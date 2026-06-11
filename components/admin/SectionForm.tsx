'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Field, inputCls, Btn } from '@/components/admin/ui';
import { saveSection } from '@/app/actions/content';

export type SectionFieldDef = {
  name: string;
  label: string;
  kind: 'text' | 'textarea' | 'lines' | 'pairs' | 'triples' | 'stats' | 'gallery';
  hint?: string;
  half?: boolean;
};

/* Line-based encodings keep complex arrays editable by non-technical users:
 *  lines   → one entry per line
 *  pairs   → "value | label"            (achievements)
 *  triples → "year | title | text"      (timeline)
 *  stats   → "count | prefix | suffix | label | imageUrl"  (hero stats)
 *  gallery → "imageUrl | title | note | wide/tall"         (results)
 */

function encode(kind: SectionFieldDef['kind'], v: unknown): string {
  if (v == null) return '';
  switch (kind) {
    case 'lines':
      return (v as string[]).join('\n');
    case 'pairs':
      return (v as { value: string; label: string }[]).map(p => `${p.value} | ${p.label}`).join('\n');
    case 'triples':
      return (v as { year: string; title: string; text: string }[])
        .map(t => `${t.year} | ${t.title} | ${t.text}`).join('\n');
    case 'stats':
      return (v as { count: number; prefix?: string; suffix?: string; label: string; image: string }[])
        .map(s => `${s.count} | ${s.prefix ?? ''} | ${s.suffix ?? ''} | ${s.label} | ${s.image}`).join('\n');
    case 'gallery':
      return (v as { image: string; title: string; note: string; layout: string }[])
        .map(g => `${g.image} | ${g.title} | ${g.note} | ${g.layout}`).join('\n');
    default:
      return String(v);
  }
}

function decode(kind: SectionFieldDef['kind'], raw: string): unknown {
  const rows = raw.split('\n').map(l => l.trim()).filter(Boolean);
  switch (kind) {
    case 'lines':
      return rows;
    case 'pairs':
      return rows.map(l => {
        const [value = '', label = ''] = l.split('|').map(s => s.trim());
        return { value, label };
      });
    case 'triples':
      return rows.map(l => {
        const [year = '', title = '', text = ''] = l.split('|').map(s => s.trim());
        return { year, title, text };
      });
    case 'stats':
      return rows.map(l => {
        const [count = '0', prefix = '', suffix = '', label = '', image = ''] = l.split('|').map(s => s.trim());
        return { count: Number(count) || 0, prefix, suffix, label, image };
      });
    case 'gallery':
      return rows.map(l => {
        const [image = '', title = '', note = '', layout = 'wide'] = l.split('|').map(s => s.trim());
        return { image, title, note, layout: layout === 'tall' ? 'tall' : 'wide' };
      });
    default:
      return raw;
  }
}

export function SectionForm({ sectionKey, title, fields, value }: {
  sectionKey: 'hero' | 'about' | 'footer' | 'cta' | 'results';
  title: string;
  fields: SectionFieldDef[];
  value: Record<string, unknown>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next: Record<string, unknown> = { ...value };
    for (const f of fields) {
      next[f.name] = decode(f.kind, (fd.get(f.name) as string) ?? '');
    }
    setMsg(null);
    start(async () => {
      try {
        await saveSection(sectionKey, next);
        setMsg('Saved ✓');
        router.refresh();
        setTimeout(() => setMsg(null), 2500);
      } catch (err) {
        setMsg(err instanceof Error ? err.message : 'Save failed');
      }
    });
  }

  return (
    <Card title={title}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {fields.map(f => (
          <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
            <Field label={f.label} hint={f.hint}>
              {f.kind === 'text' ? (
                <input name={f.name} defaultValue={encode(f.kind, value[f.name])} className={inputCls} />
              ) : (
                <textarea
                  name={f.name}
                  defaultValue={encode(f.kind, value[f.name])}
                  className={`${inputCls} resize-y ${f.kind === 'textarea' ? 'h-24' : 'h-32 font-mono text-[13px]'}`}
                />
              )}
            </Field>
          </div>
        ))}
        <div className="flex items-center gap-3 sm:col-span-2">
          <Btn type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save Section'}</Btn>
          {msg && <span className={`text-sm ${msg.includes('✓') ? 'text-[#00F5B8]' : 'text-red-400'}`}>{msg}</span>}
        </div>
      </form>
    </Card>
  );
}
