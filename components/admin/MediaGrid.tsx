'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMedia, renameMedia } from '@/app/actions/media';
import { Btn, ConfirmDelete, inputCls } from '@/components/admin/ui';

type Item = {
  id: string; url: string; publicId: string; format: string;
  folder: string; alt: string | null; bytes: number;
  width: number | null; height: number | null;
};

export function MediaGrid({ items, folders, activeFolder, q }: {
  items: Item[]; folders: string[]; activeFolder: string; q: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFolder, setUploadFolder] = useState(activeFolder || 'general');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [, start] = useTransition();

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        form.append('folder', uploadFolder || 'general');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="space-y-5">
      {/* Upload + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileRef} type="file" accept="image/*" multiple hidden
          onChange={e => handleFiles(e.target.files)}
        />
        <Btn type="button" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? 'Uploading…' : '↑ Upload Images'}
        </Btn>
        <input
          value={uploadFolder}
          onChange={e => setUploadFolder(e.target.value)}
          placeholder="Folder (e.g. blog)"
          className={`${inputCls} !w-44`}
          aria-label="Upload folder"
        />
        <form action="/admin/media" method="get" className="ml-auto flex gap-2">
          <input name="q" defaultValue={q} placeholder="Search…" className={`${inputCls} !w-48`} />
          <select name="folder" defaultValue={activeFolder} className={`${inputCls} !w-40`}>
            <option value="">All folders</option>
            {folders.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <Btn variant="ghost" type="submit">Filter</Btn>
        </form>
      </div>

      {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      {items.length === 0 && (
        <p className="rounded-2xl border border-white/8 py-16 text-center text-sm text-white/30">
          No media yet — upload your first image.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(m => (
          <div key={m.id} className="group overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
            <div className="relative aspect-[4/3] bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.url.replace('/upload/', '/upload/c_fill,w_400,q_auto,f_auto/')}
                alt={m.alt ?? m.publicId}
                className="h-full w-full object-cover !pointer-events-auto"
                loading="lazy"
              />
            </div>
            <div className="space-y-2 p-3">
              <input
                defaultValue={m.alt ?? ''}
                placeholder="Alt text…"
                className="w-full bg-transparent text-xs font-semibold text-white/70 outline-none placeholder:text-white/25"
                onBlur={e => start(() => renameMedia(m.id, e.target.value))}
                aria-label="Alt text"
              />
              <div className="flex items-center justify-between text-[11px] text-white/30">
                <span>{m.folder} · {m.format} · {(m.bytes / 1024).toFixed(0)} KB</span>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-xs font-bold text-[#00F5B8]/80 hover:text-[#00F5B8]"
                  onClick={async () => {
                    await navigator.clipboard.writeText(m.url);
                    setCopied(m.id);
                    setTimeout(() => setCopied(c => (c === m.id ? null : c)), 1500);
                  }}
                >
                  {copied === m.id ? 'Copied ✓' : 'Copy URL'}
                </button>
                <ConfirmDelete onConfirm={async () => { await deleteMedia(m.id); router.refresh(); }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
