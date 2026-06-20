'use client';
import Image from 'next/image';
import { useLang } from '@/lib/useLang';

export default function AboutClient() {
  const { t, lang } = useLang();
  const isSq = lang === 'sq';

  return (
    <div className="w-full bg-dark text-off-white">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=1400&q=90')", backgroundSize: 'cover', backgroundPosition: 'center' }}/>
          <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/60 to-dark"/>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pb-16 pt-32 w-full">
          <div className="divider mb-4"/>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">{t('about_tag')}</p>
          <h1 className="text-5xl md:text-7xl font-black leading-none">
            {isSq ? 'Drejtoni me' : 'Driving Your'}<br/><span className="gold-text">{isSq ? 'Klas.' : 'Journey'}</span>
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <div className="divider mb-4"/>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-4">{t('about_mission_tag')}</p>
          <h2 className="text-4xl font-black text-off-white mb-6 leading-tight">{t('about_mission_title')}</h2>
          <p className="text-muted leading-relaxed mb-5">{t('about_p1')}</p>
          {t('about_p2') && <p className="text-muted leading-relaxed">{t('about_p2')}</p>}
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about.jpg" alt="About TodoRental" className="w-full h-full object-cover"/>
        </div>
      </section>

      {/* Location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-24">
        <div className="divider mb-4"/>
        <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">{t('about_find_tag')}</p>
        <h2 className="text-4xl font-black text-off-white mb-12">{t('about_find_title')}</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { label: isSq ? 'Adresa' : 'Address', val: 'Zogu i Zi – Aeroporti Nënë Tereza', icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
            { label: isSq ? 'Oraret' : 'Working Hours', val: isSq ? 'Hën – Sht, 8:00 – 20:00' : 'Mon – Sat, 8:00 – 20:00', icon: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></> },
            { label: isSq ? 'Telefon' : 'Phone', val: '+355 69 75 36 334', icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 11.3 19.79 19.79 0 0 1 .07 2.7 2 2 0 0 1 2.06.5h3a2 2 0 0 1 2 1.72 19.79 19.79 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L6.09 8.37a16 16 0 0 0 6.29 6.29l1.24-1.22a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/> },
          ].map((item) => (
            <div key={item.label} className="glass rounded-2xl p-7 hover:border-gold/40 transition-all">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{item.icon}</svg>
              </div>
              <p className="text-xs text-gold/70 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-off-white font-bold">{item.val}</p>
            </div>
          ))}
        </div>
        <a href="https://share.google/5IoOzklmyuVG5H1H5" target="_blank" rel="noopener noreferrer"
          className="relative rounded-2xl overflow-hidden border border-white/5 h-80 block group hover:border-gold/40 transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/map.jpg" alt="TodoRental location" className="w-full h-full object-cover"/>
          <div className="absolute bottom-0 left-0 right-0 bg-dark/80 backdrop-blur-sm px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-off-white font-bold text-sm">Zogu i Zi, Tiranë</p>
              <p className="text-muted text-xs">Aeroporti Nënë Tereza</p>
            </div>
            <span className="text-gold text-xs font-semibold group-hover:underline">{isSq ? 'Hap Hartën →' : 'Open Maps →'}</span>
          </div>
        </a>
      </section>
    </div>
  );
}
