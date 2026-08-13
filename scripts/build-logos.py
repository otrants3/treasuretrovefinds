#!/usr/bin/env python3
"""
Treasure Trove Finds - logo suite generator.

Every wordmark in public/brand/logos/ is real Bricolage Grotesque (and DM Mono)
converted to outlines here, so the shipped SVGs carry no font dependency and
render identically everywhere. Mark geometry is authored by hand on a 64x64
grid below. Type is optically centred against each mark using real glyph
bounds, not advance widths.

Fonts are read from a local scratch dir and are NOT shipped; only paths are.
Run:  python scripts/build-logos.py
"""

import io
import math
import os
import re

import uharfbuzz as hb
from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FONT_DIR = os.environ.get("TTF_FONT_DIR", r"C:\tmp\ttfbrand")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "brand", "logos")

INK = "#23201C"
SOFT = "#5A5148"
TIN = "#BE3A2B"


def nfmt(v):
    return f"{round(v, 1):g}"


class Setter:
    """Shapes a string with harfbuzz and returns SVG path data."""

    def __init__(self, path, axes=None):
        f = TTFont(path)
        if "fvar" in f and axes:
            f = instancer.instantiateVariableFont(f, axes, inplace=True,
                                                  updateFontNames=False)
        buf = io.BytesIO()
        f.save(buf)
        self.data = buf.getvalue()
        self.ft = TTFont(io.BytesIO(self.data))
        self.upem = self.ft["head"].unitsPerEm
        self.gs = self.ft.getGlyphSet()
        self.order = self.ft.getGlyphOrder()
        self.hb = hb.Font(hb.Face(self.data))

    def shape(self, text):
        b = hb.Buffer()
        b.add_str(text)
        b.guess_segment_properties()
        hb.shape(self.hb, b, {"kern": True, "liga": True})
        return [(self.order[i.codepoint], p.x_advance, p.x_offset, p.y_offset)
                for i, p in zip(b.glyph_infos, b.glyph_positions)]

    def _run(self, text, size, x, y, track, pen_factory):
        s = size / self.upem
        pen_x = x
        for name, adv, xo, yo in self.shape(text):
            t = Transform(s, 0, 0, -s, pen_x + xo * s, y - yo * s)
            self.gs[name].draw(TransformPen(pen_factory(), t))
            pen_x += adv * s + track * size
        return pen_x - x - track * size

    def measure(self, text, size, track=0.0):
        n = len(self.shape(text))
        s = size / self.upem
        adv = sum(a for _, a, _, _ in self.shape(text)) * s
        return adv + track * size * max(n - 1, 0)

    def path(self, text, size, x=0.0, y=0.0, track=0.0, anchor="start"):
        """Baseline-left at (x, y) unless anchor is middle or end."""
        total = self.measure(text, size, track)
        if anchor == "middle":
            x -= total / 2
        elif anchor == "end":
            x -= total
        out = []

        def factory():
            p = SVGPathPen(self.gs, ntos=nfmt)
            out.append(p)
            return p

        self._run(text, size, x, y, track, factory)
        return " ".join(p.getCommands() for p in out if p.getCommands()), total

    def bounds(self, text, size, x=0.0, y=0.0, track=0.0, anchor="start"):
        total = self.measure(text, size, track)
        if anchor == "middle":
            x -= total / 2
        elif anchor == "end":
            x -= total
        pens = []

        def factory():
            p = BoundsPen(self.gs)
            pens.append(p)
            return p

        self._run(text, size, x, y, track, factory)
        boxes = [p.bounds for p in pens if p.bounds]
        return (min(b[0] for b in boxes), min(b[1] for b in boxes),
                max(b[2] for b in boxes), max(b[3] for b in boxes))

    def arc_path(self, text, size, cx, cy, r, center_deg, track=0.0,
                 bottom=False):
        """Set text around a circle. center_deg is clockwise from 12 o'clock."""
        s = size / self.upem
        glyphs = self.shape(text)
        advs = [a * s + track * size for _, a, _, _ in glyphs]
        span = sum(advs) / r
        a0 = math.radians(center_deg) + (span / 2 if bottom else -span / 2)
        out, run = [], 0.0
        for (name, adv, xo, yo), a in zip(glyphs, advs):
            mid = run + a / 2
            alpha = a0 - mid / r if bottom else a0 + mid / r
            beta = alpha + math.pi if bottom else alpha
            t = (Transform()
                 .translate(cx + r * math.sin(alpha), cy - r * math.cos(alpha))
                 .rotate(beta)
                 .translate(-a / 2 + xo * s, -yo * s)
                 .scale(s, -s))
            p = SVGPathPen(self.gs, ntos=nfmt)
            self.gs[name].draw(TransformPen(p, t))
            if p.getCommands():
                out.append(p.getCommands())
            run += a
        return " ".join(out)


