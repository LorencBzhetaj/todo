import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const patchSchema = z.object({ status: z.enum(['Pending', 'Confirmed', 'Cancelled']) });

interface BookingWithCar {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  pickupLocation: string | null;
  pickupDate: Date | null;
  dropoffDate: Date | null;
  totalPrice: number | null;
  status: string;
  car: { name: string; brandName: string } | null;
}

export async function PATCH(req: NextRequest, { params }: { params: { bookingId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { status } = patchSchema.parse(body);

    const booking = await db.booking.update({
      where: { id: Number(params.bookingId) },
      data: { status },
      include: { car: { select: { name: true, brandName: true } } },
    }) as BookingWithCar;

    if (status === 'Confirmed') {
      const formspreeId = process.env.FORMSPREE_ID;
      if (formspreeId) {
        try {
          await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: booking.email,
              name: booking.fullName,
              subject: `✅ Booking Confirmed – ${booking.car?.name ?? 'Vehicle'}`,
              message: `Dear ${booking.fullName},\n\nYour booking has been CONFIRMED!\n\nVehicle: ${booking.car?.name ?? '—'}\nPickup: ${booking.pickupLocation ?? '—'}\nFrom: ${booking.pickupDate ? new Date(booking.pickupDate).toLocaleDateString('en-GB') : '—'}\nTo: ${booking.dropoffDate ? new Date(booking.dropoffDate).toLocaleDateString('en-GB') : '—'}\nTotal: ${booking.totalPrice ? `€${booking.totalPrice}` : '—'}\n\nWe will contact you at ${booking.phoneNumber} to finalize details.\n\nThank you for choosing TodoRental!`,
              _replyto: booking.email,
            }),
          });
        } catch { /* silent */ }
      }
    }

    return NextResponse.json({
      success: true,
      message: status === 'Confirmed' ? 'Booking confirmed.' : 'Booking updated.',
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, message: err.errors[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'Failed to update booking' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { bookingId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  try {
    await db.booking.delete({ where: { id: Number(params.bookingId) } });
    return NextResponse.json({ success: true, message: 'Booking deleted.' });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to delete booking' }, { status: 500 });
  }
}
