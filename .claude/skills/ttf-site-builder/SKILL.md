---
name: ttf-site-builder
description: TTFSiteBuilder. The operating manual for building the TreasureTroveFinds site. Use for ANY design, layout, copy, or build work on the site, including reviewing concepts and grading pages. Built from three books applied to Bill and Lisa's booth - Don't Make Me Think (Krug), Ogilvy on Advertising, and On Writing Well (Zinsser).
---

# TTFSiteBuilder

The operating manual for every page, section, and sentence of treasuretrovefinds.
Three books, one job each:

- **Krug** decides whether people can USE it. He governs structure, navigation, and mobile.
- **Ogilvy** decides whether it SELLS. He governs layout, images, headlines, and the record.
- **Zinsser** decides whether it sounds like BILL. He governs every sentence of copy.

When the three conflict, precedence is: Krug on structure, Zinsser on tone, Ogilvy on
everything between. (Example: Ogilvy loves "FREE!" and "Amazing!" headline words. Zinsser
wins; Bill would never say that. But Ogilvy's layout order and caption rule beat any
aesthetic preference.)

## The site's one job

Make a stranger trust Bill before they have met him, then get them to Booth 18
(or to Etsy if they are far away). Everything on the page either builds that trust
or moves them toward the booth. If an element does neither, cut it.

The audience skews older and arrives on phones. Krug's position, adopted here as law:
there is no separate "design for seniors." Ruthless obviousness IS the accommodation.

## Sources of truth (read before writing copy)

- `docs/bill-clip-transcript.txt` - Bill's actual voice on tape. The cadence standard.
- `docs/booth-facts.md` - verified inventory, prices, the Picker Road episode, the open-cases policy.
- Bill's one text about what he collects: "1920 to 1950 toys. Trucks, cars, trains.
  Buddy L, Hubley, Lionel, Tootsietoy diecast. Along with Christmas and Halloween
  from the 1920s to the 1960s."
- Never quote Bill beyond these sources. A "Bill's take" with no source stays a
  placeholder marked `<!-- AWAITING: Bill -->` until his real words arrive.

---

# PART 1: KRUG - can they use it?

## The three laws, as TTF rules

1. **Don't make me think.** Every question mark in a visitor's head (is that clickable?
   what does that word mean? where am I?) drains goodwill. Self-evident beats
   self-explanatory beats requires-thought. If a design needs instructions, redesign it.
2. **Clicks are free, ambiguity is not.** Depth is fine as long as each tap is a
   mindless, unambiguous choice. A three-tap path of obvious choices beats a one-tap
   path behind a clever label.
