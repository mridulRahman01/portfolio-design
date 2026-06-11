import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import path from 'path';

const SRC = 'public/ezgif-split';
const OUT = 'public/frames';
const TOTAL = 42; // only the frames ScrollSequence actually uses

await mkdir(OUT, { recursive: true });

let totalBytes = 0;
for (let i = 0; i < TOTAL; i++) {
  const n = String(i).padStart(2, '0');
  const src = path.join(SRC, `frame_${n}_delay-0.066s.png`);
  const out = path.join(OUT, `frame_${n}.webp`);
  const info = await sharp(src)
    .resize({ width: 1440, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(out);
  totalBytes += info.size;
  console.log(`${n}: ${(info.size / 1024).toFixed(0)} KB`);
}
console.log(`Total: ${(totalBytes / 1024 / 1024).toFixed(2)} MB for ${TOTAL} frames`);

// Hero background: 1.9 MB PNG -> WebP
const bg = await sharp('public/Assets/3.png')
  .resize({ width: 1920, withoutEnlargement: true })
  .webp({ quality: 78 })
  .toFile('public/Assets/hero-bg.webp');
console.log(`hero-bg.webp: ${(bg.size / 1024).toFixed(0)} KB`);
