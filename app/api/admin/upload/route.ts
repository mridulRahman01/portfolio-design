import { NextRequest, NextResponse } from 'next/server';
import { sb, must } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']);
const MAX_BYTES = 10 * 1024 * 1024;

function slug(s: string) {
  return s.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 40) || 'image';
}

/** Uploads an image to the public Supabase Storage `media` bucket and records
 *  it in the media table. (Device upload — the form also accepts a pasted URL.) */
export async function POST(req: NextRequest) {
  try {
    const user = await requireCapability('media:manage');
    if (!rateLimit(`upload:${user.id}`, 40, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const form = await req.formData();
    const file = form.get('file') as File | null;
    const folder = ((form.get('folder') as string) || 'general').replace(/[^a-z0-9-_]/gi, '') || 'general';
    const alt = (form.get('alt') as string) || null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 });
    }

    const ext = file.type === 'image/svg+xml' ? 'svg' : file.type.split('/')[1];
    const path = `${folder}/${slug(file.name)}-${Date.now().toString(36)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await sb().storage
      .from('media')
      .upload(path, buffer, { contentType: file.type, upsert: true });
    if (upErr) throw new Error(upErr.message);

    const { data: pub } = sb().storage.from('media').getPublicUrl(path);

    const media = must(await sb().from('media').insert({
      publicId: path,
      url: pub.publicUrl,
      format: ext,
      bytes: file.size,
      folder,
      alt,
    }).select('*').single());

    await logActivity(user.id, 'media.uploaded', `${file.name} → ${path}`);
    return NextResponse.json({ media });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    const status = msg === 'Unauthorized' ? 401 : msg === 'Forbidden' ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
