import type { SkillGroupItem } from '@/lib/defaults';

const GROUP_ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 7h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="8" y="11" width="3" height="6" rx="1" fill="currentColor" opacity=".8" />
    <rect x="13" y="8" width="3" height="9" rx="1" fill="currentColor" opacity=".55" />
    <rect x="18" y="13" width="3" height="4" rx="1" fill="currentColor" opacity=".7" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="5" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="19" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M10.8 7l-4 8.6M13.2 7l4 8.6M7.4 18h9.2" stroke="currentColor" strokeWidth="1.8" />
  </svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>,
];

export function Skills({ groups }: { groups: SkillGroupItem[] }) {
  return (
    <section id="skills">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <span className="eyebrow orange">My Expertise</span>
            <h2 className="section-title">Skills &amp; <span className="grad">Capabilities</span></h2>
          </div>
          <p className="lede">A toolkit sharpened across 150+ campaigns — built on data, creativity, and relentless optimization.</p>
        </div>

        <div className="skillgroups">
          {groups.map((g, i) => (
            <div className={`skillgroup reveal${i % 2 ? ' d1' : ''}`} key={g.id}>
              <div className="sg-head">
                <span className="sg-ico">{GROUP_ICONS[i % GROUP_ICONS.length]}</span>
                <h3>{g.name}</h3>
              </div>
              {g.skills.map(s => (
                <div className="skill" key={s.name}>
                  <div className="skill-top"><span className="n">{s.name}</span><span className="p">{s.percent}%</span></div>
                  <div
                    className="skill-track"
                    role="progressbar"
                    aria-valuenow={s.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={s.name}
                  >
                    <div className="skill-fill" data-skill={s.percent} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
