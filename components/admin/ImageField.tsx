'use client';

import { useRef, useState } from 'react';
import { inputCls } from '@/components/admin/ui';

/**
 * Two ways to add a picture, both built in:
 *   1. Paste an image URL into the input.
 *   2. Click "Upload" to pick a file from the device (stored on Supabase).
 * Shows a live preview either way.
 */
export function ImageField({ label, value, onChange, error, hint, folder = 'blog' }: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
  hint?: string;
  folder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', folder);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      onChange(json.media.url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-semibold text-white/70">{label}</span>
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://… or upload →"
        />
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files)} />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="shrink-0 rounded-xl border border-[#00F5B8]/30 bg-[#00F5B8]/10 px-3.5 text-[13px] font-bold text-[#00F5B8] transition-all duration-200 hover:bg-[#00F5B8]/20 hover:-translate-y-0.5 active:scale-95 disabled:opacity-40"
        >
          {uploading ? '…' : '↑ Upload'}
        </button>
      </div>
      {value && (
        <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-28 w-full object-cover !pointer-events-auto"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            onLoad={e => { (e.target as HTMLImageElement).style.display = ''; }}
          />
        </div>
      )}
      {(uploadError || error) && <span className="mt-1 block text-xs text-red-400">{uploadError ?? error}</span>}
      {hint && !error && !uploadError && <span className="mt-1 block text-xs text-white/30">{hint}</span>}
    </div>
  );
}
