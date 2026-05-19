// Gemini 2.5 Flash Image cleanup pass for shop photos.
// Uses GEMINI_API_KEY env var (or .env.local) → direct generativelanguage.googleapis.com.
// Writes <name>-gemini.jpg next to the source so you can A/B before swapping in.
//
// Run: node scripts/gemini-cleanup.mjs            (cleanup pass on hero set)
//      node scripts/gemini-cleanup.mjs --all      (everything in public/shop)
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

// Load .env.local manually so we don't pull in dotenv
const ENV_PATH = path.resolve('.env.local');
if (existsSync(ENV_PATH)) {
  for (const line of readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('No GEMINI_API_KEY in env or .env.local'); process.exit(1); }

const MODEL = 'gemini-2.5-flash-image';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

const PROMPT = `Clean up this photograph of items inside an antique mall booth. Tasks:
- Reduce glare and reflection from the glass display cases
- Improve sharpness and clarity of the antique items and the handwritten paper price tags
- Correct the cool fluorescent-light cast toward warmer, more natural tones
- Preserve composition, every object, every person, and every piece of text exactly as they are
- Do NOT stylize, illustrate, paint, or change the look — output must still be a clean photograph of the same scene
- Do NOT add, remove, or move any items
- Output a single image at the same aspect ratio as the input`;

const OUT = 'public/shop';
const all = process.argv.includes('--all');
const targets = all
  ? readFileSync('.', 'utf8') && [] // expanded below
  : ['hero-aisle.jpg', 'hero-cabinet.jpg', 'hero-tags.jpg', 'bill-at-case.jpg', 'piece-ge-fan.jpg', 'piece-perfume-bottle.jpg', 'record-crocks.jpg', 'record-locks.jpg', 'record-buckle.jpg'];

for (const name of targets) {
  const srcPath = path.join(OUT, name);
  const outPath = path.join(OUT, name.replace('.jpg', '-gemini.jpg'));
  if (!existsSync(srcPath)) { console.log(`SKIP ${name} — missing`); continue; }
  if (existsSync(outPath)) { console.log(`SKIP ${name} — already cleaned`); continue; }
  const b64 = readFileSync(srcPath).toString('base64');
  const body = {
    contents: [{
      role: 'user',
      parts: [
        { text: PROMPT },
        { inlineData: { mimeType: 'image/jpeg', data: b64 } },
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
      const text = await r.text();
      console.log(`FAIL ${name} ${r.status}: ${text.slice(0, 400)}`);
      continue;
    }
    const j = await r.json();
    const part = j?.candidates?.[0]?.content?.parts?.find(p => p?.inlineData?.data || p?.inline_data?.data);
    const data = part?.inlineData?.data || part?.inline_data?.data;
    if (!data) {
      const blockReason = j?.promptFeedback?.blockReason || j?.candidates?.[0]?.finishReason;
      console.log(`FAIL ${name} — no image (${blockReason || 'unknown'}):`, JSON.stringify(j).slice(0, 300));
      continue;
    }
    const buf = Buffer.from(data, 'base64');
    writeFileSync(outPath, buf);
    console.log(`OK   ${name} → ${path.basename(outPath)}  ${(buf.length/1024).toFixed(0)}KB  ${((Date.now()-t0)/1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`ERR  ${name}: ${e.message}`);
  }
}
console.log('Done.');
