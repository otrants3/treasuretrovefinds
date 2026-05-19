// v2: smarter crops — let CSS handle hero composition; manual focal crops for tags
import sharp from 'sharp';
import { mkdirSync, statSync } from 'fs';
import path from 'path';

const SRC = 'C:/Users/ajotr/OneDrive/Desktop/TreasureTroveFinds/Real Shop Photos';
const OUT = 'C:/Users/ajotr/TreasureTroveFinds/public/shop';
mkdirSync(OUT, { recursive: true });

// HERO LAYERS — resize only, no crop. Let CSS object-cover compose per viewport.
const heroJobs = [
  { src: '1000011950.jpg.jpeg', out: 'hero-aisle.jpg', maxEdge: 2400 },
  { src: '1000011944.jpg.jpeg', out: 'hero-cabinet.jpg', maxEdge: 2400 },
  { src: 'IMG_20260518_185231.jpg', out: 'hero-tags.jpg', maxEdge: 2400 },
  // Backup hero candidates
  { src: '1000011953.jpg.jpeg', out: 'hero-firetrucks.jpg', maxEdge: 2400 },
  { src: '1000011949.jpg.jpeg', out: 'hero-aisle-wide.jpg', maxEdge: 2400 },
];

// PORTRAIT — Bill at the case
const portraitJobs = [
  { src: '20260516_122449.jpg', out: 'bill-at-case.jpg', w: 1400, h: 1750, fit: 'cover', position: 'center' },
];

// RECORD section — manual centered crops, no smart algorithm
const recordJobs = [
  { src: 'IMG_20260518_185231.jpg', out: 'record-crocks.jpg', w: 1200, h: 1500, fit: 'cover', position: 'center' },
  { src: 'IMG_20260518_185233 (30).jpg', out: 'record-locks.jpg', w: 1200, h: 1500, fit: 'cover', position: 'center' },
  { src: 'IMG_20260518_185234.jpg', out: 'record-buckle.jpg', w: 1200, h: 1500, fit: 'cover', position: 'center' },
  // Backups
  { src: 'IMG_20260518_185231 (1).jpg', out: 'record-bluebottle.jpg', w: 1200, h: 1500, fit: 'cover', position: 'center' },
  { src: '20260516_122116.jpg', out: 'record-perfume.jpg', w: 1200, h: 1500, fit: 'cover', position: 'center' },
];

const pieceJobs = [
  { src: '20260516_122116.jpg', out: 'piece-perfume-bottle.jpg', w: 1400, h: 1750, fit: 'cover', position: 'center' },
];

const bannerJobs = [
  { src: '1000011949.jpg.jpeg', out: 'banner-aisle.jpg', maxEdge: 2400 },
];

// v3: real cleanup — unsharp mask, normalize tones, mild contrast/saturation,
// higher JPEG quality. These are phone snaps under mall fluorescents — they
// need bite and contrast, not more compression.
const FINISH = (pipeline) => pipeline
  .normalise()              // stretch tonal range so the photo isn't flat
  .modulate({ saturation: 1.08, brightness: 1.02 })  // pop the colors a touch
  .linear(1.06, -6)         // mild contrast curve
  .sharpen({ sigma: 1.0, m1: 0.5, m2: 2.0 })  // crisp edges without halos
  .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' });

async function resizeMax(srcPath, outPath, maxEdge) {
  await FINISH(
    sharp(srcPath)
      .rotate()
      .resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
  ).toFile(outPath);
}

async function cropExact(srcPath, outPath, w, h, fit, position) {
  await FINISH(
    sharp(srcPath)
      .rotate()
      .resize(w, h, { fit, position })
  ).toFile(outPath);
}

const all = [
  ...heroJobs.map(j => ({ ...j, type: 'resize' })),
  ...bannerJobs.map(j => ({ ...j, type: 'resize' })),
  ...portraitJobs.map(j => ({ ...j, type: 'crop' })),
  ...recordJobs.map(j => ({ ...j, type: 'crop' })),
  ...pieceJobs.map(j => ({ ...j, type: 'crop' })),
];

for (const job of all) {
  const srcPath = path.join(SRC, job.src);
  const outPath = path.join(OUT, job.out);
  try {
    if (job.type === 'resize') {
      await resizeMax(srcPath, outPath, job.maxEdge);
    } else {
      await cropExact(srcPath, outPath, job.w, job.h, job.fit, job.position);
    }
    const size = (statSync(outPath).size / 1024).toFixed(0);
    console.log(`OK  ${job.out}  ${size}KB`);
  } catch (e) {
    console.log(`FAIL ${job.src}: ${e.message}`);
  }
}
console.log('Done.');