BRI = Setter(os.path.join(FONT_DIR, "BricolageGrotesque.ttf"),
             {"wght": 700, "opsz": 96, "wdth": 100})
BRI8 = Setter(os.path.join(FONT_DIR, "BricolageGrotesque.ttf"),
              {"wght": 800, "opsz": 96, "wdth": 100})
MONO = Setter(os.path.join(FONT_DIR, "DMMono-Medium.ttf"))

NAME = "Treasure Trove Finds"


# ------------------------------------------------------------ svg plumbing
def circle(cx, cy, r):
    return (f"M{nfmt(cx - r)},{nfmt(cy)}"
            f"a{nfmt(r)},{nfmt(r)} 0 1,0 {nfmt(2 * r)},0"
            f"a{nfmt(r)},{nfmt(r)} 0 1,0 {nfmt(-2 * r)},0Z")


def rrect(x, y, w, h, r=0):
    if r <= 0:
        return f"M{nfmt(x)},{nfmt(y)}h{nfmt(w)}v{nfmt(h)}h{nfmt(-w)}Z"
    return (f"M{nfmt(x + r)},{nfmt(y)}h{nfmt(w - 2 * r)}"
            f"a{nfmt(r)},{nfmt(r)} 0 0 1 {nfmt(r)},{nfmt(r)}"
            f"v{nfmt(h - 2 * r)}a{nfmt(r)},{nfmt(r)} 0 0 1 {nfmt(-r)},{nfmt(r)}"
            f"h{nfmt(-(w - 2 * r))}a{nfmt(r)},{nfmt(r)} 0 0 1 {nfmt(-r)},{nfmt(-r)}"
            f"v{nfmt(-(h - 2 * r))}a{nfmt(r)},{nfmt(r)} 0 0 1 {nfmt(r)},{nfmt(-r)}Z")


def diamond(cx, cy, r):
    return (f"M{nfmt(cx)},{nfmt(cy - r)}L{nfmt(cx + r)},{nfmt(cy)}"
            f"L{nfmt(cx)},{nfmt(cy + r)}L{nfmt(cx - r)},{nfmt(cy)}Z")


def g(d, fill=INK, evenodd=False):
    r = ' fill-rule="evenodd"' if evenodd else ""
    return f'<path d="{d}" fill="{fill}"{r}/>'


def group(body, dx=0.0, dy=0.0, scale=1.0):
    t = f"translate({nfmt(dx)} {nfmt(dy)})"
    if scale != 1.0:
        t += f" scale({nfmt(scale)})"
    return f'<g transform="{t}">{body}</g>'


FILES = {}


def svg(name, comment, vb, body, title, mono=False):
    color = f' style="color:{INK}"' if mono else ""
    out = (f"<!-- Treasure Trove Finds | {comment} -->\n"
           f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
           f'role="img" aria-label="{title}"{color}>'
           f"<title>{title}</title>{body}</svg>\n")
    out = re.sub(r"\n{2,}", "\n", out)
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
        fh.write(out)
    FILES[name] = (vb, body)
    return out


# ------------------------------------------------------------ type blocks
def block(lines, x=0.0, top_baseline=0.0):
    """lines: list of (setter, text, size, track, leading_after, fill).

    Sets flush left from a nominal origin and returns (svg, bbox)."""
    paths, boxes = [], []
    y = top_baseline
    for setter, text, size, track, lead, fill in lines:
        d, _ = setter.path(text, size, x, y, track=track)
        paths.append(g(d, fill))
        boxes.append(setter.bounds(text, size, x, y, track=track))
        y += lead
    bb = (min(b[0] for b in boxes), min(b[1] for b in boxes),
          max(b[2] for b in boxes), max(b[3] for b in boxes))
    return "".join(paths), bb


