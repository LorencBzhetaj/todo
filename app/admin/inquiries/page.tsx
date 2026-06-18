'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getBookings, getCars, createBooking, confirmBooking, cancelBooking, deleteBooking } from '@/lib/api-client';
import type { Booking, Car } from '@/types';

const EMPTY_BOOKING = {
  carId: 0, fullName: '', email: '', phoneNumber: '',
  pickupLocation: '', pickupDate: '', dropoffDate: '', notes: '',
};

// Manual booking modal — defined outside to prevent re-render focus loss
function CreateBookingModal({ cars, onClose, onSave }: {
  cars: Car[]; onClose: () => void; onSave: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_BOOKING });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedCar = cars.find(c => c.id === Number(form.carId));
  const rentalDays = useMemo(() => {
    if (!form.pickupDate || !form.dropoffDate) return null;
    const diff = new Date(form.dropoffDate).getTime() - new Date(form.pickupDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  }, [form.pickupDate, form.dropoffDate]);
  const totalPrice = selectedCar && rentalDays ? selectedCar.price * rentalDays : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    if (!form.carId || form.carId === 0) { setError('Please select a car.'); return; }
    if (!form.fullName.trim()) { setError('Full name required.'); return; }
    if (!form.email.trim()) { setError('Email required.'); return; }
    if (!form.phoneNumber.trim()) { setError('Phone required.'); return; }
    try {
      setSaving(true);
      await createBooking({
        carId: Number(form.carId),
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        pickupLocation: form.pickupLocation || undefined,
        pickupDate: form.pickupDate || undefined,
        dropoffDate: form.dropoffDate || undefined,
        totalPrice: totalPrice ?? undefined,
        notes: form.notes || undefined,
      });
      onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create booking');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      role="dialog" aria-modal="true">
      <div className="bg-dark-3 border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gold/70 uppercase tracking-widest mb-0.5">Admin</p>
            <h2 className="text-xl font-bold text-off-white">New Booking</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 bg-dark-4 rounded-full flex items-center justify-center text-muted hover:text-off-white transition-colors">✕</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Vehicle *</label>
            <select name="carId" value={form.carId} onChange={handleChange}
              className="input-dark w-full px-4 py-3 rounded-xl text-sm">
              <option value={0} className="bg-dark-3">Select a car...</option>
              {cars.map(c => (
                <option key={c.id} value={c.id} className="bg-dark-3">
                  {c.name} – €{c.price}/day
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Full Name *</label>
              <input name="fullName" type="text" value={form.fullName} onChange={handleChange}
                placeholder="Customer name" className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Phone *</label>
              <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange}
                placeholder="+355 69..." className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="customer@email.com" className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Pick-up Location</label>
            <input name="pickupLocation" type="text" value={form.pickupLocation} onChange={handleChange}
              placeholder="Tirana Airport, Hotel..." className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Pick-up Date</label>
              <input name="pickupDate" type="date" value={form.pickupDate} onChange={handleChange}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Drop-off Date</label>
              <input name="dropoffDate" type="date" value={form.dropoffDate} onChange={handleChange}
                min={form.pickupDate || undefined}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
            </div>
          </div>

          {totalPrice && rentalDays && (
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-3 flex items-center justify-between">
              <span className="text-muted text-sm">{rentalDays} day{rentalDays !== 1 ? 's' : ''} × €{selectedCar?.price}/day</span>
              <span className="text-gold font-black text-lg">€{totalPrice.toLocaleString()}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
              placeholder="Any notes..." className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"/>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 border border-white/10 text-muted rounded-xl text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 btn-gold py-3 rounded-xl font-bold text-sm shine disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminInquiries() {
  const { status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { if (status === 'unauthenticated') router.replace('/admin/login'); }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    Promise.all([getBookings(), getCars()])
      .then(([b, c]) => { setBookings(b.bookings); setCars(c.cars); })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [status, tick]);

  const handleConfirm = async (id: number) => {
    try { await confirmBooking(id); setTick(p => p + 1); }
    catch { setError('Failed to confirm'); }
  };

  const handleCancel = async (id: number) => {
    try { await cancelBooking(id); setTick(p => p + 1); }
    catch { setError('Failed to cancel'); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this booking?')) return;
    try { await deleteBooking(id); setTick(p => p + 1); }
    catch { setError('Failed to delete'); }
  };

  const filtered = bookings.filter(b => {
    const mStatus = filterStatus === 'All' || b.status === filterStatus;
    const mSearch = !search ||
      b.fullName.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.phoneNumber.includes(search);
    return mStatus && mSearch;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Confirmed: 'bg-green-400/10 text-green-400 border-green-400/20',
      Pending: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
      Cancelled: 'bg-red-400/10 text-red-400 border-red-400/20',
    };
    return map[status] ?? 'bg-gray-400/10 text-gray-400 border-gray-400/20';
  };

  return (
    <div className="min-h-screen bg-dark p-4 sm:p-8">
      {showCreate && (
        <CreateBookingModal
          cars={cars}
          onClose={() => setShowCreate(false)}
          onSave={() => { setShowCreate(false); setTick(p => p + 1); }}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-1">Customer Requests</p>
          <h1 className="text-3xl sm:text-4xl font-black text-off-white">Bookings</h1>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="btn-gold px-5 py-3 rounded-xl font-bold text-sm shine self-start sm:self-auto">
          + New Booking
        </button>
      </div>

      {error && (
        <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex justify-between text-sm">
          {error}
          <button onClick={() => setError('')} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input type="text" placeholder="Search name, email, phone..." value={search}
          onChange={(e) => setSearch(e.target.value)} aria-label="Search"
          className="input-dark px-4 py-2.5 rounded-xl text-sm flex-1 min-w-48"/>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Status"
          className="input-dark px-4 py-2.5 rounded-xl text-sm">
          {['All','Pending','Confirmed','Cancelled'].map(s => <option key={s} className="bg-dark-3">{s}</option>)}
        </select>
        <span className="text-sm text-muted ml-auto">
          <span className="text-gold font-bold">{filtered.length}</span> booking{filtered.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => {
            const header = ['ID','Customer','Email','Phone','Car','Pick-up Location','Pick-up Date','Drop-off Date','Total (€)','Status','Notes'];
            const rows = filtered.map(b => [
              b.id, b.fullName, b.email, b.phoneNumber,
              b.car?.name ?? b.carId,
              b.pickupLocation ?? '',
              b.pickupDate ? new Date(b.pickupDate).toLocaleDateString('en-GB') : '',
              b.dropoffDate ? new Date(b.dropoffDate).toLocaleDateString('en-GB') : '',
              b.totalPrice ?? '',
              b.status, b.notes ?? '',
            ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
            const csv = [header.join(','), ...rows].join('\n');
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
            a.download = `bookings-${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
          }}
          className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-gold/40 text-muted hover:text-gold text-sm rounded-xl transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          CSV
        </button>
      </div>

      {/* Mobile: card view */}
      <div className="block lg:hidden space-y-3 mb-6">
        {loading ? (
          <p className="text-center text-muted py-12">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted py-12">No bookings found.</p>
        ) : filtered.map(b => (
          <div key={b.id} className="bg-dark-3 border border-white/5 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-off-white">{b.fullName}</p>
                <p className="text-muted text-xs mt-0.5">{b.email}</p>
                <p className="text-muted text-xs">{b.phoneNumber}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge(b.status)}`}>
                <span className="w-1 h-1 rounded-full bg-current"/>{b.status}
              </span>
            </div>
            <div className="bg-dark-4 rounded-xl p-3 mb-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted mb-0.5">Car</p>
                <p className="text-off-white font-medium">{b.car?.name ?? `#${b.carId}`}</p>
              </div>
              <div>
                <p className="text-muted mb-0.5">Total</p>
                <p className="text-gold font-black">{b.totalPrice ? `€${b.totalPrice.toLocaleString()}` : '—'}</p>
              </div>
              {b.pickupLocation && (
                <div>
                  <p className="text-muted mb-0.5">Pick-up</p>
                  <p className="text-off-white font-medium truncate">{b.pickupLocation}</p>
                </div>
              )}
              {(b.pickupDate || b.dropoffDate) && (
                <div>
                  <p className="text-muted mb-0.5">Dates</p>
                  <p className="text-off-white font-medium text-xs">
                    {b.pickupDate ? new Date(b.pickupDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : '—'}
                    {' → '}
                    {b.dropoffDate ? new Date(b.dropoffDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : '—'}
                  </p>
                </div>
              )}
            </div>
            {b.notes && <p className="text-muted text-xs mb-3 italic">"{b.notes}"</p>}
            <div className="flex gap-2">
              {b.status === 'Pending' && (
                <button onClick={() => handleConfirm(b.id)}
                  className="flex-1 bg-green-400/10 hover:bg-green-400 border border-green-400/20 hover:border-green-400 text-green-400 hover:text-dark transition-all py-2 rounded-xl text-xs font-bold">
                  ✓ Confirm
                </button>
              )}
              {b.status !== 'Cancelled' && (
                <button onClick={() => handleCancel(b.id)}
                  className="flex-1 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 text-amber-400 transition-all py-2 rounded-xl text-xs font-bold">
                  Cancel
                </button>
              )}
              <button onClick={() => handleDelete(b.id)}
                className="flex-1 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white transition-all py-2 rounded-xl text-xs font-bold">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden lg:block bg-dark-3 border border-white/5 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Customer','Car','Pick-up','Dates','Total','Status','Actions'].map(h => (
                <th key={h} className="pb-3 pt-5 px-4 text-left text-xs font-bold uppercase tracking-widest text-muted/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center text-muted">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-muted">No bookings found.</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id} className="hover:bg-white/2 transition-colors">
                <td className="py-4 px-4">
                  <p className="font-semibold text-off-white">{b.fullName}</p>
                  <p className="text-muted text-xs">{b.email}</p>
                  <p className="text-muted text-xs">{b.phoneNumber}</p>
                </td>
                <td className="py-4 px-4 text-muted text-sm">{b.car?.name ?? `#${b.carId}`}</td>
                <td className="py-4 px-4 text-muted text-xs max-w-[120px] truncate">{b.pickupLocation || '—'}</td>
                <td className="py-4 px-4 text-muted text-xs">
                  {b.pickupDate ? new Date(b.pickupDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'}) : '—'}
                  {b.dropoffDate ? ` → ${new Date(b.dropoffDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'2-digit'})}` : ''}
                </td>
                <td className="py-4 px-4 text-gold font-bold">{b.totalPrice ? `€${b.totalPrice.toLocaleString()}` : '—'}</td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusBadge(b.status)}`}>
                    <span className="w-1 h-1 rounded-full bg-current"/>{b.status}
                  </span>
                </td>
                <td className="py-4 px-4 space-x-2 whitespace-nowrap">
                  {b.status === 'Pending' && (
                    <button onClick={() => handleConfirm(b.id)}
                      className="bg-green-400/10 hover:bg-green-400 border border-green-400/20 hover:border-green-400 text-green-400 hover:text-dark transition-all px-3 py-1.5 rounded-lg text-xs font-bold">
                      Confirm
                    </button>
                  )}
                  {b.status !== 'Cancelled' && (
                    <button onClick={() => handleCancel(b.id)}
                      className="bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 text-amber-400 transition-all px-3 py-1.5 rounded-lg text-xs font-bold">
                      Cancel
                    </button>
                  )}
                  <button onClick={() => handleDelete(b.id)}
                    className="bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white transition-all px-3 py-1.5 rounded-lg text-xs font-bold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