3. **Halve the words, then halve them again.** No happy talk ("Welcome to our
   website..."), no instructions. People scan, they do not read. Format for scanning:
   headings, short paragraphs, front-loaded trigger words.

## How people actually use the site

They SCAN for trigger words, they SATISFICE (tap the first reasonable thing), and they
MUDDLE THROUGH with wrong mental models that work well enough. Novices and experts both.
Design for that person, not for a careful reader.

## Non-negotiable structure rules

- **Billboard design.** Clear visual hierarchy: more important = more prominent,
  related = visually grouped. Break the page into clearly defined areas. Design to be
  understood at a glance, like a billboard at 60 mph.
- **Conventions over invention.** Innovate only where we know we have a better idea
  (the visual identity). Navigation, links, buttons, and forms follow convention exactly.
  Clarity trumps consistency, and clarity trumps cleverness always.
- **The trunk test.** Drop onto any section of the page cold. Within seconds you must
  know: whose site is this, what section am I in, what are my options, how do I get to
  the booth info. If not, fix the section before polishing it.
- **Persistent wayfinding.** Site name links to top. Every section has a plain name
  matching whatever link or button brought you there. Current section indicated.
- **Address, hours, and phone within one scroll of the top, always.** Hiding the
  info people came for is Krug's #1 goodwill drain. The phone number is visible,
  not buried in a footer, and always `tel:` linked.
- **Obvious clickability.** Buttons look like buttons. Links look like links. Nothing
  important depends on hover, because phones have no hover. Every interactive element
  works on first tap.
- **Tap targets 44px minimum. Body text 18px minimum.** Generous contrast. Allow zoom.
  These are already project law; Krug makes them load-bearing.
- **Forms forgive.** The email capture accepts anything reasonable. Never punish format.
  Ask for nothing we do not need (email means email only, no name field, no phone field).
- **A flat path for everything.** Any showpiece interaction (opening cabinet doors,
  a 3D walk) must have a boring flat equivalent one obvious tap away. Walk in 3D,
  read in 2D. Nobody is ever trapped in the clever version.
- **When in doubt, take something away.** Fixes are subtractions before they are
  additions. Never fix confusion by adding an explanation.

## The reservoir of goodwill

Every visitor arrives with a finite reserve. Protect it.

Drains: hiding the address or phone, making them guess prices, promo in their path,
fake sincerity, marketing fluff, broken or sloppy anything, punishing input formats.

Fills: main tasks obvious, candor about prices and condition, saving them steps
(tap to call, tap for directions), visible effort (the records themselves), easy
recovery from wrong taps.

## The testing ritual (Krug's morning-a-month, TTF edition)

Before a design ships, and once a month after: watch 3 people use it on their own
phones. Bill, Lisa, and one person their age who has never seen it. Not a focus group;
no opinions. Give tasks and watch silently:

1. "Find out when the booth is open."
2. "Get directions to the booth."
3. "Find something they sell that you would want, and what it costs."
4. "Call Bill." (Let them get to the tap, then stop them.)

Note where they hesitate, misread, or stall. Fix the worst three things. Tweak,
do not redesign. Ignore wobbles they self-correct in seconds.

---

# PART 2: OGILVY - does it sell?

Bill is an Ogilvy ad that already exists: a real founder with fifty years of homework,
long factual copy on every tag, and specifics a stranger can verify. The site's design
system is "make the Ogilvy formula visible."

## Layout law (the reading-gravity order)

- Readers look at the IMAGE first, the HEADLINE second, the COPY third. Lay out in
  that order: photo, then headline below the photo, then copy. Do not put headlines
  above their image.
- **Caption every photograph. No exceptions.** More people read captions than body
  copy, so every caption works: it names the piece, the maker, the era, and when
  known the price. An uncaptioned image is a wasted ad. This is the single
  highest-leverage rule in the book and it is exactly what Bill already does with
  his tags. The site is, in a real sense, captions all the way down.
- **Editorial, not "addy."** Pages that read like an interesting article outperform
  pages that look like advertising. The site should feel like a magazine feature about
  the booth, never like a promo. No banners, no badges, no urgency.
- Real photographs over illustration wherever we have them. Photos are believed.
  (Engravings are the sanctioned decorative exception; they never replace a real
  photo of a real piece that we have.)

## Typography law

- Serif for body copy. Sans-serif only for headlines, labels, and UI if the direction
  calls for it.
- Dark type on light ground for anything longer than a heading. Never set body copy
  reversed (light on dark) or in all caps. Dark SECTIONS are fine; long READING in
  reverse is not. Keep reversed passages under two sentences.
- Never overprint copy on a busy image. Measure stays near 35 to 45 characters on
  phones, never past ~70 on desktop.
- Subheads, short paragraphs, and generous leading break up long copy. First paragraph
  of any section stays short, around eleven words.

## Headline law

- Five times as many people read the headline as the copy. Every section headline
  must carry a promise or a fact by itself, because most visitors read nothing else.
  "Every piece has a record" passes. A pun fails. A label that needs the paragraph
  under it to make sense fails.
- Specifics beat generalities, and the best headline is often a FOUND FACT, not
  invented cleverness. Ogilvy's Rolls-Royce headline was a quote from a reviewer.
  Ours are sitting in Bill's transcript and tags already: "Made in 1928. Lindbergh
  flew in 1927." Mine the records before writing anything new.
- Include the concrete names people scan for: Buddy L, Lionel, Marx, Hubley, Steiff.
  Collectors search for makers, not for adjectives.
- No blind headlines, no cleverness that needs decoding. Long is fine if every word
  is doing work.

## Copy law

- **Long factual copy sells; the more facts, the more sell.** For considered purchases,
  and antiques are exactly that, information-hungry readers exist. The record IS the
  long copy. Never truncate a record to fit a layout; change the layout.
- **The consumer is not a moron.** No vapid adjectives ("stunning", "beautiful",
  "rare find"), no superlatives, no unsupported claims. State the maker, the year,
  the mechanism, the condition, the price, and let the reader judge. One verifiable
  fact outsells ten adjectives.
- **Show prices.** Hiding prices is both an Ogilvy sin and a Krug goodwill drain.
  The booth's honest price band (roughly $25 to $100 for most pieces, with standouts
  like the $450 Gescha) is a selling fact. Use it.
