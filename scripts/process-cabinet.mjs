// Process all 24 cabinet items: sharp center-crop → square 1200×1200 +
// thumb 600×600. Reads scripts/cabinet-manifest.json, writes outputs to
// public/cabinet/items/<slug>.jpg (and -thumb.jpg).
import sharp from 'sharp';
import { readFileSync, statSync, mkdirSync } from 'fs';
import path from 'path';

const SRC = 'C:/Users/ajotr/OneDrive/Desktop/TreasureTroveFinds/Real Shop Photos';
const OUT = 'public/cabinet/items';
mkdirSync(OUT, { recursive: true });

const manifest = JSON.parse(readFileSync('scripts/cabinet-manifest.json', 'utf8'));

const FINISH = (p, q = 85) => p
  .normalise()
  .modulate({ saturation: 1.08, brightness: 1.01 })
  .linear(1.04, -4)
  .sharpen({ sigma: 0.9, m1: 0.5, m2: 1.8 })
  .jpeg({ quality: q, mozjpeg: true, chromaSubsampling: '4:4:4' });

for (const item of manifest) {
  const srcPath = path.join(SRC, item.src);
  const fullPath = path.join(OUT, `${item.slug}.jpg`);
  const thumbPath = path.join(OUT, `${item.slug}-thumb.jpg`);
  try {
    // Square 1200x1200 center-crop for modal view
    await FINISH(
      sharp(srcPath).rotate().resize(1200, 1200, { fit: 'cover', position: 'center' })
    ).toFile(fullPath);
    // Smaller 600x600 thumb for grid view
    await FINISH(
      sharp(srcPath).rotate().resize(600, 600, { fit: 'cover', position: 'center' }), 82
    ).toFile(thumbPath);
    const full = (statSync(fullPath).size / 1024).toFixed(0);
    const thumb = (statSync(thumbPath).size / 1024).toFixed(0);
    console.log(`OK ${item.slug.padEnd(28)} ${full}KB / ${thumb}KB`);
  } catch (e) {
    console.log(`FAIL ${item.slug}: ${e.message}`);
  }
}
console.log(`Done. ${manifest.length} items processed.`);
