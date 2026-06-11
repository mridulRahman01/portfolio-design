import { sb } from '@/lib/db';
import { Badge } from '@/components/admin/ui';
import { LeadActions } from '@/components/admin/LeadActions';

export const dynamic = 'force-dynamic';

type Lead = {
  id: string; name: string; email: string; subject: string | null;
  message: string; read: boolean; createdAt: string;
};

export default async function LeadsPage() {
  let leads: Lead[] = [];
  try {
    const { data, error } = await sb().from('contact_messages')
      .select('*').order('createdAt', { ascending: false }).limit(200);
    if (!error) leads = (data ?? []) as Lead[];
  } catch {
    // Supabase unavailable
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Leads</h1>
          <p className="mt-1 text-sm text-white/40">
            {leads.filter(l => !l.read).length} unread · {leads.length} total
          </p>
        </div>
        <a href="/api/admin/leads/export"
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13.5px] font-bold text-white hover:border-[#00F5B8]/40">
          ↓ Export CSV
        </a>
      </div>

      {leads.length === 0 && (
        <p className="rounded-2xl border border-white/8 py-16 text-center text-sm text-white/30">
          No messages yet. They land here when someone uses the contact form.
        </p>
      )}

      <div className="space-y-3">
        {leads.map(l => (
          <div key={l.id}
            className={`rounded-2xl border p-5 ${l.read ? 'border-white/8 bg-white/[0.02]' : 'border-[#00F5B8]/25 bg-[#00F5B8]/[0.04]'}`}>
            <div className="flex items-center gap-3 flex-wrap">
              {!l.read && <Badge tone="green">new</Badge>}
              <span className="font-bold text-white">{l.name}</span>
              <a href={`mailto:${l.email}`} className="text-sm text-[#00F5B8]/80 hover:text-[#00F5B8]">{l.email}</a>
              <span className="ml-auto text-xs text-white/30">{new Date(l.createdAt).toLocaleString()}</span>
            </div>
            {l.subject && <div className="mt-2 text-sm font-semibold text-white/70">{l.subject}</div>}
            <p className="mt-2 whitespace-pre-wrap text-sm text-white/60">{l.message}</p>
            <div className="mt-3">
              <LeadActions id={l.id} read={l.read} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
