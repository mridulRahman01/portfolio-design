import type { Metadata } from 'next';
import { getSessionUser } from '@/lib/rbac';
import { Sidebar } from '@/components/admin/Sidebar';

export const metadata: Metadata = {
  title: 'Admin — Portfolio CMS',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // Login page renders without the shell (middleware allows it through)
  if (!user) {
    return <main className="min-h-screen bg-[#0c0c0c]">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0c0c0c] text-white">
      <Sidebar role={user.role} name={user.name} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
