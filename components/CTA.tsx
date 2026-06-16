import type { CtaContent } from '@/lib/defaults';

function Title({ text, accent }: { text: string; accent: string }) {
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const [before, ...rest] = text.split(accent);
  return (<>{before}<span className="green">{accent}</span>{rest.join(accent)}</>);
}

export function CTA({ data, cvUrl }: { data: CtaContent; cvUrl?: string }) {
  const primaryHref = cvUrl || data.primaryHref;
  const primaryExternal = !!cvUrl || data.primaryHref.startsWith('http');
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-banner reveal">
          <div className="cta-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="cta-text">
            <h2><Title text={data.title} accent={data.titleAccent} /></h2>
            <p>{data.description}</p>
            <div className="cta-proof">
              {data.proofPoints.map(p => (
                <span className="cta-proof-item" key={p}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
                    <path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="cta-actions">
            <a href={primaryHref} className="btn btn-primary" data-magnetic=""
              {...(primaryExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {data.primaryLabel}{' '}
              <span className="ico">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
            </a>
            <a href={`mailto:${data.email}`} className="btn btn-ghost" data-magnetic="">
              {data.email}{' '}
              <span className="ico">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
