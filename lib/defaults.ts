/**
 * Default site content. Used as a fallback when the database is empty or
 * unreachable (e.g. first deploy before seeding), and by `prisma/seed.ts`
 * as the initial CMS content.
 */

export type HeroContent = {
  badge: string;
  headline: string;
  headlineAccent: string;
  headlineRest: string;
  role: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  trustLabel: string;
  industries: string[];
  roiTagLabel: string;
  roiTagValue: string;
  stats: { count: number; prefix?: string; suffix?: string; label: string; image: string }[];
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  paragraphs: string[];
  achievements: { value: string; label: string }[];
  timeline: { year: string; title: string; text: string }[];
  signatureName: string;
  signatureRole: string;
};

export type FooterContent = {
  bio: string;
  copyright: string;
  contactEmail: string;
  location: string;
};

export type CtaContent = {
  title: string;
  titleAccent: string;
  description: string;
  proofPoints: string[];
  primaryLabel: string;
  primaryHref: string;
  email: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  result: string;
  icon: string | null;
  accent: string;
};

export type CaseItem = {
  id: string;
  title: string;
  tag: string;
  url: string | null;
  image: string | null;
  challenge: string;
  strategy: string;
  outcome: string;
  metrics: { k: string; v: string; count?: number; suffix?: string }[];
  fill: number;
  accent: string;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  company: string;
  avatar: string | null;
  result: string | null;
  rating: number;
};

export type SkillGroupItem = {
  id: string;
  name: string;
  skills: { name: string; percent: number }[];
};

export type SocialItem = { platform: string; url: string };

export type IntroContent = { enabled: boolean };

export type CvContent = { url: string };

export type ResultsContent = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  lede: string;
  items: { image: string; title: string; note: string; layout: 'wide' | 'tall' }[];
};

export type BlogCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  readTime: number;
  publishedAt: Date | null;
  thumbnail: string | null;
  featured: boolean;
};

export const DEFAULT_HERO: HeroContent = {
  badge: 'Available for new projects',
  headline: 'Scaling Revenue Through Performance Marketing',
  headlineAccent: 'Revenue',
  headlineRest: '',
  role: 'Alif Hosain — Affiliate Marketer',
  description:
    'I partner with brands to turn paid traffic into predictable profit — high-converting funnels, disciplined media buying, and relentless conversion optimization. Every campaign is engineered around one number: your ROI.',
  primaryCtaLabel: 'See Real Results',
  primaryCtaHref: '#cases',
  secondaryCtaLabel: 'Book a Free Strategy Call',
  secondaryCtaHref: '#footer',
  trustLabel: 'Campaigns delivered in',
  industries: ['Health & Wellness', 'Finance', 'E-commerce', 'SaaS'],
  roiTagLabel: 'Avg. Client ROI',
  roiTagValue: '+312%',
  stats: [
    { count: 3, suffix: '+', label: 'Years Experience', image: '/Assets/ChatGPT Image Jun 4, 2026, 05_41_25 AM.webp' },
    { count: 150, suffix: '+', label: 'Campaigns Run', image: '/Assets/ChatGPT Image Jun 4, 2026, 05_25_13 AM.webp' },
    { count: 10, suffix: 'M+', label: 'Ad Impressions', image: '/Assets/ChatGPT Image Jun 4, 2026, 05_28_10 AM.webp' },
    { count: 2, prefix: '$', suffix: 'M+', label: 'Revenue Generated', image: '/Assets/ChatGPT Image Jun 4, 2026, 05_32_06 AM.webp' },
  ],
};

export const DEFAULT_ABOUT: AboutContent = {
  eyebrow: 'About Me',
  title: 'The Marketer Behind',
  titleAccent: 'The Numbers',
  paragraphs: [
    "I didn't start with big budgets. I started with one affiliate link, a landing page I coded myself, and an obsession with why some pages convert and most don't. Three years and 150+ campaigns later, that obsession is my entire process.",
    "My unfair advantage is full-funnel thinking: I don't just buy traffic — I engineer the offer, the angle, the page, and the follow-up as one system. That's how clients get compounding returns instead of one lucky campaign.",
  ],
  achievements: [
    { value: '312%', label: 'Avg. client ROI' },
    { value: '40%', label: 'Avg. CPL reduction' },
    { value: '150+', label: 'Campaigns shipped' },
    { value: '12', label: 'Niches mastered' },
  ],
  timeline: [
    { year: '2023', title: 'Started in Affiliate Marketing', text: 'First commissions from organic content and SEO-driven affiliate sites. Learned the fundamentals of offers, angles, and intent.' },
    { year: '2024', title: 'Moved Into Paid Traffic', text: 'Scaled CPA and lead-gen offers with Meta and Google Ads. Built my first six-figure-revenue funnel for a health brand.' },
    { year: '2025', title: 'Full-Funnel Partnerships', text: 'Shifted from one-off campaigns to retainer partnerships — owning strategy, creatives, tracking, and optimization end to end.' },
    { year: 'Now', title: '$2M+ Generated & Counting', text: '150+ campaigns across health, finance, e-commerce, and SaaS — with an average client ROI above 300%.' },
  ],
  signatureName: 'Alif Hosain',
  signatureRole: 'Affiliate & Performance Marketer · Bangladesh',
};

