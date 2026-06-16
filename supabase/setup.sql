-- ════════════════════════════════════════════════════════════════
-- Portfolio CMS — Supabase setup (schema + security + seed)
-- Project: jfkefdwxeschxclbcivo
-- Run me once: Supabase Dashboard → SQL Editor → paste → Run
-- Idempotent: safe to run again (IF NOT EXISTS / ON CONFLICT guards)
-- ════════════════════════════════════════════════════════════════

-- ── Tables ───────────────────────────────────────────────────────

create table if not exists users (
  id             text primary key default gen_random_uuid()::text,
  name           text not null,
  email          text not null unique,
  "passwordHash" text not null,
  role           text not null default 'AUTHOR' check (role in ('SUPER_ADMIN','EDITOR','AUTHOR')),
  image          text,
  active         boolean not null default true,
  "createdAt"    timestamptz not null default now(),
  "updatedAt"    timestamptz not null default now()
);

create table if not exists categories (
  id   text primary key default gen_random_uuid()::text,
  name text not null unique,
  slug text not null unique
);

create table if not exists tags (
  id   text primary key default gen_random_uuid()::text,
  name text not null unique,
  slug text not null unique
);

create table if not exists blogs (
  id               text primary key default gen_random_uuid()::text,
  title            text not null,
  slug             text not null unique,
  excerpt          text,
  content          text not null,
  "featuredImage"  text,
  thumbnail        text,
  "readTime"       integer not null default 3,
  featured         boolean not null default false,
  status           text not null default 'DRAFT' check (status in ('DRAFT','PUBLISHED','SCHEDULED')),
  "publishedAt"    timestamptz,
  "scheduledFor"   timestamptz,
  views            integer not null default 0,
  "seoTitle"       text,
  "seoDescription" text,
  "ogImage"        text,
  "canonicalUrl"   text,
  "authorId"       text not null references users(id),
  "categoryId"     text references categories(id),
  "createdAt"      timestamptz not null default now(),
  "updatedAt"      timestamptz not null default now()
);
create index if not exists blogs_status_published_idx on blogs (status, "publishedAt");
create index if not exists blogs_status_scheduled_idx on blogs (status, "scheduledFor");
create index if not exists blogs_author_idx on blogs ("authorId");
create index if not exists blogs_featured_idx on blogs (featured);

create table if not exists blog_tags (
  "blogId" text not null references blogs(id) on delete cascade,
  "tagId"  text not null references tags(id) on delete cascade,
  primary key ("blogId", "tagId")
);

create table if not exists blog_revisions (
  id          text primary key default gen_random_uuid()::text,
  "blogId"    text not null references blogs(id) on delete cascade,
  title       text not null,
  content     text not null,
  "createdAt" timestamptz not null default now()
);
create index if not exists blog_revisions_blog_idx on blog_revisions ("blogId", "createdAt");

create table if not exists media (
  id          text primary key default gen_random_uuid()::text,
  "publicId"  text not null unique,
  url         text not null,
  format      text not null,
  width       integer,
  height      integer,
  bytes       integer not null default 0,
  folder      text not null default 'general',
  alt         text,
  "createdAt" timestamptz not null default now()
);
create index if not exists media_folder_idx on media (folder);

