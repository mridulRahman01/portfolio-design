import { notFound } from 'next/navigation';
import { sb } from '@/lib/db';
import { BlogForm } from '@/components/admin/BlogForm';

export const dynamic = 'force-dynamic';

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const [blogRes, revRes] = await Promise.all([
    sb().from('blogs')
      .select('*, category:categories(name), tags:blog_tags(tag:tags(name))')
      .eq('id', params.id).maybeSingle(),
    sb().from('blog_revisions')
      .select('id, title, createdAt')
      .eq('blogId', params.id)
      .order('createdAt', { ascending: false }).limit(10),
  ]).catch(() => [null, null] as const);

  const blog = blogRes && !blogRes.error ? blogRes.data : null;
  if (!blog) notFound();

  const tags = ((blog.tags as { tag: { name: string } | null }[]) ?? [])
    .map(t => t.tag?.name)
    .filter(Boolean)
    .join(', ');

  const scheduledFor = blog.scheduledFor
    ? (() => {
        const d = new Date(blog.scheduledFor);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      })()
    : '';

  return (
    <BlogForm
      blog={{
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt ?? '',
        content: blog.content,
        featuredImage: blog.featuredImage ?? '',
        thumbnail: blog.thumbnail ?? '',
        readTime: blog.readTime,
        featured: blog.featured,
        status: blog.status,
        scheduledFor,
        category: (blog.category as { name: string } | null)?.name ?? '',
        tags,
        seoTitle: blog.seoTitle ?? '',
        seoDescription: blog.seoDescription ?? '',
        ogImage: blog.ogImage ?? '',
        canonicalUrl: blog.canonicalUrl ?? '',
      }}
      revisions={(revRes && !revRes.error ? revRes.data ?? [] : []).map(r => ({
        id: r.id,
        createdAt: r.createdAt,
        title: r.title,
      }))}
    />
  );
}
