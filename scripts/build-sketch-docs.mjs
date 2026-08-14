// Builds prompts.md and index.html for the logo exploration sketches.
// Prompts are read from _results.json so they are byte-exact to what was sent.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'brand', 'logos2', 'sketches');
const results = JSON.parse(fs.readFileSync(path.join(OUT, '_results.json'), 'utf8'));

const DIRECTION_LABEL = {
  'island-key': 'Long Island drawn as a key',
  'keyhole-negative': 'Keyhole with the island as negative space',
  tag: 'Manila shipping tag carrying the island',
  chest: 'Antique trunk / chest with an island keyhole plate',
  'forks-abstract': 'Abstract mark from the two east-end forks',
  monogram: 'T T F monogram with the island worked in',
};

// Honest, eyes-on assessments. Written after viewing every file.
const NOTES = {
  'sketch-01.png':
    'Handsome ornate key with a quatrefoil bow, but the shaft is only vaguely island-lumpy and the island never reads. Steal the bow, not the concept.',
  'sketch-02.png':
    'Clean, confident key silhouette; an island contour is ghosted over the shaft and just muddies the edge. Useful as a proportion study, not as the island idea.',
  'sketch-03.png':
    'Generic key inside a double red ring, no island present at all, plus a stray floating dot. Weakest key, though the circular badge lockup is worth keeping.',
  'sketch-04.png':
    'Strong black keyhole with a thin outlined island crossing it, but the crossing reads as arms on a little figure. Good idea, wrong execution.',
  'sketch-05.png':
    'Best island drawing in the whole set: the two forks are unmistakable in cream negative space on a red capsule. Drifts to a third gold colour and drops the keyhole, but this is the shape to trace.',
  'sketch-06.png':
    'Proper keyhole whose slot dissolves into the forks, with a red compass star. Top two thirds are excellent; the bottom third turns to mush at small size.',
  'sketch-07.png':
    'The tag object itself is beautifully proportioned and the most on-brand thing here. The island on the face is scratchy and too small to survive shrinking.',
  'sketch-08.png':
    'Strongest tag: horizontal tag, black keyhole disc left, red island right. It solves keyhole plus island plus tag in one clean silhouette. Closest thing to a real mark.',
  'sketch-09.png':
    'Two overlapping tags with a solid black island bar straight across. Island reads well but looks skewered through the tag. Salvageable if the island sits on the tag rather than through it.',
  'sketch-10.png':
    'Flat trunk with banding, gold corners, keyhole and a cream island band. Four colours and too busy, but the island-as-a-band-across-the-trunk device is genuinely good.',
  'sketch-11.png':
    'Simplest and best chest: domed black lid, red body, small keyhole plate, cream island. Actually survives at favicon size. Usable.',
  'sketch-12.png':
    'Chest with the island tilted diagonally under a heavy outline, which fights the horizontal banding. Least useful of the three chests.',
  'sketch-13.png':
    'Elegant, confident two-blade form with a bitten cream circle, but it reads as a rocket or an arrow rather than Long Island. Keep as pure form, not as geography.',
  'sketch-14.png':
    'Reads as a red checkmark or a letter V. No island, no key. Not usable.',
  'sketch-15.png':
    'Two jagged prongs joined at the right with a floating red dot. Convincingly reads as key teeth and is the most distinctive abstract mark of the three. Usable.',
  'sketch-16.png':
    'Letters are correct and well cut, but the red island slashes straight through the middle of them and wrecks legibility. Right idea, needs the island moved off the letterforms.',
  'sketch-17.png':
    'The T, T and F are interlocked to the point of being unreadable. The ring-with-island-across-the-bottom device is worth keeping; the lettering is not.',
  'sketch-18.png':
    'Cleanest, most correct lettering in the set, island reading as a rule under the wordmark. Most usable monogram, and the easiest to rebuild properly in vector.',
};

const STYLE_NOTE =
  'Every prompt also carried the same style clause: flat vector logo design, two colours maximum, ' +
  'solid shapes only, no gradients, no 3D, no photorealism, no drop shadows, no texture, centred on a ' +
  'plain cream background, high contrast, small-size legible, professional brand mark, palette of deep ' +
  'warm near-black / muted brick red / cream. The pictorial prompts also forbade text and lettering; ' +
  'only the three monogram prompts were allowed to attempt letters.';

// ---------- prompts.md ----------
let md = `# Logo exploration sketches: prompts and honest notes

**These are AI raster exploration sketches, not production artwork.** They exist to widen the search for
shapes. The real Treasure Trove Finds logos are vectors and are being built on a separate track. Nothing
in this folder should be shipped, traced blindly, or shown to a client as a finished mark.

Generated with Google \`gemini-2.5-flash-image\` on 2026-08-13. 18 images, 6 directions, 3 variations each.

${STYLE_NOTE}

Brief behind the imagery: Bill and Lisa Otranto's antique business runs out of two booths in Las Vegas,
but the family and the story come from Long Island, New York. Bill has loved history since he was a kid
there, and he ties a handwritten tag to every piece with what he researched about it. The client likes
the keyhole idea and wants Long Island in the mark, possibly with a tag or a treasure chest.

---
`;

let current = '';
for (const r of results) {
  if (r.dir !== current) {
    current = r.dir;
    md += `\n## ${DIRECTION_LABEL[r.dir]}\n`;
  }
  md += `\n### ${r.file}\n\n**Prompt:**\n\n> ${r.prompt}\n\n**Assessment:** ${NOTES[r.file]}\n`;
}

