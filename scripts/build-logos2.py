#!/usr/bin/env python3
"""
Treasure Trove Finds - logo suite, round two: Long Island as the identity.

Bill's love of history started on Long Island, and the island's silhouette
already looks like a key: long and narrow, blunt at the west end, splitting
into two forks at the east. Put a bow on the west end and the whole island
reads as the key to a trove. One shape carries Long Island, the keyhole and
the key at once.

THE ISLAND SHAPE IS NOT INVENTED. Every control point in OUTLINE below is a
real place, converted from its latitude and longitude by one projection, so
the drawing sits directly on top of the real coast. It was checked against the
OpenStreetMap coastline for Long Island (Nominatim relation 3955977, the
41,639 point ring) by overlaying the two at 900 pixels wide. Two deliberate
departures, both needed to survive 32 pixels:

  1. the north shore is drawn along the outer envelope of the necks, so the
     harbours read as soft scallops instead of a saw blade
  2. the North Fork is drawn roughly twice its true width, and the Napeague
     isthmus roughly three times, or both vanish at small sizes

Type is real Bricolage Grotesque and DM Mono converted to outlines by
scripts/build-logos.py, which this script imports, so no shipped SVG carries
a font dependency.

Run:  python scripts/build-logos2.py
"""

import importlib.util
import math
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "public", "brand", "logos2")

# reuse the round one type pipeline (Setter, block, lockup, path helpers)
_spec = importlib.util.spec_from_file_location(
    "buildlogos", os.path.join(HERE, "build-logos.py"))
bl = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(bl)

BRI, BRI8, MONO = bl.BRI, bl.BRI8, bl.MONO
nfmt, circle, rrect, g = bl.nfmt, bl.circle, bl.rrect, bl.g

INK = "#23201C"
TIN = "#BE3A2B"
NAME = "Treasure Trove Finds"


# ================================================== the island, taken off a map
LAT0 = 40.85
K = math.cos(math.radians(LAT0))
LON_W, LAT_N = -74.0419691, 41.161155           # OSM bbox corner of the island
SPAN = (74.0419691 - 71.8562705) * K            # island length in flat degrees
SX = K * 100.0 / SPAN                           # 45.75 units per degree longitude
SY = 100.0 / SPAN                               # 60.47 units per degree latitude


def P(lat, lon, sharp=False, dy=0.0):
    """A real place, projected. dy nudges a shore for legibility, in units of
    1.85 km, and every nudge is written down so it can be argued with."""
    return ((lon - LON_W) * SX, (LAT_N - lat) * SY + dy, sharp)


OUTLINE = [
    # --- north shore, west to east, along the outer envelope of the necks ---
    P(40.740, -73.961),               # Greenpoint, the East River corner
    P(40.782, -73.855),               # Queens, Bowery Bay
    P(40.820, -73.765),               # Kings Point, tip of Great Neck
    P(40.838, -73.712, dy=0.9),       # Manhasset Bay, a soft scallop
    P(40.878, -73.640),               # Sands Point into Glen Cove
    P(40.892, -73.560, dy=0.9),       # Oyster Bay, a soft scallop
    P(40.945, -73.480),               # Lloyd Point
    P(40.958, -73.400),               # Eatons Neck Point
    P(40.918, -73.320, dy=0.6),       # Smithtown Bay, the one real dip
    P(40.955, -73.155),               # Crane Neck Point, Old Field
    P(40.968, -73.070),               # Port Jefferson
    P(40.958, -72.870),               # Wading River
    P(40.968, -72.750),               # Roanoke Point            <- fork base, N
    # --- north fork, Sound shore ---
    P(40.995, -72.590, dy=-0.9),
    P(41.030, -72.500, dy=-0.9),
    P(41.090, -72.420, dy=-0.7),
    P(41.135, -72.310, dy=-0.2),
    P(41.161, -72.239, sharp=True),   # ORIENT POINT
    # --- north fork, Peconic Bay shore, back west ---
    P(41.118, -72.320, dy=2.8),
    P(41.060, -72.400, dy=3.2),
    P(40.995, -72.480, dy=3.0),
    P(40.945, -72.600, dy=2.0),
    P(40.917, -72.667, sharp=True),   # RIVERHEAD, head of Peconic Bay
    # --- south fork, Peconic Bay shore, east ---
    P(40.898, -72.590, dy=0.4),
    P(40.900, -72.500, dy=0.6),
    P(40.940, -72.420, dy=0.9),
    P(41.005, -72.300, dy=1.1),       # Sag Harbor and North Haven
    P(41.010, -72.230, dy=0.9),       # Barcelona Neck
    P(41.000, -72.060, dy=-0.8),      # Napeague, the narrow waist
    P(41.055, -71.940, dy=-0.5),      # Culloden Point
    P(41.069, -71.859, sharp=True),   # MONTAUK POINT
    # --- Atlantic shore, back west ---
    P(41.030, -71.920, dy=1.6),       # Ditch Plains, the terminal knob
    P(40.985, -72.030, dy=1.4),       # Napeague south
    P(40.938, -72.100),               # Amagansett
    P(40.925, -72.230),               # Georgica, East Hampton
    P(40.870, -72.390),               # Southampton
    P(40.840, -72.475),               # Shinnecock
    P(40.815, -72.650),               # Westhampton              <- fork base, S
    P(40.788, -72.870),               # Moriches
    P(40.750, -73.000),               # Patchogue
    P(40.730, -73.100),               # Sayville
    P(40.712, -73.250),               # Bay Shore
    P(40.660, -73.420),               # Amityville
    P(40.635, -73.580),               # Freeport
    P(40.600, -73.660),               # Island Park
    P(40.598, -73.750),               # Far Rockaway
    P(40.560, -73.935, sharp=True),   # BREEZY POINT, tip of the spit
    P(40.655, -73.860),               # Rockaway Inlet, the notch apex
    P(40.588, -73.995),               # Coney Island
    P(40.638, -74.042, sharp=True),   # Bay Ridge, the westernmost point
]

