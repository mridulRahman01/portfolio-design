import { getAbout } from '@/lib/content';
import { SectionForm } from '@/components/admin/SectionForm';

export const dynamic = 'force-dynamic';

export default async function AboutContentPage() {
  const about = await getAbout();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">About Section</h1>
      <SectionForm
        sectionKey="about"
        title="About content"
        value={about as unknown as Record<string, unknown>}
        fields={[
          { name: 'eyebrow', label: 'Eyebrow', kind: 'text', half: true },
          { name: 'title', label: 'Title', kind: 'text', half: true },
          { name: 'titleAccent', label: 'Title accent (green part)', kind: 'text', half: true },
          { name: 'signatureName', label: 'Signature name', kind: 'text', half: true },
          { name: 'signatureRole', label: 'Signature role line', kind: 'text' },
          { name: 'paragraphs', label: 'Paragraphs (one per line)', kind: 'lines' },
          {
            name: 'achievements', label: 'Achievement cards', kind: 'pairs',
            hint: 'One per line: value | label — e.g. “312% | Avg. client ROI”',
          },
          {
            name: 'timeline', label: 'Journey timeline', kind: 'triples',
            hint: 'One per line: year | title | text — e.g. “2024 | Moved Into Paid Traffic | Scaled CPA offers…”',
          },
        ]}
      />
    </div>
  );
}
