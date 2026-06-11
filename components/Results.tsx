import type { ResultsContent } from '@/lib/defaults';

export function Results({ data }: { data: ResultsContent }) {
  if (!data.items.length) return null;
  const wide = data.items.filter(i => i.layout !== 'tall');
  const tall = data.items.filter(i => i.layout === 'tall');

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

        {wide.length > 0 && (
          <div className="results-wide">
            {wide.map((item, i) => (
              <figure className={`result-card reveal${i ? ` d${Math.min(i, 3)}` : ''}`} key={item.image}>
                <div className="result-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <figcaption>
                  <strong>{item.title}</strong>
                  <span>{item.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {tall.length > 0 && (
          <div className="results-tall">
            {tall.map((item, i) => (
              <figure className={`result-card tall reveal${i ? ` d${Math.min(i, 3)}` : ''}`} key={item.image}>
                <div className="result-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <figcaption>
                  <strong>{item.title}</strong>
                  <span>{item.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
