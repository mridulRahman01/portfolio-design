import { sb } from '@/lib/db';
import { CrudList } from '@/components/admin/CrudList';
import { upsertSocialById, deleteSocialById } from '@/app/actions/social-wrappers';

export const dynamic = 'force-dynamic';

export default async function SocialContentPage() {
  const { data } = await sb().from('social_links').select('*').order('order');
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Social Links</h1>
      <p className="text-sm text-white/40">
        Supported platforms: facebook, instagram, youtube, linkedin, twitter, github.
      </p>
      <CrudList
        rows={data ?? []}
        titleKey="platform"
        addLabel="Add Social Link"
        upsert={upsertSocialById}
        remove={deleteSocialById}
        fields={[
          { name: 'platform', label: 'Platform', kind: 'select', options: ['facebook', 'instagram', 'youtube', 'linkedin', 'twitter', 'github'], half: true },
          { name: 'url', label: 'Profile URL', kind: 'text', half: true },
          { name: 'order', label: 'Order', kind: 'number', half: true },
          { name: 'visible', label: 'Visible on site', kind: 'checkbox' },
        ]}
      />
    </div>
  );
}
