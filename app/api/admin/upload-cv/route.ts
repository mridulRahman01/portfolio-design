import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { sb, nowIso } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ALLOWED = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/webp']);
const MAX_BYTES = 15 * 1024 * 1024;

/** Uploads the CV/resume to the public Supabase Storage `cv` bucket and
 *  saves its public URL to the `cv` homepage setting. */
export async function POST(req: NextRequest) {
  try {
    const user = await requireCapability('content:manage');
    if (!rateLimit(`cv:${user.id}`, 12, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: 'Only PDF, PNG, JPG or WEBP files are allowed' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds 15 MB limit' }, { status: 400 });
    }

    const ext = file.type === 'application/pdf' ? 'pdf' : file.type.split('/')[1];
    const path = `cv-${Date.now().toString(36)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await sb().storage
      .from('cv')
      .upload(path, buffer, { contentType: file.type, upsert: true });
    if (upErr) throw new Error(upErr.message);

    const { data: pub } = sb().storage.from('cv').getPublicUrl(path);
    const url = pub.publicUrl;

    // Persist the CV URL to settings
    const { error: setErr } = await sb().from('homepage_settings')
      .upsert({ id: 'cv', value: { url }, updatedAt: nowIso() }, { onConflict: 'id' });
    if (setErr) throw new Error(setErr.message);

    await logActivity(user.id, 'cv.uploaded', `${file.name} (${(file.size / 1024).toFixed(0)} KB)`);
    revalidatePath('/');
    return NextResponse.json({ url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    const status = msg === 'Unauthorized' ? 401 : msg === 'Forbidden' ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
