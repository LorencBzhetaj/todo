'use client';
// components/ui/Lightbox.tsx
import { useEffect } from 'react';

interface Props { imageUrl: string; carName: string; onClose: () => void; }

export default function Lightbox({ imageUrl, carName, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`Image of ${carName}`} onClick={onClose}
      className="fixed inset-0 z-[99999] bg-black/92 flex items-center justify-center p-4">
      <button onClick={onClose} aria-label="Close"
        className="fixed top-4 right-4 w-10 h-10 bg-white/15 rounded-full text-white flex items-center justify-center hover:bg-white/25 transition-colors text-xl">✕</button>
      <div onClick={(e) => e.stopPropagation()} className="max-w-full max-h-[85vh] flex flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={carName} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px' }} />
        {carName && <p className="text-white font-semibold text-sm text-center">{carName}</p>}
      </div>
    </div>
  );
}
