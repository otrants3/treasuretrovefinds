// Generate ONE backdrop image for the /showcase page: an open antique
// wooden display cabinet with glass doors swung open, 4 empty wooden
// shelves visible. We'll CSS-overlay the catalog plate illustrations
// onto the shelves as clickable hotspots.
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

const OUT = 'public/cabinet/showcase';
mkdirSync(OUT, { recursive: true });

const variants = [
  {
    name: 'v1-warm',
    prompt: `A wide horizontal photograph of an antique 1920s American oak wood display cabinet, photographed straight-on from the front, both glass doors open at slight angles, revealing four empty wooden shelves inside. The cabinet has brass corner brackets and small brass hardware. The interior wood is warm honey oak with visible grain. Soft warm tungsten lighting from inside the cabinet glows on the empty shelves. The cabinet is centered, fills 85% of the wide frame. Behind it: a slightly out-of-focus warm aged cream wall (#F2E8D0) and a glimpse of cream tongue-and-groove paneling. Photographic, hyperdetailed, museum object catalog quality, no people. Wide 16:9 aspect ratio. The shelves are clean and empty — no items on them.`,
  },
  {
    name: 'v2-emerald',
    prompt: `A wide horizontal photograph of an antique 1920s American walnut display cabinet, photographed straight-on, both glass doors open at slight angles, revealing four empty shelves backed in deep emerald-green felt (#1F4D3F). The cabinet has aged brass hinges and beveled glass. Soft warm gallery lighting from inside the cabinet washes the green felt. The cabinet is centered, fills 85% of the wide frame. Behind it: a dark walnut-paneled wall, slightly out of focus. Photographic, hyperdetailed, museum quality, no people. Wide 16:9 aspect ratio. The shelves are completely empty — no items on them at all.`,
  },
];

for (const v of variants) {
  const outPath = path.join(OUT, `cabinet-${v.name}.png`);
  if (existsSync(outPath)) { console.log(`SKIP ${v.name}`); continue; }
  const body = {
    contents: [{ role: 'user', parts: [{ text: v.prompt }] }],
  };
  try {
    const t0 = Date.now();
    const r = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) { console.log(`FAIL ${v.name} ${r.status}: ${(await r.text()).slice(0,200)}`); continue; }
    const j = await r.json();
    const part = j?.candidates?.[0]?.content?.parts?.find(p => p?.inlineData?.data);
    const data = part?.inlineData?.data;
    if (!data) { console.log(`FAIL ${v.name}: no image`); continue; }
    writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log(`OK ${v.name}  ${(Buffer.from(data, 'base64').length/1024).toFixed(0)}KB  ${((Date.now()-t0)/1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`ERR ${v.name}: ${e.message}`);
  }
}
console.log('Done.');
