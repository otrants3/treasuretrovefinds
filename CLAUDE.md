# TreasureTroveFinds — Project Context

## What this is

A website for **TreasureTroveFinds**, a curated antique and vintage collectibles business owned by **Bill and Lisa** (AJ's parents). Their physical booth is **Booth #18 at Paradise Mall, 3565 E. Flamingo Rd, Las Vegas, NV**. Bill is in the booth Wednesdays and Sundays, 10 a.m. – 6 p.m.

**The brand promise:**
> Every piece has a record. Every piece comes with its story.

Bill's been collecting since 1973. Other vendors write a price on a tag. Bill writes the *record* — the history, the maker, the era, the homework — in his own handwriting.

---

## Brand attitude (read this before doing anything)

This is **curated history, with SWAGGER.**

It is NOT Smithsonian. NOT Pinterest. NOT Etsy-craft. NOT antique-shop-respectable.

Think: a guy in a Vegas back room who knows where every piece came from and isn't above embellishing the story if you ask the right way. **Boardwalk Empire set design. Joe Louis boxing match billings. Gatsby elegance. Tin Pan Alley sheet music. 1932 catalog craftsmanship.**

If something feels respectable, earnest, dry, or dutiful — wrong tone. If it feels confident, slightly outlaw, like Bill himself would say it leaning on the booth counter — right tone.

**Critical guardrail:** the swagger lives in **typography and copy**, not iconography. NO fedoras, tommy guns, dice graphics, neon signs, or "speakeasy-themed cocktail bar" clichés. Those signal cheap. The brand is more elegant than that.

---

## Source-of-truth documents

1. **`TreasureTroveFinds_Brand_Brief_v1.docx`** — the strategic brief (positioning, audience, voice, three differentiators)
2. **`design.md`** — the visual system (color palette, type stack, voice & copy table, the "Don'ts" list, Stitch prompts)

Before generating code or content, **read both files in full.** They override any assumptions.

---

## Phase 1 scope (the only scope right now)

A **single-page** site. No multi-page nav. No e-commerce. No checkout. No "order form." No "merchant policy."

The site's job is to drive visitors to:
1. The physical booth (address, hours, map)
2. Bill's phone: **(516) 446-2693**

Etsy is **"Etsy's Coming. Get on the List."** with email capture only. Listings don't exist yet.

### Required sections (in order, with swagger-correct names)

1. **Masthead** — wordmark, tagline (*"Fine Curiosities & Relics"* or *"Curated History, Plain Prices"*), brass "EST. 1973" sunburst seal, booth-info business-card block top-right
2. **Navigation** — anchor links: `THE COLLECTION | HOW WE GOT HERE | TONIGHT'S LINEUP | FIND THE JOINT`
3. **Hero** — booth photo with overlay banner: headline *"Every piece has a record."* + subhead + two CTAs: **DROP IN** / **RING BILL UP**
4. **Find the Joint** — Google Maps embed (left) + catalog-card with address, hours, phone, "Get Directions" + "Call Bill" buttons (right). High priority — visible without much scrolling.
5. **How We Got Here** — Bill and Lisa origin, magazine-feature layout. Lisa's section is a placeholder until her content arrives.
6. **The Collection** — 3×2 grid: Toys & Trucks / Art Glass & Bottles / Advertising & Signage / Jewelry & Adornment / Americana & Ephemera / Curiosities. Each tile a miniature catalog plate.
7. **Tonight's Lineup** — 4 catalog-plate entries (Bill's favorite finds). Each: framed photo + serial number + item name + era + Bill's research note (handwritten font) + price in Buddy L red. **Awaiting Bill's list — placeholder copy with `AWAITING` comments for now.**
8. **Every Piece Has a Record** — emerald-felt section (the ONE punch section on the page). Horizontal row of close-up handwritten-tag photos. **Awaiting tag photos.**
9. **Etsy's Coming. Get on the List.** — pre-announcement + email capture
10. **Footer** — wordmark, social, *"Est. 2026 — Collecting Since '73 — Ask no questions"*

