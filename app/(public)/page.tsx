// app/(public)/page.tsx
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'TodoRental – Premium Car Dealership Tirana',
  description: 'Discover quality new and used cars at TodoRental Tirana. Transparent pricing, zero hidden fees. Browse our full inventory today.',
  alternates: { canonical: 'https://automart.al' },
};

export default function HomePage() { return <HomeClient />; }
