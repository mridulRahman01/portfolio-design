'use server';

/**
 * Adapters that decode CrudList's line-based text fields into the
 * structured shapes the core content actions expect.
 */
import { upsertCase, upsertSkillGroup } from '@/app/actions/content';

/** metrics line format: "k | v | count | suffix" (count/suffix optional) */
export async function upsertCaseFromForm(id: string | null, data: Record<string, unknown>) {
  const metrics = String(data.metrics ?? '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const [k = '', v = '', count = '', suffix = ''] = l.split('|').map(s => s.trim());
      return {
        k,
        v,
        ...(count ? { count: Number(count) || 0 } : {}),
        ...(suffix ? { suffix } : {}),
      };
    });
  await upsertCase(id, { ...data, metrics });
}

/** skills line format: "Skill name | 92" */
export async function upsertSkillGroupFromForm(id: string | null, data: Record<string, unknown>) {
  const skills = String(data.skills ?? '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const [name = '', percent = '0'] = l.split('|').map(s => s.trim());
      return { name, percent: Number(percent) || 0 };
    });
  await upsertSkillGroup(id, { name: data.name, order: data.order, skills });
}
