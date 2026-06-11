import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/rbac';
import { getDashboardStats } from '@/lib/dashboard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Live KPI feed for the admin dashboard — polled by the client every 10s. */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Stats unavailable' },
      { status: 500 },
    );
  }
}
