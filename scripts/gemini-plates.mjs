// Generate pen-and-ink catalog-plate illustrations for all 24 cabinet items.
// Each item's photo is sent as a reference. Output → public/cabinet/plates/<slug>.png
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import path from 'path';

const ENV_PATH = path.resolve('.env.local');
if (existsSync(ENV_PATH)) {
  for (const line of readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${KEY}`;

const OUT = 'public/cabinet/plates';
mkdirSync(OUT, { recursive: true });

const items = JSON.parse(readFileSync('src/data/cabinet.json', 'utf8'));

function buildPrompt(itemName, displayName) {
  return `Reference the provided photograph of "${displayName}" — a ${itemName} from an antique mall booth. Now redraw it as a vintage 1920s mail-order catalog illustration: pure black ink line drawing with fine cross-hatched shading on plain warm aged cream paper (#F2E8D0 — completely solid color, no texture, no border). The item is centered, accurately drawn matching the reference proportions, details, and recognizable features. NO color anywhere, only black ink on cream cream paper. NO text, NO labels, NO captions, NO color swatches, NO color hex codes — just the illustration. Square 1:1 aspect ratio. The item fills about 75% of the frame. The result should look like a single engraved plate from a Sears Roebuck antique merchant catalog circa 1925.`;
}

let totalCost = 0;
for (const item of items) {
  const refPath = `public/cabinet/items/${item.slug}.jpg`;
  const outPath = path.join(OUT, `${item.slug}.png`);
  if (existsSync(outPath)) { console.log(`SKIP ${item.slug}`); continue; }
  if (!existsSync(refPath)) { console.log(`MISS ${item.slug} no ref`); continue; }
  const ref = readFileSync(refPath).toString('base64');
  const body = {
    contents: [{
      role: 'user',
      parts: [
        { text: buildPrompt(item.itemName, item.displayName) },
        { inlineData: { mimeType: 'image/jpeg', data: ref } },
      ],
    }],
  };
  try {
    const t0 = Date.now();
    const r = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const txt = await r.text();
      console.log(`FAIL ${item.slug} ${r.status}: ${txt.slice(0, 200)}`);
      continue;
    }
    const j = await r.json();
    const part = j?.candidates?.[0]?.content?.parts?.find(p => p?.inlineData?.data);
    const data = part?.inlineData?.data;
    if (!data) {
      const why = j?.candidates?.[0]?.finishReason || 'unknown';
      console.log(`FAIL ${item.slug} no image (${why})`);
      continue;
    }
    const buf = Buffer.from(data, 'base64');
    writeFileSync(outPath, buf);
    totalCost += 0.04;
    console.log(`OK ${item.slug.padEnd(28)} ${(buf.length/1024).toFixed(0)}KB  ${((Date.now()-t0)/1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`ERR ${item.slug}: ${e.message}`);
  }
}
console.log(`\nDone. ~$${totalCost.toFixed(2)} spent.`);
