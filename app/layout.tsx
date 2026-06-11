import type { Metadata, Viewport } from 'next';
import { Sora, Manrope, Playfair_Display, Dancing_Script } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { getSeo } from '@/lib/content';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  weight: ['600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#121212',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();
  return {
    metadataBase: new URL(seo.siteUrl),
    title: { default: seo.siteTitle, template: '%s — Alif Hosain' },
    description: seo.siteDescription,
    keywords: seo.keywords?.split(',').map(k => k.trim()),
    authors: [{ name: 'Alif Hosain' }],
    creator: 'Alif Hosain',
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      url: seo.siteUrl,
      title: seo.siteTitle,
      description: seo.siteDescription,
      siteName: 'Alif Hosain',
      locale: 'en_US',
      images: seo.ogImage ? [{ url: seo.ogImage, alt: seo.siteTitle }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.siteTitle,
      description: seo.siteDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    robots: seo.robotsIndex
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } }
      : { index: false, follow: false },
    ...(seo.gscVerification ? { verification: { google: seo.gscVerification } } : {}),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seo = await getSeo();
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${playfair.variable} ${dancing.variable}`}>
      <body>
        {children}
        {seo.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${seo.gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${seo.gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