md += `
---

## Where the useful shapes are

- **Best single mark in the set:** \`sketch-08.png\`, tag + keyhole + island in one silhouette.
- **Best island drawing:** \`sketch-05.png\`, the North and South Forks finally read.
- **Best small-size survivor:** \`sketch-11.png\`, the simplified chest.
- **Best abstract:** \`sketch-15.png\`, forks that double as key teeth.
- **Weakest direction:** the abstract V (\`sketch-14.png\`) and the interlocked monogram (\`sketch-17.png\`).

## Known limits of these sketches

The model does not know the real coastline of Long Island. Several islands are lumpy approximations and a
few are plain wrong. Colours drift past the two-colour rule (gold appears in 05, 10 and 11). Nothing here
is vector, nothing here is on-grid, and none of it is a logo yet.
`;

fs.writeFileSync(path.join(OUT, 'prompts.md'), md, 'utf8');

// ---------- index.html ----------
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let cards = '';
current = '';
for (const r of results) {
  if (r.dir !== current) {
    current = r.dir;
    cards += `</div><h2 class="dir">${esc(DIRECTION_LABEL[r.dir])}</h2><div class="grid">`;
  }
  cards += `
    <figure class="card">
      <img src="./${r.file}" alt="Exploration sketch ${r.file}" loading="lazy">
      <figcaption>
        <span class="file">${r.file}</span>
        <p class="prompt">${esc(r.prompt)}</p>
        <p class="note"><span class="notelabel">Read:</span> ${esc(NOTES[r.file])}</p>
      </figcaption>
    </figure>`;
}
cards = cards.replace(/^<\/div>/, '') + '</div>';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Logo exploration sketches: NOT final artwork</title>
<style>
  :root {
    --cream:#F2E8D0; --ink:#1A1614; --red:#9E2A2B; --smoke:#5A554E; --paper:#EFE3C6;
  }
  * { box-sizing:border-box; }
  body {
    margin:0; background:var(--cream); color:var(--ink);
    font-family:Georgia,"Times New Roman",serif; line-height:1.55;
    padding:2.5rem 1.5rem 5rem;
  }
  .wrap { max-width:1180px; margin:0 auto; }
  .warn {
    border:3px double var(--red); background:var(--paper);
    padding:1.4rem 1.6rem; margin-bottom:2.5rem;
  }
  .warn h1 {
    margin:0 0 .6rem; font-size:1.5rem; letter-spacing:.04em;
    text-transform:uppercase; color:var(--red);
  }
  .warn p { margin:.5rem 0; max-width:70ch; }
  .warn strong { text-transform:uppercase; letter-spacing:.05em; }
  .meta { font-size:.85rem; color:var(--smoke); margin-top:1rem; }
  h2.dir {
    font-size:1.05rem; text-transform:uppercase; letter-spacing:.14em;
    border-bottom:1px solid var(--ink); padding-bottom:.5rem;
    margin:3rem 0 1.5rem;
  }
  .grid {
    display:grid; gap:2rem;
    grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  }
  .card { margin:0; background:var(--paper); border:1px solid rgba(26,22,20,.25); }
  .card img { display:block; width:100%; height:auto; border-bottom:1px solid rgba(26,22,20,.25); }
  figcaption { padding:1rem 1.1rem 1.2rem; }
  .file {
    display:inline-block; font-family:ui-monospace,Menlo,Consolas,monospace;
    font-size:.75rem; letter-spacing:.08em; text-transform:uppercase;
    background:var(--ink); color:var(--cream); padding:.2rem .5rem; margin-bottom:.7rem;
  }
  .prompt { font-size:.8rem; color:var(--smoke); margin:.4rem 0 .8rem; }
  .note { font-size:.9rem; margin:0; }
  .notelabel { color:var(--red); text-transform:uppercase; letter-spacing:.08em; font-size:.72rem; }
  footer { margin-top:4rem; font-size:.85rem; color:var(--smoke); border-top:1px solid var(--ink); padding-top:1rem; }
</style>
</head>
<body>
<div class="wrap">

  <div class="warn">
    <h1>Exploration sketches, not artwork</h1>
    <p><strong>Read this first.</strong> Every image on this page is an AI-generated raster sketch made to
    widen the search for shapes. None of it is a finished logo, and none of it should be shown as one.</p>
    <p>The real Treasure Trove Finds logos are <strong>vectors</strong>, drawn on a separate track. These PNGs are
    idea fuel only: wobbly coastlines, off-grid curves, colours that drift outside the palette, and a model
    that does not actually know what Long Island looks like.</p>
    <p>Use them the way you would use napkin doodles. Point at the two or three shapes worth chasing, then
    have them drawn properly.</p>
    <p class="meta">18 sketches &middot; 6 directions &middot; generated with Google gemini-2.5-flash-image &middot;
    prompts and per-image notes also in <code>prompts.md</code></p>
  </div>

  ${cards}

  <footer>
    Brief: Bill and Lisa Otranto's antique business, two booths in Las Vegas, family and story out of Long
    Island, New York. Bill ties a handwritten researched tag to every piece. Directions explored: island as
    key, keyhole negative space, shipping tag, treasure chest, abstract east-end forks, T&nbsp;T&nbsp;F monogram.
  </footer>

</div>
</body>
</html>
`;

fs.writeFileSync(path.join(OUT, 'index.html'), html, 'utf8');
console.log('wrote prompts.md and index.html');
