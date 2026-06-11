import { getFooter, getCta } from '@/lib/content';
import { SectionForm } from '@/components/admin/SectionForm';

export const dynamic = 'force-dynamic';

export default async function FooterContentPage() {
  const [footer, cta] = await Promise.all([getFooter(), getCta()]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Footer & Closing CTA</h1>
      <SectionForm
        sectionKey="footer"
        title="Footer"
        value={footer as unknown as Record<string, unknown>}
        fields={[
          { name: 'bio', label: 'Bio', kind: 'textarea' },
          { name: 'copyright', label: 'Copyright line', kind: 'text' },
          { name: 'contactEmail', label: 'Contact email', kind: 'text', half: true },
          { name: 'location', label: 'Location', kind: 'text', half: true },
        ]}
      />
      <SectionForm
        sectionKey="cta"
        title="Closing CTA banner"
        value={cta as unknown as Record<string, unknown>}
        fields={[
          { name: 'title', label: 'Title', kind: 'text', half: true },
          { name: 'titleAccent', label: 'Accent word', kind: 'text', half: true },
          { name: 'description', label: 'Description', kind: 'textarea' },
          { name: 'proofPoints', label: 'Proof points (one per line)', kind: 'lines' },
          { name: 'primaryLabel', label: 'Button label', kind: 'text', half: true },
          { name: 'primaryHref', label: 'Button link (Calendly URL or #footer)', kind: 'text', half: true },
          { name: 'email', label: 'Email button address', kind: 'text', half: true },
        ]}
      />
    </div>
  );
}
