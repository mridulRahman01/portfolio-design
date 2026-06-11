'use client';

const TOOLS = [
  'Google Analytics', 'SEMrush', 'Ahrefs', 'ClickFunnels', 'Shopify',
  'WordPress', 'Meta Ads', 'Google Ads', 'HubSpot', 'Mailchimp',
];

const ICON = (
  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
    <path d="M4 13a8 8 0 0 1 16 0M12 13l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="13" r="1.6" fill="currentColor" />
  </svg>
);

const items    = [...TOOLS, ...TOOLS];
const itemsRev = [...TOOLS].reverse().concat([...TOOLS].reverse());

export function Tools() {
  return (
    <section className="tools" id="tools">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '42px' }} className="reveal">
          <span className="eyebrow">My Stack</span>
          <h2 className="section-title">Tools I <span className="grad">Master</span></h2>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="marquee reveal">
        <div className="marquee-track">
          {items.map((tool, i) => (
            <div className="tool" key={i}>
              <span className="dot">{ICON}</span>
              {tool}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right (reverse direction) */}
      <div className="marquee reveal" style={{ marginTop: 14 }}>
        <div className="marquee-track rev">
          {itemsRev.map((tool, i) => (
            <div className="tool" key={i}>
              <span className="dot">{ICON}</span>
              {tool}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
