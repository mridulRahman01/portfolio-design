import { sb } from '@/lib/db';
import { MediaGrid } from '@/components/admin/MediaGrid';

export const dynamic = 'force-dynamic';

type MediaRow = {
  id: string; url: string; publicId: string; format: string;
  folder: string; alt: string | null; bytes: number;
  width: number | null; height: number | null;
};

export default async function MediaPage({ searchParams }: { searchParams: { q?: string; folder?: string } }) {
  const q = searchParams.q?.trim() ?? '';
  const folder = searchParams.folder?.trim() ?? '';

  let items: MediaRow[] = [];
  let folders: string[] = [];
  try {
    let query = sb().from('media').select('*')
      .order('createdAt', { ascending: false }).limit(100);
    if (folder) query = query.eq('folder', folder);
    if (q) {
      const safe = q.replace(/[%,()]/g, '');
      query = query.or(`publicId.ilike.%${safe}%,alt.ilike.%${safe}%`);
    }
    const [itemsRes, foldersRes] = await Promise.all([
      query,
      sb().from('media').select('folder'),
    ]);
    if (!itemsRes.error) items = (itemsRes.data ?? []) as MediaRow[];
    if (!foldersRes.error) {
      folders = Array.from(new Set((foldersRes.data ?? []).map(f => f.folder as string))).sort();
    }
  } catch {
    // Supabase unavailable
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Media Library</h1>
        <p className="mt-1 text-sm text-white/40">
          Images are stored on Cloudinary and optimized automatically (WebP/AVIF, quality auto).
        </p>
      </div>
      <MediaGrid items={items} folders={folders} activeFolder={folder} q={q} />
    </div>
  );
}
