import { getResults } from '@/lib/content';
import { SectionForm } from '@/components/admin/SectionForm';

export const dynamic = 'force-dynamic';

export default async function ResultsContentPage() {
  const results = await getResults();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Past Work / Results</h1>
      <p className="text-sm text-white/40">
        Dashboard screenshots shown in the &ldquo;Real Dashboards, Real Results&rdquo; section.
        Upload new screenshots in the Media Library, then paste their URLs here.
      </p>
      <SectionForm
        sectionKey="results"
        title="Results gallery"
        value={results as unknown as Record<string, unknown>}
        fields={[
          { name: 'eyebrow', label: 'Eyebrow', kind: 'text', half: true },
          { name: 'title', label: 'Title', kind: 'text', half: true },
          { name: 'titleAccent', label: 'Title accent (green part)', kind: 'text', half: true },
          { name: 'lede', label: 'Section description', kind: 'textarea' },
          {
            name: 'items', label: 'Screenshots', kind: 'gallery',
            hint: 'One per line: image URL | title | caption | wide or tall — use “wide” for desktop screenshots, “tall” for phone screenshots',
          },
        ]}
      />
    </div>
  );
}
