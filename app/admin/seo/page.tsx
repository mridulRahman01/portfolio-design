import { getSeo } from '@/lib/content';
import { SeoForm } from '@/components/admin/SeoForm';

export const dynamic = 'force-dynamic';

export default async function SeoPage() {
  const seo = await getSeo();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">SEO Settings</h1>
        <p className="mt-1 text-sm text-white/40">
          Global metadata. sitemap.xml and robots.txt are generated automatically from these values.
        </p>
      </div>
      <SeoForm
        seo={{
          siteTitle: seo.siteTitle,
          siteDescription: seo.siteDescription,
          keywords: seo.keywords ?? '',
          ogImage: seo.ogImage ?? '',
          siteUrl: seo.siteUrl,
          robotsIndex: seo.robotsIndex,
          gaId: seo.gaId ?? '',
          gscVerification: seo.gscVerification ?? '',
        }}
      />
    </div>
  );
}
