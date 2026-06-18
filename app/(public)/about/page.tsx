// app/(public)/about/page.tsx
import type { Metadata } from 'next';
import AboutClient from './AboutClient';
export const metadata: Metadata = {
  title: 'About Us – TodoRental Tirana',
  description: "Learn about TodoRental, Tirana's premier car dealership. Over 500 cars sold, 10+ years experience.",
  alternates: { canonical: 'https://automart.al/about' },
};
export default function AboutPage() { return <AboutClient />; }