export const DEFAULT_FOOTER: FooterContent = {
  bio: 'Affiliate marketer helping brands scale revenue through high-converting strategies, funnels, and conversion optimization.',
  copyright: '© 2026 Alif Hosain. All rights reserved.',
  contactEmail: 'alifhosain@gmail.com',
  location: 'Bangladesh',
};

export const DEFAULT_CTA: CtaContent = {
  title: 'Ready To Scale Your Revenue?',
  titleAccent: 'Scale',
  description:
    "Tell me about your offer and I'll reply within 24 hours with an honest take on whether — and how — I can grow it.",
  proofPoints: ['$2M+ revenue generated', '312% average client ROI', 'No long-term lock-in'],
  primaryLabel: 'Book a Free Strategy Call',
  primaryHref: '#footer',
  email: 'alifhosain@gmail.com',
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'svc-1',
    title: 'Paid Media Buying & Campaign Scaling',
    problem: 'Ad budgets burn fast when campaigns launch without strategy, structure, or scaling discipline.',
    solution: 'End-to-end setup, management, and scaling of high-converting campaigns on Meta (Facebook) and Google Ads — strategic audience targeting and complete budget optimization.',
    result: 'Maximized Return on Ad Spend (ROAS) and sustainable revenue growth for e-commerce and digital businesses.',
    icon: '/Assets/icons/target.png',
    accent: 'green',
  },
  {
    id: 'svc-2',
    title: 'Mobile App User Acquisition (UA)',
    problem: 'App installs are expensive — and most downloads never become active users.',
    solution: 'Data-driven acquisition funnels for mobile apps and gaming projects, built to lower Cost Per Install and attract high-quality store downloads — tracked with Firebase and Google Play Console.',
    result: 'Lower CPI, more high-quality installs, and growing monthly active users (MAU).',
    icon: '/Assets/icons/rocket.png',
    accent: 'orange',
  },
  {
    id: 'svc-3',
    title: 'Data Analytics & Tracking Setup',
    problem: "Without clean data, you can't tell which ads make money and which quietly waste it.",
    solution: 'End-to-end conversion tracking, custom events, and pixel integrations — Google Analytics 4, Meta Pixel — wired across your entire funnel.',
    result: 'Every dollar of ad spend accurately tracked, analyzed, and optimized for better performance.',
    icon: '/Assets/icons/chart.png',
    accent: 'green',
  },
  {
    id: 'svc-4',
    title: 'Conversion Rate Optimization (CRO) & Funnel Strategy',
    problem: 'Driving traffic is only half the battle — most visitors leave without buying.',
    solution: 'User-behavior analysis and optimization of landing pages, store listings, and ad creatives to transform cold traffic into paying customers.',
    result: 'The highest possible conversion rate from your existing marketing budget.',
    icon: '/Assets/icons/funnel.png',
    accent: 'orange',
  },
];

export const DEFAULT_CASES: CaseItem[] = [
  {
    id: 'case-1',
    title: 'Health Supplement Offer',
    tag: 'CPA Campaign · 90 days',
    url: 'nutrapeak.com/funnel',
    image: null,
    challenge: 'Strong product, but cold traffic bounced at 82% and CPA was 2× the allowable.',
    strategy: 'Rebuilt the funnel with an advertorial pre-sell, rewrote the angle around symptoms (not ingredients), and split-tested 14 creatives.',
    outcome: 'CPA cut by 54% — the offer scaled from $100/day to $1.5K/day spend profitably.',
    metrics: [
      { k: 'ROI', v: '320%', count: 320, suffix: '%' },
      { k: 'Revenue', v: '$45K+' },
      { k: 'Traffic', v: '1.2M' },
    ],
    fill: 92,
    accent: 'green',
  },
  {
    id: 'case-2',
    title: 'Finance Lead Gen Campaign',
    tag: 'CPL Campaign · 1 quarter',
    url: 'finedge.com/leadgen',
    image: null,
    challenge: 'Three agencies had burned the budget — leads came in cheap but never qualified.',
    strategy: 'Added a qualifying quiz step, rebuilt audiences from CRM data, and aligned ad promise with the application flow.',
    outcome: 'Cost per qualified lead dropped 40% while lead quality scores rose 2.3×.',
    metrics: [
      { k: 'ROI', v: '280%', count: 280, suffix: '%' },
      { k: 'Revenue', v: '$38.5K' },
      { k: 'Leads', v: '9.4K' },
    ],
    fill: 84,
    accent: 'orange',
  },
  {
    id: 'case-3',
    title: 'E-commerce Product Campaign',
    tag: 'Sales Campaign · Launch',
    url: 'audiowave.com/shop',
    image: null,
    challenge: 'New audio brand launching into a saturated market with zero audience.',
    strategy: 'UGC-style creative testing, bundle offer engineering, and a post-purchase upsell flow that lifted AOV 28%.',
    outcome: 'Launch hit 410% ROI in 6 weeks and the winning ad set is still scaling.',
    metrics: [
      { k: 'ROI', v: '410%', count: 410, suffix: '%' },
      { k: 'Revenue', v: '$60.2K' },
      { k: 'Orders', v: '3.1K' },
    ],
    fill: 96,
    accent: 'green',
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    quote: '"Alif rebuilt our entire affiliate funnel and tripled our ROI in under 90 days. The man speaks fluent conversion — every dollar is accounted for and optimized."',
    name: 'Rafiul Hasan',
    company: 'CEO, NutraPeak Supplements',
    avatar: null,
    result: '3× ROI in 90 days',
    rating: 5,
  },
  {
    id: 't-2',
    quote: '"We\'d burned budget on three agencies before Alif. Within a quarter our cost-per-lead dropped 40% and quality went up. He\'s the real deal — strategic and obsessively analytical."',
    name: 'Sadia Karim',
    company: 'CMO, FinEdge Capital',
    avatar: null,
    result: '−40% cost per lead',
    rating: 5,
  },
  {
    id: 't-3',
    quote: '"Our product launch hit 410% ROI thanks to Alif\'s funnel and traffic mix. Clear reporting, zero fluff, pure results."',
    name: 'Tanvir Ahmed',
    company: 'Founder, AudioWave Co.',
    avatar: null,
    result: '410% launch ROI',
    rating: 5,
  },
];

