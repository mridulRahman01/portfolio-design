'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TestimonialItem } from '@/lib/defaults';

export function Testimonials({ items }: { items: TestimonialItem[] }) {
  const [idx, setIdx] = useState(0);
  const count = items.length;
  const next = useCallback((n: number) => setIdx((n + count) % count), [count]);

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setIdx(i => (i + 1) % count), 5500);
    return () => clearInterval(t);
  }, [count]);

  if (!count) return null;

  return (
    <section id="testimonials">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }} className="reveal">
          <span className="eyebrow orange">Client Love</span>
          <h2 className="section-title">What Clients <span className="grad">Say</span></h2>
        </div>
        <div className="reveal d1">
          <div className="tcarousel">
            <div className="ttrack" style={{ transform: `translateX(${-idx * 100}%)` }}>
              {items.map(t => (
                <div className="tslide" key={t.id}>
                  <div className="tcard">
                    <div className="stars" aria-label={`${t.rating} out of 5 stars`}>
                      {Array.from({ length: t.rating }).map((_, k) => (
                        <svg key={k} viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                          <path d="m12 2 2.9 6.3 6.8.7-5 4.6 1.4 6.7L12 17.8 5.9 20.3l1.4-6.7-5-4.6 6.8-.7L12 2Z" />
                        </svg>
                      ))}
                    </div>
                    <p className="quote">{t.quote}</p>
                    <div className="who">
                      {t.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.avatar} alt="" aria-hidden="true" className="avatar" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className="avatar" aria-hidden="true">
                          {t.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                      )}
                      <div>
                        <div className="nm">{t.name}</div>
                        <div className="co">{t.company}</div>
                      </div>
                      {t.result && <span className="result-chip">{t.result}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {count > 1 && (
            <div className="tnav-wrap">
              <button className="tnav-btn" onClick={() => next(idx - 1)} aria-label="Previous testimonial">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="tnav">
                {items.map((t, i) => (
                  <button key={t.id} className={`tdot${idx === i ? ' active' : ''}`} aria-label={`Testimonial ${i + 1}`} onClick={() => next(i)} />
                ))}
              </div>
              <button className="tnav-btn" onClick={() => next(idx + 1)} aria-label="Next testimonial">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
