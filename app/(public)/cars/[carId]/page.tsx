// app/(public)/cars/[carId]/page.tsx
import type { Metadata } from 'next';
import CarDetailClient from './CarDetailClient';

interface Props { params: { carId: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/cars/${params.carId}`, { cache: 'no-store' });
    const data = await res.json();
    if (!data.car) return { title: 'Car Not Found' };
    const car = data.car;
    return {
      title: `${car.name} – ${car.brandName}`,
      description: `${car.name} by ${car.brandName}. Price: €${car.price.toLocaleString()}. ${car.description?.slice(0, 120) ?? ''} Available at TodoRental Tirana.`,
      alternates: { canonical: `https://automart.al/cars/${params.carId}` },
      openGraph: { title: `${car.name} – €${car.price.toLocaleString()} | TodoRental`, description: car.description ?? '', url: `https://automart.al/cars/${params.carId}`, images: car.imageUrl ? [{ url: car.imageUrl, alt: car.name }] : [] },
    };
  } catch { return { title: 'Car Details | TodoRental' }; }
}

export default function CarDetailPage({ params }: Props) { return <CarDetailClient carId={params.carId}/>; }
