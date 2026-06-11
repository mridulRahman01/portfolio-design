import sharp from 'sharp';
import { mkdir } from 'fs/promises';

const SRC = 'C:/Users/mridu/Downloads';
const OUT = 'public/Assets/results';
await mkdir(OUT, { recursive: true });

const FILES = [
  // [source, output, targetWidth]
  ['WhatsApp Image 2026-06-11 at 7.48.00 PM.jpeg', 'stripe-desktop.webp', 1400],
  ['WhatsApp Image 2026-06-11 at 7.48.01 PM.jpeg', 'google-ads.webp', 1400],
  ['WhatsApp Image 2026-06-11 at 7.48.01 PM (1).jpeg', 'impact-dashboard.webp', 1400],
  ['WhatsApp Image 2026-06-11 at 7.48.01 PM (2).jpeg', 'affiliate-mobile.webp', 660],
  ['WhatsApp Image 2026-06-11 at 7.48.02 PM.jpeg', 'stripe-mobile-light.webp', 660],
  ['WhatsApp Image 2026-06-11 at 7.48.02 PM (1).jpeg', 'stripe-mobile-dark.webp', 660],
];

for (const [src, out, width] of FILES) {
  const info = await sharp(`${SRC}/${src}`)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(`${OUT}/${out}`);
  console.log(`${out}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
}
