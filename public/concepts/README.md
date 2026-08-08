# Five redesign directions

Static mockups. Nothing here is wired into the live site, and nothing here changes it.

## How to look at them

From the repo root:

```
NODE_OPTIONS="--use-system-ca" npm run dev
```

Then open **http://localhost:4321/concepts/index.html** and click into each one.

## The five

| | Direction | The idea |
|---|---|---|
| 05 | **The Walkthrough** | An actual room. You stand at the door, walk down the aisle, and the cases sit at angles either side of you in real perspective. CSS 3D transforms, no library. You walk in 3D and read in 2D. |
| 04 | **The Cabinet** | The site *is* the curio cabinets. Oak frames, brass nameplates, glass doors that swing open as you reach them, and every piece drawn as a pen and ink engraving sitting on the shelf. Scrolling down is walking along the aisle. Carries the family story as its own chapter, and the assistant. |
| 01 | **The Litho** | Built like the box the toys came in. Fat 1930s advertising type, four colour litho printing, the booth's real reds and yellows turned up loud. Headings print slightly out of register, the way real toy boxes did. |
| 02 | **The Keeper** | A magazine profile of Bill. Big photography, long captions, his handwriting on the tags, every photo carrying a typed accession line. |
| 03 | **Under Glass** | The website is the case. Dark walnut and brass, shelves that stay dim until you move along them, and the light comes up on whatever you point at. |

## Direction 05 in detail

**How the room is made.** The cases are real 3D objects: a `.world` element carries an inverse camera transform (`rotateY(-yaw) translate3d(-x, 0, -z)`) and each case is placed with `translate3d` and angled toward the aisle with `rotateY`. Walking is just moving the camera between stops.

**Two things I got wrong first, both worth knowing before anyone extends this:**

1. **Do not model the floor and ceiling as giant 3D planes.** I had them at 2800 by 5000 pixels rotated flat. Past a certain size the browser gives up rasterising them and paints garbage over the whole screen. The floor is now a gradient painted on the room, and the depth comes from the cases and the back wall.
2. **Do not rely on clicking a 3D transformed element.** Hit testing does not reliably follow a cabinet to where it visually appears, so clicking the case did nothing. The real control is now a flat button in the bar at the bottom, which also means it works with a keyboard and a thumb. The case still responds to a click where the browser allows it.

**Camera stops are computed, not eyeballed.** Each case stop stands back along that case's own facing direction and turns to face it, so you always get a square, readable look instead of an oblique one. The stand back distance grows on a phone so a whole case fits the screen, and it recalculates on resize and rotation.

**The rule that keeps it usable:** you walk in 3D and you read in 2D. Perspective is lovely for atmosphere and terrible for reading a price, so stepping up to a case leaves the 3D entirely and gives you a flat grid at full size. There is also a "skip the walk" link to the whole booth as an ordinary list, which is the no-JavaScript fallback and the escape hatch for anyone who does not want a room.

## Direction 04 in detail

**Where the engravings came from.** `public/cabinet/plates/*.png` already existed from the v9 work. They are pen and ink drawings of the real pieces, printed on aged paper. The cabinet interior is set to the exact paper colour sampled out of those files (`#F1D9B5`), so each engraving blends into the shelf instead of sitting on a visible card.

**Built for the people who will actually use it.**

- Written mobile first. Every size is set for a phone, then opened up at `min-width`.
- Body copy never drops below 18px, and it is 19px on desktop.
- Every button, link and input is at least 44px tall, most are 48 to 60.
- Warm dark ink on warm paper, which is a much higher contrast pairing than grey on white.
- No scroll hijacking. The page scrolls normally. The doors and the aisle marker are decoration on top of an ordinary document.
- `prefers-reduced-motion` removes the doors entirely and opens every cabinet.
- Works with the keyboard, has a skip link, and the assistant closes on Escape.

**The assistant.** Bottom right on desktop, in the sticky bar on a phone. Ask it about anything in the cases and it answers, then offers to walk you to the piece. Clicking *Show me* closes the panel, opens the right cabinet, scrolls the piece into view and flashes it.

It handles hours, location, who Bill and Lisa are, shipping, price questions (`under $50` and `under fifty dollars` both work), oldest and most expensive, keyword matches against the case, and a specific answer for the things Bill collects that are not catalogued online (Lionel, Buddy L, Christmas, Halloween). Anything it cannot answer falls back to the phone number.

Right now it is **a script inside the page**, not a model. The item list it searches is the `ITEMS` array at the bottom of the file. Wired up for real this would be Claude Haiku over the live catalogue, and the `ITEMS` array becomes the tool it searches.

## What is real and what is not

**Real** in all four: every photograph, every engraving, every price, and every tag transcription comes from the booth. Bill's quote about what he collects is his own words, lightly cleaned up for punctuation.

**Placeholder**, marked with `<!-- PLACEHOLDER -->` in the source and called out at the bottom of every page:

- The **As featured on** rows need real channel names, episode titles, dates and links.
- The three **Bill's take** lines in the trending section need Bill's actual words. What is there now is written in his general direction, not quoted from him.
- The family story in direction 04 is written from what A.J. described. It needs Bill and Lisa to read it before it goes anywhere near the public.

## One thing worth knowing

The catalogue data in `src/data/cabinet.json` is not fully reliable. `oak-park-tin` is captioned as a tin train station but the photo shows New York licence plates and wrestling figures. `raggedy-anns` is captioned as cloth dolls but shows a shelf of kitchen scales and ice trays. Several others are busy through-the-glass case shots where the named item is hard to pick out.

Every image used in these mockups was opened and checked by eye against its caption first. If you add more pieces, check them the same way.
