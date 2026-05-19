// Send each cabinet item photo to Gemini 2.5 Flash with a JSON-schema'd
// transcription request. Writes src/data/cabinet.json — the source of
// truth that the /cabinet page renders from.
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
if (!KEY) { console.error('No GEMINI_API_KEY'); process.exit(1); }

const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;
const manifest = JSON.parse(readFileSync('scripts/cabinet-manifest.json', 'utf8'));

const BASE_PROMPT = `You are looking at a photograph of items displayed in Bill Otranto's booth at the Paradise Antique Mall in Las Vegas. Bill writes a handwritten paper price tag for every piece. The tag has the era, item description, sometimes the maker, and a price.

THE PHOTO MAY CONTAIN MULTIPLE TAGGED ITEMS. Focus ONLY on the item described below. Find the handwritten tag attached to or closest to that specific item, and transcribe THAT tag.

FOCUS ITEM: {{HINT}}

Return a JSON object with these fields:
- era: the date or period written on the tag, e.g. "1934", "1980s", "Pre-war American", "1950s". If unreadable, your best guess from the item itself.
- maker: the manufacturer or maker name from the tag or item. Empty string if unknown.
- itemName: a clean short title for the focus item, 2-6 words.
- price: the price exactly as written for the focus item, e.g. "$65.00", "$10", "Ask in person". Use "Ask in person" if no price is visible.
- billsNote: the FULL transcription of Bill's handwritten note for the focus item, exactly as written, including line breaks as " / ". Preserve his spelling/abbreviations.
- shortBlurb: a 1-2 sentence description of the focus item in Bill's voice — confident, slightly outlaw, like he is leaning on the counter telling you about it. Reference real visible details. Do NOT make up provenance Bill did not write. Do NOT mention "the tag says" — just describe the piece.

Return ONLY the JSON object, no markdown, no commentary.`;

const results = [];

for (const item of manifest) {
  const imgPath = `public/cabinet/items/${item.slug}.jpg`;
  if (!existsSync(imgPath)) { console.log(`SKIP ${item.slug} — no image`); continue; }
  const b64 = readFileSync(imgPath).toString('base64');
  const prompt = BASE_PROMPT.replace('{{HINT}}', item.displayName);
  const body = {
    contents: [{
      role: 'user',
      parts: [
        { text: prompt },
        { inlineData: { mimeType: 'image/jpeg', data: b64 } },
      ],
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          era: { type: 'string' },
          maker: { type: 'string' },
          itemName: { type: 'string' },
          price: { type: 'string' },
          billsNote: { type: 'string' },
          shortBlurb: { type: 'string' },
        },
        required: ['era', 'maker', 'itemName', 'price', 'billsNote', 'shortBlurb'],
      },
    },
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
    const text = j?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) { console.log(`FAIL ${item.slug} no text`, JSON.stringify(j).slice(0, 200)); continue; }
    const parsed = JSON.parse(text);
    results.push({
      slug: item.slug,
      category: item.category,
      displayName: item.displayName,
      image: `/cabinet/items/${item.slug}.jpg`,
      thumb: `/cabinet/items/${item.slug}-thumb.jpg`,
      ...parsed,
    });
    console.log(`OK ${item.slug.padEnd(28)} ${parsed.price.padEnd(16)} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (e) {
    console.log(`ERR ${item.slug}: ${e.message}`);
  }
}

mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/cabinet.json', JSON.stringify(results, null, 2));
console.log(`\nWrote ${results.length} items to src/data/cabinet.json`);
