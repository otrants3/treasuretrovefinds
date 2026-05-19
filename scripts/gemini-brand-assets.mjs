// Generate custom brand assets via Gemini 2.5 Flash Image.
// Outputs go to public/brand/<name>-<variant>.png.
// Two variants per asset so we can A/B pick the better one.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

// Load .env.local
const ENV_PATH = path.resolve('.env.local');
if (existsSync(ENV_PATH)) {
  for (const line of readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('No GEMINI_API_KEY'); process.exit(1); }

const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${KEY}`;
const OUT = 'public/brand';
mkdirSync(OUT, { recursive: true });

// Brand color hints repeated in every prompt so output stays on-palette
const PALETTE = "warm aged cream background (#F2E8D0), antique brass tone (#C9A227), oxblood red (#9E2A2B), warm ink black (#1A1614).";

const ASSETS = [
  {
    name: 'sunburst-seal',
    variants: [
      `A square photograph of a single antique brass medallion seal, about 3 inches across, lying flat on a plain warm aged cream paper background (#F2E8D0 exactly, perfectly uniform, no other objects, no fold lines). The medallion has a 16-point engraved sunburst pattern radiating from a smooth circular center bezel. The center bezel is engraved with the bold serif letters "TTF" stacked above a curved engraved ribbon banner that reads "EST. 1973". Real raised metal with aged patina, slight oxidation in the recesses, soft natural daylight from the upper-left producing very faint shadow on the cream paper. Catalog photography, hyperdetailed, centered, the medallion fills about 75% of the square frame. No additional objects, no text outside the medallion, no border, no caption.`,
      `Top-down catalog photograph of a vintage brass merchant seal, circular, 3 inches diameter, on plain cream paper (#F2E8D0, completely solid color). Sixteen pointed brass rays radiate outward from a central round disk. The disk is deeply struck with the monogram "TTF" in an art-deco serif, with the words "EST · 1973" curving along the lower rim. Brass shows authentic age, faint verdigris in the engraving lines, polished high points. Soft even diffuse daylight, minimal shadow. The seal is centered and fills the square frame at roughly 80%. No other elements at all. No border. Square 1:1.`,
    ],
  },
  {
    name: 'brass-divider',
    variants: [
      `A long thin horizontal antique brass ornamental rule, about 8 inches wide by 0.6 inches tall, lying on a plain warm aged cream paper background (#F2E8D0 perfectly uniform). The brass rule is engraved with delicate art-deco sunburst flourishes flanking a central engraved diamond motif. Real metal with light patina, soft natural lighting, slight shadow under the brass. Centered in the frame. The rule fills the frame horizontally edge to edge. No other objects. Catalog photography, hyperdetailed.`,
      `Horizontal pressed-brass ornamental divider strip, 10 inches by 0.5 inches, on plain cream paper background (#F2E8D0 exactly, fully solid). The strip has a slim center bar flanked by two small radiating sunburst medallions, then tapers to sharp points at each end. Aged brass with engraved fine line detail. Even diffuse lighting. The divider spans the full width of the frame, centered vertically. Plain cream around it. No text, no other objects. Wide aspect ratio.`,
    ],
  },
  {
    name: 'wax-seal',
    variants: [
      `Top-down catalog photograph of a single dark oxblood-red wax seal (#9E2A2B) stamped onto plain warm cream paper (#F2E8D0 exactly, perfectly uniform). The wax disk is about 1.5 inches across with natural irregular dripped edges and small bubbles. The wax is impressed with a clean stamp showing the serif letters "TTF" stacked above a curved ribbon reading "BOOTH №18". Slight shadow under the wax. Soft natural daylight. The seal is centered and fills about 55% of the square frame. No other text or objects on the paper. Square 1:1.`,
      `A close-up overhead photograph of a deep red wax seal on cream paper (#F2E8D0 solid). The seal is an irregular pour about 40mm wide, deep oxblood color (#9E2A2B), with the embossed mark "TTF · №18" in a serif typeface inside a thin embossed border ring. Real wax texture, slight surface sheen, gentle shadow. Plain cream paper around. Centered. Square aspect ratio. Catalog photography quality.`,
    ],
  },
];

for (const asset of ASSETS) {
  for (let i = 0; i < asset.variants.length; i++) {
    const outPath = path.join(OUT, `${asset.name}-v${i + 1}.png`);
    if (existsSync(outPath)) { console.log(`SKIP ${outPath} (exists)`); continue; }
    const body = {
      contents: [{ role: 'user', parts: [{ text: PALETTE + ' ' + asset.variants[i] }] }],
    };
    try {
      const t0 = Date.now();
      const r = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const text = await r.text();
        console.log(`FAIL ${asset.name} v${i + 1}: ${r.status} ${text.slice(0, 300)}`);
        continue;
      }
      const j = await r.json();
      const part = j?.candidates?.[0]?.content?.parts?.find(p => p?.inlineData?.data);
      const data = part?.inlineData?.data;
      if (!data) {
        console.log(`FAIL ${asset.name} v${i + 1}: no image`, JSON.stringify(j).slice(0, 300));
        continue;
      }
      const buf = Buffer.from(data, 'base64');
      writeFileSync(outPath, buf);
      console.log(`OK   ${asset.name}-v${i + 1}.png  ${(buf.length / 1024).toFixed(0)}KB  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    } catch (e) {
      console.log(`ERR  ${asset.name} v${i + 1}: ${e.message}`);
    }
  }
}
console.log('Done.');
