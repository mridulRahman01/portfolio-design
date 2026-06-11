import type { MetadataRoute } from 'next';
import { getSeo } from '@/lib/content';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeo();
  const base = seo.siteUrl.replace(/\/$/, '');
  return {
    rules: seo.robotsIndex
      ? { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${base}/sitemap.xml`,
  };
}
