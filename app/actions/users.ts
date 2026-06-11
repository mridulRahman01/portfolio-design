'use server';

import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';
import { sb, must, nowIso } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';
import { userSchema } from '@/lib/validations';

async function activeSuperAdminCount(): Promise<number> {
  const { count, error } = await sb().from('users')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'SUPER_ADMIN').eq('active', true);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function upsertUser(id: string | null, input: unknown) {
  const admin = await requireCapability('users:manage');
  const data = userSchema.parse(input);

  if (id) {
    // Prevent locking yourself out by demoting/deactivating the last super admin
    if (data.role !== 'SUPER_ADMIN' || !data.active) {
      const target = must(await sb().from('users').select('role').eq('id', id).single());
      if (target.role === 'SUPER_ADMIN' && (await activeSuperAdminCount()) <= 1) {
        throw new Error('Cannot demote or deactivate the last Super Admin');
      }
    }
    must(await sb().from('users').update({
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role,
      active: data.active,
      updatedAt: nowIso(),
      ...(data.password ? { passwordHash: await hash(data.password, 12) } : {}),
    }).eq('id', id).select('id'));
    await logActivity(admin.id, 'user.updated', `${data.email} (${data.role})`);
  } else {
    if (!data.password) throw new Error('Password is required for new users');
    must(await sb().from('users').insert({
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role,
      active: data.active,
      passwordHash: await hash(data.password, 12),
    }).select('id'));
    await logActivity(admin.id, 'user.created', `${data.email} (${data.role})`);
  }
  revalidatePath('/admin/users');
}

export async function deleteUser(id: string) {
  const admin = await requireCapability('users:manage');
  if (id === admin.id) throw new Error('You cannot delete your own account');
  const target = must(await sb().from('users').select('role, email').eq('id', id).single());
  if (target.role === 'SUPER_ADMIN' && (await activeSuperAdminCount()) <= 1) {
    throw new Error('Cannot delete the last Super Admin');
  }
  // Keep their blogs: reassign to the acting admin, then delete
  must(await sb().from('blogs').update({ authorId: admin.id }).eq('authorId', id).select('id'));
  must(await sb().from('users').delete().eq('id', id).select('id'));
  await logActivity(admin.id, 'user.deleted', target.email);
  revalidatePath('/admin/users');
}
