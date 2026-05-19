// Resize winning Gemini brand assets to web-appropriate sizes.
// Outputs go to public/brand/<name>.png (drops the -vN suffix).
import sharp from 'sharp';
import { statSync } from 'fs';

const jobs = [
  { src: 'public/brand/sunburst-seal-v2.png', out: 'public/brand/sunburst-seal.png', w: 480 },
  { src: 'public/brand/wax-seal-v2.png',      out: 'public/brand/wax-seal.png',      w: 520 },
  { src: 'public/brand/brass-divider-v2.png', out: 'public/brand/brass-divider.png', w: 900 },
  // Favicon-friendly square crop of the seal
  { src: 'public/brand/sunburst-seal-v2.png', out: 'public/brand/favicon-512.png',   w: 512, square: true },
];

for (const j of jobs) {
  let pipe = sharp(j.src).rotate();
  if (j.square) {
    // Tight square crop on the seal — assume Gemini centered the medallion
    pipe = pipe.resize({ width: j.w, height: j.w, fit: 'cover', position: 'center' });
  } else {
    pipe = pipe.resize({ width: j.w, withoutEnlargement: false });
  }
  await pipe.png({ compressionLevel: 9, palette: false }).toFile(j.out);
  console.log(`OK ${j.out}  ${(statSync(j.out).size/1024).toFixed(0)}KB`);
}
console.log('Done.');
