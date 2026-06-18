import type { Metadata } from 'next';
import AboutClient from '@/app/(public)/about/AboutClient';

export const metadata: Metadata = {
  title: 'Rreth Nesh – TodoRental Tiranë',
  description: 'Mëso rreth TodoRental, kompanisë premium të makinave me qira në Tiranë.',
  alternates: { canonical: 'https://todo-rental.al/sq/rreth-nesh' },
};

export default function RrethNeshPage() { return <AboutClient />; }
