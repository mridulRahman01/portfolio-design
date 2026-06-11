'use client';

import { useState, useTransition } from 'react';
import { saveSeo } from '@/app/actions/seo';
import { Card, Field, inputCls, Btn } from '@/components/admin/ui';

type SeoValues = {
  siteTitle: string; siteDescription: string; keywords: string; ogImage: string;
  siteUrl: string; robotsIndex: boolean; gaId: string; gscVerification: string;
};

export function SeoForm({ seo }: { seo: SeoValues }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      try {
        await saveSeo({
          siteTitle: fd.get('siteTitle'),
          siteDescription: fd.get('siteDescription'),
          keywords: fd.get('keywords'),
          ogImage: fd.get('ogImage'),
          siteUrl: fd.get('siteUrl'),
          robotsIndex: fd.get('robotsIndex') === 'on',
          gaId: fd.get('gaId'),
          gscVerification: fd.get('gscVerification'),
        });
        setMsg('Saved ✓');
        setTimeout(() => setMsg(null), 2500);
      } catch (err) {
        setMsg(err instanceof Error ? err.message : 'Save failed');
      }
    });
  }

  return (
    <Card>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Site title">
            <input name="siteTitle" defaultValue={seo.siteTitle} className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Site description">
            <textarea name="siteDescription" defaultValue={seo.siteDescription} className={`${inputCls} h-24 resize-y`} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Keywords" hint="Comma-separated">
            <input name="keywords" defaultValue={seo.keywords} className={inputCls} />
          </Field>
        </div>
        <Field label="Site URL" hint="Used for canonical URLs, sitemap and OG tags">
          <input name="siteUrl" defaultValue={seo.siteUrl} className={inputCls} />
        </Field>
        <Field label="Default OG image URL">
          <input name="ogImage" defaultValue={seo.ogImage} className={inputCls} />
        </Field>
        <Field label="Google Analytics ID" hint="e.g. G-XXXXXXXXXX — script is injected automatically">
          <input name="gaId" defaultValue={seo.gaId} className={inputCls} />
        </Field>
        <Field label="Search Console verification" hint="google-site-verification meta content">
          <input name="gscVerification" defaultValue={seo.gscVerification} className={inputCls} />
        </Field>
        <label className="flex items-center gap-2.5 text-sm font-semibold text-white/70 sm:col-span-2">
          <input type="checkbox" name="robotsIndex" defaultChecked={seo.robotsIndex} className="h-4 w-4 accent-[#00F5B8]" />
          Allow search engines to index the site
        </label>
        <div className="flex items-center gap-3 sm:col-span-2">
          <Btn type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save SEO Settings'}</Btn>
          {msg && <span className={`text-sm ${msg.includes('✓') ? 'text-[#00F5B8]' : 'text-red-400'}`}>{msg}</span>}
        </div>
      </form>
    </Card>
  );
}
