/* =============================================================
   /api/ask  -  the booth helper
   Vercel serverless function (Node runtime).

   WHAT IT IS
   A small, capped question answerer for the Treasure Trove Finds
   site. The front end (public/site/assistant.js) allows three
   answers per visit and then hands the visitor to email. This
   endpoint only produces the answers. The email handoff is the
   point of the feature, so every failure mode here degrades to
   that path instead of throwing.

   REQUEST   POST application/json
     {
       messages:   [ { role: "user" | "assistant", content: "..." } ],
       image:      optional data URL string, one image, user turn only,
       catalogue:  optional array of short strings built from items.js
     }

   RESPONSE  always HTTP 200 on the happy and the degraded paths
     { reply: "..." }                      answer produced
     { reply: null, unavailable: true }    no key, upstream down, bad input

   ENV VAR
     ANTHROPIC_API_KEY   required for the helper to answer at all.
     Set it in Vercel: Project > Settings > Environment Variables >
     Add New, name ANTHROPIC_API_KEY, paste the key from
     console.anthropic.com, tick Production, Preview and Development,
     then redeploy (env vars are read at boot, not at build).
     Locally: `vercel env pull .env.local` or export it in the shell.
     If the variable is absent the site still works. The helper simply
     says it cannot answer right now and offers the email to Bill.

   COST NOTE
     Model is claude-haiku-4-5, max_tokens 400, three answers per
     visitor per session. Bill wanted cheap and fast.
   ============================================================= */

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 400;
const MAX_BODY_BYTES = 4 * 1024 * 1024; // ~4MB, one downscaled photo fits easily
const MAX_MESSAGES = 12;
const MAX_CHARS_PER_MESSAGE = 1500;
const MAX_CATALOGUE_ROWS = 140;
const MAX_CATALOGUE_ROW_CHARS = 140;

const BUSINESS = `Treasure Trove Finds is Bill and Lisa Otranto's antique business.
They have TWO booths, numbers 39 and 46, at Paradise Antique Mall,
3565 E. Flamingo Rd, Las Vegas, NV 89121.
Bill is in the booths Wednesdays and Sundays, 10 a.m. to 6 p.m.
Phone: (516) 446-2693. Email: ttrovefinds@gmail.com.
Etsy shop: ttrovefinds. Instagram: @treasuretrovefinds.
Bill has loved history since he was a kid on Long Island. He researches every
piece and writes what he found out on a handwritten tag tied to the object.
The cases are open: ask, and anything comes out.`;

function systemPrompt(catalogue) {
  const list = catalogue && catalogue.length
    ? catalogue.join('\n')
    : '(The catalogue was not sent with this request. Treat it as empty.)';

  return `You are the helper on the Treasure Trove Finds website. You are not a
salesperson and you are not Bill. You are a plain, useful front desk.

THE BUSINESS
${BUSINESS}

THE CATALOGUE YOU CAN SPEAK FOR
These are the pieces photographed for the website. Title, category, price where
a price is known. This is the ONLY inventory you know about:
${list}

WHAT YOU MAY SAY ABOUT INVENTORY
You may describe anything in that list, including its category and its price.
You must NEVER say or imply that they have something which is not in that list.
The booths hold far more than the list, so when someone asks about a piece that
is not there, the honest answer is that the list is only what has been
photographed for the site, that Bill would know what is actually in the cases
right now, and that the quickest way to find out is to send him an email or come
by on a Wednesday or Sunday. Never guess at stock. Never invent a maker, a
price, a date or a condition for a piece you were not given.

WHEN SOMEONE SENDS A PHOTO OF THEIR OWN PIECE
Give a careful, hedged read: what the object appears to be, the likely material
and construction, the sort of decade or maker family it resembles, and what to
look for to identify it properly (marks, seams, stamps, base, hardware, wear
patterns). You may give at most one WIDE ballpark range, clearly labelled as a
rough range from a photo. Never state a single confident value. Say plainly, in
your own words, that this is not an appraisal and that Bill gives real answers
after seeing a piece.

VOICE
Plain and warm. Short sentences. Factual. Anchored on makers and decades rather
than adjectives. Never salesy. No exclamation points. No em dashes. No emoji.
No bullet lists longer than four items. Keep replies under about 130 words.

WHERE EVERY ANSWER GOES
Steer to one of two outcomes, whichever fits: come see the booths on a Wednesday
or Sunday, or send Bill an email at ttrovefinds@gmail.com and he will answer.
Mention the email whenever the honest answer is that you do not know.`;
}

/* ---- request body: read it ourselves so we can cap the size ---- */
function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'string') {
        if (Buffer.byteLength(req.body) > MAX_BODY_BYTES) return reject(new Error('too big'));
        try { return resolve(JSON.parse(req.body)); } catch (e) { return reject(e); }
      }
      return resolve(req.body);
    }
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) { reject(new Error('too big')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function clean(s, max) {
  return String(s == null ? '' : s).slice(0, max).trim();
}

/* data URL -> Anthropic image block, or null */
function imageBlock(dataUrl) {
  if (typeof dataUrl !== 'string') return null;
  const m = /^data:(image\/(?:jpeg|png|gif|webp));base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl);
  if (!m) return null;
  const data = m[2].replace(/\s/g, '');
  if (data.length > 3.6 * 1024 * 1024) return null; // base64 is ~1.33x the bytes
  return { type: 'image', source: { type: 'base64', media_type: m[1], data: data } };
}

function unavailable(res, why) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.status(200).end(JSON.stringify({ reply: null, unavailable: true, why: why || null }));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST, OPTIONS');
    return res.status(405).end(JSON.stringify({ error: 'POST only' }));
  }

  const declared = Number(req.headers['content-length'] || 0);
  if (declared > MAX_BODY_BYTES) return unavailable(res, 'payload too large');

  let body;
  try { body = await readBody(req); }
  catch (e) { return unavailable(res, 'bad or oversized body'); }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return unavailable(res, 'no key configured');

  const incoming = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  const messages = [];
  for (const m of incoming) {
    const role = m && m.role === 'assistant' ? 'assistant' : 'user';
    const text = clean(m && m.content, MAX_CHARS_PER_MESSAGE);
    if (!text) continue;
    // Anthropic rejects two turns of the same role in a row.
    if (messages.length && messages[messages.length - 1].role === role) {
      const prev = messages[messages.length - 1];
      prev.content[prev.content.length - 1].text += '\n' + text;
      continue;
    }
    messages.push({ role: role, content: [{ type: 'text', text: text }] });
  }
  if (!messages.length) return unavailable(res, 'no message');
  if (messages[messages.length - 1].role !== 'user') return unavailable(res, 'last turn must be the visitor');

  const img = imageBlock(body.image);
  if (img) {
    const last = messages[messages.length - 1];
    last.content.unshift(img);
  }

  const catalogue = Array.isArray(body.catalogue)
    ? body.catalogue.slice(0, MAX_CATALOGUE_ROWS).map((r) => clean(r, MAX_CATALOGUE_ROW_CHARS)).filter(Boolean)
    : [];

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt(catalogue),
        messages: messages,
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.error('anthropic error', upstream.status, detail.slice(0, 400));
      return unavailable(res, 'upstream ' + upstream.status);
    }

    const data = await upstream.json();
    const reply = (data.content || [])
      .filter((b) => b && b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    if (!reply) return unavailable(res, 'empty reply');

    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    return res.status(200).end(JSON.stringify({ reply: reply }));
  } catch (err) {
    console.error('ask handler failed', err && err.message);
    return unavailable(res, 'request failed');
  }
}
