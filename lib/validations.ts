import { z } from 'zod';

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);
}

export const blogSchema = z.object({
  title: z.string().min(3).max(180),
  slug: z.string().regex(slugRegex, 'Lowercase letters, numbers and hyphens only').max(96),
  excerpt: z.string().max(400).optional().or(z.literal('')),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().url().optional().or(z.literal('')),
  thumbnail: z.string().url().optional().or(z.literal('')),
  readTime: z.number().int().min(1).max(120),
  featured: z.boolean(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']),
  scheduledFor: z.string().optional().or(z.literal('')),
  category: z.string().max(60).optional().or(z.literal('')),
  tags: z.string().max(300).optional().or(z.literal('')), // comma-separated
  seoTitle: z.string().max(180).optional().or(z.literal('')),
  seoDescription: z.string().max(320).optional().or(z.literal('')),
  ogImage: z.string().url().optional().or(z.literal('')),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
});
export type BlogInput = z.infer<typeof blogSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(120),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().max(180).optional().or(z.literal('')),
  message: z.string().min(10, 'Tell me a bit more (10+ characters)').max(5000),
  // Honeypot — must stay empty; bots fill it.
  website: z.string().max(0).optional().or(z.literal('')),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const serviceSchema = z.object({
  title: z.string().min(2).max(120),
  problem: z.string().min(2).max(400),
  solution: z.string().min(2).max(400),
  result: z.string().min(2).max(400),
  icon: z.string().optional().or(z.literal('')),
  accent: z.enum(['green', 'orange']).default('green'),
  order: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
});

export const caseSchema = z.object({
  title: z.string().min(2).max(160),
  tag: z.string().min(2).max(120),
  url: z.string().max(200).optional().or(z.literal('')),
  image: z.string().url().optional().or(z.literal('')),
  challenge: z.string().min(2).max(600),
  strategy: z.string().min(2).max(600),
  outcome: z.string().min(2).max(600),
  metrics: z.array(z.object({
    k: z.string().max(40),
    v: z.string().max(40),
    count: z.number().optional(),
    suffix: z.string().max(8).optional(),
  })).min(1).max(4),
  fill: z.coerce.number().int().min(0).max(100).default(90),
  accent: z.enum(['green', 'orange']).default('green'),
  order: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
});

export const testimonialSchema = z.object({
  quote: z.string().min(10).max(1000),
  name: z.string().min(2).max(120),
  company: z.string().min(2).max(160),
  avatar: z.string().url().optional().or(z.literal('')),
  result: z.string().max(80).optional().or(z.literal('')),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  order: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
});

export const skillGroupSchema = z.object({
  name: z.string().min(2).max(80),
  order: z.coerce.number().int().default(0),
  skills: z.array(z.object({
    name: z.string().min(1).max(80),
    percent: z.coerce.number().int().min(0).max(100),
  })).min(1).max(12),
});

export const socialSchema = z.object({
  platform: z.string().min(2).max(40),
  url: z.string().max(300),
  order: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
});

export const seoSchema = z.object({
  siteTitle: z.string().min(3).max(180),
  siteDescription: z.string().min(10).max(400),
  keywords: z.string().max(500).optional().or(z.literal('')),
  ogImage: z.string().optional().or(z.literal('')),
  siteUrl: z.string().url(),
  robotsIndex: z.coerce.boolean().default(true),
  gaId: z.string().max(40).optional().or(z.literal('')),
  gscVerification: z.string().max(120).optional().or(z.literal('')),
});

export const userSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8, 'Minimum 8 characters').max(100).optional().or(z.literal('')),
  role: z.enum(['SUPER_ADMIN', 'EDITOR', 'AUTHOR']),
  active: z.coerce.boolean().default(true),
});
