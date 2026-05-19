// Try 3 illustration styles on a single item to pick a winner.
// Reference photo: public/cabinet/items/perfume-bottle.jpg
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
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

const OUT = 'public/cabinet/style-tests';
mkdirSync(OUT, { recursive: true });

const ref = readFileSync('public/cabinet/items/perfume-bottle.jpg').toString('base64');

const styles = [
  {
    name: 'pen-ink',
    prompt: `Reference the provided photograph of a small antique ornate perfume bottle with pink cabochons and a Marie Antoinette miniature portrait. Now redraw it as a vintage 1920s mail-order catalog illustration. Pure black ink line drawing with fine cross-hatched shading on plain warm aged cream paper (#F2E8D0 — completely solid color, no texture). The item is centered, accurately drawn matching the reference proportions and details. No color anywhere, only black ink on cream. No text, no labels, no border. Square 1:1 aspect ratio. The bottle fills about 70% of the frame. Looks like an engraved plate from an antique merchant catalog.`,
  },
  {
    name: 'watercolor',
    prompt: `Reference the provided photograph of a small antique ornate perfume bottle with pink cabochons and a Marie Antoinette miniature portrait. Now redraw it as a soft 1900s natural-history watercolor study. Loose washes of muted antique color — sepia browns, rose pinks, dusty blue — on plain warm aged cream paper (#F2E8D0 — completely solid color, no texture). The item is centered, accurately drawn matching reference proportions. Faint pencil under-drawing visible. No text, no labels, no border. Square 1:1 aspect ratio. The bottle fills about 70% of the frame. Looks like a page from an Edwardian naturalist's collecting album.`,
  },
  {
    name: 'sepia-ghost',
    prompt: `Reference the provided photograph of a small antique ornate perfume bottle with pink cabochons and a Marie Antoinette miniature portrait. Now redraw it as a faded sepia-toned photograph from the 1890s, like a turn-of-the-century product daguerreotype. Heavy vignetting, deep sepia browns, soft focus halation, slight emulsion grain. Plain warm aged cream paper (#F2E8D0) showing at the edges. The item is centered, accurately matching the reference proportions and details. No color other than sepia tones. No text, no labels. Square 1:1. The bottle fills about 70% of the frame.`,
  },
];

for (const s of styles) {
  const outPath = path.join(OUT, `perfume-bottle-${s.name}.png`);
  if (existsSync(outPath)) { console.log(`SKIP ${outPath} (exists)`); continue; }
  const body = {
    contents: [{
      role: 'user',
      parts: [
        { text: s.prompt },
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
      console.log(`FAIL ${s.name} ${r.status}: ${txt.slice(0, 300)}`);
      continue;
    }
    const j = await r.json();
    const part = j?.candidates?.[0]?.content?.parts?.find(p => p?.inlineData?.data);
    const data = part?.inlineData?.data;
    if (!data) { console.log(`FAIL ${s.name}: no image`); continue; }
    writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log(`OK ${s.name}  ${(Buffer.from(data, 'base64').length/1024).toFixed(0)}KB  ${((Date.now()-t0)/1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`ERR ${s.name}: ${e.message}`);
  }
}
console.log('Done.');
