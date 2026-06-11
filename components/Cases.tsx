import type { CaseItem } from '@/lib/defaults';

const ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21c5-3 8-6.5 8-11a8 8 0 0 0-16 0c0 4.5 3 8 8 11Z" stroke="currentColor" strokeWidth="1.7" />
    <path d="m9 11 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 19V5M4 19h16M7 15l3-4 3 2 5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M6 6 5 3H3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="9" cy="20" r="1.4" fill="currentColor" />
    <circle cx="18" cy="20" r="1.4" fill="currentColor" />
  </svg>,
];

function Mock({ accent }: { accent: string }) {
  const c = accent === 'orange' ? '#FF7A18' : '#00F5B8';
  const bg = accent === 'orange' ? ['#33210c', '#130b05'] : ['#0d2b1e', '#06140d'];
  return (
    <div className="mock" style={{ background: `linear-gradient(160deg,${bg[0]},${bg[1]})` }}>
      <svg width="100%" height="100%" viewBox="0 0 300 156" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="20" y="20" width="120" height="10" rx="3" fill={c} opacity=".45" />
        <rect x="20" y="38" width="90" height="7" rx="3" fill={c} opacity=".2" />
        <rect x="20" y="76" width="108" height="32" rx="6" fill={c} opacity=".85" />
        <path d="M180 120l28-26 22 14 38-40" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" opacity=".75" />
        <circle cx="268" cy="68" r="5" fill={c} />
      </svg>
    </div>
  );
}

export function Cases({ items }: { items: CaseItem[] }) {
  return (
    <section id="cases">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow">Case Studies</span>
            <h2 className="section-title">Proof, Not <span className="grad">Promises</span></h2>
          </div>
          <p className="lede">
            Real campaigns, real numbers. Client names anonymized where NDAs apply.
          </p>
        </div>

        <div className="cases">
          {items.map((c, i) => (
            <article className={`case${c.accent === 'orange' ? ' o' : ''} reveal${i ? ` d${Math.min(i, 4)}` : ''}`} key={c.id}>
              <div className="case-top">
                <div className="case-badge">
                  <div className="case-live" aria-hidden="true" />
                  {ICONS[i % ICONS.length]}
                </div>
                <div>
                  <h3>{c.title}</h3>
                  <div className="tag">{c.tag}</div>
                </div>
              </div>

              <div className="case-thumb">
                <div className="browser" aria-hidden="true">
                  <i /><i /><i />
                  <span className="case-url">{c.url ?? ''}</span>
                </div>
                {c.image ? (
                  <div className="mock">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                ) : (
                  <Mock accent={c.accent} />
                )}
              </div>

              <dl className="case-story">
                <div className="cs-row">
                  <dt>Challenge</dt>
                  <dd>{c.challenge}</dd>
                </div>
                <div className="cs-row">
                  <dt>Strategy</dt>
                  <dd>{c.strategy}</dd>
                </div>
                <div className="cs-row cs-outcome">
                  <dt>Result</dt>
                  <dd>{c.outcome}</dd>
                </div>
              </dl>

              <div className="case-metrics">
                {c.metrics.map((m, j) => (
                  <div className={`m${j === 0 ? ' roi' : ''}`} key={`${m.k}-${j}`}>
                    <div className="k">{m.k}</div>
                    {m.count ? (
                      <div className="v" data-count={m.count} data-suffix={m.suffix}>0</div>
                    ) : (
                      <div className="v">{m.v}</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="case-bar"><i data-fill={c.fill} /></div>
            </article>
          ))}
        </div>

        <div className="cases-cta reveal">
          <p>Want results like these for your brand?</p>
          <a href="#footer" className="btn btn-primary" data-magnetic="">
            Let&apos;s Build Your Campaign{' '}
            <span className="ico">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
