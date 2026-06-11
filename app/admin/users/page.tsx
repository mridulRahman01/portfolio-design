import { sb } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { CrudList } from '@/components/admin/CrudList';
import { upsertUserFromForm, deleteUserById } from '@/app/actions/user-wrappers';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  await requireCapability('users:manage');
  const { data } = await sb().from('users')
    .select('id, name, email, role, active')
    .order('createdAt');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Users</h1>
        <p className="mt-1 text-sm text-white/40">
          Super Admin: full access · Editor: all content · Author: blogs and media only.
        </p>
      </div>
      <CrudList
        rows={(data ?? []).map(u => ({ ...u, password: '', visible: u.active }))}
        titleKey="email"
        addLabel="Add User"
        upsert={upsertUserFromForm}
        remove={deleteUserById}
        fields={[
          { name: 'name', label: 'Name', kind: 'text', half: true },
          { name: 'email', label: 'Email', kind: 'text', half: true },
          { name: 'password', label: 'Password', kind: 'text', hint: 'Leave empty to keep the current password (min 8 chars for new users)', half: true },
          { name: 'role', label: 'Role', kind: 'select', options: ['SUPER_ADMIN', 'EDITOR', 'AUTHOR'], half: true },
          { name: 'active', label: 'Active (can sign in)', kind: 'checkbox' },
        ]}
      />
    </div>
  );
}
