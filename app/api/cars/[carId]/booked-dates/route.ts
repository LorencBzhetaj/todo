import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: { carId: string } }) {
  try {
    const bookings = await db.booking.findMany({
      where: {
        carId: Number(params.carId),
        status: 'Confirmed',
        pickupDate: { not: null },
        dropoffDate: { not: null },
      },
      select: { pickupDate: true, dropoffDate: true },
    });
    return NextResponse.json({ success: true, bookings });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch' }, { status: 500 });
  }
}
