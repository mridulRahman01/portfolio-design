import { NextRequest, NextResponse } from 'next/server';
import { sb, must } from '@/lib/db';
import { requireCapability } from '@/lib/rbac';
import { uploadBuffer, validateUpload } from '@/lib/cloudinary';
import { logActivity } from '@/lib/activity';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const user = await requireCapability('media:manage');
    if (!rateLimit(`upload:${user.id}`, 30, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const form = await req.formData();
    const file = form.get('file') as File | null;
    const folder = (form.get('folder') as string) || 'general';
    const alt = (form.get('alt') as string) || null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    validateUpload(file);
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBuffer(buffer, folder, file.name);

    const media = must(await sb().from('media').insert({
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      width: result.width ?? null,
      height: result.height ?? null,
      bytes: result.bytes,
      folder,
      alt,
    }).select('*').single());

    await logActivity(user.id, 'media.uploaded', `${file.name} → ${result.public_id}`);
    return NextResponse.json({ media });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    const status = msg === 'Unauthorized' ? 401 : msg === 'Forbidden' ? 403 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
