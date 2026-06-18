'use client';
const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '355697536334';
export default function ContactClient() {
  const cards = [
    { href: `tel:+${WA}`, title: `+${WA}`, sub: 'Call us anytime', external: false,
      icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.3 19.79 19.79 0 01.07 2.7 2 2 0 012.06.5h3a2 2 0 012 1.72 19.79 19.79 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.37a16 16 0 006.29 6.29l1.24-1.22a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/> },
    { href: 'mailto:loribzhetaj1@gmail.com', title: 'loribzhetaj1@gmail.com', sub: 'Email us directly', external: false,
      icon: <><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></> },
    { href: 'https://tiktok.com/@lori0400', title: '@cardrive', sub: 'Follow on TikTok', external: true,
      icon: <path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/> },
    { href: 'https://instagram.com/lori.bzhetaj', title: '@lori.bzhetaj', sub: 'Follow on Instagram', external: true,
      icon: <><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></> },
    { href: `https://wa.me/${WA}`, title: 'WhatsApp', sub: 'Chat with us instantly', external: true,
      icon: <path fill="currentColor" d="M13.601 2.326A7.854 7.854 0 008.007 0C3.589 0 .012 3.577.01 7.995c0 1.41.366 2.79 1.057 4.012L0 16l4.092-1.07a7.96 7.96 0 003.915 1.003h.003c4.418 0 7.995-3.577 7.997-7.995a7.91 7.91 0 00-2.406-5.612z"/> },
    { href: 'https://maps.google.com/?q=Fresku+Tirana', title: 'Fresku, Tiranë', sub: 'Visit our showroom', external: true,
      icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
  ];

  return (
    <div className="bg-dark min-h-screen text-off-white">
      {/* Header */}
      <section className="relative bg-dark-2 border-b border-white/5 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, #C9A84C, transparent 60%)' }} aria-hidden="true"/>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 border border-gold/20 bg-gold/5 px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-xs font-semibold tracking-widest uppercase text-muted">Available Now · Average response 10 min</span>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <div className="divider mb-4"/>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-none mb-4">
                Get in touch,<br/>
                <span className="gold-text">drive tomorrow.</span>
              </h1>
              <p className="text-muted text-base sm:text-lg max-w-lg leading-relaxed">
                Interested in a vehicle or want to arrange a pickup? Our team responds within 10 minutes.
              </p>
            </div>
            <div className="glass rounded-2xl px-6 sm:px-8 py-5 sm:py-6 text-center flex-shrink-0">
              <p className="text-5xl font-black gold-text">10</p>
              <p className="text-xs text-muted uppercase tracking-widest mt-1">min response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <a key={card.href} href={card.href}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noopener noreferrer' : undefined}
              className="glass rounded-2xl p-6 flex items-center gap-4 no-underline transition-all duration-300 hover:border-gold/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5 group relative overflow-hidden shine">
              <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center flex-shrink-0 text-gold transition-all group-hover:bg-gold group-hover:border-gold group-hover:text-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">{card.icon}</svg>
              </div>
              <div className="flex-1 min-w-0">
                <strong className="block text-sm font-bold text-off-white truncate">{card.title}</strong>
                <span className="text-xs text-muted">{card.sub}</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 transition-all group-hover:border-gold group-hover:bg-gold/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-muted group-hover:text-gold transition-colors">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Map */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-white/5 h-72">
          <iframe title="DriveElite Location" width="100%" height="100%" style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(0.85)' }}
            loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.0!2d19.8187!3d41.3275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE5JzM5LjAiTiAxOcKwNDknMDcuMiJF!5e0!3m2!1sen!2sal!4v1234567890"/>
        </div>
      </section>
    </div>
  );
}
