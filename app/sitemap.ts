import type { MetadataRoute } from 'next';
import { sb } from '@/lib/db';
import { getSeo } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeo();
  const base = seo.siteUrl.replace(/\/$/, '');

  let posts: { slug: string; updatedAt: string }[] = [];
  try {
    const { data } = await sb().from('blogs')
      .select('slug, updatedAt').eq('status', 'PUBLISHED');
    posts = (data ?? []) as { slug: string; updatedAt: string }[];
  } catch {
    // Supabase unavailable — homepage-only sitemap
  }

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    ...posts.map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
