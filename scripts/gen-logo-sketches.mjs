// One-off exploration script: generates raster logo SKETCHES with Gemini.
// These are idea-starters only. Production logos are vectors, built elsewhere.
// Run: NODE_OPTIONS="--use-system-ca" node scripts/gen-logo-sketches.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const ENV = path.resolve(ROOT, '..', '..', '..', '.env.local');
const envText = fs.readFileSync(fs.existsSync(ENV) ? ENV : path.join(ROOT, '.env.local'), 'utf8');
const KEY = envText.match(/GEMINI_API_KEY=(\S+)/)[1];
const MODEL = 'gemini-2.5-flash-image';
const OUT = path.join(ROOT, 'public', 'brand', 'logos2', 'sketches');
fs.mkdirSync(OUT, { recursive: true });

// Shared style clause appended to every prompt. Two colours max, flat, small-size legible.
const STYLE =
  'Flat vector logo design, two colours maximum, solid shapes only, no gradients, no 3D, ' +
  'no photorealism, no drop shadows, no texture, centred on a plain cream background, ' +
  'high contrast, simple enough to read at small size, professional brand mark. ' +
  'Palette: deep warm near-black, muted brick red, cream.';
const NOTEXT = ' Absolutely NO text, NO letters, NO lettering, NO words anywhere in the image.';

// Long Island geography, described so the model has a chance of getting the shape right.
const LI =
  'Long Island, New York: a long narrow horizontal landmass, wide and rounded at the west end, ' +
  'tapering eastward and splitting into two slender parallel forks (the North Fork and the South Fork) ' +
  'separated by a narrow bay, the lower fork ending in a small hook';

