import { getHero } from '@/lib/content';
import { SectionForm } from '@/components/admin/SectionForm';

export const dynamic = 'force-dynamic';

export default async function HeroContentPage() {
  const hero = await getHero();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Hero Section</h1>
      <SectionForm
        sectionKey="hero"
        title="Hero content"
        value={hero as unknown as Record<string, unknown>}
        fields={[
          { name: 'badge', label: 'Badge text', kind: 'text', half: true },
          { name: 'role', label: 'Role line', kind: 'text', half: true },
          { name: 'headline', label: 'Headline', kind: 'text', hint: 'The word matching “Accent word” is highlighted green' },
          { name: 'headlineAccent', label: 'Accent word', kind: 'text', half: true },
          { name: 'description', label: 'Description', kind: 'textarea' },
          { name: 'primaryCtaLabel', label: 'Primary CTA label', kind: 'text', half: true },
          { name: 'primaryCtaHref', label: 'Primary CTA link', kind: 'text', half: true },
          { name: 'secondaryCtaLabel', label: 'Secondary CTA label', kind: 'text', half: true },
          { name: 'secondaryCtaHref', label: 'Secondary CTA link', kind: 'text', half: true },
          { name: 'trustLabel', label: 'Trust bar label', kind: 'text', half: true },
          { name: 'industries', label: 'Industries (one per line)', kind: 'lines' },
          { name: 'roiTagLabel', label: 'ROI tag label', kind: 'text', half: true },
          { name: 'roiTagValue', label: 'ROI tag value', kind: 'text', half: true },
          {
            name: 'stats', label: 'Stats', kind: 'stats',
            hint: 'One per line: count | prefix | suffix | label | image URL — e.g. “2 | $ | M+ | Revenue Generated | /Assets/…”',
          },
        ]}
      />
    </div>
  );
}
