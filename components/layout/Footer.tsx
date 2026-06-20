import Link from 'next/link';

const year = new Date().getFullYear();
const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '355697536334';

export default function Footer() {
  return (
    <footer className="bg-dark-2 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="TodoRental" width={36} height={36}
                className="rounded-full object-cover border border-gold/40 group-hover:border-gold transition-colors"/>
              <span className="font-black text-xl text-off-white">Todo<span className="gold-text">Rental</span></span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Premium car rentals in Tirana. Experience luxury, comfort, and freedom on every journey.
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://instagram.com/lori.bzhetaj', label: 'Instagram',
                  icon: <><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></> },
                { href: 'https://tiktok.com/@lori0400', label: 'TikTok',
                  icon: <path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/> },
                { href: `https://wa.me/${WA}`, label: 'WhatsApp',
                  icon: <path fill="currentColor" d="M13.601 2.326A7.854 7.854 0 008.007 0C3.589 0 .012 3.577.01 7.995c0 1.41.366 2.79 1.057 4.012L0 16l4.092-1.07a7.96 7.96 0 003.915 1.003h.003c4.418 0 7.995-3.577 7.997-7.995a7.91 7.91 0 00-2.406-5.612z"/> },
              ].map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-9 h-9 border border-white/10 hover:border-gold/50 hover:text-gold text-muted rounded-lg flex items-center justify-center transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-5">Navigation</h4>
            <ul className="space-y-3">
              {[['/', 'Home'], ['/cars', 'Fleet'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link href={to} className="text-muted hover:text-gold text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-3 h-px bg-gold/0 group-hover:bg-gold/60 transition-all"/>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-5">Services</h4>
            <ul className="space-y-3 text-muted text-sm">
              {['Daily Rentals', 'Airport Pickup', 'Chauffeur Service', 'Long-Term Rentals', 'Corporate Fleet'].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold/40"/>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-5">Contact</h4>
            <ul className="space-y-4">
              {[
                { href: 'https://share.google/5IoOzklmyuVG5H1H5', label: 'Zogu i Zi – Aeroporti Nënë Tereza, Tiranë',
                  icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
                { href: `tel:+${WA}`, label: `+${WA}`,
                  icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 11.3 19.79 19.79 0 0 1 .07 2.7 2 2 0 0 1 2.06.5h3a2 2 0 0 1 2 1.72 19.79 19.79 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L6.09 8.37a16 16 0 0 0 6.29 6.29l1.24-1.22a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/> },
                { href: 'mailto:loribzhetaj1@gmail.com', label: 'loribzhetaj1@gmail.com',
                  icon: <><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></> },
              ].map((item) => (
                <li key={item.href} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{item.icon}</svg>
                  <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-muted hover:text-gold text-sm transition-colors">{item.label}</a>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                <span className="text-muted text-sm">Mon – Sat, 8:00 – 20:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">© {year} TodoRental. Të gjitha të drejtat e rezervuara.</p>
          <p className="text-muted/50 text-xs">Makinë me Qira Premium · Tiranë, Shqipëri</p>
        </div>
      </div>
    </footer>
  );
}