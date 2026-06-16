import { getCv } from '@/lib/content';
import { CvManager } from '@/components/admin/CvManager';

export const dynamic = 'force-dynamic';

export default async function CvContentPage() {
  const cv = await getCv();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">CV / Resume</h1>
      <CvManager initialUrl={cv.url} />
    </div>
  );
}