SHELTER = P(41.062, -72.335)[:2]      # Shelter Island, one dot between the forks
FORK_BASE = (12, 37)                  # OUTLINE indices: Roanoke Point, Westhampton
TENSION = 0.62

ISLAND_PTS = [(x, y) for x, y, _ in OUTLINE]
ISLAND_SHARP = {i for i, (_, _, s) in enumerate(OUTLINE) if s}


def _forks():
    a, b = FORK_BASE
    seg = [(x, y) for x, y, _ in OUTLINE[a:b + 1]]
    apex = (seg[0][0] - 21.0, (seg[0][1] + seg[-1][1]) / 2)
    sharp = {0} | {j + 1 for j, (_, _, s) in enumerate(OUTLINE[a:b + 1]) if s}
    return [apex] + seg, sharp


FORK_PTS, FORK_SHARP = _forks()


def smooth(points, sharp, tension=TENSION):
    """Catmull-Rom through the control points, emitted as cubic beziers. Points
    flagged sharp keep their corner, which is what makes Orient Point, Montauk
    Point and Breezy Point headlands instead of blobs."""
    n = len(points)
    out = [f"M{nfmt(points[0][0])},{nfmt(points[0][1])}"]
    for i in range(n):
        p0, p1 = points[(i - 1) % n], points[i]
        p2, p3 = points[(i + 1) % n], points[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6 * tension,
              p1[1] + (p2[1] - p0[1]) / 6 * tension)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6 * tension,
              p2[1] - (p3[1] - p1[1]) / 6 * tension)
        if i in sharp:
            c1 = p1
        if (i + 1) % n in sharp:
            c2 = p2
        out.append(f"C{nfmt(c1[0])},{nfmt(c1[1])} {nfmt(c2[0])},{nfmt(c2[1])} "
                   f"{nfmt(p2[0])},{nfmt(p2[1])}")
    return " ".join(out) + "Z"


def mapper(points, rot, box, pad_pts=()):
    """Returns a function that drops unit-space points into box=(x,y,w,h),
    rotated and scaled to fit, optically centred on the bounding box. The
    transform is baked into coordinates rather than applied as a group
    transform, so island paths can be punched out of plates in one path."""
    r = math.radians(rot)
    ca, sa = math.cos(r), math.sin(r)
    q = [(x * ca - y * sa, x * sa + y * ca) for x, y in list(points) + list(pad_pts)]
    x0, x1 = min(a for a, _ in q), max(a for a, _ in q)
    y0, y1 = min(b for _, b in q), max(b for _, b in q)
    bx, by, bw, bh = box
    s = min(bw / (x1 - x0), bh / (y1 - y0))
    tx = bx + (bw - s * (x1 - x0)) / 2 - s * x0
    ty = by + (bh - s * (y1 - y0)) / 2 - s * y0

    def f(x, y):
        return (tx + s * (x * ca - y * sa), ty + s * (x * sa + y * ca))
    f.scale = s
    return f


def island_at(rot, box, pad_pts=(), tension=TENSION):
    """The island silhouette as path data, already sitting inside box."""
    m = mapper(ISLAND_PTS, rot, box, pad_pts)
    return smooth([m(x, y) for x, y in ISLAND_PTS], ISLAND_SHARP, tension), m


