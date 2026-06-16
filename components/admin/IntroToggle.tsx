'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveSection } from '@/app/actions/content';
import { Card } from '@/components/admin/ui';

/** On/off switch controlling whether the cinematic scroll intro plays
 *  before the homepage. Saves to the `intro` homepage setting. */
export function IntroToggle({ initial }: { initial: boolean }) {
  const router = useRouter();
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function toggle() {
    const next = !on;
    setOn(next);
    setMsg(null);
    start(async () => {
      try {
        await saveSection('intro', { enabled: next });
        setMsg('Saved ✓');
        router.refresh();
        setTimeout(() => setMsg(null), 2500);
      } catch (e) {
        setOn(!next); // revert on failure
        setMsg(e instanceof Error ? e.message : 'Save failed');
      }
    });
  }

  return (
    <Card title="Intro animation">
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-md">
          <p className="text-sm text-white/70">
            The cinematic scroll animation that plays before the homepage.
          </p>
          <p className="mt-1.5 text-[13px] text-white/40">
            Turn it <strong className="text-white/60">off</strong> to send visitors straight to the
            hero section. Turn it <strong className="text-white/60">on</strong> for the full
            scroll-through intro experience.
          </p>
          {msg && (
            <p className={`mt-3 text-sm ${msg.includes('✓') ? 'text-[#00F5B8]' : 'text-red-400'}`}>{msg}</p>
          )}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={on}
          disabled={pending}
          onClick={toggle}
          className={`relative h-9 w-16 shrink-0 rounded-full border transition-colors duration-300 disabled:opacity-60 ${
            on ? 'border-[#00F5B8]/40 bg-[#00F5B8]/20' : 'border-white/10 bg-white/[0.06]'
          }`}
        >
          <span
            className={`absolute top-1 h-7 w-7 rounded-full shadow-md transition-all duration-300 ${
              on ? 'left-8 bg-[#00F5B8]' : 'left-1 bg-white/40'
            }`}
          />
        </button>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
          on ? 'border-[#00F5B8]/30 bg-[#00F5B8]/10 text-[#00F5B8]' : 'border-white/10 bg-white/5 text-white/50'
        }`}>
          {pending ? 'Saving…' : on ? 'Animation ON' : 'Animation OFF'}
        </span>
      </div>
    </Card>
  );
}
