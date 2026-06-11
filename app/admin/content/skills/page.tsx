import { sb } from '@/lib/db';
import { CrudList } from '@/components/admin/CrudList';
import { deleteSkillGroup } from '@/app/actions/content';
import { upsertSkillGroupFromForm } from '@/app/actions/crud-wrappers';

export const dynamic = 'force-dynamic';

export default async function SkillsContentPage() {
  const { data } = await sb().from('skill_groups')
    .select('*, skills(*)')
    .order('order')
    .order('order', { referencedTable: 'skills' });
  const rows = (data ?? []).map(g => ({
    id: g.id as string,
    name: g.name as string,
    order: g.order as number,
    skills: ((g.skills ?? []) as { name: string; percent: number }[])
      .map(s => `${s.name} | ${s.percent}`)
      .join('\n'),
  }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Skills</h1>
      <CrudList
        rows={rows}
        titleKey="name"
        addLabel="Add Skill Group"
        upsert={upsertSkillGroupFromForm}
        remove={deleteSkillGroup}
        fields={[
          { name: 'name', label: 'Group name (e.g. Traffic Generation)', kind: 'text', half: true },
          { name: 'order', label: 'Order', kind: 'number', half: true },
          {
            name: 'skills', label: 'Skills', kind: 'textarea',
            hint: 'One per line: name | percent — e.g. “Meta Ads | 92”',
          },
        ]}
      />
    </div>
  );
}