def forks_at(rot, box):
    m = mapper(FORK_PTS, rot, box)
    return smooth([m(x, y) for x, y in FORK_PTS], FORK_SHARP), m


# ===================================================================== plumbing
def ellipse(cx, cy, rx, ry):
    return (f"M{nfmt(cx - rx)},{nfmt(cy)}"
            f"a{nfmt(rx)},{nfmt(ry)} 0 1,0 {nfmt(2 * rx)},0"
            f"a{nfmt(rx)},{nfmt(ry)} 0 1,0 {nfmt(-2 * rx)},0Z")


def stroked(d, w, color=INK):
    return (f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{nfmt(w)}"'
            f' stroke-linecap="round" stroke-linejoin="round"/>')


def one_colour(body):
    body = re.sub(r'fill="#[0-9A-Fa-f]{6}"', 'fill="currentColor"', body)
    return re.sub(r'stroke="#[0-9A-Fa-f]{6}"', 'stroke="currentColor"', body)


FILES = {}
MARKS = {}


def svg(name, comment, vb, body, title, colour_attr=False):
    style = f' style="color:{INK}"' if colour_attr else ""
    out = (f"<!-- Treasure Trove Finds | {comment} -->\n"
           f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
           f'role="img" aria-label="{title}"{style}>'
           f"<title>{title}</title>{body}</svg>\n")
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
        fh.write(out)
    FILES[name] = (vb, body)


# A place silhouette should never have to identify itself, so every lockup that
# uses the island carries the words that name it. The shape is the confirming
# detail, not the clue. Standalone marks stay wordless.
WORDLINE = "LONG ISLAND TO LAS VEGAS"
WORD = [(BRI, "Treasure Trove", 25.5, -0.018, 24.5, INK),
        (BRI, "Finds", 25.5, -0.018, 18.5, INK),
        (MONO, WORDLINE, 9.2, 0.175, 0, INK)]

LOCKUP_TITLE = f"{NAME}, Long Island to Las Vegas"


def emit(num, slug, title, colour_mark, solid_mark, lines=None):
    """Three files per concept: the lockup, the mark alone, the one colour cut."""
    n = f"{num:02d}-{slug}"
    lines = lines or WORD
    MARKS[n] = colour_mark
    svg(f"{n}-mark.svg", f"{title}. Mark, built to hold at 32 pixels.",
        "0 0 64 64", colour_mark, f"{NAME}, {title.lower()} mark")

    lk, w = bl.lockup(colour_mark, 64, lines, gap=20)
    svg(f"{n}-lockup.svg",
        f"{title}. Horizontal lockup for the site header. The support line names "
        f"the place so the silhouette never has to.",
        f"0 0 {nfmt(w)} 64", lk, LOCKUP_TITLE)

    ml, mw = bl.lockup(solid_mark, 64, lines, gap=20)
    svg(f"{n}-mono.svg",
        f"{title}. One colour. Everything is currentColor, ink by default; set "
        f"color to oat to reverse it on ink.",
        f"0 0 {nfmt(mw)} 64", one_colour(ml), LOCKUP_TITLE, colour_attr=True)


# ============================================================ 01 THE ISLAND KEY
RING = (-25.0, 28.6, 18.6, 9.8)       # bow: centre x, centre y, outer r, inner r


def build_01():
    """Ring at the west end, island as the shank, the two forks as the bit."""
    RCX, RCY, RO, RI = RING
    pad = [(RCX - RO, RCY - RO), (RCX + RO, RCY + RO)]
    d, m = island_at(-26, (4, 4, 56, 56), pad)
    cx, cy = m(RCX, RCY)
    s = m.scale
    ring = circle(cx, cy, RO * s) + circle(cx, cy, RI * s)
    collar = _rot_rect(m, RCX + 11, RCY - 6.6, 20, 13.2)
    body = g(ring, INK, evenodd=True) + g(d + " " + collar, INK)
    dot = g(circle(*m(*SHELTER), 2.1 * s), TIN)
    emit(1, "island-key", "The island key", body + dot, body)


def _rot_rect(m, x, y, w, h):
    p = [m(x, y), m(x + w, y), m(x + w, y + h), m(x, y + h)]
    return "M" + " L".join(f"{nfmt(a)},{nfmt(b)}" for a, b in p) + "Z"


