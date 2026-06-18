'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getBookings, getCars } from '@/lib/api-client';
import type { Booking, Car } from '@/types';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function StatCard({ label, value, sub, color = 'gold', icon }: {
  label: string; value: string | number; sub: string; color?: string; icon: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    gold: 'text-gold bg-gold/10 border-gold/20',
    green: 'text-green-400 bg-green-400/10 border-green-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  };
  return (
    <div className="bg-dark-3 border border-white/5 rounded-2xl p-5 hover:border-gold/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">{icon}</svg>
        </div>
      </div>
      <p className="text-3xl sm:text-4xl font-black text-off-white mb-1">{value}</p>
      <p className="text-xs text-muted">{sub}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const now = new Date();
  const [selMonth, setSelMonth] = useState(now.getMonth());
  const [selYear, setSelYear] = useState(now.getFullYear());

  useEffect(() => { if (status === 'unauthenticated') router.replace('/admin/login'); }, [status, router]);
  useEffect(() => {
    if (status !== 'authenticated') return;
    Promise.all([getBookings(), getCars()])
      .then(([b, c]) => { setBookings(b.bookings); setCars(c.cars); })
      .catch(console.error);
  }, [status]);

  if (status === 'loading') return (
    <div className="flex items-center justify-center min-h-screen bg-dark">
      <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin"/>
    </div>
  );

  const confirmed = bookings.filter(b => b.status === 'Confirmed');
  const pending = bookings.filter(b => b.status === 'Pending');

  // Revenue calculations
  const totalRevenue = confirmed.reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);

  const years = [...new Set([now.getFullYear(), ...bookings.map(b => new Date(b.createdAt ?? '').getFullYear()).filter(Boolean)])].sort((a, z) => z - a);

  const monthly = useMemo(() => bookings.filter(b => {
    const d = new Date(b.createdAt ?? '');
    return !isNaN(d.getTime()) && d.getMonth() === selMonth && d.getFullYear() === selYear;
  }), [bookings, selMonth, selYear]);

  const monthlyRevenue = monthly
    .filter(b => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);

  // Monthly revenue by month for chart (last 6 months)
  const revenueChart = useMemo(() => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const rev = bookings
        .filter(b => {
          const bd = new Date(b.createdAt ?? '');
          return b.status === 'Confirmed' && bd.getMonth() === m && bd.getFullYear() === y;
        })
        .reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);
      result.push({ label: MONTHS[m], revenue: rev });
    }
    return result;
  }, [bookings]);

  const maxRevenue = Math.max(...revenueChart.map(r => r.revenue), 1);

  return (
    <div className="min-h-screen bg-dark p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-1">Overview</p>
          <h1 className="text-3xl sm:text-4xl font-black text-off-white">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3 glass px-4 py-3 rounded-xl self-start sm:self-auto">
          <div className="w-8 h-8 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center text-gold text-sm font-black">
            {session?.user?.name?.[0] ?? 'A'}
          </div>
          <div>
            <p className="text-sm font-semibold text-off-white leading-none">{session?.user?.name ?? 'Admin'}</p>
            <p className="text-xs text-muted mt-0.5 hidden sm:block">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Revenue" value={`€${totalRevenue.toLocaleString()}`} sub="From confirmed" color="gold"
          icon={<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>}/>
        <StatCard label="Bookings" value={bookings.length} sub="All time" color="blue"
          icon={<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>}/>
        <StatCard label="Confirmed" value={confirmed.length} sub="All time" color="green"
          icon={<polyline points="20 6 9 17 4 12"/>}/>
        <StatCard label="Pending" value={pending.length} sub="Need action" color="amber"
          icon={<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>}/>
      </div>

      {/* Revenue chart + Monthly */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        {/* Revenue bar chart */}
        <div className="lg:col-span-2 bg-dark-3 border border-white/5 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Revenue</p>
              <h2 className="text-base font-bold text-off-white">Last 6 Months</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black gold-text">€{monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted">{MONTHS[selMonth]} {selYear}</p>
            </div>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-2 h-32">
            {revenueChart.map((r) => (
              <div key={r.label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative flex items-end" style={{ height: '96px' }}>
                  <div
                    className="w-full bg-gold/20 hover:bg-gold/40 transition-all rounded-t-lg cursor-default"
                    style={{ height: `${r.revenue > 0 ? Math.max((r.revenue / maxRevenue) * 96, 4) : 2}px` }}
                    title={`€${r.revenue.toLocaleString()}`}
                  />
                </div>
                <p className="text-xs text-muted">{r.label}</p>
                {r.revenue > 0 && (
                  <p className="text-xs text-gold font-bold">€{r.revenue >= 1000 ? `${(r.revenue/1000).toFixed(1)}k` : r.revenue}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Monthly stats */}
        <div className="bg-dark-3 border border-white/5 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-off-white">Monthly</h2>
            <div className="flex gap-2">
              <select value={selMonth} onChange={(e) => setSelMonth(Number(e.target.value))} aria-label="Month"
                className="input-dark text-xs px-2 py-1.5 rounded-lg">
                {MONTHS.map((m, i) => <option key={m} value={i} className="bg-dark-3">{m}</option>)}
              </select>
              <select value={selYear} onChange={(e) => setSelYear(Number(e.target.value))} aria-label="Year"
                className="input-dark text-xs px-2 py-1.5 rounded-lg">
                {years.map(y => <option key={y} value={y} className="bg-dark-3">{y}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Revenue', value: `€${monthlyRevenue.toLocaleString()}`, color: 'text-gold' },
              { label: 'Total', value: monthly.length, color: 'text-off-white' },
              { label: 'Confirmed', value: monthly.filter(b => b.status === 'Confirmed').length, color: 'text-green-400' },
              { label: 'Pending', value: monthly.filter(b => b.status === 'Pending').length, color: 'text-amber-400' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between bg-dark-4 border border-white/5 rounded-xl px-4 py-3">
                <span className="text-sm text-muted">{s.label}</span>
                <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings table */}
      <div className="bg-dark-3 border border-white/5 rounded-2xl p-5 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-off-white">Recent Bookings</h2>
          <div className="flex gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/> Live
            </span>
            <button onClick={() => router.push('/admin/inquiries')} className="text-xs text-gold hover:text-gold-light transition-colors font-medium">
              View all →
            </button>
          </div>
        </div>
        {/* Mobile: cards */}
        <div className="block sm:hidden space-y-3">
          {[...bookings].slice(0, 5).map(b => (
            <div key={b.id} className="bg-dark-4 border border-white/5 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-off-white text-sm">{b.fullName}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  b.status === 'Confirmed' ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                  : b.status === 'Cancelled' ? 'bg-red-400/10 text-red-400 border border-red-400/20'
                  : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                }`}>
                  <span className="w-1 h-1 rounded-full bg-current"/>
                  {b.status}
                </span>
              </div>
              <p className="text-muted text-xs mb-1">{b.car?.name ?? `#${b.carId}`}</p>
              <div className="flex items-center justify-between">
                <p className="text-muted text-xs">{b.phoneNumber}</p>
                {b.totalPrice ? <p className="text-gold font-bold text-sm">€{b.totalPrice.toLocaleString()}</p> : null}
              </div>
            </div>
          ))}
          {bookings.length === 0 && <p className="text-center text-muted py-8 text-sm">No bookings yet.</p>}
        </div>
        {/* Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Customer','Car','Phone','Dates','Total','Status'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs font-bold uppercase tracking-widest text-muted/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[...bookings].slice(0, 8).map(b => (
                <tr key={b.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 font-semibold text-off-white">{b.fullName}</td>
                  <td className="py-3 text-muted text-sm">{b.car?.name ?? `#${b.carId}`}</td>
                  <td className="py-3 text-muted text-sm">{b.phoneNumber}</td>
                  <td className="py-3 text-muted text-xs">
                    {b.pickupDate ? new Date(b.pickupDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short' }) : '—'}
                    {b.dropoffDate ? ` → ${new Date(b.dropoffDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short' })}` : ''}
                  </td>
                  <td className="py-3 text-gold font-bold">{b.totalPrice ? `€${b.totalPrice.toLocaleString()}` : '—'}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      b.status === 'Confirmed' ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                      : b.status === 'Cancelled' ? 'bg-red-400/10 text-red-400 border border-red-400/20'
                      : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                    }`}>
                      <span className="w-1 h-1 rounded-full bg-current"/>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-muted">No bookings yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet */}
      <div className="bg-dark-3 border border-white/5 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-off-white">Fleet ({cars.length})</h2>
          <button onClick={() => router.push('/admin/cars')} className="text-xs text-gold hover:text-gold-light transition-colors font-medium">
            Manage →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {cars.slice(0, 6).map(car => (
            <div key={car.id} className="bg-dark-4 border border-white/5 rounded-xl p-3 hover:border-gold/20 transition-all">
              {car.imageUrl
                ? <img src={car.imageUrl} alt={car.name} loading="lazy" className="w-full h-14 object-cover rounded-lg mb-2"/>
                : <div className="w-full h-14 bg-dark-5 rounded-lg mb-2 flex items-center justify-center text-muted text-xs">No img</div>}
              <p className="text-xs font-semibold text-off-white truncate">{car.name}</p>
              <p className="text-xs text-gold font-bold">€{car.price}/day</p>
            </div>
          ))}
          {cars.length === 0 && <p className="col-span-6 text-center py-6 text-muted text-sm">No cars yet.</p>}
        </div>
      </div>
    </div>
  );
}