---

## Tech stack

**Astro + Tailwind CSS**, deployed to Cloudflare Pages or Vercel (free tier).

Why Astro:
- Mostly static content (Astro's strength)
- Markdown content first-class (Bill can write item entries as `.md` files later)
- Drop in React/Svelte components for interactive bits later (Etsy API pull, contact form)
- Lighter than Next.js; faster builds; simpler mental model
- Excellent Lighthouse scores out of the box

Why Tailwind:
- Custom color palette + type system goes straight into `tailwind.config.js`
- The aesthetic relies on tight typographic control — Tailwind handles this well

**Domain:** TBD. `treasuretrovefinds.com` if available, otherwise `.co` or Vegas-specific variant.

---

## Color palette (Tailwind config)

```js
colors: {
  cream:       '#F2E8D0',  // Primary background — NEVER use pure white
  'buddy-red': '#9E2A2B',  // Primary accent, prices, CTAs
  ink:         '#1A1614',  // Body text (warm black, not pure black)
  brass:       '#C9A227',  // Ornament, sunburst seals, billing-type accents
  emerald:     '#1F4D3F',  // The ONE hero section background (poker-felt punch)
  walnut:      '#3D2A1E',  // Dark sections
  smoke:       '#5A554E',  // Muted text on dark backgrounds
  rose:        '#B47B6E',  // Sparing accent — use once or twice
  'tag-paper': '#E8D5A8',  // Handwritten-tag UI element
}
```

Rules:
- Cream is the canvas. Always.
- Two colors max per section.
- Brass for ornament, never body type.
- Use emerald-felt for ONE section per page (the Tag section is the obvious candidate).

---

## Typography (Tailwind config)

```js
fontFamily: {
  display:  ['"Alfa Slab One"', '"Playbill"', '"Cooper Black"', 'Georgia', 'serif'],   // Hero, H1 — showbill swagger
  billing:  ['"Bodoni Moda"', '"Big Caslon"', 'Georgia', 'serif'],                     // Section "billing" titles
  serif:    ['"Lora"', '"EB Garamond"', 'Georgia', 'serif'],                           // Body
  label:    ['"Oswald"', '"Trade Gothic Condensed"', 'Impact', 'sans-serif'],          // Small caps labels/metadata
  hand:     ['"Permanent Marker"', '"Sue Ellen Francisco"', '"Reenie Beanie"', 'cursive'], // Bill's tag notes — NOT Caveat
}
```

Serve from Google Fonts or Bunny Fonts. Avoid licensed faces (ITC Souvenir, real Playbill) for v1 — the free alternatives above carry the same energy.

**NEVER use Inter, Helvetica, Arial, or system sans.** Even for navigation. Even once.

---

## Voice & copy (the swagger lives here)

Default tone: **confident, knowing, slightly outlaw. Never earnest, never dutiful.**

| Earnest (avoid) | Swagger (use) |
|------------------|----------------|
| Visit the Booth | Drop In / Find the Joint |
| Our Departments | The Collection |
| About Us | How We Got Here |
| Contact Bill | Ring Bill Up |
| Bill researches every piece | Bill knows where every piece came from |
| Featured Finds | Tonight's Lineup |
| Newsletter signup | Get the Word First |
| Coming soon to Etsy | Etsy's Coming. Get on the List. |
| Our history | Fifty Years on the Hunt |

When generating any copy, lean toward the right column. When in doubt, ask: *would Bill say this leaning on the booth counter?* If not, rewrite.

Sample taglines and surface copy:
- Hero headline: *"Every piece has a record."*
- Hero subhead: *"Fifty years on the hunt — now showing at Paradise Mall, Booth #18, Las Vegas."*
- Booth info block header: *"PARADISE MALL — BOOTH #18 — known to the right people."*
- Footer: *"Est. 2026. Collecting since '73. Ask no questions."*

---

## Hard constraints — do not violate

These default away from the aesthetic. Push back every time.

- ❌ No e-commerce framing anywhere ("order," "checkout," "cart," "shop now")
- ❌ No pure white backgrounds — `#F2E8D0` aged cream is the canvas
- ❌ No Inter, Helvetica, Arial, or system sans for content
- ❌ No trendy minimalism, no gradient backgrounds, no modern card drop-shadows
- ❌ No emoji
- ❌ No stock photography
- ❌ No mid-century modern aesthetic (wrong era — we're pre-war, MCM is post-war)
- ❌ **No fedora / tommy gun / dice / playing-card icons** — speakeasy cliché
- ❌ **No neon signs** — wrong era
- ❌ **No "speakeasy cocktail bar" modern aesthetic** — overdone
- ❌ **No earnest, museum-card copy** — drains the brand of personality
- ❌ **No Caveat handwritten font** — too wedding-invitation; use Permanent Marker
- ❌ No Wes Anderson, no rustic farmhouse, no Anthropologie current

The full "Don'ts" section in `design.md` has the complete list.

---

## Pending content (blockers for full v1)

Use placeholder content for now and flag in code with `<!-- AWAITING: ... -->` comments.

1. **Lisa's piece of the story** — the "How We Got Here" section needs her voice.
2. **Bill's 8 favorite items** — the "Tonight's Lineup" section. Each needs: photo, name, era, Bill's research blurb, price.
3. **Photos of Bill's handwritten tags** — 20–30 close-ups needed for the "Every Piece Has a Record" section.
4. **Decision on Bill/Lisa portrait** — sepia-treatment, 1940s shop-owner energy. Optional but strongly recommended.
5. **EST. year** — `1973` is the working assumption; confirm with Bill.
6. **Domain name** — register `treasuretrovefinds.com` if available.

---

## Acceptance criteria for v1

The site is "v1 done" when:
- A first-time visitor finds the booth address, hours, and phone within 10 seconds
- The aesthetic feels unmistakably curated-history-with-swagger (not generic vintage, not earnest museum)
- Lighthouse scores: Performance ≥ 95, Accessibility ≥ 95
- Mobile-responsive (visitors check on phones in the booth)
- Google Maps embed functional and tappable on mobile
- Phone number is `tel:` linked (one-tap call on mobile)
- Bill's three pillars (variety, the tag, Bill in person) visible above the fold or in the first scroll
- Email capture for Etsy launch functional (Mailchimp / ConvertKit / Beehiiv free tier)
- All placeholder content clearly marked with `<!-- AWAITING -->` comments

---

## Out of scope for v1

- E-commerce (no checkout, no Stripe, no cart)
- Etsy API live integration (waiting for listings)
- Airtable inventory system (separate project)
- Instagram feed embed (when account is reactivated)
- Blog or article CMS
- Multi-language
- User accounts / login
- Search

---

## Phase 2 (mental note for future sessions)

- Etsy Open API v3 integration → live listings styled as catalog plates
- Instagram feed embed
- Airtable as inventory CMS feeding the site
- Optional: SMS list for "new at the booth" alerts

---

## Working with this project

When AJ asks for something, default to:
1. Reference the brand brief and design.md before generating
2. Match the period aesthetic AND the swagger attitude — if something feels modern OR earnest, it's wrong
3. Push back on e-commerce framing every time it creeps in
4. Push back on respectable/dutiful copy — ask "would Bill say this?"
5. Use markdown content where possible so Bill/Lisa can edit later
6. Keep components small and named for what they are (`PaperTag.astro`, `CatalogPlate.astro`, `SunburstSeal.astro`, `BoxingBilling.astro`)
7. Comment generously — future AJ will thank present AJ

---

*Project context for Claude Code. Read brand brief + design.md before generating anything. Curated history, with swagger.*
