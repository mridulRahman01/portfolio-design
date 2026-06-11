import { Nav } from '@/components/Nav';
import { CursorGlow } from '@/components/CursorGlow';
import { RevealObserver } from '@/components/RevealObserver';
import { TrackView } from '@/components/TrackView';
import { getSeo } from '@/lib/content';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const seo = await getSeo();
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Alif Hosain',
    url: seo.siteUrl,
    jobTitle: 'Affiliate & Performance Marketer',
    address: { '@type': 'PostalAddress', addressCountry: 'BD' },
    knowsAbout: [
      'Affiliate Marketing', 'Performance Marketing', 'Conversion Rate Optimization',
      'Paid Traffic', 'Funnel Building', 'Marketing Analytics',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <a href="#home" className="skip-link">Skip to main content</a>
      <div className="bg-field"><div className="bg-grid" /></div>
      <div className="grain" />
      <CursorGlow />
      <Nav />
      <RevealObserver />
      <TrackView />
      {children}
    </>
  );
}
