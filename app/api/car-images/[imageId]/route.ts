import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  carId: z.number().int().positive(),
  imageUrl: z.string().min(1).max(5000000),
});

export async function GET(req: NextRequest) {
  const carId = req.nextUrl.searchParams.get('carId');
  if (!carId) return NextResponse.json({ success: false, message: 'carId required' }, { status: 400 });
  try {
    const images = await db.carImage.findMany({ where: { carId: Number(carId) } });
    return NextResponse.json({ success: true, images });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const image = await db.carImage.create({ data });
    return NextResponse.json({ success: true, message: 'Image added.', image }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json({ success: false, message: err.errors[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'Failed to add image' }, { status: 500 });
  }
}