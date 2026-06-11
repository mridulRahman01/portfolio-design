# Portfolio CMS — Setup & Deployment Guide

A full content management system for the Alif Hosain portfolio, powered by
**Supabase** (project `jfkefdwxeschxclbcivo`). Every piece of site content —
hero, about, services, case studies, testimonials, skills, social links, SEO,
blog — is editable from `/admin` without touching code.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 App Router · TypeScript · Tailwind CSS · Framer Motion |
| Forms | React Hook Form + Zod |
| Backend | Server Actions + API Routes |
| Database | Supabase (PostgreSQL) via `@supabase/supabase-js` |
| Auth | NextAuth (JWT credentials) with RBAC |
| Media | Cloudinary (auto WebP/AVIF optimization) |
| Editor | Tiptap rich text |
| Deploy | Vercel (with Cron for scheduled publishing) |

## Setup — two steps

### 1. Create the tables (one-time)

Open the [SQL Editor](https://supabase.com/dashboard/project/jfkefdwxeschxclbcivo/sql/new)
for project `jfkefdwxeschxclbcivo`, paste the entire contents of
**`supabase/setup.sql`**, and click **Run**.

This creates all 18 tables (with indexes and Row Level Security), the
view-counter function, and seeds:
- the current site content (hero, about, services, case studies, testimonials, skills, socials, SEO),
- the Super Admin account: **admin@alifhosain.com / ChangeMe-2026!**

> ⚠ Change that password right after your first login (Admin → Users).

### 2. Add the service-role key

Go to [Project Settings → API keys](https://supabase.com/dashboard/project/jfkefdwxeschxclbcivo/settings/api-keys),
copy the **service_role** secret key, and paste it into `.env`:

```env
SUPABASE_URL="https://jfkefdwxeschxclbcivo.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."   ← paste here
```

Then restart the dev server (`npm run dev`) and sign in at
**http://localhost:3000/admin/login**.

For the Media Library, also add Cloudinary keys (free account at
cloudinary.com → Dashboard → API Keys).

## Security model

- Every table has **RLS enabled with zero policies** — the public anon key can
  read/write nothing. The app talks to Supabase exclusively through the
  **service_role** key, server-side only (server components, server actions,
  API routes). Never expose that key to the browser or commit it.
- NextAuth JWT sessions (8h), bcrypt password hashing (cost 12)
- Login rate limiting (5 attempts / 5 min per email+IP)
- Contact form: rate limit + honeypot + Zod validation
- Upload validation: image-only allowlist + 10 MB cap + auth + rate limit
- Edge middleware guards `/admin/*` and `/api/admin/*`; `requireCapability()`
  re-checks the role on every mutation
- `/admin` is `noindex` and excluded in robots.txt

## Roles (RBAC)

| Capability | Super Admin | Editor | Author |
|---|---|---|---|
| Blogs & Media | ✅ | ✅ | ✅ (own posts) |
| Site content sections | ✅ | ✅ | — |
| Leads inbox | ✅ | ✅ | — |
| Activity log | ✅ | ✅ | — |
| SEO settings | ✅ | — | — |
| User management | ✅ | — | — |

## Features map

- **Dashboard** — post counts, unread leads, 14-day traffic chart (internal
  page-view tracking), most-viewed articles, recent activity.
- **Blogs** — drafts, publishing, **scheduling** (Vercel Cron auto-publishes
  every 10 min, `vercel.json`), Tiptap editor, autosave (25s), revision
  history (last 20, restorable), duplication, draft preview,
  search/filter/pagination, full per-post SEO.
- **Media** — Cloudinary uploads, folders, search, alt text, copy URL, delete.
- **Site Content** — hero, about (timeline + achievements), services,
  case studies (with metrics), testimonials, skills groups, social links,
  footer + closing CTA.
- **SEO panel** — site title/description/keywords, OG image, robots toggle,
  GA4 ID (script auto-injected), Search Console verification.
  `sitemap.xml` / `robots.txt` are generated from these settings.
- **Leads** — contact submissions, mark read/unread, delete, **CSV export**,
  optional Resend email notifications.
- **Users** — create/edit/deactivate, roles, last-super-admin protection.
- **Activity log** — full audit trail.

## Deploy to Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Add the environment variables from `.env.example`
   (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET`,
   `NEXTAUTH_URL` = your production URL, `CRON_SECRET`, Cloudinary keys).
3. Deploy. The database is already set up from step 1 above — nothing else to run.
4. Vercel Cron (from `vercel.json`) hits `/api/cron/publish` every 10 minutes
   to publish scheduled posts, authenticated with `CRON_SECRET`.
5. In `/admin/seo`, set the production site URL, GA4 ID, and Search Console
   verification.

## Handoff notes for the client

- Sign in at `yourdomain.com/admin/login` and **change the seeded password
  immediately** (Users → your account).
- Everything on the homepage is under **Site Content**; blog under **Blog Posts**.
- Images: upload in **Media Library** → "Copy URL" → paste into any image field.
- The dashboard chart is built-in; deeper stats appear in Google Analytics
  once the GA4 ID is set on the SEO page.
