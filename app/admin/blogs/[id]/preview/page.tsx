import { notFound } from 'next/navigation';
import { sb } from '@/lib/db';
import { Badge } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

/** Draft preview — admin-only (middleware-protected route). */
export default async function PreviewPage({ params }: { params: { id: string } }) {
  const { data: blog, error } = await sb().from('blogs')
    .select('*, author:users(name), category:categories(name)')
    .eq('id', params.id).maybeSingle();

  if (error || !blog) notFound();

  const author = blog.author as { name: string } | null;
  const category = blog.category as { name: string } | null;

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Badge tone={blog.status === 'PUBLISHED' ? 'green' : 'orange'}>{blog.status.toLowerCase()} preview</Badge>
        <span className="text-xs text-white/35">
          {author?.name ?? '—'} · {blog.readTime} min read
          {category ? ` · ${category.name}` : ''}
        </span>
      </div>
      {blog.featuredImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={blog.featuredImage} alt="" className="mb-8 w-full rounded-2xl" />
      )}
      <h1 className="mb-6 text-4xl font-extrabold leading-tight">{blog.title}</h1>
      {blog.excerpt && <p className="mb-8 text-lg text-white/55">{blog.excerpt}</p>}
      <div className="tiptap-content prose-invert text-[16px] leading-relaxed text-white/80"
        dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  );
}
