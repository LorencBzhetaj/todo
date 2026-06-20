'use client';

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '355697536334';
const EMAIL = 'todorental@gmail.com';

export default function ContactClient() {
  return (
    <div className="bg-dark min-h-screen text-off-white">
      {/* Header */}
      <section className="relative bg-dark-2 border-b border-white/5 pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, #C9A84C, transparent 60%)' }} aria-hidden="true"/>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <div className="divider mb-4 mx-auto w-12"/>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-4">Contact TodoRental</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-none mb-4">
            Get in touch and<br/><span className="gold-text">drive in style.</span>
          </h1>
        </div>
      </section>

      {/* Main grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16 grid md:grid-cols-2 gap-10">
        {/* Left — info cards */}
        <div className="flex flex-col gap-4">
          {/* Address */}
          <div className="glass rounded-2xl p-6 flex items-start gap-4">
            <div className="w-11 h-11 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center flex-shrink-0 text-gold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-1">Address</p>
              <p className="text-off-white font-semibold">Zogu i Zi, Tiranë</p>
              <p className="text-muted text-sm">Rinas Airport</p>
            </div>
          </div>

          {/* Phone */}
          <a href={`tel:+${WA}`} className="glass rounded-2xl p-6 flex items-start gap-4 hover:border-gold/40 transition-all group">
            <div className="w-11 h-11 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center flex-shrink-0 text-gold group-hover:bg-gold group-hover:text-dark transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 11.3 19.79 19.79 0 0 1 .07 2.7 2 2 0 0 1 2.06.5h3a2 2 0 0 1 2 1.72 19.79 19.79 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L6.09 8.37a16 16 0 0 0 6.29 6.29l1.24-1.22a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-1">Phone</p>
              <p className="text-off-white font-semibold">+{WA}</p>
            </div>
          </a>

          {/* Email */}
          <a href={`mailto:${EMAIL}`} className="glass rounded-2xl p-6 flex items-start gap-4 hover:border-gold/40 transition-all group">
            <div className="w-11 h-11 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center flex-shrink-0 text-gold group-hover:bg-gold group-hover:text-dark transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-1">Email</p>
              <p className="text-off-white font-semibold">{EMAIL}</p>
            </div>
          </a>
        </div>

        {/* Right — static map image linking to Google Maps */}
        <a href="https://maps.google.com/?q=Zogu+i+Zi+Tirane+Albania" target="_blank" rel="noopener noreferrer"
          className="relative rounded-2xl overflow-hidden border border-white/5 min-h-[320px] block group hover:border-gold/40 transition-all">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://staticmap.openstreetmap.de/staticmap.php?center=41.3275,19.8187&zoom=15&size=600x400&markers=41.3275,19.8187,red-pushpin"
            alt="TodoRental location map"
            className="w-full h-full object-cover min-h-[320px]"
            style={{ filter: 'grayscale(0.3) contrast(0.9)' }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-dark/80 backdrop-blur-sm px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-off-white font-bold text-sm">Zogu i Zi, Tiranë</p>
              <p className="text-muted text-xs">Rinas Airport</p>
            </div>
            <span className="text-gold text-xs font-semibold group-hover:underline">Open Maps →</span>
          </div>
        </a>
      </section>

      {/* Social links */}
      <section className="border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-center gap-4">
          <a href="https://instagram.com/lori.bzhetaj" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 glass rounded-xl text-sm text-muted hover:text-off-white hover:border-gold/40 transition-all">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            Instagram
          </a>
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 glass rounded-xl text-sm text-muted hover:text-off-white hover:border-gold/40 transition-all">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.601 2.326A7.854 7.854 0 008.007 0C3.589 0 .012 3.577.01 7.995c0 1.41.366 2.79 1.057 4.012L0 16l4.092-1.07a7.96 7.96 0 003.915 1.003h.003c4.418 0 7.995-3.577 7.997-7.995a7.91 7.91 0 00-2.406-5.612z"/>
            </svg>
            WhatsApp
          </a>
          <a href={`mailto:${EMAIL}`}
            className="flex items-center gap-2 px-5 py-3 glass rounded-xl text-sm text-muted hover:text-off-white hover:border-gold/40 transition-all">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
            </svg>
            Email
          </a>
        </div>
      </section>
    </div>
  );
}
