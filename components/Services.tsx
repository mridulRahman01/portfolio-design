import type { ServiceItem } from '@/lib/defaults';

export function Services({ items }: { items: ServiceItem[] }) {
  return (
    <section id="services">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">What I Do</span>
            <h2 className="section-title">Services Built For <span className="grad">Growth</span></h2>
          </div>
          <p className="lede">
            Every engagement follows the same logic: find the leak, fix it, scale what works.
          </p>
        </div>

        <div className="cards-4">
          {items.map((s, i) => (
            <article
              className={`svc${s.accent === 'orange' ? ' alt' : ''} tilt reveal${i ? ` d${Math.min(i, 4)}` : ''}`}
              key={s.id}
            >
              <span className="svc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {s.icon && (
                <div className="svc-ico img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.icon} alt="" aria-hidden="true" loading="lazy" />
                </div>
              )}
              <h3>{s.title}</h3>
              <dl className="svc-psr">
                <div className="psr-row">
                  <dt>Problem</dt>
                  <dd>{s.problem}</dd>
                </div>
                <div className="psr-row">
                  <dt>Solution</dt>
                  <dd>{s.solution}</dd>
                </div>
                <div className="psr-row psr-result">
                  <dt>Result</dt>
                  <dd>{s.result}</dd>
                </div>
              </dl>
              <a href="#footer" className="learn">
                Start a Project{' '}
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
