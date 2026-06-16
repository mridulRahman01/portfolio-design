import { getIntro } from '@/lib/content';
import { IntroToggle } from '@/components/admin/IntroToggle';

export const dynamic = 'force-dynamic';

export default async function IntroContentPage() {
  const intro = await getIntro();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Intro Animation</h1>
      <IntroToggle initial={intro.enabled} />
    </div>
  );
}