def lockup(mark, mark_w, lines, gap=20.0, mark_center=32.0):
    """Mark on the left, type block optically centred beside it."""
    body, bb = block(lines)
    dx = mark_w + gap - bb[0]
    dy = mark_center - (bb[1] + bb[3]) / 2
    w = dx + bb[2] + 1
    return mark + group(body, dx, dy), w


def stacked(mark_svg, mark_w, mark_scale, lines, gap=22.0, pad=6.0):
    """Mark centred over a centred type block. Returns (svg, w, h)."""
    body, bb = block(lines)
    tw = bb[2] - bb[0]
    mw = mark_w * mark_scale
    w = max(tw, mw) + pad * 2
    mx = (w - mw) / 2
    dx = (w - tw) / 2 - bb[0]
    dy = pad + mark_w * mark_scale * 0 + (64 * mark_scale) + gap - bb[1]
    h = dy + bb[3] + pad
    return (group(mark_svg, mx, pad, mark_scale) + group(body, dx, dy)), w, h


def recolor_mono(body):
    return re.sub(r'fill="#[0-9A-Fa-f]{6}"', 'fill="currentColor"', body)


# ==================================================================== A. TAG
def tag_parts():
    """Manila shipping tag: tapered head, punched hole, the written record."""
    body = ("M22.6,2.6h18.8L52.4,13.6a3.2,3.2 0 0 1 1,2.3V58.2"
            "a3.4,3.4 0 0 1 -3.4,3.4H14a3.4,3.4 0 0 1 -3.4,-3.4V15.9"
            "a3.2,3.2 0 0 1 1,-2.3Z")
    hole = circle(32, 11.2, 3.4)
    rules = rrect(17.4, 25.4, 29.2, 4.2, 2.1) + rrect(17.4, 34.8, 22.4, 4.2, 2.1)
    price = rrect(17.4, 47.6, 15.2, 5, 2.5)
    return body, hole, rules, price


def build_a():
    body, hole, rules, price = tag_parts()
    solid = " ".join([body, hole, rules, price])
    mark = g(" ".join([body, hole, rules]), INK, evenodd=True) + g(price, TIN)

    svg("a-tag-mark.svg", "Direction A, the tag. Mark.", "0 0 64 64", mark,
        f"{NAME} tag mark")

    lines = [(BRI, "Treasure Trove", 30, -0.018, 29, INK),
             (BRI, "Finds", 30, -0.018, 0, INK)]
    lk, w = lockup(mark, 64, lines)
    svg("a-tag-lockup.svg", "Direction A, the tag. Horizontal lockup.",
        f"0 0 {nfmt(w)} 64", lk, NAME)

    st_lines = [(BRI, "Treasure Trove", 34, -0.018, 33, INK),
                (BRI, "Finds", 34, -0.018, 26, INK),
                (MONO, "LAS VEGAS", 12, 0.16, 0, SOFT)]
    sk, sw, sh = stacked(mark, 64, 1.45, st_lines)
    svg("a-tag-stacked.svg", "Direction A, the tag. Stacked lockup.",
        f"0 0 {nfmt(sw)} {nfmt(sh)}", sk, NAME)

    mono_mark = g(solid, INK, evenodd=True)
    ml, mw = lockup(mono_mark, 64, lines)
    svg("a-tag-mono.svg", "Direction A. One colour. Fills use currentColor, ink by default; set color to reverse it on ink.",
        f"0 0 {nfmt(mw)} 64", recolor_mono(ml), NAME, mono=True)


