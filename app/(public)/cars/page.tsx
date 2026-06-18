// app/(public)/cars/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import CarsClient from './CarsClient';
export const metadata: Metadata = {
  title: 'Our Cars – Browse Premium Vehicles',
  description: "Browse TodoRental's full inventory of premium new and used cars in Tirana. Transparent pricing, no hidden fees.",
  alternates: { canonical: 'https://automart.al/cars' },
};
export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin"/>
      </div>
    }>
      <CarsClient />
    </Suspense>
  );
}
