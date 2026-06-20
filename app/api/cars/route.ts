import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  model: z.string().max(200).optional(),
  brandName: z.string().min(1).max(200),
  price: z.number().int().min(0),
  imageUrl: z.string().max(2000).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const pickup  = req.nextUrl.searchParams.get('pickup');
    const dropoff = req.nextUrl.searchParams.get('dropoff');
    const page    = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? '1'));
    const rawSize = Number(req.nextUrl.searchParams.get('pageSize') ?? req.nextUrl.searchParams.get('limit') ?? '50');
    const pageSize = Math.min(Math.max(1, rawSize), 50);
    const now = new Date();

    const [totalCount, allCars] = await Promise.all([
      db.car.count(),
      db.car.findMany({
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    let conflictingBookings: { carId: number; pickupDate: Date | null; dropoffDate: Date | null }[] = [];

    if (pickup && dropoff) {
      const pickupDate  = new Date(pickup);
      const dropoffDate = new Date(dropoff);
      conflictingBookings = await db.booking.findMany({
        where: {
          status: 'Confirmed',
          pickupDate:  { not: null, lt: dropoffDate },
          dropoffDate: { not: null, gt: pickupDate },
        },
        select: { carId: true, pickupDate: true, dropoffDate: true },
      });
    } else {
      conflictingBookings = await db.booking.findMany({
        where: {
          status: 'Confirmed',
          dropoffDate: { not: null, gt: now },
        },
        select: { carId: true, pickupDate: true, dropoffDate: true },
      });
    }

    const bookedCarIds = new Set(conflictingBookings.map(b => b.carId));

    const cars = allCars.map(car => ({
      ...car,
      isAvailable: !bookedCarIds.has(car.id),
      activeBookings: conflictingBookings
        .filter(b => b.carId === car.id)
        .map(b => ({
          pickupDate:  b.pickupDate  ? b.pickupDate.toISOString()  : null,
          dropoffDate: b.dropoffDate ? b.dropoffDate.toISOString() : null,
        })),
    }));

    return NextResponse.json({
      success: true,
      cars,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const data = createSchema.parse(body);
    const car = await db.car.create({ data });
    return NextResponse.json({ success: true, message: 'Car created.', car }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, message: err.errors[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'Failed to create car' }, { status: 500 });
  }
}