# ================================================================== B. STAMP
def seal(full=True, cx=32, cy=32):
    p = [g(circle(cx, cy, 31.2) + circle(cx, cy, 28.7), INK, evenodd=True)]
    if full:
        top_r, bot_r, size, tr = 22.2, 26.5, 7.2, 0.055
        p.append(g(circle(cx, cy, 20.4) + circle(cx, cy, 19.3), INK,
                   evenodd=True))
        p.append(g(BRI.arc_path("TREASURE TROVE FINDS", size, cx, cy, top_r, 0,
                                track=tr)))
        p.append(g(BRI.arc_path("LAS VEGAS", size, cx, cy, bot_r, 180,
                                track=tr, bottom=True)))
        # separators sit in the two gaps the ring text leaves, not at 3 and 9
        top_end = math.degrees(BRI.measure("TREASURE TROVE FINDS", size, tr)
                               / top_r) / 2
        bot_end = 180 - math.degrees(BRI.measure("LAS VEGAS", size, tr)
                                     / bot_r) / 2
        a = math.radians((top_end + bot_end) / 2)
        dx, dy = 24.3 * math.sin(a), 24.3 * math.cos(a)
        p.append(g(diamond(cx + dx, cy - dy, 2.1)
                   + diamond(cx - dx, cy - dy, 2.1)))
        t, _ = BRI8.path("TTF", 16.6, cx, cy + 5.6, track=0.005, anchor="middle")
        p.append(g(t))
        p.append(g(rrect(cx - 7.5, cy - 14.2, 15, 1.3, .65)
                   + rrect(cx - 7.5, cy + 12.4, 15, 1.3, .65)))
    else:
        p.append(g(circle(cx, cy, 24.6) + circle(cx, cy, 23.4), INK,
                   evenodd=True))
        t, _ = BRI8.path("TTF", 21, cx, cy + 7.1, track=0.005, anchor="middle")
        p.append(g(t))
    return "".join(p)


def build_b():
    small = seal(full=False)
    svg("b-stamp-mark.svg",
        "Direction B, the stamp. Reduced seal, ring text dropped for small use.",
        "0 0 64 64", small, f"{NAME} seal mark")

    lines = [(BRI, "TREASURE TROVE", 21, 0.05, 25, INK),
             (BRI, "FINDS", 21, 0.05, 0, INK)]
    lk, w = lockup(small, 64, lines)
    svg("b-stamp-lockup.svg", "Direction B, the stamp. Horizontal lockup.",
        f"0 0 {nfmt(w)} 64", lk, NAME)

    svg("b-stamp-stacked.svg",
        "Direction B, the stamp. Full struck seal, the name in the ring.",
        "0 0 200 200", group(seal(True), 4, 4, 3), NAME)

    svg("b-stamp-mono.svg", "Direction B. One colour. Fills use currentColor, ink by default; set color to reverse it on ink.",
        f"0 0 {nfmt(w)} 64", recolor_mono(lk), NAME, mono=True)


# =============================================================== C. MONOGRAM
LIG_TRACK = -0.032


def ligature(size=64, fill=INK, cuts=0.0):
    """TTF in Bricolage 800, tracked until the three crossbars fuse.

    cuts > 0 draws hairline separations at the letter joins so the ligature
    still reads when it is knocked out of a solid field."""
    d, _ = BRI8.path("TTF", size, 0, 0, track=LIG_TRACK)
    bb = BRI8.bounds("TTF", size, 0, 0, track=LIG_TRACK)
    body = g(d, fill)
    if cuts:
        x, joins = 0.0, []
        for _, adv, _, _ in BRI8.shape("TTF")[:-1]:
            x += adv * size / BRI8.upem + LIG_TRACK * size
            joins.append(x)
        body += g(" ".join(rrect(j - cuts / 2, bb[1] - 1, cuts,
                                 bb[3] - bb[1] + 2) for j in joins), INK)
    return (group(body, -bb[0], -bb[1]),
            bb[2] - bb[0], bb[3] - bb[1])


def build_c():
    inset = 50.0                        # ligature width inside the 64 tile
    probe = ligature(64)
    scale = inset / probe[1]
    lig, lw, lh = ligature(64, fill="#F4EEE2", cuts=1.9)
    tile = (g(rrect(0, 0, 64, 64, 7), INK)
            + group(lig, (64 - lw * scale) / 2, (64 - lh * scale) / 2, scale))
    svg("c-monogram-mark.svg",
        "Direction C, the monogram. Ligature struck into a tile for small use.",
        "0 0 64 64", tile, f"{NAME} TTF monogram")

    bare, bw, bh = ligature(46)
    bare = group(bare, 0, 32 - bh / 2)
    lines = [(BRI, NAME, 27, -0.022, 0, INK)]
    lk, w = lockup(bare, bw, lines, gap=22)
    svg("c-monogram-lockup.svg", "Direction C, the monogram. Horizontal lockup.",
        f"0 0 {nfmt(w)} 64", lk, NAME)

    # stacked lettering: three lines set to one common width
    target = 240.0
    sizes = [100 * target / BRI8.measure(word, 100, track=0.012)
             for word in ("TREASURE", "TROVE", "FINDS")]
    lines = []
    for word, size, nxt in zip(("TREASURE", "TROVE", "FINDS"), sizes,
                               sizes[1:] + [0]):
        lines.append((BRI8, word, size, 0.012, nxt * 0.72, INK))
    body, bb = block(lines)
    mlig, mw2, mh2 = ligature(46)
    w2 = target + 24
    sk = (group(body, (w2 - (bb[2] - bb[0])) / 2 - bb[0], 12 - bb[1])
          + group(mlig, (w2 - mw2) / 2, 12 + (bb[3] - bb[1]) + 26))
    h2 = 12 + (bb[3] - bb[1]) + 26 + mh2 + 12
    svg("c-monogram-stacked.svg",
        "Direction C, the monogram. Stacked lettering, lines set to one width.",
        f"0 0 {nfmt(w2)} {nfmt(h2)}", sk, NAME)

    svg("c-monogram-mono.svg", "Direction C. One colour. Fills use currentColor, ink by default; set color to reverse it on ink.",
        f"0 0 {nfmt(w)} 64", recolor_mono(lk), NAME, mono=True)


