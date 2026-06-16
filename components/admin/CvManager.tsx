'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveSection } from '@/app/actions/content';
import { Card, Btn, Field, inputCls } from '@/components/admin/ui';

/** Upload or link the CV/resume that the "Book a Free Strategy Call" button
 *  opens for visitors. Files go to the public Supabase `cv` bucket. */
export function CvManager({ initialUrl }: { initialUrl: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [, start] = useTransition();

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload-cv', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      setUrl(json.url);
      setMsg('CV uploaded & published ✓');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function saveUrl() {
    setError(null);
    setMsg(null);
    start(async () => {
      try {
        await saveSection('cv', { url: url.trim() });
        setMsg('Saved ✓');
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed');
      }
    });
  }

  function clearCv() {
    setUrl('');
    start(async () => {
      try {
        await saveSection('cv', { url: '' });
        setMsg('CV removed');
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Remove failed');
      }
    });
  }

  return (
    <Card title="CV / Resume">
      <p className="text-sm text-white/60">
        The file you set here opens when a visitor clicks the
        <strong className="text-white/80"> &ldquo;Book a Free Strategy Call&rdquo;</strong> button.
        Upload a new file anytime to replace it.
      </p>

      <input ref={fileRef} type="file" accept="application/pdf,image/*" hidden onChange={e => handleFile(e.target.files)} />

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Btn type="button" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? 'Uploading…' : url ? '↑ Replace CV' : '↑ Upload CV (PDF)'}
        </Btn>
        {url && (
          <>
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13.5px] font-bold text-white hover:border-[#00F5B8]/40">
              View current CV ↗
            </a>
            <Btn type="button" variant="danger" onClick={clearCv}>Remove</Btn>
          </>
        )}
      </div>

      <div className="mt-6 border-t border-white/8 pt-5">
        <Field label="…or paste a CV link" hint="e.g. a Google Drive / Dropbox share link to a PDF">
          <div className="flex gap-2">
            <input className={inputCls} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" />
            <Btn type="button" variant="ghost" onClick={saveUrl}>Save link</Btn>
          </div>
        </Field>
      </div>

      {url && (
        <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <object data={url} type="application/pdf" className="h-[420px] w-full" aria-label="CV preview">
            <div className="p-6 text-sm text-white/50">
              Preview unavailable here — <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#00F5B8] underline">open the CV in a new tab</a>.
            </div>
          </object>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {msg && <p className="mt-4 text-sm text-[#00F5B8]">{msg}</p>}
    </Card>
  );
}
