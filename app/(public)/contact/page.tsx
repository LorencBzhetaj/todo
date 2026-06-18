// app/(public)/contact/page.tsx
import type { Metadata } from 'next';
import ContactClient from './ContactClient';
export const metadata: Metadata = {
  title: 'Contact Us – TodoRental Tirana',
  description: 'Contact TodoRental Tirana. Call +355 69 753 6334 or email us. Average response time: 10 minutes.',
  alternates: { canonical: 'https://automart.al/contact' },
};
export default function ContactPage() { return <ContactClient />; }