# ================================================================ D. KEYHOLE
def escutcheon():
    plate = ("M13,26A19,22 0 0 1 51,26L48.6,55.4A6.2,6.2 0 0 1 42.4,61.6"
             "H21.6A6.2,6.2 0 0 1 15.4,55.4Z")
    hole = circle(32, 24.6, 7.2)
    slot = ("M28.7,29.6h6.6l2.5,17.6a3.2,3.2 0 0 1 -3.2,3.6H28.4"
            "a3.2,3.2 0 0 1 -3.2,-3.6Z")
    return plate, hole, slot


def build_d():
    plate, hole, slot = escutcheon()
    behind = g(rrect(20, 14, 24, 40, 4), TIN)
    mark = behind + g(plate + hole + slot, INK, evenodd=True)
    solid = " ".join([plate, hole, slot])

    svg("d-keyhole-mark.svg", "Direction D, the keyhole. Mark.", "0 0 64 64",
        mark, f"{NAME} keyhole mark")

    lines = [(BRI, "Treasure Trove", 30, -0.018, 29, INK),
             (BRI, "Finds", 30, -0.018, 0, INK)]
    lk, w = lockup(mark, 64, lines)
    svg("d-keyhole-lockup.svg", "Direction D, the keyhole. Horizontal lockup.",
        f"0 0 {nfmt(w)} 64", lk, NAME)

    st = [(BRI, "Treasure Trove", 34, -0.018, 33, INK),
          (BRI, "Finds", 34, -0.018, 26, INK),
          (MONO, "THE CASES ARE OPEN", 12, 0.16, 0, SOFT)]
    sk, sw, sh = stacked(mark, 64, 1.45, st)
    svg("d-keyhole-stacked.svg", "Direction D, the keyhole. Stacked lockup.",
        f"0 0 {nfmt(sw)} {nfmt(sh)}", sk, NAME)

    ml, mw = lockup(g(solid, INK, evenodd=True), 64, lines)
    svg("d-keyhole-mono.svg", "Direction D. One colour. Fills use currentColor, ink by default; set color to reverse it on ink.",
        f"0 0 {nfmt(mw)} 64", recolor_mono(ml), NAME, mono=True)


# =================================================================== E. WALL
COLS = [(0, 17), (20, 13), (36, 11), (50, 14)]
ROWS = [(0, 13), (16, 18), (37, 12), (52, 12)]


def cell(c0, r0, c1=None, r1=None):
    c1, r1 = (c0 if c1 is None else c1), (r0 if r1 is None else r1)
    x, y = COLS[c0][0], ROWS[r0][0]
    return rrect(x, y, COLS[c1][0] + COLS[c1][1] - x,
                 ROWS[r1][0] + ROWS[r1][1] - y, 1.6)


def wall():
    blocks = [cell(0, 0), cell(1, 0, 2, 0), cell(3, 0, 3, 1), cell(0, 1, 0, 2),
              cell(1, 1), cell(1, 2, 2, 2), cell(3, 2, 3, 3), cell(0, 3),
              cell(1, 3), cell(2, 3)]
    return " ".join(blocks), cell(2, 1)


