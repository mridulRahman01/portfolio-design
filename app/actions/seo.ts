'use server';

import { revalidatePath } from 'next/cache';
import { sb, must, nowIso } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';
import { seoSchema } from '@/lib/validations';

export async function saveSeo(input: unknown) {
  const user = await requireCapability('seo:manage');
  const data = seoSchema.parse(input);
  must(await sb().from('seo_settings').upsert({
    id: 'global',
    ...data,
    keywords: data.keywords || null,
    ogImage: data.ogImage || null,
    gaId: data.gaId || null,
    gscVerification: data.gscVerification || null,
    updatedAt: nowIso(),
  }, { onConflict: 'id' }).select('id'));
  await logActivity(user.id, 'seo.updated', data.siteTitle);
  revalidatePath('/', 'layout');
}
