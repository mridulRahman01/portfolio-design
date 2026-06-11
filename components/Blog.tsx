import Link from 'next/link';
import type { BlogCard } from '@/lib/defaults';

const GRADIENTS = [
  'linear-gradient(150deg,#0c3326,#05130d)',
  'linear-gradient(150deg,#33210c,#130b05)',
  'linear-gradient(150deg,#0a2c2c,#05110f)',
];

function fmtDate(d: Date | null) {
  return d
    ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';
}

export function Blog({ posts }: { posts: BlogCard[] }) {
  if (!posts.length) return null; // section hidden until first post is published

  return (
    <section id="blog">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">From The Journal</span>
            <h2 className="section-title">Playbooks &amp; <span className="grad">Insights</span></h2>
          </div>
          <Link href="/blog" className="btn btn-ghost" data-magnetic="">
            View All Posts{' '}
            <span className="ico">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>

        <div className={`blog-grid${posts[0]?.featured ? ' featured' : ''}`}>
          {posts.map((p, i) => (
            <article className={`post${i === 1 ? ' o' : ''}${i === 0 && p.featured ? ' featured-post' : ''} reveal${i ? ` d${i}` : ''}`} key={p.id}>
              <div className="post-img" style={p.thumbnail ? undefined : { background: GRADIENTS[i % GRADIENTS.length] }}>
                {p.category && <span className="cat">{p.category}</span>}
                {i === 0 && p.featured && <span className="cat featured-flag">Featured</span>}
                {p.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                )}
              </div>
              <div className="post-body">
                <div className="post-meta">
                  <span>{fmtDate(p.publishedAt)}</span>
                  <span className="d" aria-hidden="true" />
                  <span>{p.readTime} min read</span>
                </div>
                <h3>{p.title}</h3>
                {i === 0 && p.featured && p.excerpt && <p className="post-excerpt">{p.excerpt}</p>}
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
      </div>
    </section>
  );
}
