// Swap selected Gemini-cleaned outputs over the originals.
// Keeps a backup at <name>.pre-gemini.jpg in case we want to revert.
// Re-encodes through sharp to drop 2.5MB Gemini raw → ~500KB optimized.
import sharp from 'sharp';
import { renameSync, existsSync, unlinkSync, statSync } from 'fs';
import path from 'path';

const OUT = 'public/shop';

// Manual whitelist — only the photos where Gemini won.
// Crocks: hallucinated. Hero set: downsized. Bill: don't AI-redraw a real person. Locks: refused.
const SWAPS = ['piece-perfume-bottle', 'piece-ge-fan', 'record-buckle'];

// Rejects to delete (Gemini outputs we won't use)
const REJECTS = ['hero-aisle-gemini.jpg', 'hero-cabinet-gemini.jpg', 'hero-tags-gemini.jpg', 'bill-at-case-gemini.jpg', 'record-crocks-gemini.jpg'];

for (const stem of SWAPS) {
  const src = path.join(OUT, `${stem}-gemini.jpg`);
  const dst = path.join(OUT, `${stem}.jpg`);
  const bak = path.join(OUT, `${stem}.pre-gemini.jpg`);
  if (!existsSync(src)) { console.log(`SKIP ${stem} — no gemini output`); continue; }
  if (existsSync(dst) && !existsSync(bak)) renameSync(dst, bak);
  // Re-encode through sharp: light sharpen + q=85 to slim down
  await sharp(src)
    .sharpen({ sigma: 0.6, m1: 0.5, m2: 1.2 })
    .jpeg({ quality: 85, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(dst);
  unlinkSync(src);
  const before = statSync(bak).size / 1024;
  const after = statSync(dst).size / 1024;
  console.log(`SWAP ${stem}.jpg   sharp ${before.toFixed(0)}KB → gemini ${after.toFixed(0)}KB`);
}

for (const name of REJECTS) {
  const p = path.join(OUT, name);
  if (existsSync(p)) { unlinkSync(p); console.log(`DROP ${name}`); }
}

console.log('Done.');
