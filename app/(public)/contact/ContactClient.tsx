'use client';
import { useState } from 'react';

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '355697536334';
const EMAIL = 'todorental@gmail.com';

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`https://wa.me/${WA}?text=${text}`, '_blank');
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

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

        {/* Right — contact form */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold text-off-white mb-6">Send a Message</h2>
          {sent ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-14 h-14 bg-green-400/10 border border-green-400/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p className="text-off-white font-bold mb-1">Message sent!</p>
              <p className="text-muted text-sm">We&apos;ll get back to you shortly.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-gold text-sm hover:underline">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Name</label>
                <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your name" className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com" className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Message</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="How can we help you?" className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"/>
              </div>
              <button type="submit" className="btn-gold py-3.5 rounded-xl font-bold shine mt-1">
                Send Message →
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Map */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-12">
        <div className="rounded-2xl overflow-hidden border border-white/5 h-72">
          <iframe title="TodoRental Location" width="100%" height="100%"
            style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(0.85)' }}
            loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.0!2d19.8187!3d41.3275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE5JzM5LjAiTiAxOcKwNDknMDcuMiJF!5e0!3m2!1sen!2sal!4v1234567890"/>
        </div>
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
