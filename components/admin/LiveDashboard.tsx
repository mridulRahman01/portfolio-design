'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { DashboardStats } from '@/lib/dashboard';
import { Card, BarChart, Badge } from '@/components/admin/ui';
import { ViewPortfolioButton } from '@/components/admin/ViewPortfolioButton';

const POLL_MS = 10_000;

/** Smoothly counts from the previous value to the next on every update. */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) return;
    const t0 = performance.now();
    const dur = 700;
    let raf: number;
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

function KpiCard({ label, value, hint, accent = false, pulse = false }: {
  label: string; value: number; hint?: string; accent?: boolean; pulse?: boolean;
}) {
  return (
    <div className="group relative rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#00F5B8]/30 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(0,245,184,0.06)]">
      {pulse && value > 0 && (
        <span className="absolute right-4 top-4 flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00F5B8] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00F5B8]" />
        </span>
      )}
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40 transition-colors group-hover:text-white/60">
        {label}
      </div>
      <div className={`mt-2 text-3xl font-extrabold tracking-tight tabular-nums transition-transform duration-300 origin-left group-hover:scale-[1.04] ${accent ? 'text-[#00F5B8]' : 'text-white'}`}>
        <AnimatedNumber value={value} />
      </div>
      {hint && <div className="mt-1 text-xs text-white/35">{hint}</div>}
    </div>
  );
}

export function LiveDashboard({ initial }: { initial: DashboardStats }) {
  const [stats, setStats] = useState(initial);
  const [live, setLive] = useState(true);

  useEffect(() => {
    let stopped = false;

    async function refresh() {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const next = (await res.json()) as DashboardStats;
        if (!stopped) {
          setStats(next);
          setLive(true);
        }
      } catch {
        if (!stopped) setLive(false);
      }
    }

    const interval = setInterval(refresh, POLL_MS);
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      stopped = true;
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const updatedAt = new Date(stats.generatedAt).toLocaleTimeString();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold">Dashboard</h1>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
              live ? 'border-[#00F5B8]/30 bg-[#00F5B8]/10 text-[#00F5B8]' : 'border-orange-400/30 bg-orange-400/10 text-orange-300'
            }`}>
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                {live && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
              </span>
              {live ? 'Live' : 'Reconnecting…'}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/40">
            Auto-refreshes every 10 seconds · last update {updatedAt}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewPortfolioButton />
          <Link href="/admin/blogs/new"
            className="rounded-xl bg-gradient-to-br from-[#00F5B8] to-[#19d6a8] px-4 py-2.5 text-[13.5px] font-bold text-[#03110c] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,245,184,0.45)] active:scale-[0.97]">
            + New Post
          </Link>
        </div>
      </div>

      {/* KPI row 1 — traffic */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Visitors Today" value={stats.viewsToday} accent pulse hint="Page views since midnight" />
        <KpiCard label="Visitors — 14 Days" value={stats.views14d} hint="All tracked page views" />
        <KpiCard label="Article Reads" value={stats.totalBlogViews} hint="Total blog post views" />
        <KpiCard label="Unread Leads" value={stats.unreadLeads} accent={stats.unreadLeads > 0} pulse hint={`${stats.totalLeads} leads total`} />
      </div>

      {/* KPI row 2 — content */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total Posts" value={stats.totalPosts} />
        <KpiCard label="Published" value={stats.published} accent />
        <KpiCard label="Drafts" value={stats.drafts} />
        <KpiCard label="Scheduled" value={stats.scheduled} hint="Auto-publish via scheduler" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Page views — last 14 days">
          {stats.chart.some(c => c.value > 0)
            ? <BarChart data={stats.chart} />
            : <p className="py-8 text-center text-sm text-white/30">No tracked views yet — they appear as visitors browse the site.</p>}
        </Card>

        <Card title="Most viewed articles">
          {stats.topPosts.length === 0 && <p className="py-8 text-center text-sm text-white/30">No published posts yet.</p>}
          <ul className="divide-y divide-white/[0.06]">
            {stats.topPosts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <span className="w-5 text-sm font-bold text-white/25">{i + 1}</span>
                <Link href={`/admin/blogs/${p.id}`} className="flex-1 truncate text-sm font-semibold text-white hover:text-[#00F5B8] transition-colors">
                  {p.title}
                </Link>
                <Badge tone="green"><AnimatedNumber value={p.views} /> views</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Recent activity">
        {stats.recentActivity.length === 0 && <p className="py-6 text-center text-sm text-white/30">Nothing yet.</p>}
        <ul className="divide-y divide-white/[0.06]">
          {stats.recentActivity.map(a => (
            <li key={a.id} className="flex items-center gap-3 py-2.5 text-sm">
              <Badge tone="neutral">{a.action}</Badge>
              <span className="flex-1 truncate text-white/60">{a.detail}</span>
              <span className="text-xs text-white/30">
                {a.userName ?? 'system'} · {new Date(a.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
