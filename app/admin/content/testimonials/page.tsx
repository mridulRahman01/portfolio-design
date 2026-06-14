import { sb } from '@/lib/db';
import { CrudList } from '@/components/admin/CrudList';
import { upsertTestimonial, deleteTestimonial } from '@/app/actions/content';

export const dynamic = 'force-dynamic';

export default async function TestimonialsContentPage() {
  const { data } = await sb().from('testimonials').select('*').order('order');
  const rows = (data ?? []).map(r => ({ ...r, avatar: r.avatar ?? '', result: r.result ?? '' }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Testimonials</h1>
      <CrudList
        rows={rows}
        titleKey="name"
        addLabel="Add Testimonial"
        upsert={upsertTestimonial}
        remove={deleteTestimonial}
        fields={[
          { name: 'quote', label: 'Quote', kind: 'textarea' },
          { name: 'name', label: 'Client name', kind: 'text', half: true },
          { name: 'company', label: 'Role & company', kind: 'text', half: true },
          { name: 'avatar', label: 'Client photo', kind: 'image', folder: 'testimonials', hint: 'Upload a photo — initials are shown if left empty' },
          { name: 'result', label: 'Result chip (e.g. “3× ROI in 90 days”)', kind: 'text', half: true },
          { name: 'rating', label: 'Rating (1–5)', kind: 'number', half: true },
          { name: 'order', label: 'Order', kind: 'number', half: true },
          { name: 'visible', label: 'Visible on site', kind: 'checkbox' },
        ]}
      />
    </div>
  );
}
