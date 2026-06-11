import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sb } from '@/lib/db';

export const revalidate = 300;

type PostRow = {
  id: string; title: string; slug: string; excerpt: string | null; content: string;
  featuredImage: string | null; readTime: number; publishedAt: string | null;
  updatedAt: string; seoTitle: string | null; seoDescription: string | null;
  ogImage: string | null; canonicalUrl: string | null;
  author: { name: string } | null;
  category: { name: string } | null;
  tags: { tag: { name: string } | null }[];
};

async function getPost(slug: string): Promise<PostRow | null> {
  try {
    const { data, error } = await sb().from('blogs')
      .select('*, author:users(name), category:categories(name), tags:blog_tags(tag:tags(name))')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle();
    if (error) return null;
    return data as unknown as PostRow | null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const { data } = await sb().from('blogs')
      .select('slug').eq('status', 'PUBLISHED').limit(50);
    return (data ?? []).map(p => ({ slug: p.slug as string }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Article not found' };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || undefined;
  return {
    title,
    description,
    alternates: { canonical: post.canonicalUrl || `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      authors: post.author ? [post.author.name] : undefined,
      images: post.ogImage || post.featuredImage ? [{ url: (post.ogImage || post.featuredImage)! }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  // Atomic view counter — fire and forget
  sb().rpc('increment_blog_views', { blog_id: post.id }).then(() => {}, () => {});

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.featuredImage ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author?.name ?? 'Alif Hosain' },
  };

  const tags = post.tags?.map(t => t.tag?.name).filter(Boolean) ?? [];

  return (
    <main className="wrap" style={{ paddingTop: 140 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <article className="container" style={{ maxWidth: 760, paddingBottom: 100 }}>
        <div className="post-meta" style={{ marginBottom: 18 }}>
          <Link href="/blog" style={{ color: 'var(--green)' }}>← All articles</Link>
          <span className="d" aria-hidden="true" />
          <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
          <span className="d" aria-hidden="true" />
          <span>{post.readTime} min read</span>
          {post.category && (<><span className="d" aria-hidden="true" /><span>{post.category.name}</span></>)}
        </div>

        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 20 }}>
          {post.title}
        </h1>
        {post.excerpt && (
          <p style={{ color: 'var(--muted)', fontSize: 18, marginBottom: 32 }}>{post.excerpt}</p>
        )}
        {post.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featuredImage}
            alt=""
            style={{
              width: '100%',
              maxHeight: 460,
              objectFit: 'cover',
              borderRadius: 18,
              marginBottom: 36,
              border: '1px solid var(--stroke)',
            }}
          />
        )}

        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />

        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 40 }}>
            {tags.map(t => (
              <span key={t} className="cat" style={{ position: 'static' }}>{t}</span>
            ))}
          </div>
        )}

        <div className="cases-cta" style={{ marginTop: 64 }}>
          <p>Want this kind of growth for your brand?</p>
          <Link href="/#footer" className="btn btn-primary">Let&apos;s Talk</Link>
        </div>
      </article>
    </main>
  );
}
