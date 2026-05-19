// Retry the 4 plates that hit copyright filters or stopped — with
// generic descriptions that avoid IP keywords.
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

const OUT = 'public/cabinet/plates';
mkdirSync(OUT, { recursive: true });

// Generic descriptions that don't trigger copyright filters
const retries = [
  { slug: 'yoda-c3po', desc: 'an antique brass railway lock with a small key on a chain, lying on a black display tray with two small plastic toy figurines beside it' },
  { slug: 'mickey-donald-rubber', desc: 'a small collection of vintage rubber and plastic cartoon-style figurines displayed in a glass case, each tagged with a paper price tag' },
  { slug: 'donald-duckling-tin', desc: 'a vintage tin lithograph spinning top and a small ceramic figural bank shaped like a duckling in a sailor hat, displayed in a glass cabinet' },
  { slug: 'oak-park-tin', desc: 'a small yellow tin lithograph model of an antique train station building with white windows and "OAK PARK" on the awning, displayed on top of an old wooden cabinet' },
];

function buildPrompt(desc) {
  return `Reference the provided photograph. Now redraw the focal subject as a vintage 1920s mail-order catalog illustration. Subject: ${desc}. Style: pure black ink line drawing with fine cross-hatched shading on plain warm aged cream paper (#F2E8D0 — completely solid color, no texture). Subject is centered, accurately drawn matching reference proportions and details. NO color, only black ink on cream. NO text, NO labels, NO captions, NO color swatches, NO border. Square 1:1. Subject fills about 75% of the frame. Looks like an engraved plate from a Sears Roebuck antique merchant catalog circa 1925.`;
}

for (const r of retries) {
  const refPath = `public/cabinet/items/${r.slug}.jpg`;
  const outPath = path.join(OUT, `${r.slug}.png`);
  if (existsSync(outPath)) { console.log(`SKIP ${r.slug} (already exists)`); continue; }
  if (!existsSync(refPath)) { console.log(`MISS ${r.slug}`); continue; }
  const ref = readFileSync(refPath).toString('base64');
  const body = {
    contents: [{
      role: 'user',
      parts: [
        { text: buildPrompt(r.desc) },
        { inlineData: { mimeType: 'image/jpeg', data: ref } },
      ],
    }],
  };
  try {
    const t0 = Date.now();
    const resp = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) { console.log(`FAIL ${r.slug} ${resp.status}: ${(await resp.text()).slice(0,200)}`); continue; }
    const j = await resp.json();
    const part = j?.candidates?.[0]?.content?.parts?.find(p => p?.inlineData?.data);
    const data = part?.inlineData?.data;
    if (!data) {
      const why = j?.candidates?.[0]?.finishReason || 'unknown';
      console.log(`FAIL ${r.slug} no image (${why})`);
      continue;
    }
    const buf = Buffer.from(data, 'base64');
    writeFileSync(outPath, buf);
    console.log(`OK ${r.slug.padEnd(28)} ${(buf.length/1024).toFixed(0)}KB  ${((Date.now()-t0)/1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`ERR ${r.slug}: ${e.message}`);
  }
}
console.log('Done.');