create table if not exists services (
  id          text primary key default gen_random_uuid()::text,
  title       text not null,
  problem     text not null,
  solution    text not null,
  result      text not null,
  icon        text,
  accent      text not null default 'green',
  "order"     integer not null default 0,
  visible     boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists case_studies (
  id          text primary key default gen_random_uuid()::text,
  title       text not null,
  tag         text not null,
  url         text,
  image       text,
  challenge   text not null,
  strategy    text not null,
  outcome     text not null,
  metrics     jsonb not null default '[]',
  fill        integer not null default 90,
  accent      text not null default 'green',
  "order"     integer not null default 0,
  visible     boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists testimonials (
  id          text primary key default gen_random_uuid()::text,
  quote       text not null,
  name        text not null,
  company     text not null,
  avatar      text,
  result      text,
  rating      integer not null default 5,
  "order"     integer not null default 0,
  visible     boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists skill_groups (
  id      text primary key default gen_random_uuid()::text,
  name    text not null,
  "order" integer not null default 0
);

create table if not exists skills (
  id        text primary key default gen_random_uuid()::text,
  name      text not null,
  percent   integer not null,
  "order"   integer not null default 0,
  "groupId" text not null references skill_groups(id) on delete cascade
);
create index if not exists skills_group_idx on skills ("groupId", "order");

create table if not exists social_links (
  id       text primary key default gen_random_uuid()::text,
  platform text not null unique,
  url      text not null,
  "order"  integer not null default 0,
  visible  boolean not null default true
);

create table if not exists seo_settings (
  id                text primary key default 'global',
  "siteTitle"       text not null,
  "siteDescription" text not null,
  keywords          text,
  "ogImage"         text,
  "siteUrl"         text not null default 'https://alifhosain.com',
  "robotsIndex"     boolean not null default true,
  "gaId"            text,
  "gscVerification" text,
  "updatedAt"       timestamptz not null default now()
);

create table if not exists homepage_settings (
  id          text primary key,
  value       jsonb not null,
  "updatedAt" timestamptz not null default now()
);

create table if not exists contact_messages (
  id          text primary key default gen_random_uuid()::text,
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  read        boolean not null default false,
  "createdAt" timestamptz not null default now()
);
create index if not exists contact_read_idx on contact_messages (read);
create index if not exists contact_created_idx on contact_messages ("createdAt");

create table if not exists activity_logs (
  id          text primary key default gen_random_uuid()::text,
  "userId"    text references users(id) on delete set null,
  action      text not null,
  detail      text,
  "createdAt" timestamptz not null default now()
);
create index if not exists activity_created_idx on activity_logs ("createdAt");

create table if not exists page_views (
  id          text primary key default gen_random_uuid()::text,
  path        text not null,
  "createdAt" timestamptz not null default now()
);
create index if not exists page_views_path_idx on page_views (path);
create index if not exists page_views_created_idx on page_views ("createdAt");

-- ── Atomic view counter ─────────────────────────────────────────
create or replace function increment_blog_views(blog_id text)
returns void language sql security definer set search_path = public as
$$ update blogs set views = views + 1 where id = blog_id; $$;

-- ── Security: RLS on, no policies ────────────────────────────────
-- The app talks to the DB exclusively with the service-role key
-- (server-side only), which bypasses RLS. Enabling RLS with zero
-- policies means the public anon key can read/write NOTHING.
do $$ declare t text;
begin
  foreach t in array array[
    'users','categories','tags','blogs','blog_tags','blog_revisions',
    'media','services','case_studies','testimonials','skill_groups',
    'skills','social_links','seo_settings','homepage_settings',
    'contact_messages','activity_logs','page_views'
  ] loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- ── Public storage bucket for the CV/resume ──────────────────────
-- The "Book a Free Strategy Call" button opens the file uploaded here.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cv', 'cv', true, 15728640,
        array['application/pdf','image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

-- ════════════════════════════════════════════════════════════════
-- SEED DATA
-- ════════════════════════════════════════════════════════════════

-- Super Admin — email: admin@alifhosain.com / password: ChangeMe-2026!
-- ⚠ CHANGE THIS PASSWORD after first login (Admin → Users)
insert into users (name, email, "passwordHash", role) values (
  'Alif Hosain',
  'admin@alifhosain.com',
  '$2b$12$CImgWhfC6ePBlMBgxsqW3.PTmJqzHc4zPWS4511y.Bbt1yLe5MPPK',
  'SUPER_ADMIN'
) on conflict (email) do nothing;

-- SEO
insert into seo_settings (id, "siteTitle", "siteDescription", keywords, "ogImage") values (
  'global',
  'Alif Hosain — Performance & Affiliate Marketing Expert',
  'Performance marketer scaling brand revenue through high-converting affiliate strategies, funnels, and conversion optimization. $2M+ revenue generated across 150+ campaigns.',
  'affiliate marketing, performance marketing, conversion rate optimization, media buying, funnel building, Alif Hosain',
  '/Assets/hero-bg.webp'
) on conflict (id) do nothing;

-- Homepage sections
insert into homepage_settings (id, value) values
('hero', $json$
{"badge":"Available for new projects",
 "headline":"Scaling Revenue Through Performance Marketing",
 "headlineAccent":"Revenue","headlineRest":"",
 "role":"Alif Hosain — Affiliate Marketer",
 "description":"I partner with brands to turn paid traffic into predictable profit — high-converting funnels, disciplined media buying, and relentless conversion optimization. Every campaign is engineered around one number: your ROI.",
 "primaryCtaLabel":"See Real Results","primaryCtaHref":"#cases",
 "secondaryCtaLabel":"Book a Free Strategy Call","secondaryCtaHref":"#footer",
 "trustLabel":"Campaigns delivered in",
 "industries":["Health & Wellness","Finance","E-commerce","SaaS"],
 "roiTagLabel":"Avg. Client ROI","roiTagValue":"+312%",
 "stats":[
  {"count":3,"suffix":"+","label":"Years Experience","image":"/Assets/ChatGPT Image Jun 4, 2026, 05_41_25 AM.webp"},
  {"count":150,"suffix":"+","label":"Campaigns Run","image":"/Assets/ChatGPT Image Jun 4, 2026, 05_25_13 AM.webp"},
  {"count":10,"suffix":"M+","label":"Ad Impressions","image":"/Assets/ChatGPT Image Jun 4, 2026, 05_28_10 AM.webp"},
  {"count":2,"prefix":"$","suffix":"M+","label":"Revenue Generated","image":"/Assets/ChatGPT Image Jun 4, 2026, 05_32_06 AM.webp"}]}
$json$::jsonb),
('about', $json$
{"eyebrow":"About Me","title":"The Marketer Behind","titleAccent":"The Numbers",
 "paragraphs":[
  "I didn't start with big budgets. I started with one affiliate link, a landing page I coded myself, and an obsession with why some pages convert and most don't. Three years and 150+ campaigns later, that obsession is my entire process.",
  "My unfair advantage is full-funnel thinking: I don't just buy traffic — I engineer the offer, the angle, the page, and the follow-up as one system. That's how clients get compounding returns instead of one lucky campaign."],
 "achievements":[
  {"value":"312%","label":"Avg. client ROI"},{"value":"40%","label":"Avg. CPL reduction"},
  {"value":"150+","label":"Campaigns shipped"},{"value":"12","label":"Niches mastered"}],
 "timeline":[
  {"year":"2023","title":"Started in Affiliate Marketing","text":"First commissions from organic content and SEO-driven affiliate sites. Learned the fundamentals of offers, angles, and intent."},
  {"year":"2024","title":"Moved Into Paid Traffic","text":"Scaled CPA and lead-gen offers with Meta and Google Ads. Built my first six-figure-revenue funnel for a health brand."},
  {"year":"2025","title":"Full-Funnel Partnerships","text":"Shifted from one-off campaigns to retainer partnerships — owning strategy, creatives, tracking, and optimization end to end."},
  {"year":"Now","title":"$2M+ Generated & Counting","text":"150+ campaigns across health, finance, e-commerce, and SaaS — with an average client ROI above 300%."}],
 "signatureName":"Alif Hosain","signatureRole":"Affiliate & Performance Marketer · Bangladesh"}
$json$::jsonb),
('footer', $json$
{"bio":"Affiliate marketer helping brands scale revenue through high-converting strategies, funnels, and conversion optimization.",
 "copyright":"© 2026 Alif Hosain. All rights reserved.",
 "contactEmail":"alifhosain@gmail.com","location":"Bangladesh"}
$json$::jsonb),
('cta', $json$
{"title":"Ready To Scale Your Revenue?","titleAccent":"Scale",
 "description":"Tell me about your offer and I'll reply within 24 hours with an honest take on whether — and how — I can grow it.",
 "proofPoints":["$2M+ revenue generated","312% average client ROI","No long-term lock-in"],
 "primaryLabel":"Book a Free Strategy Call","primaryHref":"#footer","email":"alifhosain@gmail.com"}
$json$::jsonb)
on conflict (id) do nothing;

-- Services
insert into services (title, problem, solution, result, icon, accent, "order")
select * from (values
 ('Affiliate Strategy','Promoting offers blindly with no system behind them.','Data-driven offer selection, angle testing, and channel mix built around your margins.','A repeatable acquisition engine — not one-off wins.','/Assets/ChatGPT Image Jun 4, 2026, 05_25_50 AM.webp','green',0),
 ('Funnel Building','Traffic arrives, but the page leaks money at every step.','High-converting landing pages, pre-sells, and email sequences engineered as one journey.','Typical lift: +30–80% conversion rate within 60 days.','/Assets/ChatGPT Image Jun 4, 2026, 05_44_37 AM.webp','orange',1),
 ('Traffic Generation','Rising ad costs and audiences that never convert.','Disciplined media buying on Meta & Google with creative testing and strict KPI gates.','Quality traffic at a CPA your unit economics can scale on.','/Assets/ChatGPT Image Jun 4, 2026, 05_41_25 AM.webp','green',2),
 ('Conversion Optimization','Plenty of clicks, disappointing revenue.','A/B testing, heatmap analysis, and offer restructuring driven by real user data.','More revenue from the traffic you already pay for.','/Assets/ChatGPT Image Jun 4, 2026, 05_25_13 AM.webp','orange',3)
) v(title, problem, solution, result, icon, accent, ord)
where not exists (select 1 from services);

-- Case studies
insert into case_studies (title, tag, url, challenge, strategy, outcome, metrics, fill, accent, "order")
select * from (values
 ('Health Supplement Offer','CPA Campaign · 90 days','nutrapeak.com/funnel',
  'Strong product, but cold traffic bounced at 82% and CPA was 2× the allowable.',
  'Rebuilt the funnel with an advertorial pre-sell, rewrote the angle around symptoms (not ingredients), and split-tested 14 creatives.',
  'CPA cut by 54% — the offer scaled from $100/day to $1.5K/day spend profitably.',
  '[{"k":"ROI","v":"320%","count":320,"suffix":"%"},{"k":"Revenue","v":"$45K+"},{"k":"Traffic","v":"1.2M"}]'::jsonb, 92,'green',0),
 ('Finance Lead Gen Campaign','CPL Campaign · 1 quarter','finedge.com/leadgen',
  'Three agencies had burned the budget — leads came in cheap but never qualified.',
  'Added a qualifying quiz step, rebuilt audiences from CRM data, and aligned ad promise with the application flow.',
  'Cost per qualified lead dropped 40% while lead quality scores rose 2.3×.',
  '[{"k":"ROI","v":"280%","count":280,"suffix":"%"},{"k":"Revenue","v":"$38.5K"},{"k":"Leads","v":"9.4K"}]'::jsonb, 84,'orange',1),
 ('E-commerce Product Campaign','Sales Campaign · Launch','audiowave.com/shop',
  'New audio brand launching into a saturated market with zero audience.',
  'UGC-style creative testing, bundle offer engineering, and a post-purchase upsell flow that lifted AOV 28%.',
  'Launch hit 410% ROI in 6 weeks and the winning ad set is still scaling.',
  '[{"k":"ROI","v":"410%","count":410,"suffix":"%"},{"k":"Revenue","v":"$60.2K"},{"k":"Orders","v":"3.1K"}]'::jsonb, 96,'green',2)
) v(title, tag, url, challenge, strategy, outcome, metrics, fill, accent, ord)
where not exists (select 1 from case_studies);

-- Testimonials
insert into testimonials (quote, name, company, result, rating, "order")
select * from (values
 ('"Alif rebuilt our entire affiliate funnel and tripled our ROI in under 90 days. The man speaks fluent conversion — every dollar is accounted for and optimized."','Rafiul Hasan','CEO, NutraPeak Supplements','3× ROI in 90 days',5,0),
 ('"We''d burned budget on three agencies before Alif. Within a quarter our cost-per-lead dropped 40% and quality went up. He''s the real deal — strategic and obsessively analytical."','Sadia Karim','CMO, FinEdge Capital','−40% cost per lead',5,1),
 ('"Our product launch hit 410% ROI thanks to Alif''s funnel and traffic mix. Clear reporting, zero fluff, pure results."','Tanvir Ahmed','Founder, AudioWave Co.','410% launch ROI',5,2)
) v(quote, name, company, result, rating, ord)
where not exists (select 1 from testimonials);

-- Skill groups + skills
do $$
declare gid text;
begin
  if not exists (select 1 from skill_groups) then
    insert into skill_groups (name, "order") values ('Traffic Generation', 0) returning id into gid;
    insert into skills (name, percent, "order", "groupId") values
      ('Meta Ads', 92, 0, gid), ('Google Ads', 88, 1, gid), ('Native & Push Traffic', 84, 2, gid);
    insert into skill_groups (name, "order") values ('Conversion Optimization', 1) returning id into gid;
    insert into skills (name, percent, "order", "groupId") values
      ('Landing Page CRO', 94, 0, gid), ('Funnel Architecture', 92, 1, gid), ('A/B Testing', 90, 2, gid);
    insert into skill_groups (name, "order") values ('Analytics & Tracking', 2) returning id into gid;
    insert into skills (name, percent, "order", "groupId") values
      ('GA4 & Server-Side Tracking', 93, 0, gid), ('Attribution Modeling', 86, 1, gid);
    insert into skill_groups (name, "order") values ('Affiliate Networks', 3) returning id into gid;
    insert into skills (name, percent, "order", "groupId") values
      ('CPA / CPL Offer Selection', 95, 0, gid), ('Network Relations & Caps', 88, 1, gid);
    insert into skill_groups (name, "order") values ('Marketing Automation', 4) returning id into gid;
    insert into skills (name, percent, "order", "groupId") values
      ('Email Sequences', 89, 0, gid), ('Retargeting Flows', 91, 1, gid);
  end if;
end $$;

-- Social links
insert into social_links (platform, url, "order") values
 ('facebook','#',0),('instagram','#',1),('youtube','#',2),('linkedin','#',3)
on conflict (platform) do nothing;

-- Done. Sign in at /admin/login with admin@alifhosain.com / ChangeMe-2026!
