'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCarImages } from '@/lib/api-client';
import type { CarImage } from '@/types';

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '355697536334';

interface CarFull {
  id: number;
  name: string;
  description?: string | null;
  model?: string | null;
  brandName: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  activeBookings?: { pickupDate: string | null; dropoffDate: string | null }[];
}

export default function CarDetailClient({ carId }: { carId: string }) {
  const router = useRouter();
  const [car, setCar] = useState<CarFull | null>(null);
  const [images, setImages] = useState<CarImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`/api/cars/${carId}`).then(r => r.json()),
      getCarImages(Number(carId)),
    ])
      .then(([carData, imgData]) => {
        if (cancelled) return;
        setCar(carData.car ?? null);
        if (carData.car?.imageUrl) setActiveImg(carData.car.imageUrl);
        setImages(imgData.images ?? []);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [carId]);

  const allImages = useMemo(() =>
    car ? [{ id: 0, carId: car.id, imageUrl: car.imageUrl ?? '' }, ...images] : images,
    [car, images]);

  if (loading) return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin"/>
    </div>
  );

  if (!car) return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center">
      <p className="text-muted text-lg mb-4">Vehicle not found.</p>
      <Link href="/cars" className="text-gold hover:text-gold-light text-sm transition-colors">← Back to fleet</Link>
    </div>
  );

  const specs = [
    { label: 'Brand', value: car.brandName },
    { label: 'Model', value: car.model || '—' },
    { label: 'Price / Day', value: `€${Number(car.price).toLocaleString()}` },
    { label: 'Category', value: 'Premium' },
  ];

  return (
    <>
      {/* Header */}
      <div className="bg-dark-2 border-b border-white/5 pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted mb-6">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-gold/30">/</span>
            <Link href="/cars" className="hover:text-gold transition-colors">Fleet</Link>
            <span className="text-gold/30">/</span>
            <span className="text-off-white font-medium">{car.name}</span>
          </nav>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-off-white">{car.name}</h1>
              <p className="text-muted mt-2">{car.brandName} · {car.model}</p>
            </div>
            <span className="flex-shrink-0 flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold text-sm font-bold px-4 py-2 rounded-full">
              €{Number(car.price).toLocaleString()}/day
            </span>
          </div>
        </div>
      </div>

      <section className="min-h-screen bg-dark py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">

            {/* Images */}
            <div>
              <div className="relative rounded-2xl overflow-hidden border border-white/5 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeImg ?? car.imageUrl ?? ''} alt={car.name}
                  className="w-full h-72 sm:h-80 object-cover"
                  loading="eager"/>
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {allImages.map((img, i) => (
                    <button key={img.id} onClick={() => setActiveImg(img.imageUrl)}
                      aria-pressed={activeImg === img.imageUrl} aria-label={`Image ${i + 1}`}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${activeImg === img.imageUrl ? 'border-gold' : 'border-white/10 hover:border-gold/40'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.imageUrl} alt="" loading="lazy" className="w-full h-full object-cover"/>
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Info */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-gold/10 border border-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full">
                  {car.model?.split(' ')[0] ?? 'Premium'}
                </span>
                <p className="text-4xl font-black gold-text">
                  €{Number(car.price).toLocaleString()}
                  <span className="text-muted text-base font-normal">/day</span>
                </p>
              </div>

              {/* Specs */}
              <div className="bg-dark-3 border border-white/5 rounded-2xl p-5 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-4">Vehicle Specs</p>
                <div className="grid grid-cols-2 gap-3">
                  {specs.map(s => (
                    <div key={s.label} className="bg-dark-4 border border-white/5 rounded-xl p-3">
                      <p className="text-xs text-muted mb-1 uppercase tracking-wider">{s.label}</p>
                      <p className="text-off-white font-semibold text-sm">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {car.description && (
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-3">About This Vehicle</p>
                  <p className="text-muted text-sm leading-relaxed">{car.description}</p>
                </div>
              )}

              <div className="flex gap-3 mb-3">
                <button onClick={() => router.push(`/inquiry/${car.id}`)}
                  className="flex-1 py-4 rounded-xl font-bold transition-all btn-gold shine">
                  Book This Car
                </button>
                <a href={`tel:+${WHATSAPP}`}
                  className="flex items-center gap-2 px-5 py-4 border border-white/10 hover:border-gold/40 rounded-xl text-sm font-medium text-off-white transition-all hover:bg-white/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 11.3 19.79 19.79 0 0 1 .07 2.7 2 2 0 0 1 2.06.5h3a2 2 0 0 1 2 1.72 19.79 19.79 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L6.09 8.37a16 16 0 0 0 6.29 6.29l1.24-1.22a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Call
                </a>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`I'm interested in the ${car.name} – €${car.price}/day`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 hover:border-green-500/40 text-muted hover:text-green-400 text-sm font-medium transition-all mb-5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13.601 2.326A7.854 7.854 0 008.007 0C3.589 0 .012 3.577.01 7.995c0 1.41.366 2.79 1.057 4.012L0 16l4.092-1.07a7.96 7.96 0 003.915 1.003h.003c4.418 0 7.995-3.577 7.997-7.995a7.91 7.91 0 00-2.406-5.612z"/>
                </svg>
                Chat on WhatsApp
              </a>

              <button onClick={() => router.push('/cars')}
                className="text-sm text-muted hover:text-gold transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                Back to fleet
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}