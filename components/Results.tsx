'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ResultsContent } from '@/lib/defaults';

export function Results({ data }: { data: ResultsContent }) {
  const items = data.items;
  const count = items.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((n: number) => setIdx(((n % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setIdx(i => (i + 1) % count), 4500);
    return () => clearInterval(t);
  }, [count, paused]);

  if (!count) return null;

  return (
    <section id="results">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow orange">{data.eyebrow}</span>
            <h2 className="section-title">{data.title} <span className="grad">{data.titleAccent}</span></h2>
          </div>
          <p className="lede">{data.lede}</p>
        </div>

        <div
          className="rs reveal d1"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
        >
          <button className="rs-arrow rs-prev" onClick={() => go(idx - 1)} aria-label="Previous">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="rs-viewport">
            <div className="rs-track" style={{ transform: `translateX(${-idx * 100}%)` }}>
              {items.map((item, i) => (
                <div className={`rs-slide${item.layout === 'tall' ? ' tall' : ''}`} key={item.image} aria-hidden={i !== idx}>
                  <div className="rs-frame">
                    <div className="rs-dots-deco" aria-hidden="true"><i /><i /><i /></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} loading={i <= 1 ? 'eager' : 'lazy'} />
                  </div>
                  <div className="rs-caption">
                    <span className="rs-tag">Verified result</span>
                    <strong>{item.title}</strong>
                    <span className="rs-note">{item.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="rs-arrow rs-next" onClick={() => go(idx + 1)} aria-label="Next">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="rs-dots">
            {items.map((item, i) => (
              <button
                key={item.image}
                className={`rs-dot${i === idx ? ' active' : ''}`}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === idx}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className="rs-counter" aria-hidden="true">
            <span>{String(idx + 1).padStart(2, '0')}</span> / {String(count).padStart(2, '0')}
          </div>
        </div>
      </div>
    </section>
  );
}