def build_e():
    blocks, find = wall()
    mark = g(blocks) + g(find, TIN)
    solid = blocks + " " + find

    svg("e-wall-mark.svg", "Direction E, the wall. Mark.", "0 0 64 64", mark,
        f"{NAME} wall mark")

    lines = [(BRI, NAME, 28, -0.022, 0, INK)]
    lk, w = lockup(mark, 64, lines)
    svg("e-wall-lockup.svg", "Direction E, the wall. Horizontal lockup.",
        f"0 0 {nfmt(w)} 64", lk, NAME)

    st = [(BRI, "Treasure Trove", 34, -0.018, 33, INK),
          (BRI, "Finds", 34, -0.018, 0, INK)]
    sk, sw, sh = stacked(mark, 64, 1.45, st)
    svg("e-wall-stacked.svg", "Direction E, the wall. Stacked lockup.",
        f"0 0 {nfmt(sw)} {nfmt(sh)}", sk, NAME)

    ml, mw = lockup(g(solid), 64, lines)
    svg("e-wall-mono.svg", "Direction E. One colour. Fills use currentColor, ink by default; set color to reverse it on ink.",
        f"0 0 {nfmt(mw)} 64", recolor_mono(ml), NAME, mono=True)


DIRECTIONS = [
    ("A", "a-tag", "The tag",
     "Bill ties a handwritten tag to every piece, so the tag is the business. "
     "The ruled lines are the record he writes out, and the red one is the price."),
    ("B", "b-stamp", "The stamp",
     "A maker's mark, struck the way a foundry marked the base of old tin. "
     "The full name rides the ring; the reduced seal carries the initials when it has to be small."),
    ("C", "c-monogram", "The monogram",
     "Three letters in the brand face, tracked until the crossbars meet and cut back apart by a hair. "
     "No ornament, no period costume, and it holds a square better than anything else here."),
    ("D", "d-keyhole", "The keyhole",
     "The escutcheon plate off a display case, with red showing through the hole. "
     "Bill leaves his cases unlocked, so the mark says look closely rather than keep out."),
    ("E", "e-wall", "The wall",
     "The name promises abundance and the booth is packed floor to ceiling, so the mark is a full case. "
     "Ten blocks, one of them red: the piece you came for."),
]


def build_index():
    """The client review page. Mono lockups are embedded as symbols so the
    same artwork can be recoloured on oat and reversed on ink."""
    syms, uses = [], {}
    for _, slug, _, _ in DIRECTIONS:
        vb, body = FILES[f"{slug}-mono.svg"]
        syms.append(f'<symbol id="m-{slug}" viewBox="{vb}">{body}</symbol>')
        uses[slug] = vb

    tabs = "".join(
        f'<span class="tab"><img src="{slug}-mark.svg" alt=""><b>Treasure Trove '
        f'Finds</b><i>{letter}</i></span>'
        for letter, slug, _, _ in DIRECTIONS)

    faviconrow = "".join(
        f'<div class="fav"><img src="{slug}-mark.svg" alt="{title} mark at 24 '
        f'pixels" width="24" height="24"><span>{letter}. {title}</span></div>'
        for letter, slug, title, _ in DIRECTIONS)

    secs = []
    for letter, slug, title, why in DIRECTIONS:
        vb = uses[slug]
        secs.append(f"""
<section class="dir" id="{slug}">
  <div class="dir-head">
    <p class="eyebrow">Direction {letter}</p>
    <h2>{title}</h2>
    <p class="why">{why}</p>
  </div>

  <div class="panels">
    <figure class="panel w4">
      <div class="stage"><img src="{slug}-lockup.svg" alt="{title} horizontal lockup" class="lockup"></div>
      <figcaption>Horizontal lockup. Site header and letterhead.</figcaption>
    </figure>

    <figure class="panel w2">
      <div class="stage tall"><img src="{slug}-stacked.svg" alt="{title} stacked lockup" class="stack"></div>
      <figcaption>Stacked. Footer, printed card, paper bag.</figcaption>
    </figure>

    <figure class="panel w2">
      <div class="stage tall sizes">
        <img src="{slug}-mark.svg" alt="{title} mark at 96 pixels" width="96" height="96">
        <img src="{slug}-mark.svg" alt="{title} mark at 48 pixels" width="48" height="48">
        <img src="{slug}-mark.svg" alt="{title} mark at 32 pixels" width="32" height="32">
      </div>
      <figcaption>Mark at 96, 48 and 32 pixels.</figcaption>
    </figure>

    <figure class="panel w4">
      <div class="duo">
        <div class="stage one-col"><svg viewBox="{vb}" class="mono" role="img" aria-label="{title} in one colour on oat"><use href="#m-{slug}"/></svg></div>
        <div class="stage one-col rev"><svg viewBox="{vb}" class="mono" role="img" aria-label="{title} reversed on ink"><use href="#m-{slug}"/></svg></div>
      </div>
      <figcaption>One colour. Solid ink on oat, and reversed to oat on ink.</figcaption>
    </figure>

    <figure class="panel w3">
      <div class="stage fit">
        <span class="hold circle"><img src="{slug}-mark.svg" alt=""></span>
        <span class="hold square"><img src="{slug}-mark.svg" alt=""></span>
      </div>
      <figcaption>Optical fit inside a circle and a square.</figcaption>
    </figure>

    <figure class="panel w3">
      <div class="stage bar">
        <span class="mockhead"><img src="{slug}-lockup.svg" alt=""><em>Call Bill</em></span>
      </div>
      <figcaption>At real header size, 26 pixels tall.</figcaption>
    </figure>
  </div>
</section>""")

    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Treasure Trove Finds · Five logo directions</title>
