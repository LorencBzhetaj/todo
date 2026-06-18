import type { Metadata } from 'next';
import ContactClient from '@/app/(public)/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Kontakt – TodoRental Tiranë',
  description: 'Na kontakto për rezervime makinash. Tiranë – +355 69 753 6334.',
  alternates: { canonical: 'https://todo-rental.al/sq/kontakt' },
};

export default function KontaktPage() { return <ContactClient />; }
