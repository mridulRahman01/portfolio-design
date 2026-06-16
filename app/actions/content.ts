'use server';

import { revalidatePath } from 'next/cache';
import { sb, must, ok, nowIso } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';
import {
  serviceSchema, caseSchema, testimonialSchema, skillGroupSchema, socialSchema,
} from '@/lib/validations';
import { z } from 'zod';

function done() {
  revalidatePath('/');
}

/* ── Homepage JSON sections (hero / about / footer / cta) ── */

const SECTION_KEYS = ['hero', 'about', 'footer', 'cta', 'results', 'intro', 'cv'] as const;

export async function saveSection(key: (typeof SECTION_KEYS)[number], value: unknown) {
  const user = await requireCapability('content:manage');
  if (!SECTION_KEYS.includes(key)) throw new Error('Unknown section');
  const json = z.record(z.string(), z.unknown()).parse(value);
  must(await sb().from('homepage_settings')
    .upsert({ id: key, value: json, updatedAt: nowIso() }, { onConflict: 'id' })
    .select('id'));
  await logActivity(user.id, 'content.section_updated', key);
  done();
}

/* ── Services ── */

export async function upsertService(id: string | null, input: unknown) {
  const user = await requireCapability('content:manage');
  const data = serviceSchema.parse(input);
  const payload = { ...data, icon: data.icon || null };
  if (id) {
    must(await sb().from('services').update({ ...payload, updatedAt: nowIso() }).eq('id', id).select('id'));
  } else {
    must(await sb().from('services').insert(payload).select('id'));
  }
  await logActivity(user.id, id ? 'service.updated' : 'service.created', data.title);
  done();
}

export async function deleteService(id: string) {
  const user = await requireCapability('content:manage');
  const row = must(await sb().from('services').delete().eq('id', id).select('title').single());
  await logActivity(user.id, 'service.deleted', row.title);
  done();
}

/* ── Case Studies ── */

export async function upsertCase(id: string | null, input: unknown) {
  const user = await requireCapability('content:manage');
  const data = caseSchema.parse(input);
  const payload = { ...data, url: data.url || null, image: data.image || null };
  if (id) {
    must(await sb().from('case_studies').update({ ...payload, updatedAt: nowIso() }).eq('id', id).select('id'));
  } else {
    must(await sb().from('case_studies').insert(payload).select('id'));
  }
  await logActivity(user.id, id ? 'case.updated' : 'case.created', data.title);
  done();
}

export async function deleteCase(id: string) {
  const user = await requireCapability('content:manage');
  const row = must(await sb().from('case_studies').delete().eq('id', id).select('title').single());
  await logActivity(user.id, 'case.deleted', row.title);
  done();
}

/* ── Testimonials ── */

export async function upsertTestimonial(id: string | null, input: unknown) {
  const user = await requireCapability('content:manage');
  const data = testimonialSchema.parse(input);
  const payload = { ...data, avatar: data.avatar || null, result: data.result || null };
  if (id) {
    must(await sb().from('testimonials').update({ ...payload, updatedAt: nowIso() }).eq('id', id).select('id'));
  } else {
    must(await sb().from('testimonials').insert(payload).select('id'));
  }
  await logActivity(user.id, id ? 'testimonial.updated' : 'testimonial.created', data.name);
  done();
}

export async function deleteTestimonial(id: string) {
  const user = await requireCapability('content:manage');
  const row = must(await sb().from('testimonials').delete().eq('id', id).select('name').single());
  await logActivity(user.id, 'testimonial.deleted', row.name);
  done();
}

/* ── Skill Groups ── */

export async function upsertSkillGroup(id: string | null, input: unknown) {
  const user = await requireCapability('content:manage');
  const data = skillGroupSchema.parse(input);
  let groupId = id;
  if (id) {
    must(await sb().from('skill_groups')
      .update({ name: data.name, order: data.order }).eq('id', id).select('id'));
    ok(await sb().from('skills').delete().eq('groupId', id));
  } else {
    const row = must(await sb().from('skill_groups')
      .insert({ name: data.name, order: data.order }).select('id').single());
    groupId = row.id;
  }
  ok(await sb().from('skills')
    .insert(data.skills.map((s, i) => ({ ...s, order: i, groupId }))));
  await logActivity(user.id, id ? 'skills.updated' : 'skills.created', data.name);
  done();
}

export async function deleteSkillGroup(id: string) {
  const user = await requireCapability('content:manage');
  const row = must(await sb().from('skill_groups').delete().eq('id', id).select('name').single());
  await logActivity(user.id, 'skills.deleted', row.name);
  done();
}

/* ── Social Links ── */

export async function upsertSocial(input: unknown) {
  const user = await requireCapability('content:manage');
  const data = socialSchema.parse(input);
  must(await sb().from('social_links')
    .upsert(data, { onConflict: 'platform' }).select('id'));
  await logActivity(user.id, 'social.updated', data.platform);
  done();
}

export async function deleteSocial(platform: string) {
  const user = await requireCapability('content:manage');
  must(await sb().from('social_links').delete().eq('platform', platform).select('id'));
  await logActivity(user.id, 'social.deleted', platform);
  done();
}