<meta name="description" content="Five logo directions for Treasure Trove Finds, each with a horizontal lockup, a stacked version, a small mark and a one colour version.">
<link rel="icon" href="a-tag-mark.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{{
  --oat:#F4EEE2; --oat-deep:#EAE1D0; --paper:#FCF8F0; --ink:#23201C;
  --ink-soft:#5A5148; --oak:#A78862; --oak-line:rgba(167,136,98,.38);
  --tin:#BE3A2B; --sage:#4E6B58;
  --display:"Bricolage Grotesque",system-ui,sans-serif;
  --body:"Newsreader",Georgia,serif;
  --mono:"DM Mono",ui-monospace,Menlo,monospace;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--oat);color:var(--ink);font-family:var(--body);
  font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}}
img{{display:block;max-width:100%}}
h1,h2,h3{{font-family:var(--display);font-weight:700;line-height:1.04;margin:0;letter-spacing:-.02em}}
h1{{font-size:clamp(34px,7.5vw,58px)}}
h2{{font-size:clamp(26px,4vw,38px)}}
p{{margin:0 0 1em}}
.wrap{{width:100%;max-width:1240px;margin:0 auto;padding-inline:20px}}
@media (min-width:900px){{.wrap{{padding-inline:40px}}}}
.eyebrow{{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--ink-soft);margin:0 0 10px}}
.lede{{font-size:clamp(18px,2.2vw,21px);max-width:56ch;color:var(--ink)}}
.rule{{border:0;border-top:1px solid var(--oak-line);margin:0}}

header.top{{padding-block:48px 28px}}
.legend{{font-family:var(--mono);font-size:13px;color:var(--ink-soft);
  max-width:60ch;margin-top:18px}}

/* favicon strip */
.strip{{background:var(--paper);border:1px solid var(--oak-line);border-radius:14px;
  padding:18px;margin-block:28px 8px}}
.chrome{{background:var(--ink);border-radius:10px 10px 0 0;padding:10px 10px 0;
  display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}}
.chrome::-webkit-scrollbar{{display:none}}
.tab{{flex:0 0 auto;display:flex;align-items:center;gap:8px;background:var(--oat);
  border-radius:8px 8px 0 0;padding:9px 14px;max-width:210px}}
.tab img{{width:16px;height:16px;flex:0 0 auto}}
.tab b{{font-family:var(--display);font-weight:500;font-size:12.5px;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis}}
.tab i{{font-family:var(--mono);font-style:normal;font-size:11px;color:var(--ink-soft)}}
.favs{{display:flex;flex-wrap:wrap;gap:10px 26px;padding-top:18px}}
.fav{{display:flex;align-items:center;gap:9px}}
.fav span{{font-family:var(--mono);font-size:12px;color:var(--ink-soft)}}

/* directions */
.dir{{padding-block:46px}}
.dir + .dir{{border-top:1px solid var(--oak-line)}}
.dir-head{{max-width:62ch;margin-bottom:26px}}
.why{{font-size:18px;margin:12px 0 0;color:var(--ink)}}
.panels{{display:grid;gap:14px;grid-template-columns:1fr}}
@media (min-width:760px){{.panels{{grid-template-columns:1fr 1fr}}}}
@media (min-width:1080px){{.panels{{grid-template-columns:repeat(6,1fr)}}
  .w2{{grid-column:span 2}} .w3{{grid-column:span 3}} .w4{{grid-column:span 4}}}}
