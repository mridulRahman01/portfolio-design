import 'server-only';
import { sb } from '@/lib/db';

export type DashboardStats = {
  totalPosts: number;
  published: number;
  drafts: number;
  scheduled: number;
  unreadLeads: number;
  totalLeads: number;
  viewsToday: number;
  views14d: number;
  totalBlogViews: number;
  chart: { label: string; value: number }[];
  topPosts: { id: string; title: string; slug: string; views: number }[];
  recentActivity: { id: string; action: string; detail: string | null; createdAt: string; userName: string | null }[];
  generatedAt: string;
};

async function count(table: string, filter?: (q: any) => any): Promise<number> {
  let q = sb().from(table).select('id', { count: 'exact', head: true });
  if (filter) q = filter(q);
  const { count: c, error } = await q;
  if (error) throw new Error(error.message);
  return c ?? 0;
}

/** All KPI data for the admin dashboard — shared by the page (SSR) and the
 *  /api/admin/stats polling endpoint (live refresh). */
export async function getDashboardStats(): Promise<DashboardStats> {
  const since = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000);
  since.setHours(0, 0, 0, 0);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalPosts, published, drafts, scheduled, unreadLeads, totalLeads, activityRes, topRes, viewsRes, blogViewsRes] =
    await Promise.all([
      count('blogs'),
      count('blogs', q => q.eq('status', 'PUBLISHED')),
      count('blogs', q => q.eq('status', 'DRAFT')),
      count('blogs', q => q.eq('status', 'SCHEDULED')),
      count('contact_messages', q => q.eq('read', false)),
      count('contact_messages'),
      sb().from('activity_logs')
        .select('id, action, detail, createdAt, user:users(name)')
        .order('createdAt', { ascending: false }).limit(8),
      sb().from('blogs')
        .select('id, title, slug, views')
        .eq('status', 'PUBLISHED')
        .order('views', { ascending: false }).limit(5),
      sb().from('page_views')
        .select('createdAt')
        .gte('createdAt', since.toISOString()),
      sb().from('blogs').select('views'),
    ]);

  if (activityRes.error || topRes.error || viewsRes.error || blogViewsRes.error) {
    throw new Error('Dashboard query failed');
  }

  const views = viewsRes.data ?? [];
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    return d;
  });
  const chart = days.map(d => ({
    label: `${d.getDate()}`,
    value: views.filter(v => new Date(v.createdAt).toDateString() === d.toDateString()).length,
  }));

  return {
    totalPosts, published, drafts, scheduled, unreadLeads, totalLeads,
    viewsToday: views.filter(v => new Date(v.createdAt) >= todayStart).length,
    views14d: views.length,
    totalBlogViews: (blogViewsRes.data ?? []).reduce((s, b) => s + (b.views as number), 0),
    chart,
    topPosts: (topRes.data ?? []) as DashboardStats['topPosts'],
    recentActivity: (activityRes.data ?? []).map(a => ({
      id: a.id as string,
      action: a.action as string,
      detail: a.detail as string | null,
      createdAt: a.createdAt as string,
      userName: (a.user as unknown as { name: string } | null)?.name ?? null,
    })),
    generatedAt: new Date().toISOString(),
  };
}