# =========================================================== 02 KEYHOLE ISLAND
def build_02():
    """An escutcheon plate whose negative space is the island."""
    d, m = island_at(0, (6, 22.2, 52, 19.6))
    plate = rrect(3, 9.5, 58, 45, 11)
    screws = circle(32, 15.2, 2.4) + circle(32, 48.8, 2.4)
    solid = g(f"{plate} {screws} {d}", INK, evenodd=True)
    dot = g(circle(*m(*SHELTER), 2.3 * m.scale), TIN)
    emit(2, "keyhole-island", "Keyhole island", solid + dot, solid)


# =============================================================== 03 ISLAND TAG
def build_03():
    """A manila tag with the island on it, and a real string through the hole."""
    tag = ("M20,14H57A3.4,3.4 0 0 1 60.4,17.4V46.6A3.4,3.4 0 0 1 57,50H20"
           "L11.4,35.4a3.4,3.4 0 0 1 0,-6.8Z")
    hole = circle(19.5, 32, 3.2)
    d, m = island_at(0, (24.5, 25.6, 33, 12.8))
    price = rrect(25, 42.4, 10.4, 3.8, 1.9)
    string = "M19.5,29.4C15.6,24.6 10.2,23.8 7.6,18.4"
    solid = g(f"{tag} {hole} {d} {price}", INK, evenodd=True) + stroked(string, 2.8)
    colour = (g(f"{tag} {hole} {d}", INK, evenodd=True) + g(price, TIN)
              + stroked(string, 2.8))
    emit(3, "island-tag", "The island tag", colour, solid)


# ============================================================ 04 CHEST + ISLAND
def build_04():
    """A trunk whose escutcheon plate, across the lid seam, is the island."""
    # lid and body are one contour, or the shared edge shows as a hairline
    trunk = "M6,30A26,20 0 0 1 58,30V55H6Z"
    feet = rrect(8, 55, 9.4, 4.6, 1.4) + rrect(46.6, 55, 9.4, 4.6, 1.4)
    d, m = island_at(0, (9, 21.6, 46, 17.4))
    solid = g(f"{trunk} {feet} {d}", INK, evenodd=True)
    dot = g(circle(*m(*SHELTER), 2.2 * m.scale), TIN)
    emit(4, "chest-island", "Chest and island", solid + dot, solid)


# ========================================================= 05 ISLAND ON A STRING
def build_05():
    """The island hanging as a charm from a tag string."""
    string = "M4.6,8.6C13,9.4 21.4,13.8 27.6,20.8"
    ring = circle(29.8, 26.2, 5.8) + circle(29.8, 26.2, 3.1)
    bail = rrect(28.2, 29.4, 3.2, 8.6, 1.6)
    d, m = island_at(0, (3, 30, 58, 21))
    body = (stroked(string, 2.6) + g(bail, INK) + g(ring, INK, evenodd=True)
            + g(d, INK))
    dot = g(circle(*m(*SHELTER), 2.0 * m.scale), TIN)
    emit(5, "island-charm", "Island on a string", body + dot, body)


# ============================================================== 06 ESCUTCHEON
def build_06():
    """A maker's mark: brass oval plate, island above, keyhole below."""
    ring = ellipse(32, 32, 25.6, 31) + ellipse(32, 32, 22, 27.4)
    d, m = island_at(0, (11.4, 17.6, 41.2, 15.2))
    key = (circle(32, 40.6, 4.2)
           + "M29.4,43.8h5.2l1.8,7.4a2.5,2.5 0 0 1 -2.5,3.1H30.1"
             "a2.5,2.5 0 0 1 -2.5,-3.1Z")
    solid = g(f"{ring} {d} {key}", INK, evenodd=True)
    dot = g(circle(*m(*SHELTER), 2.2 * m.scale), TIN)
    emit(6, "escutcheon", "The escutcheon", solid + dot, solid)


# ================================================================= 07 THE FORKS
def build_07():
    """The two-fork east end alone, tapered west so it reads as a direction."""
    d, m = forks_at(-21, (5, 5, 54, 54))
    solid = g(d, INK)
    dot = g(circle(*m(*SHELTER), 2.3 * m.scale), TIN)
    emit(7, "the-forks", "The forks", solid + dot, solid)


# =========================================================== 08 LOCK AND ISLAND
def build_08():
    """A padlock with the island cut out of the body."""
    shackle = ("M20.4,30V24.6a11.6,11.6 0 0 1 23.2,0V30H38.2V24.6"
               "a6.2,6.2 0 0 0 -12.4,0V30Z")
    body = rrect(8.6, 27.4, 46.8, 30.6, 6.4)
    d, m = island_at(0, (12, 33.4, 40, 15))
    solid = g(shackle, INK) + g(f"{body} {d}", INK, evenodd=True)
    dot = g(circle(*m(*SHELTER), 2.2 * m.scale), TIN)
    emit(8, "lock-island", "Lock and island", solid + dot, solid)


