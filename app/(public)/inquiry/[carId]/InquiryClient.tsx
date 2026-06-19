'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCar, createBooking } from '@/lib/api-client';
import { sanitizeInput, sanitizeEmail, isSuspicious } from '@/lib/sanitize';
import type { Car } from '@/types';

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '355697536334';

export default function InquiryClient({ carId }: { carId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [car, setCar] = useState<Car | null>(null);
  const [bookedRanges, setBookedRanges] = useState<{ pickupDate: string; dropoffDate: string }[]>([]);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    pickupLocation: searchParams.get('location') ?? '',
    pickupDate: searchParams.get('pickup') ?? '',
    dropoffDate: searchParams.get('dropoff') ?? '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCar(carId).then((d) => setCar(d.car)).catch(() => setError('Failed to load car.'));
    fetch(`/api/cars/${carId}/booked-dates`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setBookedRanges(
          d.bookings.map((b: { pickupDate: string; dropoffDate: string }) => ({
            pickupDate: b.pickupDate.slice(0, 10),
            dropoffDate: b.dropoffDate.slice(0, 10),
          }))
        );
      })
      .catch(() => {});
  }, [carId]);

  const isDateConflict = (pickup: string, dropoff: string) =>
    bookedRanges.some(
      (r) => pickup < r.dropoffDate && dropoff > r.pickupDate
    );

  const rentalDays = useMemo(() => {
    if (!form.pickupDate || !form.dropoffDate) return null;
    const diff = new Date(form.dropoffDate).getTime() - new Date(form.pickupDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  }, [form.pickupDate, form.dropoffDate]);

  const totalPrice = useMemo(() => {
    if (!car || !rentalDays) return null;
    return car.price * rentalDays;
  }, [car, rentalDays]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError('');

    if (!form.fullName.trim()) { setError('Full name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email.'); return; }
    if (!form.phoneNumber.trim()) { setError('Phone number is required.'); return; }
    if (!form.pickupLocation.trim()) { setError('Pick-up location is required.'); return; }
    if (!form.pickupDate) { setError('Pick-up date is required.'); return; }
    if (!form.dropoffDate) { setError('Drop-off date is required.'); return; }
    if (rentalDays === null || rentalDays <= 0) { setError('Drop-off date must be after pick-up date.'); return; }
    if (isDateConflict(form.pickupDate, form.dropoffDate)) { setError('This car is already booked for those dates. Please choose different dates.'); return; }

    // Sanitize
    const cleanName     = sanitizeInput(form.fullName, 300);
    const cleanPhone    = sanitizeInput(form.phoneNumber, 50);
    const cleanLocation = sanitizeInput(form.pickupLocation, 300);
    const cleanNotes    = sanitizeInput(form.notes, 2000);
    const cleanEmail    = sanitizeEmail(form.email) || form.email.trim().toLowerCase();

    // Block suspicious input
    if ([cleanName, cleanPhone, cleanLocation, cleanNotes].some(isSuspicious)) {
      setError('Invalid characters detected. Please check your input.');
      return;
    }

    try {
      setSubmitting(true);
      await createBooking({
        carId: Number(carId),
        fullName: cleanName,
        email: cleanEmail,
        phoneNumber: cleanPhone,
        pickupLocation: cleanLocation,
        pickupDate: form.pickupDate,
        dropoffDate: form.dropoffDate,
        totalPrice: totalPrice ?? undefined,
        notes: cleanNotes || undefined,
      });
      setSuccess('Booking request sent!');
      setTimeout(() => router.push('/'), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally { setSubmitting(false); }
  };

  const whatsappUrl = car
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`I'd like to book the ${car.name} – €${car.price}/day`)}`
    : `https://wa.me/${WHATSAPP}`;

  if (success) return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-10 text-center max-w-md" role="status">
        <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="text-2xl font-black text-off-white mb-2">Booking Request Sent!</h2>
        <p className="text-muted text-sm mb-4">We'll contact you within 10 minutes to confirm your reservation.</p>
        {totalPrice && (
          <div className="bg-gold/10 border border-gold/20 rounded-xl px-4 py-3 inline-block mb-6">
            <p className="text-gold font-black text-xl">€{totalPrice.toLocaleString()}</p>
            <p className="text-muted text-xs">Estimated total · {rentalDays} day{rentalDays !== 1 ? 's' : ''}</p>
          </div>
        )}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full btn-gold py-3 rounded-xl font-bold text-sm shine">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13.601 2.326A7.854 7.854 0 008.007 0C3.589 0 .012 3.577.01 7.995c0 1.41.366 2.79 1.057 4.012L0 16l4.092-1.07a7.96 7.96 0 003.915 1.003h.003c4.418 0 7.995-3.577 7.997-7.995a7.91 7.91 0 00-2.406-5.612z"/>
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark">
      <div className="bg-dark-2 border-b border-white/5 pt-24 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-8">
          <button onClick={() => router.push('/cars')}
            className="flex items-center gap-2 text-muted hover:text-gold text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            Back to fleet
          </button>
          <div className="divider mb-4"/>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Rental Booking</p>
          <h1 className="text-3xl sm:text-4xl font-black text-off-white">Book Your Car</h1>
          <p className="text-muted text-sm mt-2">Fill in your details and we'll confirm within 10 minutes.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8">
        {car && (
          <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-4">
            {car.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={car.imageUrl} alt={car.name}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-xl border border-white/10 flex-shrink-0"/>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-muted text-xs uppercase tracking-wider mb-0.5">{car.brandName}</p>
              <p className="text-off-white font-black text-lg truncate">{car.name}</p>
              <p className="text-gold text-sm font-bold">€{car.price}/day</p>
            </div>
            {rentalDays && totalPrice && (
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted mb-0.5">{rentalDays} day{rentalDays !== 1 ? 's' : ''}</p>
                <p className="text-gold font-black text-xl">€{totalPrice.toLocaleString()}</p>
                <p className="text-muted text-xs">total</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="glass rounded-2xl p-5 sm:p-7 flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-gold/70">Your Details</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Full Name *</label>
              <input id="fullName" name="fullName" type="text" autoComplete="name" placeholder="John Smith"
                value={form.fullName} onChange={handleChange} required
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Phone *</label>
              <input id="phoneNumber" name="phoneNumber" type="tel" autoComplete="tel" placeholder="+355 69 123 4567"
                value={form.phoneNumber} onChange={handleChange} required
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Email Address *</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="john@example.com"
              value={form.email} onChange={handleChange} required
              className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
          </div>

          <div className="border-t border-white/5 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-4">Rental Details</p>

            <div className="mb-4">
              <label htmlFor="pickupLocation" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Pick-up Location *</label>
              <input id="pickupLocation" name="pickupLocation" type="text" placeholder="e.g. Tirana Airport, Hotel name..."
                value={form.pickupLocation} onChange={handleChange} required
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="pickupDate" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Pick-up Date *</label>
                <input id="pickupDate" name="pickupDate" type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.pickupDate} onChange={handleChange} required
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
              </div>
              <div>
                <label htmlFor="dropoffDate" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Drop-off Date *</label>
                <input id="dropoffDate" name="dropoffDate" type="date"
                  min={form.pickupDate || new Date().toISOString().split('T')[0]}
                  value={form.dropoffDate} onChange={handleChange} required
                  className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
              </div>
            </div>

            {bookedRanges.length > 0 && (
              <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-3 mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Already Booked</p>
                <ul className="space-y-1">
                  {bookedRanges.map((r, i) => (
                    <li key={i} className="text-xs text-red-300/80 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"/>
                      {r.pickupDate} → {r.dropoffDate}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rentalDays && car && (
              <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted text-sm">€{car.price}/day × {rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
                  <span className="text-gold font-black text-xl">€{(car.price * rentalDays).toLocaleString()}</span>
                </div>
                <p className="text-muted text-xs">Estimated total — final price confirmed by our team</p>
              </div>
            )}
            {form.pickupDate && form.dropoffDate && !rentalDays && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                <p className="text-red-400 text-xs">Drop-off date must be after pick-up date</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Additional Notes <span className="text-muted/50 normal-case tracking-normal font-normal">(optional)</span>
            </label>
            <textarea id="notes" name="notes" rows={3}
              placeholder="Any special requests, flight number..."
              value={form.notes} onChange={handleChange}
              className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"/>
          </div>

          <button type="button" onClick={handleSubmit} disabled={submitting}
            className="btn-gold py-4 rounded-xl font-bold text-base disabled:opacity-50 shine">
            {submitting ? 'Sending Request...' : `Confirm Booking${totalPrice ? ` · €${totalPrice.toLocaleString()}` : ''}`}
          </button>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 hover:border-green-500/40 text-muted hover:text-green-400 text-sm transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.601 2.326A7.854 7.854 0 008.007 0C3.589 0 .012 3.577.01 7.995c0 1.41.366 2.79 1.057 4.012L0 16l4.092-1.07a7.96 7.96 0 003.915 1.003h.003c4.418 0 7.995-3.577 7.997-7.995a7.91 7.91 0 00-2.406-5.612z"/>
            </svg>
            Or chat on WhatsApp
          </a>

          <p className="text-center text-muted text-xs">
            Our team will contact you within 10 minutes to confirm availability.
          </p>
        </div>
      </div>
    </div>
  );
}
