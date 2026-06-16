import Link from 'next/link';

const SECTIONS = [
  { href: '/admin/content/intro', title: 'Intro Animation', desc: 'Turn the cinematic scroll intro on/off' },
  { href: '/admin/content/cv', title: 'CV / Resume', desc: 'Upload the CV opened by the strategy-call button' },
  { href: '/admin/content/hero', title: 'Hero', desc: 'Headline, CTAs, trust bar, stats' },
  { href: '/admin/content/about', title: 'About', desc: 'Story, timeline, achievements' },
  { href: '/admin/content/services', title: 'Services', desc: 'Problem → Solution → Result cards' },
  { href: '/admin/content/cases', title: 'Case Studies', desc: 'Campaigns with metrics' },
  { href: '/admin/content/results', title: 'Past Work / Results', desc: 'Dashboard screenshot gallery' },
  { href: '/admin/content/testimonials', title: 'Testimonials', desc: 'Client quotes and ratings' },
  { href: '/admin/content/skills', title: 'Skills', desc: 'Grouped expertise bars' },
  { href: '/admin/content/social', title: 'Social Links', desc: 'Facebook, LinkedIn, Instagram…' },
  { href: '/admin/content/footer', title: 'Footer & CTA', desc: 'Bio, contact info, closing CTA' },
];

export default function ContentHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Site Content</h1>
        <p className="mt-1 text-sm text-white/40">Every section of the homepage, editable without code.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-[#00F5B8]/35 hover:bg-white/[0.05]">
            <div className="font-bold text-white">{s.title}</div>
            <div className="mt-1 text-[13px] text-white/40">{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
