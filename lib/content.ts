import 'server-only';
import { cache } from 'react';
import { sb } from '@/lib/db';
import {
  DEFAULT_HERO, DEFAULT_ABOUT, DEFAULT_FOOTER, DEFAULT_CTA,
  DEFAULT_SERVICES, DEFAULT_CASES, DEFAULT_TESTIMONIALS,
  DEFAULT_SKILL_GROUPS, DEFAULT_SOCIALS, DEFAULT_SEO, DEFAULT_RESULTS, DEFAULT_INTRO, DEFAULT_CV,
  type HeroContent, type AboutContent, type FooterContent, type CtaContent,
  type ServiceItem, type CaseItem, type TestimonialItem, type SkillGroupItem,
  type SocialItem, type BlogCard, type ResultsContent, type IntroContent, type CvContent,
} from '@/lib/defaults';

/**
 * Every fetcher falls back to the static defaults if Supabase is
 * unconfigured/unreachable or empty, so the public site never hard-fails.
 */

async function settingOr<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await sb()
      .from('homepage_settings').select('value').eq('id', key).maybeSingle();
    if (error || !data) return fallback;
    return { ...fallback, ...(data.value as object) } as T;
  } catch {
    return fallback;
  }
}

export const getHero = cache(() => settingOr<HeroContent>('hero', DEFAULT_HERO));
export const getAbout = cache(() => settingOr<AboutContent>('about', DEFAULT_ABOUT));
export const getFooter = cache(() => settingOr<FooterContent>('footer', DEFAULT_FOOTER));
export const getCta = cache(() => settingOr<CtaContent>('cta', DEFAULT_CTA));
export const getResults = cache(() => settingOr<ResultsContent>('results', DEFAULT_RESULTS));
export const getIntro = cache(() => settingOr<IntroContent>('intro', DEFAULT_INTRO));
export const getCv = cache(() => settingOr<CvContent>('cv', DEFAULT_CV));

export const getServices = cache(async (): Promise<ServiceItem[]> => {
  try {
    const { data, error } = await sb()
      .from('services').select('*').eq('visible', true).order('order');
    if (error || !data?.length) return DEFAULT_SERVICES;
    return data.map(r => ({
      id: r.id, title: r.title, problem: r.problem, solution: r.solution,
      result: r.result, icon: r.icon, accent: r.accent,
    }));
  } catch {
    return DEFAULT_SERVICES;
  }
});

export const getCases = cache(async (): Promise<CaseItem[]> => {
  try {
    const { data, error } = await sb()
      .from('case_studies').select('*').eq('visible', true).order('order');
    if (error || !data?.length) return DEFAULT_CASES;
    return data.map(r => ({
      id: r.id, title: r.title, tag: r.tag, url: r.url, image: r.image,
      challenge: r.challenge, strategy: r.strategy, outcome: r.outcome,
      metrics: r.metrics as CaseItem['metrics'], fill: r.fill, accent: r.accent,
    }));
  } catch {
    return DEFAULT_CASES;
  }
});

export const getTestimonials = cache(async (): Promise<TestimonialItem[]> => {
  try {
    const { data, error } = await sb()
      .from('testimonials').select('*').eq('visible', true).order('order');
    if (error || !data?.length) return DEFAULT_TESTIMONIALS;
    return data.map(r => ({
      id: r.id, quote: r.quote, name: r.name, company: r.company,
      avatar: r.avatar, result: r.result, rating: r.rating,
    }));
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
});

export const getSkillGroups = cache(async (): Promise<SkillGroupItem[]> => {
  try {
    const { data, error } = await sb()
      .from('skill_groups')
      .select('*, skills(*)')
      .order('order')
      .order('order', { referencedTable: 'skills' });
    if (error || !data?.length) return DEFAULT_SKILL_GROUPS;
    return data.map(g => ({
      id: g.id, name: g.name,
      skills: (g.skills as { name: string; percent: number }[]).map(s => ({
        name: s.name, percent: s.percent,
      })),
    }));
  } catch {
    return DEFAULT_SKILL_GROUPS;
  }
});

export const getSocials = cache(async (): Promise<SocialItem[]> => {
  try {
    const { data, error } = await sb()
      .from('social_links').select('*').eq('visible', true).order('order');
    if (error || !data?.length) return DEFAULT_SOCIALS;
    return data.map(r => ({ platform: r.platform, url: r.url }));
  } catch {
    return DEFAULT_SOCIALS;
  }
});

export const getSeo = cache(async () => {
  try {
    const { data, error } = await sb()
      .from('seo_settings').select('*').eq('id', 'global').maybeSingle();
    if (error || !data) return DEFAULT_SEO;
    return data as typeof DEFAULT_SEO & { siteUrl: string };
  } catch {
    return DEFAULT_SEO;
  }
});

export const getLatestPosts = cache(async (take = 3): Promise<BlogCard[]> => {
  try {
    const { data, error } = await sb()
      .from('blogs')
      .select('id, slug, title, excerpt, readTime, publishedAt, thumbnail, featured, category:categories(name)')
      .eq('status', 'PUBLISHED')
      .order('featured', { ascending: false })
      .order('publishedAt', { ascending: false })
      .limit(take);
    if (error || !data) return [];
    return data.map(b => ({
      id: b.id, slug: b.slug, title: b.title, excerpt: b.excerpt,
      category: (b.category as unknown as { name: string } | null)?.name ?? null,
      readTime: b.readTime,
      publishedAt: b.publishedAt ? new Date(b.publishedAt) : null,
      thumbnail: b.thumbnail, featured: b.featured,
    }));
  } catch {
    return [];
  }
});
