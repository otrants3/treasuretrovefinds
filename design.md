# TreasureTroveFinds — Design Direction

**Version:** 1.1 — *Curated History, With Swagger*
**Last updated:** May 14, 2026
**Owner:** AJ

---

## The One-Line Brief

A single-page website with the bones of a 1940s mail-order catalog and the attitude of a 1928 speakeasy menu — driving visitors to Paradise Mall Booth #18 and to Bill's phone.

## The Brand Promise

> **Every piece has a record. Every piece comes with its story.**

Bill's been collecting since 1973. Other vendors write a price on a tag. Bill writes the *record* — the history, the maker, the era, the homework. Told with a wink, not a museum-card lecture.

---

## Brand Attitude

The most important section in this document. If you only read one part, read this one.

This is **curated history, with swagger.** It is not Smithsonian. It is not Pinterest. It is not Etsy-craft. It is not antique-shop-respectable.

Think: a guy in a Vegas back room who knows where every piece came from, what it's worth, and isn't above embellishing the story if you ask the right way. **Boardwalk Empire's set design. The Untouchables. Gatsby's elegance. Buddy L's craftsmanship. Joe Louis fight billings. Tin Pan Alley sheet music. The poker table at a speakeasy that happened to be hosting a 1942 toy show.**

If a section feels respectable, earnest, dutiful, or dry — wrong tone. If it feels confident, slightly outlaw, and like Bill himself would say it leaning on the booth counter — right tone.

**Critical guardrail:** the swagger lives in **typography and copy**, not in cheap iconography. Never use fedoras, tommy guns, dice scattered everywhere, neon signs, or Sopranos clichés. Those signal "themed cocktail bar," and that's the most overdone aesthetic on the internet right now.

---

## Audience

Two camps, both already walking into the booth:

1. **Millennials and Gen X (30s–40s)** — rediscovering 20th-century Americana, nostalgic by proxy, will share on social if the aesthetic photographs well.
2. **Older collectors (50s+)** — know what they're looking at, want a fair deal from someone who knows what they're talking about.

Both should leave thinking: *I got a good piece, at a fair price, from a guy who knew what he was doing.*

---

## Design Philosophy

### The concept

The site is a **speakeasy menu wrapped around a mail-order catalog**. The structure is catalog: departments, plates, serial numbers, prices in bold serif, Bill's research notes. The attitude is speakeasy: boxing-billing headlines, decorative ribbons, brass sunburst seals, drop-shadow display type, copy that winks.

### Why this works

1. **It's authentic to Bill.** He's not a museum curator; he's a 50-year collector with a great booth in Vegas and stories to tell.
2. **It's unique on the web.** Antique sites are either earnest-museum or Etsy-craft. Neither is interesting. This is.
3. **It's authentic to Vegas.** The booth is on Flamingo Road. Lean into where it lives.
4. **It photographs and shares well.** A site that looks like a 1932 boxing poster gets screenshotted.

### What it is NOT

Stitch and most designers will default to all of these. Push back hard.

- NOT modern minimalism
- NOT all sans-serif
- NOT pure white backgrounds
- NOT SaaS landing page
- NOT "rustic farmhouse" Pinterest aesthetic
- NOT Etsy-style craft-fair styling
- NOT modern "speakeasy cocktail bar" aesthetic (this is the most important "not")
- NOT mid-century modern (wrong era — we're pre-war, they're post-war)
- NOT respectable / earnest / dutiful museum-card copy

---

## Color System

Period-correct palette with more saturation and attitude than v1.

| Role | Color | Hex | Usage |
|------|-------|------|-------|
| **Aged cream paper** | Background | `#F2E8D0` | Primary canvas. Every page sits on this. Never pure white. |
| **Buddy L red** | Primary accent | `#9E2A2B` | Headlines, CTAs, banners, prices. Use boldly. |
| **Catalog ink** | Text | `#1A1614` | All body text. Warm black, never pure black. |
| **Brass** | Ornament | `#C9A227` | Section dividers, sunburst seals, "billing" type accents. Replaces gold leaf — more saturated, more swagger. |
| **Emerald felt** | Section accent | `#1F4D3F` | The "poker table" green. Use for ONE hero section per page (the Tag section is the obvious candidate). |
| **Walnut shadow** | Dark sections | `#3D2A1E` | Reverse sections (cream text on walnut). |
| **Cigar smoke** | Muted | `#5A554E` | Body text on dark backgrounds, secondary metadata. |
| **Dusty rose** | Highlight | `#B47B6E` | Sparingly — billing callouts, accent badges. |
| **Tag paper** | Tag motif | `#E8D5A8` | Aged price-tag color for tag UI elements. |