export const DEFAULT_SKILL_GROUPS: SkillGroupItem[] = [
  {
    id: 'sg-1',
    name: 'Paid Advertising',
    skills: [
      { name: 'Facebook Ads', percent: 94 },
      { name: 'Google Ads', percent: 93 },
    ],
  },
  {
    id: 'sg-2',
    name: 'E-commerce & Dropshipping',
    skills: [
      { name: 'Shopify Store Management', percent: 93 },
      { name: 'Ecommerce Operations', percent: 90 },
      { name: 'Dropshipping', percent: 92 },
      { name: 'Order Fulfillment', percent: 88 },
    ],
  },
  {
    id: 'sg-3',
    name: 'Growth & Optimization',
    skills: [
      { name: 'Product Research', percent: 91 },
      { name: 'SEO & Product Listing Optimization', percent: 89 },
      { name: 'Customer Support', percent: 87 },
    ],
  },
];

export const DEFAULT_INTRO: IntroContent = { enabled: true };

export const DEFAULT_CV: CvContent = { url: '' };

export const DEFAULT_RESULTS: ResultsContent = {
  eyebrow: 'Past Work',
  title: 'Real Dashboards,',
  titleAccent: 'Real Results',
  lede: 'Unedited screenshots from live client accounts — payments, ad platforms, and affiliate networks I manage.',
  items: [
    {
      image: '/Assets/results/stripe-desktop.webp',
      title: 'Stripe — E-commerce Store Revenue',
      note: '$4.7K+ gross volume processed for an e-commerce brand',
      layout: 'wide',
    },
    {
      image: '/Assets/results/google-ads.webp',
      title: 'Google Ads — 21.8K Conversions at $0.10',
      note: '142K clicks driven on just $2.11K spend in 30 days',
      layout: 'wide',
    },
    {
      image: '/Assets/results/impact-dashboard.webp',
      title: 'impact.com — Affiliate Partnerships',
      note: 'Active partner dashboard with pre-approved brand deals',
      layout: 'wide',
    },
    {
      image: '/Assets/results/affiliate-mobile.webp',
      title: '$350 Earned In One Day',
      note: '8.3% conversion rate · 5.22 EPC on affiliate offers',
      layout: 'tall',
    },
    {
      image: '/Assets/results/stripe-mobile-light.webp',
      title: '+1,042% Weekly Growth',
      note: 'Stripe gross volume scaled week-over-week',
      layout: 'tall',
    },
    {
      image: '/Assets/results/stripe-mobile-dark.webp',
      title: '+233% Week-Over-Week',
      note: 'Consistent payment volume growth on autopilot',
      layout: 'tall',
    },
  ],
};

export const DEFAULT_SOCIALS: SocialItem[] = [
  { platform: 'facebook', url: '#' },
  { platform: 'instagram', url: '#' },
  { platform: 'youtube', url: '#' },
  { platform: 'linkedin', url: '#' },
];

export const DEFAULT_SEO = {
  siteTitle: 'Alif Hosain — Performance & Affiliate Marketing Expert',
  siteDescription:
    'Performance marketer scaling brand revenue through high-converting affiliate strategies, funnels, and conversion optimization. $2M+ revenue generated across 150+ campaigns.',
  keywords: 'affiliate marketing, performance marketing, conversion rate optimization, media buying, funnel building, Alif Hosain',
  ogImage: '/Assets/hero-bg.webp',
  siteUrl: 'https://alifhosain.com',
  robotsIndex: true,
  gaId: null as string | null,
  gscVerification: null as string | null,
};
