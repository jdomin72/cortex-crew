#!/usr/bin/env python3
"""Generate web media from assets-src/ into public/media/.

    python3 scripts/build_media.py        # from the repo root
    bun run media                         # same thing

Outputs are COMMITTED to git. Vercel never runs this — there is no Python step
in the deploy. Re-run it only when something in assets-src/ changes.

Only dependency is Pillow (12.2 confirmed on this machine, WebP encode = True).
cwebp / ImageMagick / pngquant are NOT installed here, so everything is PIL.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src"
PUB = ROOT / "public"
OUT = PUB / "media"

BASE = (5, 5, 8)  # #050508 — the site background
WEBP = dict(format="WEBP", method=6)  # 6 = slowest / smallest


# ─────────────────────────────── helpers ───────────────────────────────


def save(im: Image.Image, path: Path, quality: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, quality=quality, **WEBP)
    kb = path.stat().st_size // 1024
    print(f"  {path.relative_to(ROOT)}  {kb} KB  {im.width}x{im.height}")


def ladder(im, widths, out_dir: Path, stem: str, quality: int, square=False) -> None:
    for w in widths:
        h = w if square else round(im.height * w / im.width)
        save(im.resize((w, h), Image.LANCZOS), out_dir / f"{stem}-{w}.webp", quality)


def load(path: Path) -> Image.Image:
    """exif_transpose is MANDATORY — the phone JPEGs carry orientation tag 6 and
    come out rotated 90 degrees without it."""
    return ImageOps.exif_transpose(Image.open(path))


def circle_alpha(im: Image.Image) -> Image.Image:
    """Mask the square badge to its inscribed circle, 4x supersampled for a clean
    edge. Verified safe: the source corners are pure #000000 and the badge is a
    centred circle in a 1254x1254 frame."""
    s = im.width
    mask = Image.new("L", (s * 4, s * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, s * 4 - 1, s * 4 - 1), fill=255)
    out = im.convert("RGBA")
    out.putalpha(mask.resize((s, s), Image.LANCZOS))
    return out


def redact(im: Image.Image, boxes) -> Image.Image:
    """Blur rectangles containing personal data before the image ever ships.

    Applied at FULL source resolution, before any downscale, so no intermediate
    file on disk ever holds the readable version."""
    im = im.copy()
    for box in boxes:
        region = im.crop(box)
        # radius scales with the region so small crops still fully dissolve
        radius = max(12, min(region.width, region.height) // 4)
        im.paste(region.filter(ImageFilter.GaussianBlur(radius)), box)
    return im


# ─────────────────── per-photo crop + redaction config ───────────────────
#
# Crop windows are fractions of the (exif-corrected) source, verified by eye
# against each real file — a blind centre-crop decapitates people in group
# shots and cuts the prize cheques out of frame.
#
#   crop:   (x0, x1, y0) as fractions; height derives from the aspect ratio
#   redact: absolute pixel boxes in the exif-corrected source

AWARDS = {
    # Team + "CHAMPION BDT 12000" cheque, both legible.
    "csad-2026": {"crop": (0.06, 0.80, 0.12)},
    # "1st RUNNER-UP / Cortex Crew / BDT 10,000" cheque, centred and readable.
    "icadhi-2026": {"crop": (0.24, 0.60, 0.55)},
    #
    # ── Awaiting replacement photos from the team ──
    # The originals for these two were pulled before the site went public.
    # Drop a new file at assets-src/awards/<key>.jpg, uncomment its line, and
    # re-run this script; then add the matching `photo: award(...)` back in
    # src/data/site.ts. Set the crop by eye against the real file.
    #
    # NOTE the redaction on ai-hackathon-2026: the original showed a participant
    # badge with a name and contact line. Any replacement shot from that event
    # needs its own redaction box checked before publishing.
    #
    # "ai-hackathon-2026": {"crop": (0.06, 0.97, 0.16), "redact": [(1330, 2400, 1620, 2580)]},
    # "diu-ai-2026": {"crop": (0.04, 0.99, 0.22)},
}

AWARD_WIDTHS = [480, 720, 1080]
AWARD_ASPECT = (16, 10)
TEAM_WIDTHS = [160, 240, 336]
PROJECT_WIDTHS = [400, 640, 900]

# ──────────────────── per-portrait square crop config ────────────────────
#
# Portraits arrive framed however the person framed them, so one global
# centering cannot serve all of them — a head-and-shoulders shot and a
# full-body outdoor shot need different windows to land the face at the same
# size in an 88px avatar, and a row of avatars at mismatched face scales reads
# as a mistake. Same reasoning as the per-photo crops in AWARDS.
#
# Anything absent from here uses the default centering, which is correct for
# most supplied portraits. Set a window by eye at the REAL render size against
# the rest of the row, not against the full-resolution original.
#
#   x    horizontal centre of the crop, as a fraction of source width
#   y    top edge of the crop, as a fraction of source height
#   side crop side length, as a fraction of source width

TEAM_CROPS = {
    # Full-body shot in a wide outdoor frame. The default square crop left his
    # face ~15 px tall at 88 px — half of everyone else's.
    #
    # NOTE this window belongs to the PHOTO, not to the person. The Shafim and
    # Alok files were swapped on 2026-08-01 after being wired up the wrong way
    # round, and this key had to move with the image. If two portraits are ever
    # reassigned, move their crop windows too, or you silently apply one
    # person's framing to another person's photo.
    "shafiur-rahman": {"x": 0.565, "y": 0.275, "side": 0.55},
}


def crop_fractional(im: Image.Image, spec, aspect) -> Image.Image:
    x0f, x1f, y0f = spec
    x0, x1 = int(im.width * x0f), int(im.width * x1f)
    y0 = int(im.height * y0f)
    tw, th = aspect
    y1 = min(y0 + round((x1 - x0) * th / tw), im.height)
    return im.crop((x0, y0, x1, y1))


def crop_square(im: Image.Image, spec) -> Image.Image:
    """Explicit square window, for portraits the default centering frames badly.

    Clamped to the source on every edge, so an over-generous `side` yields the
    largest square that actually fits rather than a black border."""
    side = min(round(im.width * spec["side"]), im.width, im.height)
    x0 = max(0, min(round(im.width * spec["x"] - side / 2), im.width - side))
    y0 = max(0, min(round(im.height * spec["y"]), im.height - side))
    return im.crop((x0, y0, x0 + side, y0 + side))


# ─────────────────────────────── pipeline ───────────────────────────────


def build_logo() -> Image.Image:
    print("logo (circular alpha mask) ->")
    logo = circle_alpha(load(SRC / "cortex_crew_logo.png").convert("RGB"))
    ladder(logo, [256, 512, 768], OUT, "logo", 90, square=True)
    return logo


def build_icons(logo: Image.Image) -> None:
    print("icons ->")
    for px, name in ((180, "apple-touch-icon.png"), (32, "favicon-32.png")):
        small = logo.resize((px, px), Image.LANCZOS)
        # Must be OPAQUE — Safari fills transparent touch icons with white.
        flat = Image.new("RGB", (px, px), BASE)
        flat.paste(small, (0, 0), small)
        flat.save(PUB / name, "PNG", optimize=True)
        print(f"  public/{name}  {(PUB / name).stat().st_size // 1024} KB  {px}x{px}")


def build_banner_and_og() -> None:
    print("banner + og ->")
    banner = load(SRC / "cortex_crew_banner.png").convert("RGB")
    # Only 1000w is emitted: the banner is not rendered in the page (the hero uses
    # the logo badge), so this exists purely as a spare asset for posts/slides.
    ladder(banner, [1000], OUT, "banner", 78)
    # Letterbox, do NOT crop: the banner is 2.40:1 and OG wants 1.905:1, so a
    # centre-crop would cut the hooded figure and the trophy off both ends.
    og = ImageOps.pad(banner, (1200, 630), color=BASE, centering=(0.5, 0.5), method=Image.LANCZOS)
    og.save(OUT / "og.jpg", "JPEG", quality=86, optimize=True, progressive=True)
    print(f"  public/media/og.jpg  {(OUT / 'og.jpg').stat().st_size // 1024} KB  1200x630")


def build_awards() -> None:
    print("awards ->")
    directory = SRC / "awards"
    if not directory.exists():
        print("  (skip — assets-src/awards/ not present)")
        return
    for path in sorted(directory.iterdir()):
        if path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        cfg = AWARDS.get(path.stem)
        if cfg is None:
            print(f"  ! {path.name}: no crop config — add one to AWARDS. Skipped.")
            continue
        im = load(path).convert("RGB")
        if cfg.get("redact"):
            im = redact(im, cfg["redact"])
            print(f"  · {path.stem}: redacted {len(cfg['redact'])} region(s)")
        im = crop_fractional(im, cfg["crop"], AWARD_ASPECT)
        ladder(im, AWARD_WIDTHS, OUT / "awards", path.stem, 78)


def build_square(src_sub: str, out_sub: str, widths, quality: int, centering, crops=None) -> None:
    print(f"{src_sub} ->")
    directory = SRC / src_sub
    if not directory.exists() or not any(directory.iterdir()):
        print(f"  (none yet — drop files into assets-src/{src_sub}/)")
        return
    for path in sorted(directory.iterdir()):
        if path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        im = load(path).convert("RGB")
        spec = (crops or {}).get(path.stem)
        if spec:
            im = crop_square(im, spec)
            print(f"  · {path.stem}: explicit crop window")
        else:
            side = min(im.width, im.height)
            im = ImageOps.fit(im, (side, side), method=Image.LANCZOS, centering=centering)
        ladder(im, widths, OUT / out_sub, path.stem, quality)


def build_projects() -> None:
    print("projects ->")
    directory = SRC / "projects"
    if not directory.exists() or not any(directory.iterdir()):
        print("  (none yet — projects render the generated fallback panel)")
        return
    for path in sorted(directory.iterdir()):
        if path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        im = load(path).convert("RGB")
        box = (im.width, round(im.width * 9 / 16))
        if box[1] > im.height:
            box = (round(im.height * 16 / 9), im.height)
        im = ImageOps.fit(im, box, method=Image.LANCZOS, centering=(0.5, 0.0))
        ladder(im, PROJECT_WIDTHS, OUT / "projects", path.stem, 80)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    logo = build_logo()
    build_icons(logo)
    build_banner_and_og()
    build_awards()
    # centering 0.35 vertically: a centred square crop of a portrait cuts the face.
    # TEAM_CROPS overrides that per file where the default frames the face badly.
    build_square("team", "team", TEAM_WIDTHS, 80, (0.5, 0.35), TEAM_CROPS)
    build_projects()
    total = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    print(f"\ndone. public/media total: {total // 1024} KB")


if __name__ == "__main__":
    main()
