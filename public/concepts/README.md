# Three redesign directions

Static mockups. Nothing here is wired into the live site, and nothing here changes it.

## How to look at them

From the repo root:

```
NODE_OPTIONS="--use-system-ca" npm run dev
```

Then open **http://localhost:4321/concepts/index.html** and click into each one.

The index page has all three side by side with the palette and the thinking behind each.

## The three

| | Direction | The idea |
|---|---|---|
| 01 | **The Litho** | Built like the box the toys came in. Fat 1930s advertising type, four colour litho printing, the booth's real reds and yellows turned up loud. Headings print slightly out of register, the way real toy boxes did. |
| 02 | **The Keeper** | A magazine profile of Bill. Big photography, long captions, his handwriting on the tags, every photo carrying a typed accession line like a museum that never got formal. |
| 03 | **Under Glass** | The website is the case. Dark walnut and brass, shelves that stay dim until you move along them, and the light comes up on whatever you point at. |

## What is real and what is not

**Real** in all three: every photograph, every price, and every tag transcription comes from the booth. Bill's quote about what he collects is his own words, lightly cleaned up for punctuation.

**Placeholder**, marked with `<!-- PLACEHOLDER -->` in the source and called out at the bottom of every page:

- The **As featured on** rows need real channel names, episode titles, dates and links.
- The three **Bill's take** lines in the trending section need Bill's actual words. What is there now is written in his general direction, not quoted from him.
- The longer piece descriptions in direction 02 are drafted and need his sign off.

## One thing worth knowing

The catalogue data in `src/data/cabinet.json` is not fully reliable. The `oak-park-tin` entry, for example, is captioned as a tin train station but the photo shows New York licence plates and wrestling figures. Several other entries are busy through-the-glass case shots where the named item is hard to pick out.

Every image used in these mockups was checked by eye against its caption first. If you add more pieces, check them the same way.
