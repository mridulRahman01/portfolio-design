import type { TestimonialItem } from '@/lib/defaults';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="tc-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, k) => (
        <svg key={k} viewBox="0 0 24 24" fill="currentColor" width="17" height="17"
          aria-hidden="true" className={k < rating ? '' : 'tc-star-empty'}>
          <path d="m12 2 2.9 6.3 6.8.7-5 4.6 1.4 6.7L12 17.8 5.9 20.3l1.4-6.7-5-4.6 6.8-.7L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({ items }: { items: TestimonialItem[] }) {
  if (!items.length) return null;

  return (
    <section id="testimonials">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '52px' }} className="reveal">
          <span className="eyebrow orange">Client Love</span>
          <h2 className="section-title">What Clients <span className="grad">Say</span></h2>
          <p className="lede" style={{ margin: '14px auto 0' }}>
            Real words from the brands and founders I&apos;ve helped scale.
          </p>
        </div>

        <div className="tc-grid">
          {items.map((t, i) => (
            <figure className={`tc-card reveal${i ? ` d${Math.min(i, 3)}` : ''}`} key={t.id}>
              <div className="tc-top">
                <Stars rating={t.rating} />
                <svg className="tc-quotemark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9.5 6C6.5 7 5 9.5 5 13v5h6v-6H8c0-2 .8-3.2 2.5-3.8L9.5 6Zm9 0c-3 1-4.5 3.5-4.5 7v5h6v-6h-3c0-2 .8-3.2 2.5-3.8L18.5 6Z" />
                </svg>
              </div>

              <blockquote className="tc-quote">{t.quote}</blockquote>

              {t.result && <span className="tc-result">{t.result}</span>}

              <figcaption className="tc-who">
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar} alt={t.name} className="tc-avatar" loading="lazy" />
                ) : (
                  <div className="tc-avatar tc-avatar-initials" aria-hidden="true">
                    {t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                )}
                <div className="tc-meta">
                  <span className="tc-name">{t.name}</span>
                  <span className="tc-co">{t.company}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
