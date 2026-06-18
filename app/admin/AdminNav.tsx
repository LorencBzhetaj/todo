'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard',
    icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></> },
  { href: '/admin/cars', label: 'Fleet',
    icon: <><path d="M19 17H5a2 2 0 0 1-2-2V9l2-4h14l2 4v6a2 2 0 0 1-2 2z"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></> },
  { href: '/admin/inquiries', label: 'Bookings',
    icon: <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/> },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 bg-dark-2 border-r border-white/5 flex-col h-screen sticky top-0 flex-shrink-0">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group mb-1">
            <div className="w-8 h-8 border border-gold/40 rounded-lg flex items-center justify-center group-hover:border-gold transition-colors">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M19 17H5a2 2 0 0 1-2-2V9l2-4h14l2 4v6a2 2 0 0 1-2 2z"/>
                <circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>
              </svg>
            </div>
            <span className="font-black text-lg text-off-white">Drive<span className="gold-text">Elite</span></span>
          </Link>
          <p className="text-xs text-muted ml-11">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Admin navigation">
          <p className="text-xs font-bold uppercase tracking-widest text-muted/50 px-3 mb-4">Management</p>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-gold/10 text-gold border border-gold/20'
                  : 'text-muted hover:text-off-white hover:bg-white/5 border border-transparent'
              }`}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{item.icon}</svg>
              {item.label}
              {isActive(item.href) && <span className="ml-auto w-1 h-1 rounded-full bg-gold"/>}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-6 border-t border-white/5 pt-4 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-off-white hover:bg-white/5 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            View Site
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ────────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-2/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 border border-gold/40 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M19 17H5a2 2 0 0 1-2-2V9l2-4h14l2 4v6a2 2 0 0 1-2 2z"/>
                <circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>
              </svg>
            </div>
            <span className="font-black text-base text-off-white">Drive<span className="gold-text">Elite</span></span>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"
            className="p-2 text-muted hover:text-off-white transition-colors">
            {mobileOpen
              ? <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            }
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="bg-dark-2 border-t border-white/5 px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.href) ? 'bg-gold/10 text-gold border border-gold/20' : 'text-muted hover:text-off-white hover:bg-white/5 border border-transparent'
                }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{item.icon}</svg>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/5 mt-2 pt-2 flex gap-2">
              <Link href="/" onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-muted hover:text-off-white hover:bg-white/5 transition-all">
                View Site
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="flex-1 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