# ============================================================ 09 ISLAND MONOGRAM
def build_09():
    """TTF with the letters' shared crossbar replaced by the island."""
    d, m = island_at(0, (2, 7, 60, 19))
    top, bot, wdt = 16.5, 51.5, 8.4
    stems = "".join(rrect(x, top, wdt, bot - top, 0.8) for x in (10.5, 26.5, 42.5))
    arm = rrect(42.5, 33, 15.5, 6.6, 0.8)
    solid = g(f"{d} {stems} {arm}", INK)
    dot = g(circle(*m(*SHELTER), 1.9 * m.scale), TIN)
    emit(9, "island-monogram", "Island monogram", solid + dot, solid)


# ============================================================== 10 KEY AND TAG
def build_10():
    """The island key with a tag tied to its ring."""
    RCX, RCY, RO, RI = RING
    pad = [(RCX - RO, RCY - RO), (RCX + RO, RCY + RO)]
    d, m = island_at(-16, (6, 27, 57, 33), pad)
    cx, cy = m(RCX, RCY)
    s = m.scale
    ring = circle(cx, cy, RO * s) + circle(cx, cy, RI * s)
    collar = _rot_rect(m, RCX + 11, RCY - 6.6, 20, 13.2)
    key = g(ring, INK, evenodd=True) + g(d + " " + collar, INK)

    tag = ("M25,3.4H46.4A2.6,2.6 0 0 1 49,6V18.4A2.6,2.6 0 0 1 46.4,21H25"
           "L19.2,14.4a2.3,2.3 0 0 1 0,-4.2Z")
    hole = circle(24.4, 12.2, 2.2)
    rule = rrect(28.6, 9.2, 14.4, 2.2, 1.1) + rrect(28.6, 14.2, 9.6, 2.2, 1.1)
    string = (f"M24.4,14.6C23.4,19.6 {nfmt(cx - 2)},{nfmt(cy - 13)} "
              f"{nfmt(cx)},{nfmt(cy - RO * s + 1.6)}")
    body = stroked(string, 2.2) + key + g(f"{tag} {hole} {rule}", INK, evenodd=True)
    emit(10, "key-tag", "Key and tag", body, body)


# ================================================================= 11 WORDLINE
def build_11():
    """The control. No island at all: the words carry the geography, so nothing
    has to be decoded. The mark is a route, one dot to the other."""
    route = "M14.6,43.8C24.4,43.8 31.6,33 48.4,23.4"
    a, b = circle(12.6, 43.8, 5.4), circle(50.4, 23.4, 5.4)
    body = stroked(route, 4.6) + g(a, INK)
    colour = body + g(b, TIN)
    solid = body + g(b, INK)

    # the wordline becomes structure here: a rule above it and a rule below
    lead1, lead2 = 24.0, 15.5
    lines = [(BRI, "Treasure Trove", 25, -0.018, lead1, INK),
             (BRI, "Finds", 25, -0.018, lead2, INK),
             (MONO, WORDLINE, 9.2, 0.175, 0, INK)]
    base3 = lead1 + lead2                      # baseline of the wordline
    for mark, name, cmt, one in (
            (colour, "11-wordline-lockup.svg",
             "The wordline. Horizontal lockup. The support line is set as "
             "structure, ruled above and below.", False),
            (solid, "11-wordline-mono.svg",
             "The wordline. One colour. Everything is currentColor, ink by "
             "default; set color to oat to reverse it on ink.", True)):
        body_t, bb = bl.block(lines)
        w_word = MONO.measure(WORDLINE, 9.2, 0.175)
        right = max(bb[2], bb[0] + w_word)
        top_rule, bot_rule = base3 - 11.1, base3 + 2.8
        rules = (rrect(bb[0], top_rule, right - bb[0], 1.3, 0.65)
                 + rrect(bb[0], bot_rule, right - bb[0], 1.3, 0.65))
        block = body_t + g(rules, INK)
        dx = 64 + 20 - bb[0]
        dy = 32 - (bb[1] + bot_rule + 1.3) / 2
        lk = mark + bl.group(block, dx, dy)
        total = dx + right + 1
        out = one_colour(lk) if one else lk
        svg(name, cmt, f"0 0 {nfmt(total)} 64", out, LOCKUP_TITLE,
            colour_attr=one)

    svg("11-wordline-mark.svg",
        "The wordline. Mark: the route itself, Long Island to Las Vegas.",
        "0 0 64 64", colour, f"{NAME}, route mark")
    MARKS["11-wordline"] = colour


