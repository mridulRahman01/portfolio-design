'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Field, inputCls, Btn, ConfirmDelete, Badge } from '@/components/admin/ui';

export type FieldDef = {
  name: string;
  label: string;
  kind: 'text' | 'textarea' | 'number' | 'checkbox' | 'select';
  options?: string[];
  hint?: string;
  half?: boolean;
};

type Row = Record<string, unknown> & { id: string };

/**
 * Generic CRUD editor for ordered content collections
 * (services, testimonials, social links, …).
 * Server actions are passed in as props from the server page.
 */
export function CrudList({ rows, fields, titleKey, upsert, remove, addLabel }: {
  rows: Row[];
  fields: FieldDef[];
  titleKey: string;
  upsert: (id: string | null, data: Record<string, unknown>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  addLabel: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.kind === 'checkbox') data[f.name] = fd.get(f.name) === 'on';
      else if (f.kind === 'number') data[f.name] = Number(fd.get(f.name) ?? 0);
      else data[f.name] = (fd.get(f.name) as string) ?? '';
    }
    setError(null);
    start(async () => {
      try {
        await upsert(editing === 'new' ? null : (editing as Row).id, data);
        setEditing(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Save failed');
      }
    });
  }

  const current: Record<string, unknown> = editing === 'new' ? {} : (editing ?? {});

  return (
    <div className="space-y-4">
      {editing ? (
        <Card title={editing === 'new' ? addLabel : `Edit: ${String(current[titleKey] ?? '')}`}>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            {fields.map(f => (
              <div key={f.name} className={f.half ? '' : 'sm:col-span-2'}>
                {f.kind === 'checkbox' ? (
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-white/70">
                    <input
                      type="checkbox" name={f.name}
                      defaultChecked={current[f.name] === undefined ? true : Boolean(current[f.name])}
                      className="h-4 w-4 accent-[#00F5B8]"
                    />
                    {f.label}
                  </label>
                ) : (
                  <Field label={f.label} hint={f.hint}>
                    {f.kind === 'textarea' ? (
                      <textarea name={f.name} defaultValue={String(current[f.name] ?? '')} className={`${inputCls} h-20 resize-y`} />
                    ) : f.kind === 'select' ? (
                      <select name={f.name} defaultValue={String(current[f.name] ?? f.options?.[0] ?? '')} className={inputCls}>
                        {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={f.kind === 'number' ? 'number' : 'text'}
                        name={f.name}
                        defaultValue={String(current[f.name] ?? (f.kind === 'number' ? 0 : ''))}
                        className={inputCls}
                      />
                    )}
                  </Field>
                )}
              </div>
            ))}
            {error && <p className="sm:col-span-2 text-sm text-red-400">{error}</p>}
            <div className="flex gap-3 sm:col-span-2">
              <Btn type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</Btn>
              <Btn type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
            </div>
          </form>
        </Card>
      ) : (
        <Btn type="button" onClick={() => setEditing('new')}>+ {addLabel}</Btn>
      )}

      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.id} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="truncate font-bold text-white">{String(r[titleKey] ?? '')}</div>
            </div>
            {'visible' in r && (
              <Badge tone={r.visible ? 'green' : 'neutral'}>{r.visible ? 'visible' : 'hidden'}</Badge>
            )}
            {'order' in r && <span className="text-xs text-white/30">#{String(r.order)}</span>}
            <button onClick={() => setEditing(r)} className="text-xs font-bold text-[#00F5B8]/80 hover:text-[#00F5B8]">
              Edit
            </button>
            <ConfirmDelete onConfirm={async () => { await remove(r.id); router.refresh(); }} />
          </div>
        ))}
        {rows.length === 0 && (
          <p className="rounded-2xl border border-white/8 py-10 text-center text-sm text-white/30">
            Nothing here yet — the site shows its built-in defaults until you add items.
          </p>
        )}
      </div>
    </div>
  );
}