### Rules

- Cream is the canvas. **Always.** White backgrounds are forbidden.
- **Two colors max per section.** Speakeasy menus were printed cheap. Embrace that.
- Brass is for ornament and "billing" type — never as a fill color for body type.
- Emerald felt is the most powerful section background. Use for the *one* most important section per page.
- Dusty rose is the spice — use it once or twice, never as a system color.

---

## Typography System

This is where the site stops feeling like a library and starts feeling like Bill.

| Role | Recommended faces | Fallback | Notes |
|------|-------------------|----------|-------|
| **Display (hero, H1)** | Playbill, Limelight, Alfa Slab One, Modesto Poster | Cooper Black | Showbill, boxing-billing energy. Confident. Decorative. |
| **Billing (section titles)** | Bodoni Moda, Big Caslon, Bodoni FLF | Georgia Bold | High-contrast elegant. For "TONIGHT'S LINEUP," "FEATURED FINDS." |
| **Headline (H2/H3)** | Playfair Display, Mrs Eaves, Caslon | Georgia | High-contrast serif with personality |
| **Body** | Lora, EB Garamond, Crimson Pro | Georgia | Humanist serif, comfortable reading |
| **Catalog label** | Oswald, Trade Gothic Condensed, Rockwell | Impact | Condensed sans or slab for metadata and labels |
| **Handwritten** | Permanent Marker, Sue Ellen Francisco, Reenie Beanie | cursive | For Bill's tag notes. **Not Caveat** — reads too wedding-invitation. |

### Rules

- **Never use** Inter, Helvetica, Arial, system sans. Even once. Even for navigation.
- Display type carries the swagger — pick something with personality.
- Use **drop shadows** on display type. Cheap printing aesthetic includes registration errors and ink offsets. Embrace them.
- **Small caps** for category labels and metadata. Instantly period-correct, adds attitude.
- **Boxing-billing layout** for section announcements. Stacked, centered, decorative rules above and below:

```
              — FEATURING —
       BILL'S FAVORITE FINDS
   eight pieces, hand-picked
```

---

## Voice & Copy

This is half the brand. Most "vintage" sites fail because the copy is earnest. Don't.

**Default voice: confident, knowing, slightly outlaw. Never dutiful, never reverent.**

| Earnest (avoid) | Swagger (use) |
|------------------|----------------|
| "Visit the Booth" | "Drop In" or "Find the Joint" |
| "Our Departments" | "The Collection" or "What's on the Shelves" |
| "About Us" | "How We Got Here" |
| "Contact Bill" | "Ring Bill Up" |
| "Bill researches every piece" | "Bill knows where every piece came from" |
| "Featured Finds" | "Tonight's Lineup" or "This Month's Bill" |
| "Newsletter signup" | "Get the Word First" |
| "Coming soon to Etsy" | "Etsy's Coming. Get on the List." |
| "Our history" | "Fifty Years on the Hunt" |

### Sample copy by surface

**Hero headline (pick one or alternate):**
- *"Every piece has a record."*
- *"Curated history. Plain prices. No questions."*

**Hero subhead:**
- "Fifty years on the hunt — now at Paradise Mall, Booth #18, Las Vegas."
- "1,000 pieces. 100 years of American stuff. One booth on Flamingo Road."

**Booth info block ("Find the Joint"):**
- "PARADISE MALL — BOOTH #18 — known to the right people."
- "Open daily, 10 'til 6. Bill works the booth Wednesdays and Sundays."
- "Ring Bill up: (516) 446-2693"

**Footer:**
- "Est. 2026. Collecting since 1973. *Ask no questions.*"
- Or: "Est. 2026. Collecting since '73. *Bill knows everybody.*"

