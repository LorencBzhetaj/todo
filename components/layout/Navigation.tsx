'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/useLang';

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '355697536334';

export default function Navigation() {
  const pathname = usePathname();
  const { lang, toggleLang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isSq = lang === 'sq';

  const links = isSq
    ? [
        { to: '/sq/',          label: 'Kryefaqja' },
        { to: '/sq/makina',    label: 'Makinat' },
        { to: '/sq/rreth-nesh',label: 'Rreth Nesh' },
        { to: '/sq/kontakt',   label: 'Kontakt' },
      ]
    : [
        { to: '/',        label: 'Home' },
        { to: '/cars',    label: 'Fleet' },
        { to: '/about',   label: 'About Us' },
        { to: '/contact', label: 'Contact' },
      ];

  const isActive = (p: string) => {
    if (p === '/' || p === '/sq/') return pathname === '/' || pathname === '/sq/' || pathname === '/sq';
    return pathname.startsWith(p);
  };

  const bookLink = isSq ? '/sq/makina' : '/cars';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-dark-2/95 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href={isSq ? '/sq/' : '/'} className="flex items-center gap-3 group" aria-label="TodoRental Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="TodoRental"
            width={36}
            height={36}
            className="rounded-full object-cover border border-gold/40 group-hover:border-gold transition-colors"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              const fallback = img.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="w-9 h-9 border border-gold/60 rounded-lg items-center justify-center group-hover:border-gold transition-colors hidden" aria-hidden="true">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M19 17H5a2 2 0 0 1-2-2V9l2-4h14l2 4v6a2 2 0 0 1-2 2z"/>
              <circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>
            </svg>
          </div>
          <span className="font-black text-xl tracking-tight text-off-white">
            Todo<span className="gold-text">Rental</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <Link href={l.to}
                className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg relative group ${
                  isActive(l.to) ? 'text-gold' : 'text-muted hover:text-off-white'
                }`}>
                {l.label}
                {isActive(l.to) && <span className="absolute bottom-1 left-4 right-4 h-px bg-gold/60"/>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleLang} aria-label="Toggle language"
            className="w-9 h-9 border border-white/10 hover:border-gold/40 rounded-lg flex items-center justify-center text-xs font-bold text-muted hover:text-gold transition-all">
            {isSq ? 'EN' : 'SQ'}
          </button>
          <a href={`tel:+${WA}`} className="text-sm text-muted hover:text-gold transition-colors font-medium">
            +{WA}
          </a>
          <Link href={bookLink} className="btn-gold px-5 py-2.5 rounded-lg text-sm shine">
            {isSq ? 'Rezervo' : 'Book Now'}
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-2 text-muted hover:text-off-white transition-colors"
          onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`h-px bg-current transition-all duration-300 ${open ? 'rotate-45 translate-y-2.5' : ''}`}/>
            <span className={`h-px bg-current transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`}/>
            <span className={`h-px bg-current transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}/>
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-dark-2/98 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.to} href={l.to} onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(l.to) ? 'text-gold bg-gold/5' : 'text-muted hover:text-off-white hover:bg-white/5'
              }`}>{l.label}</Link>
          ))}
          <button onClick={() => { toggleLang(); setOpen(false); }}
            className="text-left px-4 py-3 rounded-lg text-sm text-muted hover:text-off-white hover:bg-white/5 transition-colors">
            🌐 {isSq ? 'English' : 'Shqip'}
          </button>
          <Link href={bookLink} onClick={() => setOpen(false)}
            className="btn-gold mt-2 px-4 py-3 rounded-lg text-sm text-center">
            {isSq ? 'Rezervo' : 'Book Now'}
          </Link>
        </div>
      </div>
    </nav>
  );
}
