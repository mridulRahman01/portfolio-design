import Link from 'next/link';
import { sb } from '@/lib/db';
import { Badge, Table } from '@/components/admin/ui';
import { BlogRowActions } from '@/components/admin/BlogRowActions';

export const dynamic = 'force-dynamic';

const PER_PAGE = 12;

type Row = {
  id: string; title: string; slug: string; status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  scheduledFor: string | null; views: number; updatedAt: string;
  author: { name: string } | null; category: { name: string } | null;
};

export default async function BlogsPage({ searchParams }: {
  searchParams: { q?: string; status?: string; page?: string };
}) {
  const q = searchParams.q?.trim() ?? '';
  const status = ['DRAFT', 'PUBLISHED', 'SCHEDULED'].includes(searchParams.status ?? '')
    ? searchParams.status
    : undefined;
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);

  let blogs: Row[] = [];
  let count = 0;
  try {
    let query = sb().from('blogs')
      .select('id, title, slug, status, scheduledFor, views, updatedAt, author:users(name), category:categories(name)',
        { count: 'exact' })
      .order('updatedAt', { ascending: false })
      .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
    if (status) query = query.eq('status', status);
    if (q) {
      const safe = q.replace(/[%,()]/g, '');
      query = query.or(`title.ilike.%${safe}%,slug.ilike.%${safe}%`);
    }
    const res = await query;
    if (!res.error) {
      blogs = (res.data ?? []) as unknown as Row[];
      count = res.count ?? 0;
    }
  } catch {
    // Supabase unavailable — show empty state
  }
  const pages = Math.max(1, Math.ceil(count / PER_PAGE));

  const statusTone = { PUBLISHED: 'green', DRAFT: 'neutral', SCHEDULED: 'blue' } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Blog Posts</h1>
          <p className="mt-1 text-sm text-white/40">{count} post{count === 1 ? '' : 's'} total</p>
        </div>
        <Link href="/admin/blogs/new"
          className="rounded-xl bg-gradient-to-br from-[#00F5B8] to-[#19d6a8] px-4 py-2.5 text-[13.5px] font-bold text-[#03110c]">
          + New Post
        </Link>
      </div>

      <form className="flex flex-wrap gap-3" action="/admin/blogs" method="get">
        <input
          name="q" defaultValue={q} placeholder="Search title or slug…"
          className="w-64 rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-[#00F5B8]/50"
        />
        <select
          name="status" defaultValue={searchParams.status ?? ''}
          className="rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-[14px] text-white outline-none focus:border-[#00F5B8]/50"
        >
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
        </select>
        <button className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13.5px] font-bold text-white hover:border-[#00F5B8]/40">
          Filter
        </button>
      </form>

      <Table head={['Title', 'Status', 'Category', 'Author', 'Views', 'Updated', '']}>
        {blogs.length === 0 && (
          <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-white/30">
            No posts found. Create your first one!
          </td></tr>
        )}
        {blogs.map(b => (
          <tr key={b.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3">
              <Link href={`/admin/blogs/${b.id}`} className="font-semibold text-white hover:text-[#00F5B8]">
                {b.title}
              </Link>
              <div className="text-xs text-white/30">/blog/{b.slug}</div>
            </td>
            <td className="px-4 py-3">
              <Badge tone={statusTone[b.status]}>{b.status.toLowerCase()}</Badge>
              {b.status === 'SCHEDULED' && b.scheduledFor && (
                <div className="mt-1 text-[11px] text-white/35">{new Date(b.scheduledFor).toLocaleString()}</div>
              )}
            </td>
            <td className="px-4 py-3 text-white/55">{b.category?.name ?? '—'}</td>
            <td className="px-4 py-3 text-white/55">{b.author?.name ?? '—'}</td>
            <td className="px-4 py-3 text-white/55">{b.views}</td>
            <td className="px-4 py-3 text-xs text-white/35">{new Date(b.updatedAt).toLocaleDateString()}</td>
            <td className="px-4 py-3 text-right">
              <BlogRowActions id={b.id} slug={b.slug} />
            </td>
          </tr>
        ))}
      </Table>

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <Link
              key={p}
              href={`/admin/blogs?q=${encodeURIComponent(q)}&status=${searchParams.status ?? ''}&page=${p}`}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-bold ${
                p === page ? 'bg-[#00F5B8]/15 text-[#00F5B8]' : 'text-white/40 hover:text-white'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