---

## Photography Direction

### What to shoot

- **The handwritten tags.** Close-up. Sharp. Bill's handwriting must be legible. Get 20–30 of them on his next booth shift.
- **Bill's favorite items.** 8–12 hero pieces. Warm light on warm wood, slight depth-of-field, visible texture. The tag should be visible in at least half.
- **The booth itself.** Wide environmental shots — already done well in the existing photos.
- **Bill and Lisa.** Eventually a real portrait. Not staged-corporate. Think 1940s shop-owner standing in front of his store. Sepia or desaturated treatment.

### What NOT to shoot

- Items on white backgrounds (eBay style — kills the aesthetic)
- Soft modern Instagram-influencer lighting
- Stock photos of "antiques"
- Hands-and-objects flat lays (too craft-fair-modern)

### Treatment

- Slight desaturation, warm shadows
- Light film grain on hero images is OK
- Photos sit inside **decorative frames** or **catalog-plate borders** — never free-floating
- Where appropriate, layer Bill's actual handwritten tag photos over item shots, slightly rotated, like they fell on the desk

---

## Layout & Composition

### Principles

- **Narrow content columns.** Catalog-style. Long lines kill the feel.
- **Decorative dividers between sections.** Sunbursts, double rules, ornamental flourishes. Never plain whitespace.
- **Items as plates.** Each featured item gets the same composition: framed photo + serial number + name + era + Bill's research note + price in bold red.
- **Generous vertical rhythm.** Catalogs breathe. Don't pack the page.
- **No edge-to-edge full-bleed sections.** Everything sits inside a generous margin (printed page, not browser tab).
- **One emerald-felt section per page.** It's the punch — usually the Tag-is-the-Brand section.

### Page structure (single scroll)

1. **Masthead** — TreasureTroveFinds wordmark, "Fine Curiosities & Relics" tagline (or alternative: "Curated History, Plain Prices"), brass "EST. 1973" sunburst seal, booth-info business card
2. **Hero** — Booth photo with overlay banner: headline + subhead + two CTAs ("Drop In" / "Ring Bill Up")
3. **Find the Joint** — Map + booth details, high priority, near the top
4. **How We Got Here** — Bill + Lisa origin, magazine-feature layout
5. **The Collection** — Six category plates (3×2): Toys & Trucks / Art Glass & Bottles / Advertising & Signage / Jewelry & Adornment / Americana & Ephemera / Curiosities
6. **Tonight's Lineup** — Bill's favorite items, full catalog plates (awaiting his list)
7. **Every Piece Has a Record** — Emerald-felt section, scrolling row of Bill's handwritten tags (awaiting tag photos)
8. **Etsy's Coming. Get on the List.** — Pre-announce, email capture
9. **Footer** — Wordmark, social, "Est. 2026 — Collecting Since '73 — Ask no questions"

---

## UI Elements / Components

### Buttons

- **Primary:** Buddy L red fill, cream text, slab-serif, subtle drop shadow, decorative inner border line (vintage business-card feel)
- **Secondary:** Cream fill, ink text, walnut outline, optional decorative corner ornaments
- **Tertiary (text link):** Brass or emerald, underlined, oldstyle figures for numbers

### Badges / Seals

- **Brass "EST. 1973" sunburst** — appears on masthead and footer. Decorative center mark, "COLLECTING SINCE 1973" wrapping. Brass on cream.
- **"Featured" ribbon banner** — boxing-poster ribbon shape, Buddy L red with cream text, drop shadow
- **"One of a Kind" stamp** — for Etsy hero items. Looks like a hand-stamped ink mark, slightly crooked.
- **"Known to the Right People" stamp** — playful header element on the booth-info block

### Dividers

- Single rule with central ornament (diamond, sunburst, fleuron)
- Double rule for major section breaks
- Line-illustrated borders for hero sections (think old certificate frames)
- Boxing-billing layout for section announcements (rules above and below stacked text)

### Tag UI element (signature component)

