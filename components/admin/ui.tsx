'use client';

import { useState, useTransition, type ReactNode } from 'react';

/* Shared admin UI primitives — dark SaaS aesthetic, pure Tailwind. */

export function Card({ title, action, children, className = '' }: {
  title?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md p-6 transition-colors duration-300 hover:border-white/[0.14] ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          {title && <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white/50">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({ label, value, hint, accent = false }: {
  label: string; value: string | number; hint?: string; accent?: boolean;
}) {
  return (
    <div className="group rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#00F5B8]/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(0,245,184,0.06)]">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40 transition-colors group-hover:text-white/60">{label}</div>
      <div className={`mt-2 text-3xl font-extrabold tracking-tight transition-transform duration-300 group-hover:scale-[1.04] origin-left ${accent ? 'text-[#00F5B8]' : 'text-white'}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-white/35">{hint}</div>}
    </div>
  );
}

export function Field({ label, error, children, hint }: {
  label: string; error?: string; children: ReactNode; hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-white/70">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-white/30">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

export const inputCls =
  'w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-[14px] text-white ' +
  'placeholder:text-white/25 outline-none transition focus:border-[#00F5B8]/50 focus:ring-1 focus:ring-[#00F5B8]/30';

export function Btn({ children, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
}) {
  const styles = {
    primary: 'bg-gradient-to-br from-[#00F5B8] to-[#19d6a8] text-[#03110c] hover:shadow-[0_10px_32px_rgba(0,245,184,0.45)] hover:brightness-110',
    ghost: 'border border-white/10 bg-white/[0.04] text-white hover:border-[#00F5B8]/50 hover:bg-white/[0.07] hover:shadow-[0_0_24px_rgba(0,245,184,0.12)]',
    danger: 'border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500/50',
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-bold transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${styles} ${props.className ?? ''}`}
    >
      {children}
    </button>
  );
}

/** Delete button with inline confirm step (no window.confirm). */
export function ConfirmDelete({ onConfirm, label = 'Delete' }: { onConfirm: () => Promise<void>; label?: string }) {
  const [arming, setArming] = useState(false);
  const [pending, start] = useTransition();
  if (!arming) {
    return (
      <button onClick={() => setArming(true)} className="text-xs font-semibold text-red-400/70 hover:text-red-300">
        {label}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <span className="text-white/50">Sure?</span>
      <button
        disabled={pending}
        onClick={() => start(async () => { await onConfirm(); setArming(false); })}
        className="font-bold text-red-400 hover:text-red-300"
      >
        {pending ? '…' : 'Yes'}
      </button>
      <button onClick={() => setArming(false)} className="text-white/50 hover:text-white">No</button>
    </span>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'green' | 'orange' | 'blue' | 'neutral' | 'red' }) {
  const tones = {
    green: 'bg-[#00F5B8]/10 text-[#00F5B8] border-[#00F5B8]/25',
    orange: 'bg-[#FF7A18]/10 text-[#FF7A18] border-[#FF7A18]/25',
    blue: 'bg-blue-400/10 text-blue-300 border-blue-400/25',
    red: 'bg-red-400/10 text-red-300 border-red-400/25',
    neutral: 'bg-white/5 text-white/55 border-white/10',
  }[tone];
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${tones}`}>
      {children}
    </span>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/8">
      <table className="w-full min-w-[640px] text-left text-[13.5px]">
        <thead>
          <tr className="border-b border-white/8 bg-white/[0.02]">
            {head.map(h => (
              <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">{children}</tbody>
      </table>
    </div>
  );
}

/** Minimal SVG bar chart — no chart library needed. */
export function BarChart({ data, height = 120 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div className="flex items-end gap-1.5" style={{ height }} role="img"
      aria-label={`Bar chart: ${data.map(d => `${d.label} ${d.value}`).join(', ')}`}>
      {data.map((d, i) => (
        <div key={i} className="group relative flex-1 flex flex-col items-center justify-end h-full">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-[#00F5B8]/30 to-[#00F5B8] transition-all group-hover:from-[#00F5B8]/50"
            style={{ height: `${Math.max(3, (d.value / max) * 100)}%` }}
          />
          <span className="mt-1.5 text-[9px] text-white/30">{d.label}</span>
          <span className="pointer-events-none absolute -top-6 hidden rounded bg-black/90 px-1.5 py-0.5 text-[10px] font-bold text-white group-hover:block">
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}
