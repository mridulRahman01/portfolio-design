import { NextRequest, NextResponse } from 'next/server';
import { sb } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local';
    if (!rateLimit(`track:${ip}`, 60, 60_000)) {
      return NextResponse.json({ ok: true }); // silently drop floods
    }
    const { path } = await req.json();
    if (typeof path === 'string' && path.length < 200 && !path.startsWith('/admin')) {
      await sb().from('page_views').insert({ path });
    }
  } catch {
    // Tracking must never error out to the client.
  }
  return NextResponse.json({ ok: true });
}
