import { NextResponse } from 'next/server';
import { sb, must } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';

export const runtime = 'nodejs';

function csvEscape(v: string | null): string {
  const s = v ?? '';
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  try {
    await requireCapability('leads:manage');
    const rows = must(await sb().from('contact_messages')
      .select('*').order('createdAt', { ascending: false }));
    const header = 'Name,Email,Subject,Message,Read,Date';
    const body = (rows as {
      name: string; email: string; subject: string | null;
      message: string; read: boolean; createdAt: string;
    }[]).map(r =>
      [r.name, r.email, r.subject ?? '', r.message, r.read ? 'yes' : 'no', r.createdAt]
        .map(csvEscape)
        .join(','),
    );
    return new NextResponse([header, ...body].join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Export failed';
    return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 403 });
  }
}
