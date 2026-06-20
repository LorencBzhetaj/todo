'use client';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CarSkeleton from '@/components/ui/CarSkeleton';
import Lightbox from '@/components/ui/Lightbox';
import { useDebounce } from '@/lib/useDebounce';
import type { Car } from '@/types';

interface CarWithAvail extends Car {
  isAvailable: boolean;
  activeBookings: { pickupDate: string | null; dropoffDate: string | null }[];
}

const CarCard = memo(function CarCard({ car, pickupDate, dropoffDate, onLightbox, onDetail, onEnquire }: {
  car: CarWithAvail;
  pickupDate: string;
  dropoffDate: string;
  onLightbox: (c: CarWithAvail) => void;
  onDetail: (id: number) => void;
  onEnquire: (id: number) => void;
}) {
  const rentalDays = useMemo(() => {
    if (!pickupDate || !dropoffDate) return null;
    const diff = new Date(dropoffDate).getTime() - new Date(pickupDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  }, [pickupDate, dropoffDate]);

  const totalPrice = rentalDays ? car.price * rentalDays : null;

  // Gjej daten e para te lire pas booking aktiv
  const nextAvailableDate = useMemo(() => {
    if (car.isAvailable || !car.activeBookings?.length) return null;
    const dates = car.activeBookings
      .map(b => b.dropoffDate ? new Date(b.dropoffDate) : null)
      .filter(Boolean) as Date[];
    if (!dates.length) return null;
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    return latest.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }, [car.isAvailable, car.activeBookings]);

  return (
    <Link href={`/cars/${car.id}`} className="block">
    <article className="bg-dark-3 border border-white/5 hover:border-gold/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/5 rounded-2xl overflow-hidden transition-all duration-300 group shine">
      <div className="relative h-52 overflow-hidden cursor-zoom-in"
        role="button" tabIndex={0}
        onClick={(e) => { e.preventDefault(); onLightbox(car); }}
        onKeyDown={(e) => e.key === 'Enter' && onLightbox(car)}
        aria-label={`View image of ${car.name}`}>
        <Image src={car.imageUrl ?? '/placeholder.jpg'} alt={`${car.name} rental`} fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"/>
        <div className="img-placeholder w-full h-full items-center justify-center bg-dark-4 text-muted text-sm hidden absolute inset-0">
          <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M19 17H5a2 2 0 0 1-2-2V9l2-4h14l2 4v6a2 2 0 0 1-2 2z"/>
            <circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent"/>


        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-dark/80 backdrop-blur-sm border border-gold/30 text-gold text-sm font-black px-3 py-1.5 rounded-xl">
            €{Number(car.price).toLocaleString()}
            <span className="text-muted text-xs font-normal">/day</span>
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <p className="text-muted text-xs uppercase tracking-wider mb-0.5">{car.brandName}</p>
          <h3 className="text-off-white font-bold text-lg leading-tight">{car.name}</h3>
        </div>


        {/* Specs — show model if available */}
        {car.model && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="flex items-center gap-1 bg-dark-4 border border-white/5 text-muted text-xs px-2.5 py-1 rounded-lg">
              ⚙ {car.model}
            </span>
          </div>
        )}

        {/* Total price if dates selected */}
        {totalPrice && rentalDays && (
          <div className="bg-gold/5 border border-gold/10 rounded-xl px-3 py-2 mb-4 flex items-center justify-between">
            <span className="text-muted text-xs">{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
            <span className="text-gold font-black">€{totalPrice.toLocaleString()} total</span>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={(e) => { e.preventDefault(); onDetail(car.id); }}
            className="flex-1 bg-dark-4 hover:bg-dark-5 border border-white/8 text-off-white font-semibold py-2.5 rounded-xl text-sm transition-all">
            Details
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onEnquire(car.id); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold btn-gold shine cursor-pointer transition-all">
            Book Now
          </button>
        </div>
      </div>
    </article>
    </Link>
  );
});

export default function CarsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cars, setCars] = useState<CarWithAvail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState<CarWithAvail | null>(null);

  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterType, setFilterType] = useState(searchParams.get('type') ?? 'All');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const pickupDate  = searchParams.get('pickup')  ?? '';
  const dropoffDate = searchParams.get('dropoff') ?? '';

  const rentalDays = useMemo(() => {
    if (!pickupDate || !dropoffDate) return null;
    const diff = new Date(dropoffDate).getTime() - new Date(pickupDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  }, [pickupDate, dropoffDate]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (pickupDate)  params.set('pickup',  pickupDate);
    if (dropoffDate) params.set('dropoff', dropoffDate);
    params.set('page', String(page));
    params.set('pageSize', '50');

    fetch(`/api/cars?${params.toString()}`)
      .then(r => r.json())
      .then(d => {
        if (!cancelled) {
          setCars(d.cars ?? []);
          setTotalPages(d.totalPages ?? 1);
        }
      })
      .catch(() => { if (!cancelled) setError('Failed to load fleet.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [pickupDate, dropoffDate, page]);

  const brands = useMemo(() => ['All', ...new Set(cars.map(c => c.brandName))], [cars]);
  const types = ['All', 'Luxury', 'SUV', 'Sport', 'Economy'];

  const filtered = useMemo(() => cars.filter(c => {
    const mBrand  = filterBrand === 'All' || c.brandName === filterBrand;
    const mPrice  = !filterMaxPrice || c.price <= Number(filterMaxPrice);
    const mSearch = !debouncedSearch || c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || c.brandName.toLowerCase().includes(debouncedSearch.toLowerCase());
    const mType   = filterType === 'All' || [c.name, c.brandName, c.model, c.description].some(
      f => (f ?? '').toLowerCase().includes(filterType.toLowerCase())
    );
    const mAvail  = (pickupDate && dropoffDate) ? c.isAvailable : (!showOnlyAvailable || c.isAvailable);
    return mBrand && mPrice && mSearch && mType && mAvail;
  }), [cars, filterBrand, filterMaxPrice, debouncedSearch, filterType, showOnlyAvailable]);

  const availableCount = useMemo(() => cars.filter(c => c.isAvailable).length, [cars]);
  const bookedCount    = useMemo(() => cars.filter(c => !c.isAvailable).length, [cars]);

  const handleClear = useCallback(() => {
    setSearch(''); setFilterBrand('All'); setFilterMaxPrice('');
    setFilterType('All'); setShowOnlyAvailable(false); setPage(1);
    router.replace('/cars');
  }, [router]);

  const hasFilters = search || filterBrand !== 'All' || filterMaxPrice || filterType !== 'All' || showOnlyAvailable;

  const handleEnquire = useCallback((id: number) => {
    const params = new URLSearchParams();
    if (pickupDate)  params.set('pickup',   pickupDate);
    if (dropoffDate) params.set('dropoff',  dropoffDate);
    if (searchParams.get('location')) params.set('location', searchParams.get('location')!);
    const query = params.toString();
    router.push(`/inquiry/${id}${query ? `?${query}` : ''}`);
  }, [pickupDate, dropoffDate, searchParams, router]);

  return (
    <>
      {lightbox && <Lightbox imageUrl={lightbox.imageUrl ?? ''} carName={lightbox.name} onClose={() => setLightbox(null)}/>}

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-dark-2 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, #C9A84C, transparent 60%)' }} aria-hidden="true"/>
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="divider mb-4"/>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Our Fleet</p>
          <h1 className="text-5xl md:text-6xl font-black text-off-white mb-4">Premium Vehicles</h1>
          <p className="text-muted text-lg max-w-xl">Every car in our fleet is meticulously maintained and ready for your journey.</p>
          {/* Availability summary */}
          {!loading && (
            <div className="flex gap-4 mt-4">
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-400"/>
                <span className="text-green-400 font-bold">{availableCount}</span>
                <span className="text-muted">available</span>
              </span>
              {bookedCount > 0 && (
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-400"/>
                  <span className="text-red-400 font-bold">{bookedCount}</span>
                  <span className="text-muted">booked</span>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="w-full bg-dark min-h-screen px-4 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto">

          {/* Search dates banner */}
          {(pickupDate || dropoffDate || searchParams.get('location')) && (
            <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span className="text-sm font-semibold text-gold">Searching availability</span>
              {searchParams.get('location') && (
                <span className="bg-dark-4 border border-white/10 text-off-white text-xs px-3 py-1.5 rounded-lg">📍 {searchParams.get('location')}</span>
              )}
              {pickupDate && (
                <span className="bg-dark-4 border border-white/10 text-off-white text-xs px-3 py-1.5 rounded-lg">
                  📅 {new Date(pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )}
              {dropoffDate && (
                <span className="bg-dark-4 border border-white/10 text-off-white text-xs px-3 py-1.5 rounded-lg">
                  🏁 {new Date(dropoffDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )}
              {rentalDays && (
                <span className="bg-gold/10 border border-gold/20 text-gold text-xs font-bold px-3 py-1.5 rounded-lg">
                  {rentalDays} day{rentalDays !== 1 ? 's' : ''}
                </span>
              )}
              <button onClick={handleClear} className="ml-auto text-xs text-muted hover:text-gold transition-colors">Clear ×</button>
            </div>
          )}

          {/* Filters */}
          <div className="glass rounded-2xl p-4 mb-8 flex flex-wrap gap-3 items-center">
            <input type="text" placeholder="Search make, model..." value={search}
              onChange={e => setSearch(e.target.value)} aria-label="Search"
              className="input-dark px-4 py-2.5 rounded-xl text-sm w-full sm:w-48"/>
            <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)} aria-label="Brand"
              className="input-dark px-4 py-2.5 rounded-xl text-sm">
              {brands.map(b => <option key={b} className="bg-dark-3">{b}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} aria-label="Type"
              className="input-dark px-4 py-2.5 rounded-xl text-sm">
              {types.map(t => <option key={t} className="bg-dark-3">{t}</option>)}
            </select>
            <input type="number" placeholder="Max €/day" value={filterMaxPrice} min="0"
              onChange={e => setFilterMaxPrice(e.target.value)} aria-label="Max price"
              className="input-dark px-4 py-2.5 rounded-xl text-sm w-28"/>
            <button onClick={() => setShowOnlyAvailable(p => !p)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                showOnlyAvailable ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'border-white/10 text-muted hover:border-white/20'
              }`}>
              <span className={`w-2 h-2 rounded-full ${showOnlyAvailable ? 'bg-green-400' : 'bg-muted'}`}/>
              Available only
            </button>
            {hasFilters && (
              <button onClick={handleClear} className="text-sm text-gold hover:text-gold-light font-medium">Clear ×</button>
            )}
            <span className="ml-auto text-sm text-muted" aria-live="polite">
              <span className="text-gold font-bold">{filtered.length}</span> car{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {error && <div role="alert" className="border border-red-500/20 bg-red-500/10 text-red-400 px-4 py-3 rounded-xl mb-8">{error}</div>}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <CarSkeleton key={i}/>)
              : filtered.length === 0
                ? (
                  <div className="col-span-3 text-center py-20 text-muted">
                    <p className="text-5xl mb-4">◈</p>
                    <p className="font-semibold text-off-white mb-2">No cars match your search</p>
                    <p className="text-sm mb-6">Try adjusting your filters</p>
                    <button onClick={handleClear} className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold shine">Clear Filters</button>
                  </div>
                )
                : filtered.map(car => (
                  <CarCard
                    key={car.id}
                    car={car}
                    pickupDate={pickupDate}
                    dropoffDate={dropoffDate}
                    onLightbox={setLightbox}
                    onDetail={id => router.push(`/cars/${id}`)}
                    onEnquire={handleEnquire}
                  />
                ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-white/10 text-muted hover:border-gold/40 hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                    p === page
                      ? 'btn-gold'
                      : 'border border-white/10 text-muted hover:border-gold/40 hover:text-gold'
                  }`}>
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-white/10 text-muted hover:border-gold/40 hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm">
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}