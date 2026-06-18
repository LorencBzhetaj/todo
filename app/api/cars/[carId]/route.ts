// app/api/cars/[carId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  model: z.string().max(200).optional(),
  brandName: z.string().min(1).max(200).optional(),
  price: z.number().int().min(0).optional(),
  imageUrl: z.string().max(2000).optional(),
});

// GET /api/cars/[carId] — public
export async function GET(_: NextRequest, { params }: { params: { carId: string } }) {
  try {
    const car = await db.car.findUnique({ where: { id: Number(params.carId) } });
    if (!car) return NextResponse.json({ success: false, message: 'Car not found' }, { status: 404 });
    return NextResponse.json({ success: true, car });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch car' }, { status: 500 });
  }
}

// PUT /api/cars/[carId] — admin only
export async function PUT(req: NextRequest, { params }: { params: { carId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);
    const car = await db.car.update({ where: { id: Number(params.carId) }, data });
    return NextResponse.json({ success: true, message: 'Car updated successfully.', car });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, message: err.errors[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'Failed to update car' }, { status: 500 });
  }
}

// DELETE /api/cars/[carId] — admin only
export async function DELETE(_: NextRequest, { params }: { params: { carId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await db.car.delete({ where: { id: Number(params.carId) } });
    return NextResponse.json({ success: true, message: 'Car deleted successfully.' });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to delete car' }, { status: 500 });
  }
}
