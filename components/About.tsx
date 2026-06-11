import type { AboutContent } from '@/lib/defaults';

export function About({ data }: { data: AboutContent }) {
  return (
    <section id="about">
      <div className="container about">
        <div className="about-grid">
          <div className="reveal">
            <span className="eyebrow">{data.eyebrow}</span>
            <h2>{data.title} <span className="green">{data.titleAccent}</span></h2>
            {data.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <div className="achievements" role="list">
              {data.achievements.map(a => (
                <div className="ach" role="listitem" key={a.label}>
                  <div className="ach-v">{a.value}</div>
                  <div className="ach-k">{a.label}</div>
                </div>
              ))}
            </div>
            <a href="#footer" className="btn btn-ghost" data-magnetic="" style={{ marginTop: 26 }}>
              Work With Me{' '}
              <span className="ico">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>

          <div className="reveal d2">
            <ol className="timeline">
              {data.timeline.map((t, i) => (
                <li className={`tl-item${i === data.timeline.length - 1 ? ' tl-now' : ''}`} key={`${t.year}-${i}`}>
                  <div className="tl-dot" aria-hidden="true" />
                  <div className="tl-year">{t.year}</div>
                  <div className="tl-body">
                    <h3>{t.title}</h3>
                    <p>{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="signature">
              <div className="sig" aria-hidden="true">{data.signatureName}</div>
              <div className="nm">{data.signatureName}</div>
              <div className="pf">{data.signatureRole}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