.panel{{margin:0;background:var(--paper);border:1px solid var(--oak-line);
  border-radius:14px;padding:16px;display:flex;flex-direction:column}}
.panel figcaption{{font-family:var(--mono);font-size:12px;line-height:1.5;
  color:var(--ink-soft);padding-top:14px;margin-top:auto}}
.panel .stage,.panel .duo{{flex:1}}
.stage{{display:flex;align-items:center;justify-content:center;gap:20px;
  min-height:110px;padding:14px 10px;background:var(--oat);border-radius:8px;
  flex-wrap:wrap}}
.stage.tall{{min-height:190px}}
.lockup{{height:46px;width:auto}}
@media (min-width:1080px){{.lockup{{height:54px}}}}
.stack{{height:150px;width:auto}}
.sizes{{align-items:flex-end;gap:22px}}
.duo{{display:grid;grid-template-columns:1fr;gap:10px;align-items:stretch}}
.duo .stage{{height:100%}}
@media (min-width:520px){{.duo{{grid-template-columns:1fr 1fr}}}}
.one-col{{min-height:96px}}
.mono{{height:38px;width:auto;color:var(--ink)}}
.rev{{background:var(--ink)}}
.rev .mono{{color:var(--oat)}}
.hold{{display:grid;place-items:center;width:104px;height:104px;background:var(--oat-deep)}}
.hold.circle{{border-radius:50%}}
.hold.square{{border-radius:4px}}
.hold img{{width:56px;height:56px}}
.bar{{padding:0;background:var(--oat-deep);align-items:flex-start}}
.mockhead{{display:flex;align-items:center;gap:14px;width:100%;padding:13px 16px;
  background:var(--oat);border-bottom:1px solid var(--oak-line);border-radius:8px}}
.mockhead img{{height:26px;width:auto}}
.mockhead em{{margin-left:auto;font-family:var(--display);font-style:normal;
  font-weight:600;font-size:13px;background:var(--tin);color:var(--paper);
  padding:8px 14px;border-radius:6px;white-space:nowrap}}

footer.foot{{background:var(--ink);color:var(--oat);padding-block:40px;margin-top:36px}}
.foot h3{{font-size:22px;margin-bottom:14px}}
.foot p,.foot li{{color:rgba(244,238,226,.72)}}
.foot ul{{list-style:none;margin:0;padding:0;font-family:var(--mono);font-size:12.5px;
  columns:2;column-gap:26px;max-width:640px}}
.foot li{{margin-bottom:6px;break-inside:avoid}}
</style>
</head>
<body>

<header class="top wrap">
  <p class="eyebrow">Treasure Trove Finds · Brand marks</p>
  <h1>Five logo directions</h1>
  <p class="lede">Each direction comes with a horizontal lockup for the site
  header, a stacked version for the footer or a printed card, a standalone mark
  that has to hold at 32 pixels, and a one colour version for a stamp, a paper
  bag or anything reversed out.</p>
  <p class="legend">Colours are the booth palette. Type is Bricolage Grotesque
  and DM Mono, converted to outlines, so no font file is needed to use any of
  these. Judge them small first.</p>

  <div class="strip">
    <div class="chrome">{tabs}</div>
    <div class="favs">{faviconrow}</div>
  </div>
</header>

<main class="wrap">
{''.join(secs)}
</main>

<footer class="foot">
  <div class="wrap">
    <h3>Twenty files, all vector</h3>
    <p>Saved in public/brand/logos. Rebuild them with scripts/build-logos.py.</p>
    <ul>{''.join(f'<li>{n}</li>' for n in sorted(FILES))}</ul>
  </div>
</footer>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">{''.join(syms)}</svg>
</body>
</html>
"""
    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as fh:
        fh.write(html)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    build_a()
    build_b()
    build_c()
    build_d()
    build_e()
    build_index()
    total = 0
    for f in sorted(os.listdir(OUT)):
        if f.endswith(".svg"):
            n = os.path.getsize(os.path.join(OUT, f))
            total += n
            print(f"{n:>7} {f}")
    print(f"{total:>7} total")
