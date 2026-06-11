'use server';

import { revalidatePath } from 'next/cache';
import { sb, must } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';

export async function markLeadRead(id: string, read: boolean) {
  await requireCapability('leads:manage');
  must(await sb().from('contact_messages').update({ read }).eq('id', id).select('id'));
  revalidatePath('/admin/leads');
}

export async function deleteLead(id: string) {
  const user = await requireCapability('leads:manage');
  const lead = must(await sb().from('contact_messages')
    .delete().eq('id', id).select('name, email').single());
  await logActivity(user.id, 'lead.deleted', `${lead.name} <${lead.email}>`);
  revalidatePath('/admin/leads');
}
