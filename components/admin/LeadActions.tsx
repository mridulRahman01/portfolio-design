'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { markLeadRead, deleteLead } from '@/app/actions/leads';
import { ConfirmDelete } from '@/components/admin/ui';

export function LeadActions({ id, read }: { id: string; read: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <span className="inline-flex items-center gap-4 text-xs font-semibold">
      <button
        disabled={pending}
        onClick={() => start(async () => { await markLeadRead(id, !read); router.refresh(); })}
        className="text-[#00F5B8]/80 hover:text-[#00F5B8]"
      >
        {read ? 'Mark unread' : 'Mark read'}
      </button>
      <ConfirmDelete onConfirm={async () => { await deleteLead(id); router.refresh(); }} />
    </span>
  );
}