- **Testimonials from real, named sources only.** The Picker Road quote ("This is a
  vendor who really knows his stuff") is our Ogilvy testimonial: real people, on
  camera, attributed. Use it once per page at most. Never invent or paraphrase praise.
- **Demonstration beats assertion.** The dating guides with magnifying glasses tied
  on, the open cases, the research cards: show these as photos with captions rather
  than claiming "expert knowledge."

## Brand law

- **The founder is the face.** One real person with authority and a little eccentricity
  personifies the brand better than any logo. Bill in his Hawaiian shirt is our
  Commander Whitehead. His photo, his handwriting, his words.
- **Story appeal.** One odd, specific, human detail in an image makes the viewer ask
  "what is going on here?" The magnifying glasses tied to the case. The New York
  plates on a Vegas wall. The handwritten tag in a world of price stickers. Feature
  these; they are our eyepatch. Never fabricate one.
- **Every page is a deposit in the brand image.** Pick the personality once and hold
  it for years. No chasing novelty, no tone drift between sections. The personality:
  a knowledgeable, generous collector who shows his homework.
- **Big idea test** for any new section or feature: does it fit "every piece has a
  record"? Could it still run in five years? If not, it is decoration; cut it.

## Measurement law

- Response is truth, opinion is not. The measurable outcomes: taps on Call, taps on
  Directions, email signups, Etsy clicks. When choosing between two versions of
  anything, prefer the test (even the informal 3-person kind) over the debate.

---

# PART 3: ZINSSER - does it sound like Bill?

The product a writer sells is not the subject; it is who they are. This site sells
Bill's person-hood on the page. Every sentence gets written like he would say it
leaning on the case, then tightened.

## The cadence standard (from the tape)

Bill talks in short factual sentences anchored on dates, makers, and prices. He
explains mechanisms. He defines terms plainly and immediately.

- "This was made in 1928. Of course, Charles Lindbergh's flight was in 1927."
- "On auction, recent auction prices, it sold for $450."
- "It's a pottery. It's not a porcelain, because a porcelain would be glazed."
- "I learn the history of something when I learn about it. Because I can study it
  and then I'm pretty good at it."

Write TO that cadence. Before shipping any paragraph, read it aloud and ask: would
Bill say this? If it sounds "written," rewrite it until it sounds said.

## Simplicity and clutter

- Strip every sentence to its cleanest components. Most first drafts can lose half
  their words without losing anything. (This is Krug's third law applied to prose;
  the two books agree exactly here.)
- Clutter to kill on sight: "at this point in time" (now), "due to the fact that"
  (because), "in order to" (to), utilize (use), sufficient (enough), numerous (many),
  attempt (try), "it is interesting to note" (delete), "it should be pointed out"
  (delete).
- Little qualifiers dilute: a bit, sort of, kind of, rather, quite, very, pretty much.
  Don't be kind of bold. Be bold.
- The bracket drill: bracket every word or phrase that might do no work, reread the
  sentence without it. If it survives, cut. Run this on every block of site copy.

## Voice

- Write like people talk, then tighten. Never say anything on the site you would not
  say out loud to a customer at the booth.
- First person is natural and allowed. "We" is Bill and Lisa. Warmth is contagious;
  the reader must feel the writer is enjoying this. Bill is.
- Jargon and pomposity kill trust. The dentist asks "are you experiencing any pain?"
  but asks his own kid "does it hurt?" Write for the kid. Antique-world jargon
  (provenance, curated, patina-as-flex) gets Bill's treatment instead: define it
  plainly or drop it.
- No soft place-words that mean nothing: attractive, charming, delightful, romantic,
  wonderful, unique, stunning. Cut every one and replace with a fact or nothing.
- Any phrase that comes easily is suspect: it is probably a cliche arriving. This is
  doubly true of AI-cadence tells. The no-ai-slop skill's ban list applies to every
  word on this site. NO EM DASHES anywhere, ever.

## Craft

- Active verbs push sentences forward. "Bill found it upstate" beats "it was
  discovered." No inanimate things doing human verbs.
- Adjectives only when they do fact-work ("tin", "wind-up", "hand-painted", "1928"),
  never decoration.
- Short sentences. Reach the period sooner. Ration exclamation points to roughly one
  per page.
- Unity: each section makes ONE point and leaves one thought. The story section:
  this is their dream, finally happening. The record section: he does the homework
  so you can check it. The find-us section: come see it. One point each. Anything
  serving a different point moves or dies.
- **Leads:** the first sentence of every section either pulls the reader to the second
  sentence or the section is dead. Lead with the freshest concrete thing, then a few
  hard details for why the section exists. No warm-up sentences.
- **Endings: when you are ready to stop, stop.** No recap. The best ending surprises
  slightly and lands exactly, and a real quotation with finality is a classic close.
  (The story section already ends on Bill's mission quote. That is the pattern.)
- The last sentence of every section gets as much care as the first.

## Quotes and the profile (the story section)

- Real speech beats paraphrase every time. Handle Bill's and Lisa's words like a
  valuable gift.
- Cleanup ethics: compressing, reordering, and tidying a real quote is allowed ONLY
  to make the speaker's meaning clearer and truer. Fabricating, extending, or
  "improving" a quote is never allowed. If we need words we do not have, the section
  waits, marked `<!-- AWAITING -->`.
- Attribution stays plain: "Bill says." Never "Bill quips," "Bill muses," "Bill avers."
- Homework before asking: when collecting new material from Bill (the weekly card,
  voice notes), never ask what the transcript already answers. Ask the next question.
- The story is the place filtered through them. Only significant detail survives:
  the kitchen table, the reference book, the New York plates. Detail that any antique
  shop could claim gets cut.

---

# THE SHIP CHECKLIST

Run before any page, section, or concept ships. All three graders must pass.

**Krug pass (use):**
- [ ] Trunk test: cold visitor knows whose site, where they are, what they can do
- [ ] Address, hours, tap-to-call phone within one scroll of the top
- [ ] Every interactive element obviously clickable; nothing depends on hover
- [ ] 18px+ body, 44px+ targets, works one-handed on a phone
- [ ] Any showpiece interaction has a flat one-tap alternative
- [ ] Halve-the-words pass done on every block

**Ogilvy pass (sell):**
- [ ] Every photo captioned with maker, era, and price when known
- [ ] Headlines carry a fact or promise; no blind or clever-only headlines
- [ ] Image, then headline, then copy; body serif; no reversed or all-caps body
- [ ] Prices visible; no vapid adjectives; every claim verifiable
- [ ] Bill's face or handwriting present; one story-appeal detail; zero invented praise
- [ ] Page reads editorial, not "addy"

**Zinsser pass (voice):**
- [ ] Read aloud: every sentence something Bill would actually say
- [ ] Bracket drill run; clutter and qualifiers cut
- [ ] All quotes real and sourced; anything unsourced marked AWAITING
- [ ] Each section makes one point, leads strong, stops when done
- [ ] No em dashes, no AI-cadence tells, no soft nothing-words

**Then the test:** watch Bill, Lisa, and one friend do the four tasks on their phones.
Fix the worst three things by subtraction. Ship.