CONCEPTS = [
    ("01-island-key", "The island key",
     "Long Island already looks like a key, so give it a bow and let it be one. "
     "The two forks are the bit, and the thing you unlock is the trove.",
     None),
    ("02-keyhole-island", "Keyhole island",
     "An escutcheon plate off a display case, with the island as the hole you "
     "look through. Bill leaves his cases unlocked, so the mark says look, not keep out.",
     None),
    ("03-island-tag", "The island tag",
     "Bill ties a handwritten tag to every piece, so the tag is the business. "
     "This one carries the island, and the red block is the price he writes last.",
     None),
    ("04-chest-island", "Chest and island",
     "A trunk with the island as its lock plate, straddling the seam where the "
     "lid opens. The trove is literal here, which is the risk and the appeal.",
     "The chest is the most expected shape in the set. It reads instantly and it "
     "argues least."),
    ("05-island-charm", "Island on a string",
     "The island hung from a tag string like a charm, the way a small good thing "
     "comes tied to a bigger one.",
     "The string and the jump ring are the thinnest lines in the suite. This one "
     "is a stationery mark, not a favicon."),
    ("06-escutcheon", "The escutcheon",
     "A maker's mark in a brass oval: where it comes from above, the way in below. "
     "Struck, not drawn, the way a foundry marked the base of old tin.",
     None),
    ("07-the-forks", "The forks",
     "Only the east end, tapered to a point. It is Orient and Montauk to anyone "
     "from there, and an arrow pointing east to everyone else.",
     None),
    ("08-lock-island", "Lock and island",
     "A padlock with the island cut clean out of the body. The heaviest, most "
     "stampable shape here, and the one that holds a square best.",
     None),
    ("09-island-monogram", "Island monogram",
     "Three letters sharing one crossbar, and the crossbar is the island. The "
     "forks run out past the F like a flourish.",
     "The weakest small. Below about 40 pixels the three stems stop reading as "
     "T, T and F and start reading as a comb."),
    ("10-key-tag", "Key and tag",
     "The key with Bill's tag tied to it. It is the whole promise in one object: "
     "the place, the way in, and the record that comes with it.",
     "Two objects in one mark. Handsome at letterhead size, crowded below 48 pixels."),
    ("11-wordline", "The wordline",
     "The control. No island at all: the words do the geography, ruled above and "
     "below so the route is structure rather than a tagline. Nothing to decode.",
     "It gives up the one shape that is only theirs. Safest to read, easiest to "
     "forget, and the mark alone says less than any island here."),
]