const DIRECTIONS = [
  {
    id: 'island-key',
    prompts: [
      `A logo mark of an antique skeleton key whose shaft is the silhouette of ${LI}. The two eastern forks of the island form the toothed bit of the key at the right end, and a round ornate key ring sits at the west end. Single continuous solid silhouette, horizontal composition.${NOTEXT} ${STYLE}`,
      `Minimal logo: the silhouette of ${LI} rendered as a key lying horizontally, deep near-black island shape with a brick red circular bow ring on the left, the forked east end reading unmistakably as key teeth. Bold thick shapes, no fine detail.${NOTEXT} ${STYLE}`,
      `Emblem logo inside a thin circular brick red border: a solid near-black key made from ${LI}, ring at the far west, forked teeth at the far east. Balanced, symmetrical framing, small decorative notch under the shaft.${NOTEXT} ${STYLE}`,
    ],
  },
  {
    id: 'keyhole-negative',
    prompts: [
      `A classic antique keyhole shape, solid deep near-black, with the negative space cut out in the exact silhouette of ${LI}. The island appears as cream-coloured empty space inside the black keyhole. Single icon, vertical composition.${NOTEXT} ${STYLE}`,
      `Logo mark: a rounded brick red escutcheon keyhole plate, and the hole itself is shaped like ${LI} in cream negative space, the two forks pointing right. Bold, flat, iconic, no ornament.${NOTEXT} ${STYLE}`,
      `A keyhole whose upper circle and lower tapering slot are formed by the coastline of ${LI}, near-black on cream, the two eastern forks becoming the bottom of the keyhole slot. Clever silhouette puzzle, one solid shape.${NOTEXT} ${STYLE}`,
    ],
  },
  {
    id: 'tag',
    prompts: [
      `A manila shipping tag hanging by a short string, flat vector, with the solid silhouette of ${LI} stamped across the face of the tag in brick red, and the tag's reinforced eyelet hole at the top. Slight tilt, bold clean edges.${NOTEXT} ${STYLE}`,
      `Logo icon of a rectangular parcel tag with an angled top corner, near-black outline, containing the horizontal silhouette of ${LI}, and the tag's punched hole doubling as a small keyhole. Flat, geometric, no shading.${NOTEXT} ${STYLE}`,
      `Two overlapping antique price tags seen straight on, one brick red one cream, the top tag carrying a solid near-black silhouette of ${LI}, string looped through the eyelets. Simple flat shapes, strong outline.${NOTEXT} ${STYLE}`,
    ],
  },
  {
    id: 'chest',
    prompts: [
      `A logo of an antique steamer trunk seen from the front, flat vector, near-black with brick red banding, and the brass lock plate on the front is shaped exactly like the silhouette of ${LI}. Symmetrical, iconic, chunky shapes.${NOTEXT} ${STYLE}`,
      `Minimal treasure chest icon with a domed lid, solid brick red body, and a single cream keyhole plate on the front whose outline is the silhouette of ${LI} with its two forks. Very simplified, no rivets, no wood grain.${NOTEXT} ${STYLE}`,
      `A small antique chest drawn as a flat geometric badge, near-black, its lid line and body reduced to three bars, with an island-shaped keyhole cutout in the centre matching ${LI}. Bold small-size legibility.${NOTEXT} ${STYLE}`,
    ],
  },
  {
    id: 'forks-abstract',
    prompts: [
      `An abstract minimal logo mark made only from the two eastern forks of Long Island: two long slender tapering shapes running left to right, nearly parallel, the upper one straight and the lower one ending in a small hook, separated by a thin cream gap. Solid near-black, one brick red accent tip. Pure abstract mark.${NOTEXT} ${STYLE}`,
      `Two tapering blades forming a narrow V that opens to the right, derived from the North Fork and South Fork of Long Island, rendered as one confident brick red shape on cream. Modern, sharp, extremely simple, like a monoline mark thickened.${NOTEXT} ${STYLE}`,
      `Abstract logo: two elongated forked prongs reading simultaneously as the east end of Long Island and as the bit of a key, near-black solid shapes with a single circular brick red dot to their left. Tight, minimal, high contrast.${NOTEXT} ${STYLE}`,
    ],
  },
  {
    id: 'monogram',
    prompts: [
      `A monogram logo of the three capital letters T T F in a bold vintage slab serif, arranged in a horizontal row, with the crossbar of the middle T replaced by the solid horizontal silhouette of ${LI}. Near-black letters, brick red island. Clean, correct, well spaced letterforms.${STYLE}`,
      `A circular badge monogram: the letters T T F stacked and interlocked in a heavy antique serif, near-black, sitting above a small brick red silhouette of ${LI}. Only the letters T, T and F appear, spelled correctly, nothing else.${STYLE}`,
      `Monogram mark where a single bold letter T and letter F flank a central letter T, and the negative space beneath them forms the narrow forked silhouette of ${LI}. Brick red and near-black on cream, letters crisp and legible.${STYLE}`,
    ],
  },
];

const jobs = [];
DIRECTIONS.forEach((d) => d.prompts.forEach((p) => jobs.push({ dir: d.id, prompt: p })));

async function generate(job, idx) {
  const n = String(idx + 1).padStart(2, '0');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: job.prompt }] }],
          generationConfig: { responseModalities: ['IMAGE'] },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const img = parts.find((p) => p.inlineData?.data);
      if (!img) throw new Error('no image part returned: ' + JSON.stringify(data).slice(0, 300));
      const file = path.join(OUT, `sketch-${n}.png`);
      fs.writeFileSync(file, Buffer.from(img.inlineData.data, 'base64'));
      console.log(`OK  sketch-${n}.png  [${job.dir}]`);
      return { file: `sketch-${n}.png`, ...job, ok: true };
    } catch (e) {
      console.log(`RETRY ${attempt} sketch-${n}: ${e.message.slice(0, 160)}`);
      if (attempt === 3) return { file: `sketch-${n}.png`, ...job, ok: false, error: e.message };
      await new Promise((r) => setTimeout(r, 4000 * attempt));
    }
  }
}

const results = [];
for (let i = 0; i < jobs.length; i++) {
  results.push(await generate(jobs[i], i));
  await new Promise((r) => setTimeout(r, 1200)); // be polite to the quota
}
fs.writeFileSync(path.join(OUT, '_results.json'), JSON.stringify(results, null, 2));
console.log(`\nDone: ${results.filter((r) => r.ok).length}/${jobs.length}`);
