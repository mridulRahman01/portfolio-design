import { sb } from '@/lib/db';
import { CrudList } from '@/components/admin/CrudList';
import { deleteCase } from '@/app/actions/content';
import { upsertCaseFromForm } from '@/app/actions/crud-wrappers';

export const dynamic = 'force-dynamic';

export default async function CasesContentPage() {
  const { data } = await sb().from('case_studies').select('*').order('order');
  const rows = (data ?? []).map(r => ({
    ...r,
    url: r.url ?? '',
    image: r.image ?? '',
    metrics: ((r.metrics ?? []) as { k: string; v: string; count?: number; suffix?: string }[])
      .map(m => `${m.k} | ${m.v} | ${m.count ?? ''} | ${m.suffix ?? ''}`)
      .join('\n'),
  }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Case Studies</h1>
      <CrudList
        rows={rows}
        titleKey="title"
        addLabel="Add Case Study"
        upsert={upsertCaseFromForm}
        remove={deleteCase}
        fields={[
          { name: 'title', label: 'Title', kind: 'text', half: true },
          { name: 'tag', label: 'Tag line (e.g. “CPA Campaign · 90 days”)', kind: 'text', half: true },
          { name: 'challenge', label: 'Challenge', kind: 'textarea' },
          { name: 'strategy', label: 'Strategy', kind: 'textarea' },
          { name: 'outcome', label: 'Result', kind: 'textarea' },
          {
            name: 'metrics', label: 'Metrics', kind: 'textarea',
            hint: 'One per line: label | value | animatedNumber | suffix — e.g. “ROI | 320% | 320 | %” (last two optional)',
          },
          { name: 'url', label: 'Display URL (browser bar)', kind: 'text', half: true },
          { name: 'image', label: 'Screenshot image (optional)', kind: 'image', folder: 'cases' },
          { name: 'fill', label: 'Progress bar % (0–100)', kind: 'number', half: true },
          { name: 'accent', label: 'Accent color', kind: 'select', options: ['green', 'orange'], half: true },
          { name: 'order', label: 'Order', kind: 'number', half: true },
          { name: 'visible', label: 'Visible on site', kind: 'checkbox' },
        ]}
      />
    </div>
  );
}
