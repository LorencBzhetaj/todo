import type { Metadata } from 'next';
import HomeClient from '@/app/(public)/HomeClient';

export const metadata: Metadata = {
  title: 'TodoRental – Makinë me Qira Tiranë',
  description: 'Rent me qira makinën tuaj të ëndrrave tek TodoRental Tiranë. Çmime transparente, pa kosto të fshehura.',
  alternates: { canonical: 'https://todo-rental.al/sq/' },
};

export default function HomePageSq() { return <HomeClient />; }
