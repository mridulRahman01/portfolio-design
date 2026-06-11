'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, slugify, type BlogInput } from '@/lib/validations';
import { createBlog, updateBlog, autosaveBlog, restoreRevision } from '@/app/actions/blogs';
import { Editor } from '@/components/admin/Editor';
import { ImageField } from '@/components/admin/ImageField';
import { Card, Field, inputCls, Btn, Badge } from '@/components/admin/ui';

type Revision = { id: string; createdAt: string; title: string };

export function BlogForm({ blog, revisions = [] }: {
  blog?: (Partial<BlogInput> & { id: string }) | null;
  revisions?: Revision[];
}) {
  const router = useRouter();
  const isEdit = !!blog?.id;
  const [serverError, setServerError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const slugTouched = useRef(isEdit);

  const {
    register, handleSubmit, control, watch, setValue, getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title ?? '',
      slug: blog?.slug ?? '',
      excerpt: blog?.excerpt ?? '',
      content: blog?.content ?? '',
      featuredImage: blog?.featuredImage ?? '',
      thumbnail: blog?.thumbnail ?? '',
      readTime: blog?.readTime ?? 3,
      featured: blog?.featured ?? false,
      status: blog?.status ?? 'DRAFT',
      scheduledFor: blog?.scheduledFor ?? '',
      category: blog?.category ?? '',
      tags: blog?.tags ?? '',
      seoTitle: blog?.seoTitle ?? '',
      seoDescription: blog?.seoDescription ?? '',
      ogImage: blog?.ogImage ?? '',
      canonicalUrl: blog?.canonicalUrl ?? '',
    },
  });

  const status = watch('status');
  const title = watch('title');

  // Auto-generate slug from title until the user edits the slug manually
  useEffect(() => {
    if (!slugTouched.current && title) setValue('slug', slugify(title));
  }, [title, setValue]);

  // Autosave every 25s while editing an existing post
  useEffect(() => {
    if (!isEdit) return;
    const t = setInterval(async () => {
      if (!isDirty) return;
      try {
        const res = await autosaveBlog(blog!.id, getValues('title'), getValues('content'));
        setSavedAt(new Date(res.savedAt).toLocaleTimeString());
      } catch { /* autosave is best-effort */ }
    }, 25_000);
    return () => clearInterval(t);
  }, [isEdit, isDirty, blog, getValues]);

  const onSubmit = async (data: BlogInput) => {
    setServerError(null);
    try {
      const res = isEdit ? await updateBlog(blog!.id, data) : await createBlog(data);
      router.push(`/admin/blogs/${res.id}`);
      router.refresh();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Save failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-extrabold">{isEdit ? 'Edit Post' : 'New Post'}</h1>
        <div className="flex items-center gap-3">
          {savedAt && <span className="text-xs text-white/35">Autosaved {savedAt}</span>}
          {isEdit && (
            <a href={`/admin/blogs/${blog!.id}/preview`} target="_blank"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13.5px] font-bold text-white hover:border-[#00F5B8]/40">
              Preview
            </a>
          )}
          <Btn type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : status === 'PUBLISHED' ? 'Save & Publish' : 'Save'}
          </Btn>
        </div>
      </div>

      {serverError && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{serverError}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <Field label="Title" error={errors.title?.message}>
                <input className={inputCls} {...register('title')} placeholder="My next great article" />
              </Field>
              <Field label="Slug" error={errors.slug?.message} hint={`URL: /blog/${watch('slug') || '…'}`}>
                <input
                  className={inputCls}
                  {...register('slug', { onChange: () => { slugTouched.current = true; } })}
                />
              </Field>
              <Field label="Excerpt" error={errors.excerpt?.message} hint="Short summary shown on cards and in search results">
                <textarea className={`${inputCls} h-20 resize-y`} {...register('excerpt')} />
              </Field>
              <Field label="Content" error={errors.content?.message}>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => <Editor value={field.value} onChange={field.onChange} />}
                />
              </Field>
            </div>
          </Card>

          <Card title="SEO">
            <div className="space-y-4">
              <Field label="SEO Title" error={errors.seoTitle?.message}>
                <input className={inputCls} {...register('seoTitle')} placeholder="Defaults to post title" />
              </Field>
              <Field label="SEO Description" error={errors.seoDescription?.message}>
                <textarea className={`${inputCls} h-20 resize-y`} {...register('seoDescription')} />
              </Field>
              <Controller
                name="ogImage"
                control={control}
                render={({ field }) => (
                  <ImageField
                    label="OpenGraph Image (social sharing)"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={errors.ogImage?.message}
                    hint="Shown when the article is shared on social media"
                  />
                )}
              />
              <Field label="Canonical URL" error={errors.canonicalUrl?.message}>
                <input className={inputCls} {...register('canonicalUrl')} placeholder="https://…" />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Publish">
            <div className="space-y-4">
              <Field label="Status">
                <select className={inputCls} {...register('status')}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                </select>
              </Field>
              {status === 'SCHEDULED' && (
                <Field label="Publish at" error={errors.scheduledFor?.message}>
                  <input type="datetime-local" className={inputCls} {...register('scheduledFor')} />
                </Field>
              )}
              <label className="flex items-center gap-2.5 text-sm font-semibold text-white/70">
                <input type="checkbox" {...register('featured')} className="h-4 w-4 accent-[#00F5B8]" />
                Featured post
              </label>
              <Field label="Read time (minutes)" error={errors.readTime?.message}>
                <input type="number" min={1} className={inputCls} {...register('readTime', { valueAsNumber: true })} />
              </Field>
            </div>
          </Card>

          <Card title="Organize">
            <div className="space-y-4">
              <Field label="Category">
                <input className={inputCls} {...register('category')} placeholder="Strategy" />
              </Field>
              <Field label="Tags" hint="Comma-separated">
                <input className={inputCls} {...register('tags')} placeholder="cro, funnels, meta-ads" />
              </Field>
            </div>
          </Card>

          <Card title="Images">
            <div className="space-y-4">
              <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                  <ImageField
                    label="Featured Image"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={errors.featuredImage?.message}
                    hint="Large image at the top of the article"
                  />
                )}
              />
              <Controller
                name="thumbnail"
                control={control}
                render={({ field }) => (
                  <ImageField
                    label="Thumbnail"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={errors.thumbnail?.message}
                    hint="Card image on the blog list (auto-cropped to fit)"
                  />
                )}
              />
            </div>
          </Card>

          {isEdit && revisions.length > 0 && (
            <Card title="Revision history">
              <ul className="space-y-2">
                {revisions.map(r => (
                  <li key={r.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-white/50">{new Date(r.createdAt).toLocaleString()}</span>
                    <button
                      type="button"
                      className="font-bold text-[#00F5B8]/80 hover:text-[#00F5B8]"
                      onClick={async () => {
                        await restoreRevision(blog!.id, r.id);
                        router.refresh();
                        window.location.reload();
                      }}
                    >
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {isEdit && <Badge tone="neutral">Autosave on · every 25s</Badge>}
        </div>
      </div>
    </form>
  );
}