Every featured item is presented with a **paper-tag UI** alongside it:
- Aged cream paper texture
- Hole-punch with a tiny twine illustration at the top
- Slightly rotated, like it fell there
- Handwritten font (Permanent Marker / Sue Ellen Francisco) for the body
- Item name + era + Bill's research note
- This is the visual signature of the entire site — used wherever inventory shows up

---

## Don'ts (the critical list)

Defaults that will instantly destroy the aesthetic. Push back every time.

- ❌ Pure white backgrounds
- ❌ Inter / Helvetica / system sans
- ❌ Trendy minimalist layouts (giant hero text + sans + whitespace)
- ❌ Geometric "vintage" icons (compass, anchor, mustache, gear, eye, hourglass)
- ❌ Subway tile / hexagon / pattern overlays
- ❌ Gradient backgrounds (anywhere, ever)
- ❌ Modern card drop-shadows (the soft UI kind)
- ❌ Stock photography
- ❌ Emoji
- ❌ Modern UI patterns (modals, toasts, hamburger menus styled like 2024 apps)
- ❌ **Tommy gun / fedora / dice / playing-card icons** — speakeasy clichés
- ❌ **Neon signs** — wrong era (post-war Vegas, we're pre-war)
- ❌ **Modern "speakeasy cocktail bar" aesthetic** — overdone
- ❌ **Earnest "we curate history" copy** — drains the brand of personality
- ❌ **Caveat handwritten font** — reads too wedding-invitation; use Permanent Marker or Sue Ellen Francisco
- ❌ Mid-century modern (wrong era)
- ❌ Wes Anderson palette / aesthetic (too whimsical for this brand)

---

## Reference Mood Board

Send to Bill and Lisa to confirm direction. Pull images from:

**Attitude references (speakeasy / boxing / pulp):**
- **Speakeasy menus and price lists** (1920s–early 30s)
- **Boxing match posters** (Joe Louis era, 1936–1942)
- **Pulp magazine covers** (Black Mask, Dime Detective, 1930s)
- **Tin Pan Alley sheet music covers** (1920s–30s)
- **Carnival and sideshow posters** (the elegant kind — Ringling Bros. classic era)
- **Vaudeville and cabaret bills**
- **Prohibition-era whiskey and beer advertising**
- **Vintage horse racing posters**
- **Boardwalk Empire and The Untouchables** (set design, typography)
- **The Great Gatsby** (1974 Redford version, for elegance)

**Structure references (catalog / craftsmanship):**
- **Buddy L toy advertising** (1921–1940 catalogs)
- **Sears Roebuck catalog** (1930s–1940s)
- **Mobil Pegasus / Texaco / Esso signage** (1930s–40s)
- **Pre-war Coca-Cola advertising** (Norman Rockwell era)
- **Saturday Evening Post / Life magazine ads** (1935–48)
- **Singer Sewing Machine advertising** (1930s)

**Avoid as references:**
- Wes Anderson (too whimsical, too symmetrical)
- Anthropologie (too current)
- Magnolia Network (wrong era)
- Modern speakeasy cocktail bars (overdone)
- Sopranos kitsch
- Neon-Vegas tropes
- Etsy aesthetic generally

---

## Etsy Integration Plan

The site features Etsy prominently even before listings exist. Direction:

- **v1 (now):** "Etsy's Coming. Get on the List." section with email capture. Pre-announce 30–50 hero items. Build a warm-leads list for launch day.
- **v1.5 (5–10 listings live):** Etsy Open API v3 pulls listings server-side. Featured items appear styled as catalog plates — same fonts, same colors, same paper-tag treatment. Customer never feels they jumped brands.
- **v2 (30+ listings):** Full integration. Etsy listings drive checkout, but discovery happens in TreasureTroveFinds' aesthetic.

Visitor should **never** see Etsy's default styling on this site. Etsy is the payment rail; the brand is the experience.

---

## Stitch / AI Tool Prompts

### Master prompt (paste first)

```
A single-page website for TreasureTroveFinds — a curated antique
and vintage collectibles business at Paradise Mall, Booth #18,
Las Vegas, NV. Owners Bill and Lisa have been collecting since
1973. Every piece has a record — Bill writes the history on a
handwritten tag.

BRAND ATTITUDE — read carefully and reread it:
This is "curated history, with SWAGGER." NOT museum, NOT
catalog-stuffy, NOT Etsy-craft, NOT antique-shop-respectable.

Think: a guy in a Vegas back room who knows where every piece
came from and isn't above embellishing the story if you ask the
right way. References: 1920s speakeasy menus, Joe Louis boxing
match posters, pulp magazine covers (Black Mask, Dime Detective),
Tin Pan Alley sheet music, prohibition-era whiskey advertising,
Boardwalk Empire set design, Gatsby elegance, Buddy L toy
catalogs.

The swagger lives in TYPOGRAPHY and COPY — never in cheap
iconography. NO fedoras, NO tommy guns, NO dice graphics, NO
neon, NO modern-speakeasy-cocktail-bar Pinterest aesthetic.

DO: aged cream paper backgrounds, two-color speakeasy printing
aesthetic, boxing-billing headlines, ornate showbill display
type with drop shadows, decorative banner ribbons, brass
"Est. 1973" sunburst seal, narrow catalog columns, line-
illustrated dividers, items as catalog plates with prices in
bold red, period registration-error ink effects, ornamental
borders, one emerald-felt section per page for punch.

DO NOT: modern minimalism, sans-serif (no Inter/Helvetica), pure
white backgrounds, SaaS landing page patterns, rustic farmhouse,
Wes Anderson, mid-century modern, modern card drop shadows,
hamburger menus, stock photography, emoji.

Color palette:
- Aged cream paper: #F2E8D0 (primary background, NEVER white)
- Buddy L red: #9E2A2B (primary accent, used boldly)
- Catalog ink: #1A1614 (text, warm black)
- Brass: #C9A227 (ornament, billing type, sunburst seals)
- Emerald felt: #1F4D3F (ONE hero section background, poker-table feel)
- Walnut shadow: #3D2A1E (dark sections)
- Cigar smoke: #5A554E (muted text on dark)
- Dusty rose: #B47B6E (sparing accent)

Typography:
- Display/hero: Playbill or Alfa Slab One (showbill swagger)
- Section "billing": Bodoni Moda (high-contrast elegant)
- Body: Lora or EB Garamond (humanist serif)
- Catalog labels: Oswald (small caps)
- Handwritten: Permanent Marker or Sue Ellen Francisco (NOT Caveat — too wedding-invitation)

VOICE: confident, knowing, slightly outlaw. Bill would say
"Drop In," not "Visit the Booth." Footer reads "Est. 2026.
Collecting since 1973. Ask no questions." Section labels:
"Tonight's Lineup" (featured finds), "The Collection"
(departments), "Find the Joint" (visit info), "How We Got Here"
(story), "Get the Word First" (email signup).

Photography: close-up vintage objects on warm wood, visible
handwritten paper tags, slight desaturation, warm shadows, light
film grain. Looks like it could appear in a 1940 magazine.

Layout: narrow content columns, decorative dividers between
sections, items as catalog plates, generous margins. No edge-
to-edge full-bleed.

Goal: drive visitors to physical booth or call Bill at
(516) 446-2693. Etsy "Coming Soon" section with email capture.
No checkout in v1.
```

### Section prompts

**Hero:**
```
Hero section: full-bleed photo of curated antique display case on
warm wood shelving, slightly desaturated, warm shadows, light
film grain. Overlay on aged cream banner with decorative brass
border and corner ornaments:

Headline in large display showbill serif (Playbill / Alfa Slab):
"EVERY PIECE HAS A RECORD."
(with subtle drop shadow, slightly rotated for printed-poster feel)

Subhead in italic Bodoni Moda:
"Fifty years on the hunt — now showing at Paradise Mall,
Booth #18, Las Vegas."

Two buttons below:
- Primary (Buddy L red fill, cream Oswald small caps): "DROP IN"
- Secondary (cream fill, walnut outline, Oswald small caps):
  "RING BILL UP — (516) 446-2693"

Upper-right corner: brass "EST. 1973" sunburst seal with
"COLLECTING SINCE 1973" wrapping a center mark.

Boxing-billing detail at bottom: small ornamental rule with
"PARADISE MALL — BOOTH #18 — KNOWN TO THE RIGHT PEOPLE" in
small caps.
```

**Tonight's Lineup (Featured Finds):**
```
"TONIGHT'S LINEUP" section. Cream background. Boxing-billing
layout for the section header:

— FEATURING —
TONIGHT'S LINEUP
bill's eight favorite pieces

(decorative double rule above and below, small caps subhead)

Below: four catalog-plate entries arranged 2x2.

Each plate:
- Framed photo of antique on warm wood (decorative ornamental
  border around photo, slight registration offset for printed-
  poster feel)
- Below photo, small caps brass label: "PLATE NO. 14"
- Item name in warm display serif: "1938 BUDDY L FIRE ENGINE"
- Era + provenance in italic Bodoni: "American, pressed steel,
  East Moline, Illinois"
- A handwritten paper-tag UI element (slightly rotated, attached
  with twine illustration) showing Bill's research note in
  Permanent Marker font
- Price in bold Buddy L red, large oldstyle figures

Plates should look like pages torn from a 1932 catalog with
swagger.
```

**Every Piece Has a Record (Tag Showcase):**
```
"EVERY PIECE HAS A RECORD" section. Emerald felt background
(#1F4D3F) — THIS is the punch section. Cream and brass type.

Centered display headline in Playbill:
"EVERY PIECE HAS A RECORD."

Italic Bodoni subhead in cream:
"Other vendors put a price. Bill puts the homework — fifty
years of it, written on every tag in his own hand."

Below: horizontal scrolling row of 8-10 close-up photos of
actual handwritten paper price tags on twine, varied angles like
they were dropped on a poker table. Subtle drop shadow under each.

Bottom: brass leaf decorative divider with diamond ornament,
small italic line: "Ring Bill up if you want the full story."
```

**Find the Joint (Visit the Booth):**
```
"FIND THE JOINT" section. Cream background. Two-column layout
inside a decorative brass-bordered catalog card. Section divider
above with sunburst ornament.

Section title in large Playbill display:
"FIND THE JOINT"

Subhead in italic Bodoni:
"Booth #18 at Paradise Mall, Las Vegas — open every day, but
Bill works the floor Wednesdays and Sundays."

LEFT COLUMN (60% width):
Embedded Google Map showing Paradise Mall at 3565 E. Flamingo
Road, Las Vegas, NV. Sepia or desaturated styling. Click opens
directions in new tab.

RIGHT COLUMN (40% width), inside catalog-card border:
- Small caps brass header: "DIRECTIONS"
- "PARADISE MALL — BOOTH #18" (warm display serif, bold)
- "3565 E. Flamingo Road"
- "Las Vegas, Nevada 89121"
- Decorative rule with diamond ornament
- Small caps brass header: "HOURS"
- "Open daily, 10 'til 6"
- "Bill works the booth Wednesdays & Sundays"
- Decorative rule
- Small caps brass header: "RING BILL UP"
- Phone number "(516) 446-2693" — Buddy L red, large display serif
- Italic line beneath: "Bill loves to talk. Call ahead and he'll
  set things aside."

Two buttons:
- Primary (Buddy L red): "GET DIRECTIONS" (opens Google Maps)
- Secondary (cream/walnut outline): "CALL BILL"
```

---

## Open Questions

1. Does Stitch render showbill display faces (Playbill, Limelight) well, or do we compose them manually in the final code?
2. Bill's favorite Buddy L pieces — what's in his "Tonight's Lineup"?
3. Photos of handwritten tags — when can we get them?
4. Lisa's piece of the story.
5. Eventually: portrait of Bill and Lisa (sepia, 1940s shop-owner energy) for the "How We Got Here" section.
6. Does Bill like the swagger direction, or does he want to dial it back? (This is the biggest open question — get his read.)

---

## Next Moves

1. Send brand brief + this design.md to Bill and Lisa for reaction.
2. Confirm with Bill: does the swagger direction feel right?
3. Get tag photos and "Tonight's Lineup" items.
4. Get Lisa's piece of the story.
5. Move to Claude Code in terminal to build.
6. Bring screenshots back here for critique before launch.

---

*TreasureTroveFinds — Design Direction v1.1 — Curated History, With Swagger — AJ Otranto*
