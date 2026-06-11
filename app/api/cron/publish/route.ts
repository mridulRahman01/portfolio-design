import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sb, must, nowIso } from '@/lib/db';
import { logActivity } from '@/lib/activity';

export const runtime = 'nodejs';

/**
 * Content scheduler — promotes SCHEDULED posts whose time has arrived to
 * PUBLISHED. Triggered by Vercel Cron (see vercel.json) every 10 minutes.
 * Protected by CRON_SECRET (Vercel sends it as a Bearer token automatically).
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const due = must(await sb().from('blogs')
      .select('id, slug, title')
      .eq('status', 'SCHEDULED')
      .lte('scheduledFor', nowIso()));

    if (due.length) {
      must(await sb().from('blogs')
        .update({ status: 'PUBLISHED', publishedAt: nowIso(), scheduledFor: null })
        .in('id', due.map(b => b.id))
        .select('id'));
      for (const b of due) {
        await logActivity(null, 'blog.autopublished', `"${b.title}" (${b.slug})`);
      }
      revalidatePath('/blog');
      revalidatePath('/');
    }

    return NextResponse.json({ published: due.length });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Scheduler failed' },
      { status: 500 },
    );
  }
}
