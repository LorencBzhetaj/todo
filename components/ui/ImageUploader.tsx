'use client';
// components/ui/ImageUploader.tsx
import { useState, useRef } from 'react';

interface Props { onImageReady: (url: string) => void; }

export default function ImageUploader({ onImageReady }: Props) {
  const [preview, setPreview] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.trim();
    setUrlInput(v);
    if (v.startsWith('http')) { setPreview(v); onImageReady(v); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image.'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('Max 10MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { const r = ev.target?.result as string; setPreview(r); onImageReady(r); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(['url', 'upload'] as const).map((m) => (
          <button key={m} type="button"
            onClick={() => { setMode(m); if (m === 'upload') setTimeout(() => inputRef.current?.click(), 50); }}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode === m ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {m === 'url' ? 'URL' : 'Upload'}
          </button>
        ))}
      </div>
      {mode === 'url' && (
        <input type="url" placeholder="https://example.com/image.jpg" value={urlInput} onChange={handleUrl}
          className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"/>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} aria-label="Upload image"/>
      {preview && (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-gray-200"/>
          <button type="button" onClick={() => { setPreview(''); setUrlInput(''); onImageReady(''); }} aria-label="Remove"
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
        </div>
      )}
    </div>
  );
}