# ==================================================================== the page
def build_index():
    syms = []
    for slug, _, _, _ in CONCEPTS:
        vb, body = FILES[f"{slug}-mono.svg"]
        syms.append(f'<symbol id="m-{slug}" viewBox="{vb}">{body}</symbol>')

    tabs = "".join(
        f'<span class="tab"><img src="{slug}-mark.svg" alt="" width="24" '
        f'height="24"><b>Treasure Trove Finds</b><i>{slug[:2]}</i></span>'
        for slug, _, _, _ in CONCEPTS)

    nav = "".join(f'<a href="#{slug}">{slug[:2]} {title}</a>'
                  for slug, title, _, _ in CONCEPTS)

    secs = []
    for slug, title, why, weak in CONCEPTS:
        vb = FILES[f"{slug}-mono.svg"][0]
        note = (f'<p class="weak"><span>Honest note</span>{weak}</p>' if weak else "")
        secs.append(f"""
<section class="con" id="{slug}">
  <div class="con-head">
    <p class="eyebrow">Concept {slug[:2]}</p>
    <h2>{title}</h2>
    <p class="why">{why}</p>
    {note}
  </div>
  <div class="panels">
    <figure class="panel w4">
      <div class="stage"><img src="{slug}-lockup.svg" alt="{title} horizontal lockup" class="lockup"></div>
      <figcaption>Horizontal lockup. Site header and letterhead.</figcaption>
    </figure>
    <figure class="panel w2">
      <div class="stage sizes">
        <img src="{slug}-mark.svg" alt="{title} mark at 96 pixels" width="96" height="96">
        <img src="{slug}-mark.svg" alt="{title} mark at 48 pixels" width="48" height="48">
        <img src="{slug}-mark.svg" alt="{title} mark at 32 pixels" width="32" height="32">
      </div>
      <figcaption>Mark at 96, 48 and 32 pixels.</figcaption>
    </figure>
    <figure class="panel w4">
      <div class="duo">
        <div class="stage one"><svg viewBox="{vb}" class="mono" role="img" aria-label="{title} in one colour on oat"><use href="#m-{slug}"/></svg></div>
        <div class="stage one rev"><svg viewBox="{vb}" class="mono" role="img" aria-label="{title} reversed on ink"><use href="#m-{slug}"/></svg></div>
      </div>
      <figcaption>One colour. Solid ink on oat, and reversed to oat on ink.</figcaption>
    </figure>
    <figure class="panel w2">
      <div class="stage fit">
        <span class="hold circle"><img src="{slug}-mark.svg" alt=""></span>
        <span class="hold square"><img src="{slug}-mark.svg" alt=""></span>
      </div>
      <figcaption>Optical fit inside a circle and a square.</figcaption>
    </figure>
    <figure class="panel w6">
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
<title>Treasure Trove Finds &middot; Eleven logo concepts, Long Island</title>
<meta name="description" content="Eleven logo concepts for Treasure Trove Finds built on the silhouette of Long Island, each with a lockup, a small mark and a one colour version.">
<link rel="icon" href="01-island-key-mark.svg">
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
h1,h2{{font-family:var(--display);font-weight:700;line-height:1.04;margin:0;
  letter-spacing:-.02em}}
h1{{font-size:clamp(32px,7.5vw,56px)}}
h2{{font-size:clamp(25px,4vw,36px)}}
p{{margin:0 0 1em}}
.wrap{{width:100%;max-width:1240px;margin:0 auto;padding-inline:18px}}
@media (min-width:900px){{.wrap{{padding-inline:40px}}}}
.eyebrow{{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--ink-soft);margin:0 0 10px}}
.lede{{font-size:clamp(17px,2.2vw,21px);max-width:58ch}}
.note{{max-width:60ch;margin-top:18px;padding-left:15px;
  border-left:2px solid var(--tin)}}
.note b{{font-family:var(--display);font-weight:600}}
header.top{{padding-block:40px 22px}}
.legend{{font-family:var(--mono);font-size:12.5px;line-height:1.6;
  color:var(--ink-soft);max-width:64ch;margin-top:16px}}

/* judge them small first */
.strip{{background:var(--paper);border:1px solid var(--oak-line);border-radius:14px;
  padding:16px;margin-block:26px 6px}}
.strip > p{{font-family:var(--mono);font-size:11.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink-soft);margin:0 0 12px}}
.chrome{{background:var(--ink);border-radius:10px 10px 0 0;padding:9px 9px 0;
  display:flex;gap:5px;overflow-x:auto;scrollbar-width:none}}
.chrome::-webkit-scrollbar{{display:none}}
.tab{{flex:0 0 auto;display:flex;align-items:center;gap:8px;background:var(--oat);
  border-radius:8px 8px 0 0;padding:9px 12px;max-width:196px}}
.tab img{{width:24px;height:24px;flex:0 0 auto}}
.tab b{{font-family:var(--display);font-weight:500;font-size:12.5px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.tab i{{font-family:var(--mono);font-style:normal;font-size:11px;color:var(--ink-soft)}}

.jump{{display:flex;flex-wrap:wrap;gap:6px;padding-bottom:8px}}
.jump a{{font-family:var(--mono);font-size:11.5px;text-decoration:none;
  color:var(--ink-soft);border:1px solid var(--oak-line);border-radius:999px;
  padding:5px 11px}}
.jump a:hover{{color:var(--ink);border-color:var(--ink)}}

.con{{padding-block:40px}}
.con + .con{{border-top:1px solid var(--oak-line)}}
.con-head{{max-width:64ch;margin-bottom:22px}}
.why{{font-size:17.5px;margin:10px 0 0}}
.weak{{font-family:var(--mono);font-size:12.5px;line-height:1.6;
  color:var(--ink-soft);margin:14px 0 0;padding-left:14px;
  border-left:2px solid var(--tin)}}
.weak span{{display:block;color:var(--tin);letter-spacing:.14em;
  text-transform:uppercase;font-size:11px}}
.panels{{display:grid;gap:12px;grid-template-columns:1fr}}
@media (min-width:700px){{.panels{{grid-template-columns:1fr 1fr}}}}
@media (min-width:1080px){{.panels{{grid-template-columns:repeat(6,1fr)}}
  .w2{{grid-column:span 2}} .w4{{grid-column:span 4}} .w6{{grid-column:span 6}}}}
.panel{{margin:0;background:var(--paper);border:1px solid var(--oak-line);
  border-radius:14px;padding:15px;display:flex;flex-direction:column}}
.panel figcaption{{font-family:var(--mono);font-size:11.5px;line-height:1.5;
  color:var(--ink-soft);padding-top:13px;margin-top:auto}}
.panel .stage,.panel .duo{{flex:1}}
.stage{{display:flex;align-items:center;justify-content:center;gap:18px;
  min-height:112px;padding:14px 10px;background:var(--oat);border-radius:8px;
  flex-wrap:wrap}}
.lockup{{height:42px;width:auto}}
@media (min-width:1080px){{.lockup{{height:52px}}}}
.sizes{{align-items:flex-end;gap:20px}}
.duo{{display:grid;grid-template-columns:1fr;gap:10px}}
@media (min-width:520px){{.duo{{grid-template-columns:1fr 1fr}}}}
.duo .stage{{height:100%}}
.one{{min-height:96px}}
.mono{{height:34px;width:auto;color:var(--ink)}}
@media (min-width:1080px){{.mono{{height:40px}}}}
.rev{{background:var(--ink)}}
.rev .mono{{color:var(--oat)}}
.hold{{display:grid;place-items:center;width:96px;height:96px;
  background:var(--oat-deep)}}
.hold.circle{{border-radius:50%}}
.hold.square{{border-radius:4px}}
.hold img{{width:54px;height:54px}}
.bar{{padding:0;background:var(--oat-deep);align-items:flex-start;min-height:0}}
.mockhead{{display:flex;align-items:center;gap:14px;width:100%;padding:13px 16px;
  background:var(--oat);border-bottom:1px solid var(--oak-line);border-radius:8px}}
.mockhead img{{height:26px;width:auto}}
.mockhead em{{margin-left:auto;font-family:var(--display);font-style:normal;
  font-weight:600;font-size:13px;background:var(--tin);color:var(--paper);
  padding:8px 14px;border-radius:6px;white-space:nowrap}}

footer.foot{{background:var(--ink);color:var(--oat);padding-block:36px;
  margin-top:30px}}
.foot h2{{font-size:21px;margin-bottom:12px}}
.foot p{{color:rgba(244,238,226,.72);max-width:62ch}}
.foot ul{{list-style:none;margin:0;padding:0;font-family:var(--mono);
  font-size:12px;columns:2;column-gap:24px;max-width:660px;
  color:rgba(244,238,226,.72)}}
@media (min-width:900px){{.foot ul{{columns:3}}}}
.foot li{{margin-bottom:5px;break-inside:avoid}}
</style>
</head>
<body>

<header class="top wrap">
  <p class="eyebrow">Treasure Trove Finds &middot; Brand marks, round two</p>
  <h1>Eleven logo concepts,<br>built on Long Island</h1>
  <p class="lede">Long Island is long and narrow, blunt at the west end, and it
  splits into two forks at the east. Put a bow on the west end and the whole
  island reads as a key, with the forks as the bit. One shape carries where Bill
  is from, the keyhole, and the key to a trove.</p>
  <p class="note">Every island lockup carries the line <b>Long Island to Las
  Vegas</b>, because a place silhouette should never have to identify itself.
  The words name the place, the shape is what you notice second, and the
  standalone marks stay wordless. Concept 11 is the control: the same geography
  with nothing at all to decode.</p>
  <p class="legend">The island is not invented. Every control point is a real
  place converted from its latitude and longitude, checked against the
  OpenStreetMap coastline. Two shores are drawn wider than life so they survive
  32 pixels: the North Fork, and the Napeague waist below Montauk. Colours are
  the booth palette. Type is Bricolage Grotesque and DM Mono, converted to
  outlines, so nothing here needs a font file.</p>

  <div class="strip">
    <p>Judge them small first. All eleven at 24 pixels, in a browser tab.</p>
    <div class="chrome">{tabs}</div>
  </div>
  <nav class="jump">{nav}</nav>
</header>

<main class="wrap">
{''.join(secs)}
</main>

<footer class="foot">
  <div class="wrap">
    <h2>Thirty three files, all vector</h2>
    <p>Saved in public/brand/logos2. Rebuild them with scripts/build-logos2.py.
    No raster, no external assets, no font references.</p>
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
    for i in range(1, 12):
        globals()[f"build_{i:02d}"]()
    build_index()
    total = 0
    for f in sorted(os.listdir(OUT)):
        if f.endswith(".svg"):
            n = os.path.getsize(os.path.join(OUT, f))
            total += n
            print(f"{n:>7} {f}")
    print(f"{total:>7} total in {len([f for f in os.listdir(OUT) if f.endswith('.svg')])} files")
