'use client';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getCars, createCar, updateCar, deleteCar, getCarImages, addCarImage, deleteCarImage } from '@/lib/api-client';
import type { Car, CarImage } from '@/types';

const EMPTY = { name: '', description: '', model: '', brandName: '', price: 0, imageUrl: '' };
type FormData = typeof EMPTY;

// ── Photo picker — supports URL, file upload, and device camera ──
function PhotoPicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState(value || '');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 15 * 1024 * 1024) { alert('File must be under 15MB.'); return; }

    // Kompreso imazhin para base64 per te reduktuar madhesine
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', 0.82);
      onChange(compressed);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  const handleUrl = (url: string) => {
    setUrlInput(url);
    if (url.startsWith('http') || url.startsWith('https')) onChange(url);
    else if (!url) onChange('');
  };

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex gap-1.5 bg-dark-4 p-1 rounded-xl">
        <button type="button" onClick={() => setMode('url')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${mode === 'url' ? 'bg-gold/20 text-gold' : 'text-muted hover:text-off-white'}`}>
          🔗 URL
        </button>
        <button type="button" onClick={() => { setMode('file'); setTimeout(() => fileRef.current?.click(), 50); }}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${mode === 'file' ? 'bg-gold/20 text-gold' : 'text-muted hover:text-off-white'}`}>
          📁 File
        </button>
        <button type="button" onClick={() => cameraRef.current?.click()}
          className="flex-1 py-2 rounded-lg text-xs font-semibold text-muted hover:text-off-white transition-all">
          📷 Camera
        </button>
      </div>

      {mode === 'url' && (
        <input type="url" value={urlInput} onChange={(e) => handleUrl(e.target.value)}
          placeholder="https://example.com/car.jpg"
          className="input-dark w-full px-4 py-3 rounded-xl text-sm"/>
      )}

      {/* Hidden file inputs */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile}/>

      {/* Preview */}
      {value && (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview"
            className="w-full h-36 object-cover rounded-xl border border-white/10"/>
          <button type="button" onClick={() => { onChange(''); setUrlInput(''); }}
            aria-label="Remove image"
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

// ── Car form modal ──
function CarModal({ title, form, onChange, onSave, onClose, saveLabel, error }: {
  title: string; form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void; onClose: () => void; saveLabel: string; error?: string;
}) {
  const handleImageChange = useCallback((url: string) => {
    onChange({ target: { name: 'imageUrl', value: url } } as React.ChangeEvent<HTMLInputElement>);
  }, [onChange]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
      role="dialog" aria-modal="true" aria-label={title}>
      <div className="bg-dark-3 border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-md shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-off-white">{title}</h2>
          <button onClick={onClose} aria-label="Close"
            className="w-9 h-9 bg-dark-4 rounded-full flex items-center justify-center text-muted hover:text-off-white transition-colors">✕</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Name *</label>
              <input name="name" type="text" value={form.name} onChange={onChange}
                placeholder="e.g. BMW X5" className="input-dark w-full px-3 py-3 rounded-xl text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Brand *</label>
              <input name="brandName" type="text" value={form.brandName} onChange={onChange}
                placeholder="e.g. BMW" className="input-dark w-full px-3 py-3 rounded-xl text-sm"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Model</label>
              <input name="model" type="text" value={form.model} onChange={onChange}
                placeholder="xDrive40i" className="input-dark w-full px-3 py-3 rounded-xl text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">€/day *</label>
              <input name="price" type="number" min="0" value={form.price || ''} onChange={onChange}
                placeholder="80" className="input-dark w-full px-3 py-3 rounded-xl text-sm"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={2}
              placeholder="Vehicle description..." className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"/>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">Cover Photo</label>
            <PhotoPicker value={form.imageUrl} onChange={handleImageChange}/>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 border border-white/10 text-muted rounded-xl text-sm hover:border-white/20 transition-colors">Cancel</button>
          <button onClick={onSave} className="flex-1 btn-gold py-3 rounded-xl font-bold text-sm shine">{saveLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Gallery modal with device upload ──
function GalleryModal({ car, images, loading, onAdd, onDelete, onClose, toast }: {
  car: Car; images: CarImage[]; loading: boolean;
  onAdd: (url: string) => Promise<void>;
  onDelete: (id: number) => void;
  onClose: () => void; toast: boolean;
}) {
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newUrl) return;
    setAdding(true);
    try { await onAdd(newUrl); setNewUrl(''); }
    finally { setAdding(false); }
  };

  const handleImageChange = (url: string) => setNewUrl(url);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
      role="dialog" aria-modal="true">
      <div className="bg-dark-3 border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 w-full sm:max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-gold/70 uppercase tracking-widest mb-1">Gallery</p>
            <h2 className="text-xl font-bold text-off-white">{car.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="w-9 h-9 bg-dark-4 rounded-full flex items-center justify-center text-muted hover:text-off-white transition-colors">✕</button>
        </div>

        {toast && (
          <div className="bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-green-400 text-sm font-medium">Photo added!</span>
          </div>
        )}

        <div className="mb-6 pb-6 border-b border-white/5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Add Photo</p>
          <PhotoPicker value={newUrl} onChange={handleImageChange}/>
          {newUrl && (
            <button onClick={handleAdd} disabled={adding}
              className="mt-3 w-full btn-gold py-3 rounded-xl text-sm font-bold shine disabled:opacity-50">
              {adding ? 'Saving...' : 'Save Photo'}
            </button>
          )}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Gallery ({images.length})
          </p>
          {loading ? (
            <p className="text-muted text-sm text-center py-6">Loading...</p>
          ) : images.length === 0 ? (
            <p className="text-muted text-sm text-center py-6">No photos yet. Add your first one above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imageUrl} alt="" loading="lazy"
                    className="w-full h-28 object-cover rounded-xl border border-white/10"/>
                  <button onClick={() => onDelete(img.id)} aria-label="Delete photo"
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function AdminCarsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<FormData>({ ...EMPTY });
  const [editCar, setEditCar] = useState<Car | null>(null);
  const [editForm, setEditForm] = useState<FormData>({ ...EMPTY });
  const [gallery, setGallery] = useState<Car | null>(null);
  const [images, setImages] = useState<CarImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imgToast, setImgToast] = useState(false);

  useEffect(() => { if (status === 'unauthenticated') router.replace('/admin/login'); }, [status, router]);
  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    getCars().then((d) => setCars(d.cars)).catch(() => setError('Failed to load fleet')).finally(() => setLoading(false));
  }, [status, tick]);

  const filtered = useMemo(() => {
    if (!search) return cars;
    const q = search.toLowerCase();
    return cars.filter((c) => c.name.toLowerCase().includes(q) || c.brandName.toLowerCase().includes(q));
  }, [cars, search]);

  const handleAddChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddForm((p) => ({ ...p, [name]: name === 'price' ? Number(value) : value }));
  }, []);

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: name === 'price' ? Number(value) : value }));
  }, []);

  const handleCreate = async () => {
    setFormError('');
    if (!addForm.name.trim()) { setFormError('Car name is required.'); return; }
    if (!addForm.brandName.trim()) { setFormError('Brand is required.'); return; }
    if (!addForm.price || addForm.price <= 0) { setFormError('Price must be greater than 0.'); return; }
    try {
      await createCar({ ...addForm, price: Number(addForm.price) });
      setTick((p) => p + 1); setShowAdd(false); setAddForm({ ...EMPTY });
    } catch (e) { setFormError(e instanceof Error ? e.message : 'Failed'); }
  };

  const handleUpdate = async () => {
    if (!editCar) return;
    setFormError('');
    try {
      await updateCar(editCar.id, editForm);
      setTick((p) => p + 1); setEditCar(null);
    } catch (e) { setFormError(e instanceof Error ? e.message : 'Failed'); }
  };

  const openEdit = (car: Car) => {
    setEditCar(car);
    setEditForm({
      name: car.name ?? '',
      description: car.description ?? '',
      model: car.model ?? '',
      brandName: car.brandName ?? '',
      price: car.price ?? 0,
      imageUrl: car.imageUrl ?? '',
    });
    setFormError('');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try { await deleteCar(id); setTick((p) => p + 1); }
    catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
  };

  const openGallery = async (car: Car) => {
    setGallery(car); setImagesLoading(true);
    try { const d = await getCarImages(car.id); setImages(d.images); }
    catch { setImages([]); } finally { setImagesLoading(false); }
  };

  const handleAddImage = async (url: string) => {
    if (!gallery) return;
    await addCarImage(gallery.id, url);
    const d = await getCarImages(gallery.id);
    setImages(d.images);
    setImgToast(true);
    setTimeout(() => setImgToast(false), 2500);
  };

  const handleDeleteImage = async (imageId: number) => {
    try { await deleteCarImage(imageId); setImages((p) => p.filter((i) => i.id !== imageId)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Failed'); }
  };

  return (
    <div className="min-h-screen bg-dark p-4 sm:p-8">
      {showAdd && (
        <CarModal title="Add Vehicle" form={addForm} onChange={handleAddChange}
          onSave={handleCreate} onClose={() => { setShowAdd(false); setFormError(''); }}
          saveLabel="Create Vehicle" error={formError}/>
      )}
      {editCar && (
        <CarModal title={`Edit: ${editCar.name}`} form={editForm} onChange={handleEditChange}
          onSave={handleUpdate} onClose={() => { setEditCar(null); setFormError(''); }}
          saveLabel="Save Changes" error={formError}/>
      )}
      {gallery && (
        <GalleryModal car={gallery} images={images} loading={imagesLoading}
          onAdd={handleAddImage} onDelete={handleDeleteImage}
          onClose={() => { setGallery(null); }} toast={imgToast}/>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold/70 mb-1">Fleet Management</p>
          <h1 className="text-3xl sm:text-4xl font-black text-off-white">Vehicles</h1>
        </div>
        <button onClick={() => { setAddForm({ ...EMPTY }); setFormError(''); setShowAdd(true); }}
          className="btn-gold px-4 sm:px-6 py-3 rounded-xl font-bold text-sm shine">
          + Add
        </button>
      </div>

      {error && (
        <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex justify-between text-sm">
          {error}<button onClick={() => setError('')} className="font-bold ml-4">✕</button>
        </div>
      )}

      <div className="flex gap-3 mb-5">
        <input type="text" placeholder="Search fleet..." value={search}
          onChange={(e) => setSearch(e.target.value)} aria-label="Search"
          className="input-dark px-4 py-2.5 rounded-xl text-sm flex-1"/>
        <span className="self-center text-sm text-muted whitespace-nowrap">
          <span className="text-gold font-bold">{filtered.length}</span> car{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Mobile: card grid */}
      <div className="block lg:hidden">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-dark-3 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 skeleton"/><div className="p-4 space-y-2">
                  <div className="h-3 w-3/4 skeleton rounded"/><div className="h-3 w-1/2 skeleton rounded"/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted py-16">No vehicles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(car => (
              <div key={car.id} className="bg-dark-3 border border-white/5 rounded-2xl overflow-hidden">
                {car.imageUrl
                  ? <img src={car.imageUrl} alt={car.name} loading="lazy" className="w-full h-40 object-cover"/>
                  : <div className="w-full h-40 bg-dark-4 flex items-center justify-center text-muted text-sm">No photo</div>}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-muted text-xs">{car.brandName}</p>
                      <p className="text-off-white font-bold">{car.name}</p>
                    </div>
                    <p className="text-gold font-black">€{car.price}/day</p>
                    {(car as any).isAvailable === false ? (
                      <span className="inline-flex items-center gap-1 text-xs text-red-400 font-bold mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"/> Booked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400 font-bold mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/> Available
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(car)}
                      className="flex-1 bg-blue-400/10 border border-blue-400/20 text-blue-400 py-2 rounded-lg text-xs font-bold">Edit</button>
                    <button onClick={() => openGallery(car)}
                      className="flex-1 bg-gold/10 border border-gold/20 text-gold py-2 rounded-lg text-xs font-bold">Photos</button>
                    <button onClick={() => handleDelete(car.id)}
                      className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 py-2 rounded-lg text-xs font-bold">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden lg:block bg-dark-3 border border-white/5 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Photo','Name','Brand','€/Day','Status','Actions'].map((h, i) => (
                <th key={i} className="pb-3 pt-5 px-5 text-left text-xs font-bold uppercase tracking-widest text-muted/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? <tr><td colSpan={5} className="py-12 text-center text-muted">Loading...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={5} className="py-12 text-center text-muted">No vehicles.</td></tr>
              : filtered.map(car => (
                <tr key={car.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 px-5 w-24">
                    {car.imageUrl
                      ? <img src={car.imageUrl} alt={car.name} loading="lazy" className="w-20 h-12 object-cover rounded-xl border border-white/10"/>
                      : <div className="w-20 h-12 bg-dark-4 rounded-xl border border-white/10 flex items-center justify-center text-muted text-xs">No img</div>}
                  </td>
                  <td className="py-3 font-bold text-off-white">{car.name}</td>
                  <td className="py-3 text-muted">{car.brandName}</td>
                  <td className="py-3 text-gold font-bold">€{Number(car.price).toLocaleString()}</td>
                  <td className="py-3">
                    {(car as any).isAvailable === false ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                        <span className="w-1 h-1 rounded-full bg-current"/> Booked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-400/10 text-green-400 border border-green-400/20">
                        <span className="w-1 h-1 rounded-full bg-current animate-pulse"/> Available
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5 space-x-2 whitespace-nowrap">
                    <button onClick={() => openEdit(car)}
                      className="bg-blue-400/10 hover:bg-blue-400 border border-blue-400/20 hover:border-blue-400 text-blue-400 hover:text-dark transition-all px-3 py-1.5 rounded-lg text-xs font-bold">Edit</button>
                    <button onClick={() => openGallery(car)}
                      className="bg-gold/10 hover:bg-gold border border-gold/20 hover:border-gold text-gold hover:text-dark transition-all px-3 py-1.5 rounded-lg text-xs font-bold">Gallery</button>
                    <button onClick={() => handleDelete(car.id)}
                      className="bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white transition-all px-3 py-1.5 rounded-lg text-xs font-bold">Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}