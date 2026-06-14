/**
 * Skeleton loader shown during the route transition into the portfolio
 * (e.g. when navigating from the CMS dashboard). Mirrors the hero layout
 * so the page feels like it's assembling, not blank-loading.
 */
export default function SiteLoading() {
  return (
    <div className="skel" aria-busy="true" aria-label="Loading portfolio">
      {/* Hero skeleton: copy left, portrait stage right */}
      <div className="skel-hero">
        <div className="skel-copy">
          <div className="skel-box" style={{ width: 180, height: 32, borderRadius: 999 }} />
          <div className="skel-box skel-h" style={{ width: '92%' }} />
          <div className="skel-box skel-h" style={{ width: '74%' }} />
          <div className="skel-box skel-h" style={{ width: '60%' }} />
          <div className="skel-box" style={{ width: 240, height: 18, marginTop: 10 }} />
          <div className="skel-lines">
            <div className="skel-box" style={{ width: '100%', height: 12 }} />
            <div className="skel-box" style={{ width: '90%', height: 12 }} />
            <div className="skel-box" style={{ width: '80%', height: 12 }} />
          </div>
          <div className="skel-actions">
            <div className="skel-box" style={{ width: 170, height: 52, borderRadius: 999 }} />
            <div className="skel-box" style={{ width: 200, height: 52, borderRadius: 999 }} />
          </div>
        </div>

        <div className="skel-visual">
          <div className="skel-ring" />
          <div className="skel-box skel-portrait" />
        </div>
      </div>

      {/* Stats strip */}
      <div className="skel-stats">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="skel-box" key={i} style={{ height: 78, borderRadius: 18 }} />
        ))}
      </div>

      <div className="skel-spinner-wrap">
        <span className="skel-spinner" />
        <span className="skel-spinner-label">Loading your portfolio…</span>
      </div>
    </div>
  );
}
