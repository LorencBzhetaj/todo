import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { sanitizeInput, sanitizeEmail, isSuspicious } from '@/lib/sanitize';
import { rateLimit, getIp } from '@/lib/rateLimit';

const createSchema = z.object({
  carId: z.number().int().positive(),
  fullName: z.string().min(1).max(300),
  email: z.string().email().max(300),
  phoneNumber: z.string().min(1).max(50),
  pickupLocation: z.string().max(300).optional(),
  pickupDate: z.string().optional(),
  dropoffDate: z.string().optional(),
  totalPrice: z.number().int().min(0).optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  try {
    const bookings = await db.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: { car: { select: { name: true, brandName: true, price: true } } },
    });
    return NextResponse.json({ success: true, bookings });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(`booking:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const raw = createSchema.parse(body);

    // Sanitize all string inputs
    const data = {
      ...raw,
      fullName:       sanitizeInput(raw.fullName, 300),
      phoneNumber:    sanitizeInput(raw.phoneNumber, 50),
      pickupLocation: raw.pickupLocation ? sanitizeInput(raw.pickupLocation, 300) : undefined,
      notes:          raw.notes ? sanitizeInput(raw.notes, 2000) : undefined,
      email:          sanitizeEmail(raw.email) || raw.email.trim().toLowerCase(),
    };

    // Block suspicious input
    const fieldsToCheck = [data.fullName, data.phoneNumber, data.pickupLocation ?? '', data.notes ?? ''];
    if (fieldsToCheck.some(isSuspicious)) {
      return NextResponse.json({ success: false, message: 'Invalid input detected.' }, { status: 400 });
    }

    // Double-booking prevention
    if (data.pickupDate && data.dropoffDate) {
      const pickupDate  = new Date(data.pickupDate);
      const dropoffDate = new Date(data.dropoffDate);
      const conflict = await db.booking.findFirst({
        where: {
          carId:       data.carId,
          status:      'Confirmed',
          pickupDate:  { not: null, lt: dropoffDate },
          dropoffDate: { not: null, gt: pickupDate },
        },
      });
      if (conflict) {
        return NextResponse.json(
          { success: false, message: 'This car is already booked for those dates. Please choose different dates.' },
          { status: 409 }
        );
      }
    }

    let totalPrice = data.totalPrice;
    if (!totalPrice && data.pickupDate && data.dropoffDate) {
      const car = await db.car.findUnique({ where: { id: data.carId } });
      if (car) {
        const days = Math.ceil(
          (new Date(data.dropoffDate).getTime() - new Date(data.pickupDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (days > 0) totalPrice = car.price * days;
      }
    }

    await db.booking.create({
      data: {
        ...data,
        pickupDate:  data.pickupDate  ? new Date(data.pickupDate)  : null,
        dropoffDate: data.dropoffDate ? new Date(data.dropoffDate) : null,
        totalPrice:  totalPrice ?? null,
        status: 'Pending',
      },
    });

    const formspreeId = process.env.FORMSPREE_ID;
    if (formspreeId) {
      try {
        await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            name: data.fullName,
            subject: 'New Booking Request',
            message: `Customer: ${data.fullName}\nPhone: ${data.phoneNumber}\nPickup: ${data.pickupLocation ?? '—'}\nFrom: ${data.pickupDate ?? '—'}\nTo: ${data.dropoffDate ?? '—'}\nTotal: ${totalPrice ? `€${totalPrice}` : '—'}`,
          }),
        });
      } catch { /* silent — email failure should not block the booking */ }
    }

    return NextResponse.json({ success: true, message: 'Booking submitted successfully.' }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, message: err.errors[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'Failed to submit booking' }, { status: 500 });
  }
}
