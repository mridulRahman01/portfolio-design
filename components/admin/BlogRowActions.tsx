'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteBlog, duplicateBlog } from '@/app/actions/blogs';
import { ConfirmDelete } from '@/components/admin/ui';

export function BlogRowActions({ id, slug }: { id: string; slug: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <span className="inline-flex items-center gap-3 text-xs font-semibold">
      <Link href={`/blog/${slug}`} target="_blank" className="text-white/40 hover:text-white">View</Link>
      <button
        disabled={pending}
        onClick={() => start(async () => { await duplicateBlog(id); })}
        className="text-white/40 hover:text-[#00F5B8]"
      >
        Duplicate
      </button>
      <ConfirmDelete onConfirm={async () => { await deleteBlog(id); router.refresh(); }} />
    </span>
  );
}
