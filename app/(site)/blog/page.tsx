import Link from 'next/link';
import type { Metadata } from 'next';
import { sb } from '@/lib/db';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Performance marketing playbooks, case studies, and growth tactics from live campaigns.',
  alternates: { canonical: '/blog' },
};

const PER_PAGE = 9;

type PostRow = {
  id: string; slug: string; title: string; thumbnail: string | null;
  readTime: number; publishedAt: string | null; category: { name: string } | null;
};

export default async function BlogIndexPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);

  let posts: PostRow[] = [];
  let count = 0;
  try {
    const res = await sb().from('blogs')
      .select('id, slug, title, thumbnail, readTime, publishedAt, category:categories(name)', { count: 'exact' })
      .eq('status', 'PUBLISHED')
      .order('publishedAt', { ascending: false })
      .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
    if (!res.error) {
      posts = (res.data ?? []) as unknown as PostRow[];
      count = res.count ?? 0;
    }
  } catch {
    // Supabase unavailable — empty state below
  }
  const pages = Math.max(1, Math.ceil(count / PER_PAGE));

  return (
    <main className="wrap" style={{ paddingTop: 140 }}>
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">The Journal</span>
              <h1 className="section-title">Playbooks &amp; <span className="grad">Insights</span></h1>
            </div>
            <p className="lede">Tactics from live campaigns — written for marketers who care about numbers.</p>
          </div>

          {posts.length === 0 && (
            <p style={{ color: 'var(--muted)', padding: '60px 0', textAlign: 'center' }}>
              No articles published yet — check back soon.
            </p>
          )}

          <div className="blog-grid">
            {posts.map((p, i) => (
              <article className={`post reveal${i % 3 ? ` d${i % 3}` : ''}`} key={p.id}>
                <div className="post-img" style={p.thumbnail ? undefined : { background: 'linear-gradient(150deg,#0c3326,#05130d)' }}>
                  {p.category && <span className="cat">{p.category.name}</span>}
                  {p.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  )}
                </div>
                <div className="post-body">
                  <div className="post-meta">
                    <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                    <span className="d" aria-hidden="true" />
                    <span>{p.readTime} min read</span>
                  </div>
                  <h3>{p.title}</h3>
                  <Link href={`/blog/${p.slug}`} className="readmore">
                    Read More{' '}
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 48 }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <Link key={p} href={`/blog?page=${p}`} className={p === page ? 'btn btn-primary' : 'btn btn-ghost'}
                  style={{ padding: '10px 18px' }}>
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
