'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/useLang';

export default function HomeClient() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [carType, setCarType] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '355697536334';
  const isSq = lang === 'sq';
  const carsLink = isSq ? '/sq/makina' : '/cars';

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (pickupLocation.trim()) params.set('location', pickupLocation.trim());
    if (pickupDate)  params.set('pickup',  pickupDate);
    if (dropoffDate) params.set('dropoff', dropoffDate);
    if (carType)     params.set('type',    carType);
    router.push(`${carsLink}${params.toString() ? `?${params}` : ''}`);
  };

  const features = [
    { icon: '◈', title: t('feat1_t'), desc: t('feat1_d') },
    { icon: '◇', title: t('feat2_t'), desc: t('feat2_d') },
    { icon: '◉', title: t('feat3_t'), desc: t('feat3_d') },
    { icon: '◎', title: t('feat4_t'), desc: t('feat4_d') },
  ];

  const services = [
    { title: t('svc1_t'), desc: t('svc1_d'), icon: '🗓' },
    { title: t('svc2_t'), desc: t('svc2_d'), icon: '✈️' },
    { title: t('svc3_t'), desc: t('svc3_d'), icon: '🎩' },
    { title: t('svc4_t'), desc: t('svc4_d'), icon: '📋' },
  ];

  const testimonials = [
    { name: 'Marco Rossi', role: 'Business Traveler', text: 'Exceptional service. The BMW X5 was immaculate and the pickup was effortless. Will use again.', stars: 5 },
    { name: 'Sarah Mitchell', role: 'Tourist', text: 'Best car rental experience in Albania. Professional, fast, and the car was stunning.', stars: 5 },
    { name: 'Arben Hoxha', role: isSq ? 'Klient Korporativ' : 'Corporate Client', text: isSq ? 'TodoRental menaxhoi flotën tonë gjatë konferencës. Ekzekutim i përsosur.' : 'TodoRental handled our entire corporate fleet for the conference. Flawless execution.', stars: 5 },
  ];

  const stats = [
    { number: '500+', label: t('stat1') },
    { number: '50+',  label: t('stat2') },
    { number: '10+',  label: t('stat3') },
    { number: '24/7', label: t('stat4') },
  ];

  return (
    <div className="w-full bg-dark text-off-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col overflow-hidden">
        {/* Video */}
        <div className="absolute inset-0 z-0">
          <video ref={videoRef} autoPlay muted loop playsInline preload="auto"
            className="w-full h-full object-cover object-center"
            aria-hidden="true">
            <source src="/hero.mp4" type="video/mp4"/>
          </video>
            {/* gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90"/>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent hidden sm:block"/>
        </div>

        {/* MOBILE: centër, minimal */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:hidden">
          <span className="inline-flex items-center gap-2 mb-4">
            <span className="w-1 h-1 rounded-full bg-gold animate-pulse"/>
            <span className="text-gold text-[10px] font-semibold tracking-widest uppercase">{t('home_badge')}</span>
          </span>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-center mb-2 drop-shadow-xl">
            {t('home_hero1')}<br/>
            <span className="gold-text">{t('home_hero2')}</span>
          </h1>
          <div className="flex gap-3 mt-5">
            <Link href={carsLink} className="btn-gold px-5 py-2 rounded-xl font-bold text-sm shine">
              {t('home_book')}
            </Link>
            <Link href={carsLink}
              className="px-5 py-2 rounded-xl border border-white/20 text-white/75 font-medium text-sm backdrop-blur-sm">
              {t('home_fleet')}
            </Link>
          </div>
        </div>

        {/* DESKTOP: bottom-left */}
        <div className="relative z-10 mt-auto mr-auto px-10 pb-5 max-w-lg hidden sm:block text-left">
          <span className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"/>
            <span className="text-gold text-xs font-semibold tracking-widest uppercase">{t('home_badge')}</span>
          </span>
          <h1 className="text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-3 drop-shadow-xl">
            {t('home_hero1')}<br/>
            <span className="gold-text">{t('home_hero2')}</span>
          </h1>
          <p className="text-base text-white/65 leading-relaxed mb-5 max-w-sm">{t('home_sub')}</p>
          <div className="flex gap-3">
            <Link href={carsLink} className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm shine">
              {t('home_book')}
            </Link>
            <Link href={carsLink}
              className="px-6 py-2.5 rounded-xl border border-white/20 text-white/75 font-medium text-sm hover:border-gold/40 hover:text-white backdrop-blur-sm transition-all">
              {t('home_fleet')}
            </Link>
          </div>
        </div>

        {/* Booking bar — vetëm desktop, djathtas për të mbuluar watermark */}
        <div className="relative z-10 w-full px-8 pb-5 mt-4 hidden sm:block">
          <div className="ml-auto max-w-4xl rounded-xl border border-white/10 bg-black/25 backdrop-blur-lg p-3 sm:p-4">
            {/* Mobile: 2-col grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 items-end">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">
                  {t('qb_location')}
                </label>
                <input type="text" placeholder={t('qb_location_ph')} value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-gold/50 transition-colors"/>
              </div>
              <div>
                <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">
                  {t('qb_pickup')}
                </label>
                <input type="date" value={pickupDate} min={today}
                  onChange={(e) => { setPickupDate(e.target.value); if (dropoffDate && e.target.value > dropoffDate) setDropoffDate(''); }}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold/50 transition-colors"/>
              </div>
              <div>
                <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">
                  {t('qb_dropoff')}
                </label>
                <input type="date" value={dropoffDate} min={pickupDate || today}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold/50 transition-colors"/>
              </div>
              <div className="hidden md:block">
                <label className="block text-[10px] text-white/40 mb-1 uppercase tracking-wider">
                  {t('qb_type')}
                </label>
                <select value={carType} onChange={(e) => setCarType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold/50 transition-colors">
                  <option value="" className="bg-neutral-900">{t('qb_all')}</option>
                  <option className="bg-neutral-900">Luxury</option>
                  <option className="bg-neutral-900">SUV</option>
                  <option className="bg-neutral-900">Sport</option>
                  <option className="bg-neutral-900">Economy</option>
                </select>
              </div>
              <button onClick={handleSearch}
                className="col-span-2 sm:col-span-1 btn-gold py-2 rounded-lg font-bold text-sm shine">
                {t('qb_search')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-dark-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-black gold-text mb-1">{s.number}</p>
              <p className="text-muted text-sm uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="mb-14">
          <div className="divider mb-4"/>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">{t('feat_tag')}</p>
          <h2 className="text-4xl md:text-5xl font-black text-off-white leading-tight">
            {t('feat_title1')}<br/>{t('feat_title2')}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-7 group hover:border-gold/40 transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl text-gold mb-5">{f.icon}</div>
              <h3 className="text-off-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-dark-2 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <div className="mb-10 sm:mb-14">
            <div className="divider mb-4"/>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">{t('svc_tag')}</p>
            <h2 className="text-4xl md:text-5xl font-black text-off-white">{t('svc_title')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-dark-3 border border-white/5 hover:border-gold/30 rounded-2xl p-7 transition-all duration-300 group hover:-translate-y-1">
                <div className="text-3xl mb-5">{s.icon}</div>
                <h3 className="text-off-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="mb-10 sm:mb-14">
          <div className="divider mb-4"/>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">{t('rev_tag')}</p>
          <h2 className="text-4xl md:text-5xl font-black text-off-white">{t('rev_title')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((r) => (
            <div key={r.name} className="glass rounded-2xl p-7">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: r.stars }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-muted text-sm leading-relaxed mb-6 italic">"{r.text}"</p>
              <div>
                <p className="text-off-white font-semibold text-sm">{r.name}</p>
                <p className="text-gold/70 text-xs">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-dark-2 border-y border-white/5">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #C9A84C, transparent 70%)' }} aria-hidden="true"/>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-4">{t('cta_tag')}</p>
          <h2 className="text-4xl md:text-6xl font-black text-off-white mb-5 leading-tight">
            {t('cta_title1')}<br/><span className="gold-text">{t('cta_title2')}</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">{t('cta_sub')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={carsLink} className="btn-gold px-10 py-4 rounded-xl font-bold text-base shine inline-block">
              {t('cta_reserve')}
            </Link>
            <a href={`tel:+${WA}`}
              className="px-10 py-4 rounded-xl border border-white/20 hover:border-gold/50 text-off-white font-semibold text-base transition-all hover:bg-white/5 inline-block">
              {t('cta_call')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
