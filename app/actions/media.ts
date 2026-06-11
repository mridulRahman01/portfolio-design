'use server';

import { revalidatePath } from 'next/cache';
import { sb, must } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { cloudinary } from '@/lib/cloudinary';
import { logActivity } from '@/lib/activity';

export async function deleteMedia(id: string) {
  const user = await requireCapability('media:manage');
  const media = must(await sb().from('media').select('publicId').eq('id', id).single());
  try {
    await cloudinary.uploader.destroy(media.publicId);
  } catch {
    // Cloudinary asset may already be gone; still remove the DB record.
  }
  must(await sb().from('media').delete().eq('id', id).select('id'));
  await logActivity(user.id, 'media.deleted', media.publicId);
  revalidatePath('/admin/media');
}

export async function renameMedia(id: string, alt: string) {
  await requireCapability('media:manage');
  must(await sb().from('media')
    .update({ alt: alt.slice(0, 200) || null }).eq('id', id).select('id'));
  revalidatePath('/admin/media');
}
