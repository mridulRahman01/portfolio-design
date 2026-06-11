'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { AppRole } from '@/lib/auth';

const NAV: { href: string; label: string; roles: AppRole[] }[] = [
  { href: '/admin', label: 'Dashboard', roles: ['SUPER_ADMIN', 'EDITOR', 'AUTHOR'] },
  { href: '/admin/blogs', label: 'Blog Posts', roles: ['SUPER_ADMIN', 'EDITOR', 'AUTHOR'] },
  { href: '/admin/media', label: 'Media Library', roles: ['SUPER_ADMIN', 'EDITOR', 'AUTHOR'] },
  { href: '/admin/content', label: 'Site Content', roles: ['SUPER_ADMIN', 'EDITOR'] },
  { href: '/admin/leads', label: 'Leads', roles: ['SUPER_ADMIN', 'EDITOR'] },
  { href: '/admin/seo', label: 'SEO', roles: ['SUPER_ADMIN'] },
  { href: '/admin/users', label: 'Users', roles: ['SUPER_ADMIN'] },
  { href: '/admin/activity', label: 'Activity Log', roles: ['SUPER_ADMIN', 'EDITOR'] },
];

export function Sidebar({ role, name }: { role: AppRole; name: string }) {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-white/8 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/8">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#00F5B8]/30 font-mono text-xs font-bold text-[#00F5B8]">
          AH
        </span>
        <div>
          <div className="text-sm font-bold text-white leading-tight">Portfolio CMS</div>
          <div className="text-[11px] text-white/35">{name} · {role.replace('_', ' ').toLowerCase()}</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        {NAV.filter(item => item.roles.includes(role)).map(item => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group mb-1 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200 ease-out ${
                active
                  ? 'bg-[#00F5B8]/10 text-[#00F5B8] border border-[#00F5B8]/20 shadow-[0_0_18px_rgba(0,245,184,0.08)]'
                  : 'text-white/55 hover:bg-white/[0.06] hover:text-white hover:translate-x-1 border border-transparent active:scale-[0.98]'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200 ${
                  active ? 'bg-[#00F5B8] shadow-[0_0_8px_rgba(0,245,184,0.8)]' : 'bg-white/15 group-hover:bg-[#00F5B8]/60'
                }`}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/8 p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-1 block rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-white/55 hover:bg-white/[0.05] hover:text-white"
        >
          View Site ↗
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="block w-full rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold text-white/55 hover:bg-red-500/10 hover:text-red-300"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
