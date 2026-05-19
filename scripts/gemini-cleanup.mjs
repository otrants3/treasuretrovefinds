// Gemini 2.5 Flash Image cleanup pass for hero photos.
// Sends each image to Gemini with a "clean up, sharpen, don't restyle"
// prompt and writes <name>-gemini.jpg next to the original.
//
// Auth: uses gcloud's application-default access token + the active project.
// Run: node scripts/gemini-cleanup.mjs
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const PROJECT = 'alchemy-media-buying';
const LOCATION = 'us-central1';
const MODEL = 'gemini-2.5-flash-image-preview';

const TOKEN = execSync('gcloud auth application-default print-access-token', { encoding: 'utf8' }).trim();
if (!TOKEN) { console.error('No gcloud token'); process.exit(1); }

const ENDPOINT = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

const PROMPT = `Clean up this photograph of an antique mall booth.
Tasks:
- Reduce glare and reflection on glass display cases
- Improve sharpness and clarity of the antique items, especially any handwritten paper tags
- Correct the cool fluorescent-light color cast toward warmer natural tones
- Keep the composition, all objects, all people, and all text exactly as they are
- Do not stylize, do not paint, do not add or remove any items
- Output should look like a clean, well-lit, high-quality photograph of the same scene`;

const OUT = 'C:/Users/ajotr/TreasureTroveFinds/public/shop';
const targets = [
  'hero-aisle.jpg',
  'hero-cabinet.jpg',
  'hero-tags.jpg',
  'bill-at-case.jpg',
];

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
        { inline_data: { mime_type: 'image/jpeg', data: b64 } },
      ],
    }],
    generationConfig: { responseModalities: ['IMAGE'] },
  };
  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const text = await r.text();
      console.log(`FAIL ${name} ${r.status}: ${text.slice(0, 400)}`);
      continue;
    }
    const j = await r.json();
    const part = j?.candidates?.[0]?.content?.parts?.find(p => p?.inline_data?.data || p?.inlineData?.data);
    const data = part?.inline_data?.data || part?.inlineData?.data;
    if (!data) {
      console.log(`FAIL ${name} — no image in response:`, JSON.stringify(j).slice(0, 400));
      continue;
    }
    writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log(`OK   ${name} → ${path.basename(outPath)}  ${(Buffer.from(data, 'base64').length/1024).toFixed(0)}KB`);
  } catch (e) {
    console.log(`ERR  ${name}: ${e.message}`);
  }
}
console.log('Done.');
