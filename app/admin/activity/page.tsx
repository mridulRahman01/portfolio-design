import { sb } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { Badge, Table } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function ActivityPage({ searchParams }: { searchParams: { page?: string } }) {
  await requireCapability('activity:view');
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);
  const PER = 40;

  let logs: { id: string; action: string; detail: string | null; createdAt: string; user: { name: string } | null }[] = [];
  let count = 0;
  try {
    const res = await sb().from('activity_logs')
      .select('id, action, detail, createdAt, user:users(name)', { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range((page - 1) * PER, page * PER - 1);
    if (!res.error) {
      logs = (res.data ?? []) as unknown as typeof logs;
      count = res.count ?? 0;
    }
  } catch {
    // Supabase unavailable
  }

  const pages = Math.max(1, Math.ceil(count / PER));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Activity Log</h1>
        <p className="mt-1 text-sm text-white/40">{count} audit entries</p>
      </div>

      <Table head={['Action', 'Detail', 'User', 'When']}>
        {logs.length === 0 && (
          <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-white/30">No activity yet.</td></tr>
        )}
        {logs.map(a => (
          <tr key={a.id} className="hover:bg-white/[0.02]">
            <td className="px-4 py-3"><Badge tone={a.action.includes('delete') ? 'red' : 'neutral'}>{a.action}</Badge></td>
            <td className="px-4 py-3 text-white/60">{a.detail ?? '—'}</td>
            <td className="px-4 py-3 text-white/55">{a.user?.name ?? 'system'}</td>
            <td className="px-4 py-3 text-xs text-white/35">{new Date(a.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </Table>

      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <a key={p} href={`/admin/activity?page=${p}`}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-bold ${p === page ? 'bg-[#00F5B8]/15 text-[#00F5B8]' : 'text-white/40 hover:text-white'}`}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
