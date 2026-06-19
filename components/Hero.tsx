'use client';

import { useEffect, useRef } from 'react';
import type { HeroContent, SocialItem } from '@/lib/defaults';
import { SocialIconLinks } from '@/components/SocialIcons';

function Headline({ text, accent }: { text: string; accent: string }) {
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const [before, ...rest] = text.split(accent);
  return (
    <>
      {before}
      <span className="green">{accent}</span>
      {rest.join(accent)}
    </>
  );
}

export function Hero({ data, socials, cvUrl }: { data: HeroContent; socials: SocialItem[]; cvUrl?: string }) {
  const heroRef  = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero  = heroRef.current;
    const stage = stageRef.current;
    if (!hero || !stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    const layers = Array.from(hero.querySelectorAll<HTMLElement>('[data-depth]'));
    let tx = 0, ty = 0, rx = 0, ry = 0, raf: number;

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width  - 0.5;
      ty = (e.clientY - r.top)  / r.height - 0.5;
    };
    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });

    const loop = () => {
      rx += (tx - rx) * 0.08; ry += (ty - ry) * 0.08;
      layers.forEach(l => {
        const d = parseFloat(l.dataset.depth!);
        l.style.transform = `translate3d(${-rx * 65 * d}px, ${-ry * 65 * d}px, 0)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => { hero.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <header className="hero-section" id="home" ref={heroRef}>
      <div className="hero-inner container">
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="badge reveal">
              <span className="badge-dot" />
              {data.badge}
            </span>
            <h1 className="reveal d1">
              <Headline text={data.headline} accent={data.headlineAccent} />
            </h1>
            <div className="role reveal d2">{data.role}</div>
            <p className="desc reveal d2">{data.description}</p>
            <div className="hero-actions reveal d3">
              <a href={data.primaryCtaHref} className="btn btn-primary" data-magnetic="">
                {data.primaryCtaLabel}{' '}
                <span className="ico">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
              <a
                href={cvUrl || '#'}
                className="btn btn-ghost"
                data-magnetic=""
                target="_blank"
                rel="noopener noreferrer"
                download=""
              >
                {data.secondaryCtaLabel}{' '}
                <span className="ico">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </div>
            <div className="trustbar reveal d4" aria-label="Industries served">
              <span className="trustbar-label">{data.trustLabel}</span>
              <ul className="trustbar-list">
                {data.industries.map(ind => <li key={ind}>{ind}</li>)}
              </ul>
            </div>
            <div className="socials-block reveal d4" style={{ marginTop: 26 }}>
              <div className="socials-label">Follow Me On</div>
              <div className="socials">
                <SocialIconLinks socials={socials} />
              </div>
            </div>
          </div>

          <div className="hero-visual reveal d2">
            <div className="portrait-stage" id="portraitStage" ref={stageRef}>
              {/* Back-to-front layered composition */}
              <div className="hero-glow" data-depth="0.22" />
              <div className="hero-rings" data-depth="0.4" />

              <div className="hero-ico ico-chart" data-depth="0.7">
                <div className="hero-ico-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Assets/ChatGPT Image Jun 4, 2026, 05_25_13 AM.webp" alt="" aria-hidden="true" loading="lazy" />
                </div>
              </div>
              <div className="hero-ico ico-target" data-depth="0.85">
                <div className="hero-ico-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Assets/ChatGPT Image Jun 4, 2026, 05_25_50 AM.webp" alt="" aria-hidden="true" loading="lazy" />
                </div>
              </div>
              <div className="hero-ico ico-people" data-depth="0.6">
                <div className="hero-ico-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Assets/ChatGPT Image Jun 4, 2026, 05_28_10 AM.webp" alt="" aria-hidden="true" loading="lazy" />
                </div>
              </div>

              <div className="hero-person" data-depth="0.1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Assets/hero-person.webp" alt="Alif Hosain — Affiliate Marketer" />
              </div>
            </div>
          </div>
        </div>

        <div className="stats-wrap reveal">
          <div className="stats">
            {data.stats.map(s => (
              <div className="stat" key={s.label}>
                <div className="stat-ico img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt="" aria-hidden="true" loading="lazy" />
                </div>
                <div>
                  <div className="num" data-count={s.count} data-prefix={s.prefix || undefined} data-suffix={s.suffix || undefined}>0</div>
                  <div className="lab">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
