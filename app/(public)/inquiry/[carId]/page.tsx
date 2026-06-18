// app/(public)/inquiry/[carId]/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import InquiryClient from './InquiryClient';
export const metadata: Metadata = { title: 'Send Enquiry – TodoRental', robots: { index: false } };
export default function InquiryPage({ params }: { params: { carId: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin"/>
      </div>
    }>
      <InquiryClient carId={params.carId}/>
    </Suspense>
  );
}
