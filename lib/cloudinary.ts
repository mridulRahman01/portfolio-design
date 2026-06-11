import 'server-only';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

const ALLOWED_FORMATS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif']);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateUpload(file: { size: number; type: string }) {
  if (file.size > MAX_BYTES) throw new Error('File exceeds 10 MB limit');
  const ext = file.type.split('/')[1]?.replace('+xml', '');
  if (!file.type.startsWith('image/') || !ALLOWED_FORMATS.has(ext)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
}

export async function uploadBuffer(buffer: Buffer, folder: string, filename?: string) {
  return new Promise<{
    public_id: string; secure_url: string; format: string;
    width?: number; height?: number; bytes: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${folder.replace(/[^a-z0-9-_/]/gi, '')}`,
        public_id: filename?.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]/gi, '-'),
        resource_type: 'image',
        // Automatic optimization: Cloudinary serves f_auto/q_auto via URL transforms
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (err, result) => (err || !result ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

/** Thumbnail URL via on-the-fly Cloudinary transformation. */
export function thumbUrl(url: string, w = 300) {
  return url.replace('/upload/', `/upload/c_fill,w_${w},q_auto,f_auto/`);
}
