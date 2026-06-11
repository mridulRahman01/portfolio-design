'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sb, must, ok, nowIso } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';
import { blogSchema, slugify, type BlogInput } from '@/lib/validations';

function revalidateBlog(slug?: string) {
  revalidatePath('/');
  revalidatePath('/blog');
  if (slug) revalidatePath(`/blog/${slug}`);
}

async function upsertCategoryAndTags(category?: string, tags?: string) {
  let categoryId: string | null = null;
  if (category) {
    const slug = slugify(category);
    const row = must(await sb().from('categories')
      .upsert({ name: category, slug }, { onConflict: 'slug' })
      .select('id').single());
    categoryId = row.id;
  }
  const tagIds: string[] = [];
  for (const raw of (tags ?? '').split(',').map(t => t.trim()).filter(Boolean)) {
    const slug = slugify(raw);
    const row = must(await sb().from('tags')
      .upsert({ name: raw, slug }, { onConflict: 'slug' })
      .select('id').single());
    tagIds.push(row.id);
  }
  return { categoryId, tagIds };
}

function statusFields(input: BlogInput): {
  status: string; publishedAt?: string | null; scheduledFor?: string | null;
} {
  if (input.status === 'PUBLISHED') {
    return { status: 'PUBLISHED', publishedAt: nowIso(), scheduledFor: null };
  }
  if (input.status === 'SCHEDULED') {
    const when = input.scheduledFor ? new Date(input.scheduledFor) : null;
    if (!when || isNaN(+when)) throw new Error('Scheduled posts need a valid date/time');
    return { status: 'SCHEDULED', scheduledFor: when.toISOString() };
  }
  return { status: 'DRAFT' };
}

function blogPayload(data: BlogInput, categoryId: string | null) {
  return {
    title: data.title,
    slug: data.slug || slugify(data.title),
    excerpt: data.excerpt || null,
    content: data.content,
    featuredImage: data.featuredImage || null,
    thumbnail: data.thumbnail || null,
    readTime: data.readTime,
    featured: data.featured,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    ogImage: data.ogImage || null,
    canonicalUrl: data.canonicalUrl || null,
    categoryId,
  };
}

export async function createBlog(input: BlogInput) {
  const user = await requireCapability('blogs:manage');
  const data = blogSchema.parse(input);
  const { categoryId, tagIds } = await upsertCategoryAndTags(data.category, data.tags);

  const blog = must(await sb().from('blogs')
    .insert({ ...blogPayload(data, categoryId), authorId: user.id, ...statusFields(data) })
    .select('id, title, slug').single());

  if (tagIds.length) {
    ok(await sb().from('blog_tags')
      .insert(tagIds.map(tagId => ({ blogId: blog.id, tagId }))));
  }

  await logActivity(user.id, 'blog.created', `"${blog.title}" (${blog.slug})`);
  revalidateBlog(blog.slug);
  return { id: blog.id };
}

export async function updateBlog(id: string, input: BlogInput) {
  const user = await requireCapability('blogs:manage');
  const data = blogSchema.parse(input);
  const existing = must(await sb().from('blogs').select('*').eq('id', id).single());

  // Authors may only edit their own posts
  if (user.role === 'AUTHOR' && existing.authorId !== user.id) throw new Error('Forbidden');

  // Revision history: snapshot before overwrite, keep last 20
  ok(await sb().from('blog_revisions')
    .insert({ blogId: id, title: existing.title, content: existing.content }));
  const { data: old } = await sb().from('blog_revisions')
    .select('id').eq('blogId', id)
    .order('createdAt', { ascending: false }).range(20, 100);
  if (old?.length) {
    ok(await sb().from('blog_revisions').delete().in('id', old.map(r => r.id)));
  }

  const { categoryId, tagIds } = await upsertCategoryAndTags(data.category, data.tags);
  const status = statusFields(data);
  // Keep the original publish date when a published post stays published
  if (existing.status === 'PUBLISHED' && data.status === 'PUBLISHED') {
    status.publishedAt = existing.publishedAt;
  }

  const blog = must(await sb().from('blogs')
    .update({ ...blogPayload(data, categoryId), ...status, updatedAt: nowIso() })
    .eq('id', id)
    .select('id, title, slug').single());

  ok(await sb().from('blog_tags').delete().eq('blogId', id));
  if (tagIds.length) {
    ok(await sb().from('blog_tags')
      .insert(tagIds.map(tagId => ({ blogId: id, tagId }))));
  }

  await logActivity(user.id, 'blog.updated', `"${blog.title}" (${blog.slug})`);
  revalidateBlog(blog.slug);
  if (existing.slug !== blog.slug) revalidateBlog(existing.slug);
  return { id: blog.id };
}

/** Lightweight autosave — content + title only, no status/revision churn. */
export async function autosaveBlog(id: string, title: string, content: string) {
  const user = await requireCapability('blogs:manage');
  const existing = must(await sb().from('blogs').select('authorId').eq('id', id).single());
  if (user.role === 'AUTHOR' && existing.authorId !== user.id) throw new Error('Forbidden');
  must(await sb().from('blogs')
    .update({ title, content, updatedAt: nowIso() }).eq('id', id).select('id').single());
  return { savedAt: nowIso() };
}

export async function deleteBlog(id: string) {
  const user = await requireCapability('blogs:manage');
  const blog = must(await sb().from('blogs').select('*').eq('id', id).single());
  if (user.role === 'AUTHOR' && blog.authorId !== user.id) throw new Error('Forbidden');
  ok(await sb().from('blogs').delete().eq('id', id));
  await logActivity(user.id, 'blog.deleted', `"${blog.title}" (${blog.slug})`);
  revalidateBlog(blog.slug);
}

export async function duplicateBlog(id: string) {
  const user = await requireCapability('blogs:manage');
  const src = must(await sb().from('blogs')
    .select('*, tags:blog_tags(tagId)').eq('id', id).single());

  const copy = must(await sb().from('blogs').insert({
    title: `${src.title} (Copy)`,
    slug: `${src.slug}-copy-${Date.now().toString(36)}`,
    excerpt: src.excerpt,
    content: src.content,
    featuredImage: src.featuredImage,
    thumbnail: src.thumbnail,
    readTime: src.readTime,
    status: 'DRAFT',
    seoTitle: src.seoTitle,
    seoDescription: src.seoDescription,
    ogImage: src.ogImage,
    authorId: user.id,
    categoryId: src.categoryId,
  }).select('id, slug').single());

  const tags = (src.tags as { tagId: string }[]) ?? [];
  if (tags.length) {
    ok(await sb().from('blog_tags')
      .insert(tags.map(t => ({ blogId: copy.id, tagId: t.tagId }))));
  }

  await logActivity(user.id, 'blog.duplicated', `"${src.title}" → ${copy.slug}`);
  redirect(`/admin/blogs/${copy.id}`);
}

export async function restoreRevision(blogId: string, revisionId: string) {
  const user = await requireCapability('blogs:manage');
  const rev = must(await sb().from('blog_revisions').select('*').eq('id', revisionId).single());
  if (rev.blogId !== blogId) throw new Error('Revision mismatch');
  const blog = must(await sb().from('blogs')
    .update({ title: rev.title, content: rev.content, updatedAt: nowIso() })
    .eq('id', blogId).select('title, slug').single());
  await logActivity(user.id, 'blog.revision_restored', `"${blog.title}" ← ${rev.createdAt}`);
  revalidateBlog(blog.slug);
}
