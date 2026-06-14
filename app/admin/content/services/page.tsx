import { sb } from '@/lib/db';
import { CrudList } from '@/components/admin/CrudList';
import { upsertService, deleteService } from '@/app/actions/content';

export const dynamic = 'force-dynamic';

export default async function ServicesContentPage() {
  const { data } = await sb().from('services').select('*').order('order');
  const rows = (data ?? []).map(r => ({ ...r, icon: r.icon ?? '' }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Services</h1>
      <CrudList
        rows={rows}
        titleKey="title"
        addLabel="Add Service"
        upsert={upsertService}
        remove={deleteService}
        fields={[
          { name: 'title', label: 'Title', kind: 'text' },
          { name: 'problem', label: 'Problem', kind: 'textarea' },
          { name: 'solution', label: 'Solution', kind: 'textarea' },
          { name: 'result', label: 'Result', kind: 'textarea' },
          { name: 'icon', label: 'Icon image', kind: 'image', folder: 'services', hint: 'Upload a 3D icon (optional)' },
          { name: 'accent', label: 'Accent color', kind: 'select', options: ['green', 'orange'], half: true },
          { name: 'order', label: 'Order', kind: 'number', half: true },
          { name: 'visible', label: 'Visible on site', kind: 'checkbox' },
        ]}
      />
    </div>
  );
}
