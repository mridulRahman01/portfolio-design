import { getDashboardStats } from '@/lib/dashboard';
import { LiveDashboard } from '@/components/admin/LiveDashboard';
import { Card } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  try {
    const stats = await getDashboardStats();
    return <LiveDashboard initial={stats} />;
  } catch {
    return (
      <Card title="Supabase not connected">
        <p className="text-sm text-white/60">
          The CMS could not reach your Supabase project{' '}
          (<code className="text-[#00F5B8]">jfkefdwxeschxclbcivo</code>). Two steps:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-white/60">
          <li>
            Run <code className="text-[#00F5B8]">supabase/setup.sql</code> once in the{' '}
            Supabase Dashboard → SQL Editor (creates all tables + seed content + admin user).
          </li>
          <li>
            Copy the <strong>service_role</strong> key from Project Settings → API keys into{' '}
            <code className="text-[#00F5B8]">SUPABASE_SERVICE_ROLE_KEY</code> in{' '}
            <code className="text-[#00F5B8]">.env</code>, then restart the dev server.
          </li>
        </ol>
      </Card>
    );
  }
}
