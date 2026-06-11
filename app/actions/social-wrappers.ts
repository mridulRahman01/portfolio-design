'use server';

/**
 * Adapters so social_links (keyed by platform) fits the generic CrudList
 * (id-based) interface.
 */
import { sb } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { upsertSocial, deleteSocial } from '@/app/actions/content';

export async function upsertSocialById(id: string | null, data: Record<string, unknown>) {
  await requireCapability('content:manage');
  if (id) {
    const { data: existing } = await sb().from('social_links')
      .select('platform').eq('id', id).maybeSingle();
    if (existing && existing.platform !== data.platform) {
      // Platform changed: remove the old row, the upsert below creates the new one
      await sb().from('social_links').delete().eq('id', id);
    }
  }
  await upsertSocial(data);
}

export async function deleteSocialById(id: string) {
  await requireCapability('content:manage');
  const { data: row } = await sb().from('social_links')
    .select('platform').eq('id', id).maybeSingle();
  if (row) await deleteSocial(row.platform);
}
