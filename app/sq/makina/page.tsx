import type { Metadata } from 'next';
import { Suspense } from 'react';
import CarsClient from '@/app/(public)/cars/CarsClient';

export const metadata: Metadata = {
  title: 'Makinat – TodoRental Tiranë',
  description: 'Shfleto flotën tonë të makinave me qira. Luksoz, SUV, Sport dhe ekonomik.',
  alternates: { canonical: 'https://todo-rental.al/sq/makina' },
};

export default function MakinatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark flex items-center justify-center"><div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin"/></div>}>
      <CarsClient />
    </Suspense>
  );
}
