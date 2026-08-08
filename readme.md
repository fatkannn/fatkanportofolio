# Portfolio v3 — Fatkan Muhrozi

Modern SaaS-style portfolio (Apple x Linear x Vercel aesthetic), built as
static HTML/CSS/JS — no build step, no framework.

## Final fix: Storyline scaling — minimal transform, verified by measurement

After removing the custom scaling code entirely (see the entry below this
one), a *new* bug surfaced: Storyline's own built-in `letterbox` scaling
engine turned out to only work correctly when the embed's native design
size is **smaller** than its container (no scaling needed). When the
native size is **larger** — Yuk Mengaji (1894×1174) and Menjaga
Disintegrasi (1124×1607) both need to scale *down* — Storyline's engine
silently fails and leaves `.presentation-wrapper` at `scale(1.00)`,
causing the oversized native content to overflow its container and get
cropped (this is why Argumentative Essay, whose native size 740×499 is
already smaller than any container it's placed in, looked correct while
the other two didn't).

**The actual fix**, now applied consistently to all three files
(`assets/embeds/yukmengaji/story_html5.html`,
`assets/embeds/menjaga-disintegrasi/story_html5.html`,
`assets/embeds/argumentative-essay/index.html`):

```js
function fitStage() {
  var wrapper = document.querySelector('.presentation-wrapper');
  if (!wrapper) return;
  var nativeW = wrapper.offsetWidth;
  var nativeH = wrapper.offsetHeight;
  if (!nativeW || !nativeH) return;
  var scale = Math.min(window.innerWidth / nativeW, window.innerHeight / nativeH, 1);
  wrapper.style.transform = 'scale(' + scale + ')';
}
```

Two things make this version different from earlier (broken) attempts:
1. **Only sets `transform: scale(...)`** — never touches `top`/`left`/
   `translate`. Combined with `transform-origin: 0 0 !important` and the
   wrapper's own native `top:0; left:0` inline styles (which Storyline
   sets itself and which this code doesn't fight), the wrapper scales
   cleanly from its top-left corner with no position math to get wrong.
2. **`Math.min(..., 1)` caps the scale at 1** — never scales *up*, only
   down when needed. This is why applying it to Argumentative Essay
   (which didn't need scaling) doesn't break it: the formula evaluates to
   `scale(1)`, identical to doing nothing.

Verified by measuring `.presentation-wrapper`'s actual rendered
`getBoundingClientRect()` in a headless browser for all three modules —
each one now reports `x:0, y:0` and a width/height matching its container
exactly, with no manual visual guessing involved.

## Removed custom Storyline scaling entirely (superseded by the fix above)

The gap-above-content and stray-scrollbar bugs on Yuk Mengaji, Menjaga
Disintegrasi Indonesia, and Argumentative Essay were traced back to
**custom JavaScript scaling code** added across earlier sessions to work
around a scaling issue — that code itself was the actual bug. Investigation
found the CSS `transform: translate(-50%, -50%) scale(var(--fit-scale))`
approach produced an inconsistent transform origin under certain container
sizes, shrinking the visible content to roughly half its container instead
of filling it, and leaving elements with `position: fixed` (like the mute
button) stranded in the resulting empty space.

**Fix:** all custom scaling CSS/JS was removed from the three embed files
(`assets/embeds/yukmengaji/story_html5.html`,
`assets/embeds/menjaga-disintegrasi/story_html5.html`,
`assets/embeds/argumentative-essay/index.html`), each reduced to a plain
`html, body { margin:0; padding:0; width:100%; height:100%; overflow:hidden; }`.
Two of the three files also had their internal Storyline config set to
`scale: 'noscale'` (which disables all auto-scaling) — changed to
`scale: 'letterbox'` to match Yuk Mengaji's already-correct setting. With
`letterbox` mode and no competing custom transforms, Storyline's own
built-in scaling engine now fills the iframe completely on its own —
verified by measuring the `#preso` element's rendered size, which now
exactly matches its container (previously it was rendering at less than
half height).

If you ever re-export any of these three modules from Articulate Storyline
and replace the files, **do not add custom scaling CSS/JS again** — just
confirm `scale: 'letterbox'` is set in the story's JS config and leave the
CSS as the plain full-bleed rule above. The `.sc-embed-tall` /
`.sc-embed-portrait` `aspect-ratio` rules in `css/showcase.css` handle
sizing the outer container; the iframe content will scale itself to fit.

## Previous fix: Storyline embed height bug (Yuk Mengaji, Menjaga Disintegrasi, Argumentative Essay)

A CSS specificity bug was causing the three self-hosted Storyline modules
in the Academic Thesis Project section to render with a large empty gap
above the content and/or a scrollbar — even though the container's
`aspect-ratio` was mathematically correct. Root cause: `.sc-embed-wrap
iframe` sets a fixed `height: 480px` (added for the Kemendikdasmen/Lumi
embeds, which have no reliable native aspect ratio), and that fixed height
was overriding the `aspect-ratio` rule in `.sc-embed-tall iframe` /
`.sc-embed-portrait iframe` for the Storyline modules, since CSS ignores
`aspect-ratio` on an axis that already has an explicit `height`. Fixed by
adding `height: auto` explicitly in both of those more-specific selectors
so they properly reclaim control of their own aspect ratio. If you add
another tall/portrait Storyline embed later, make sure its wrapper class
also sets `height: auto` before its `aspect-ratio`, or it'll silently
inherit the 480px fallback again.

The background-music mute button on Yuk Mengaji (top-right circular icon)
was confirmed **not** the cause of this — it's kept as-is.

## New: "Explore My Work" button on the homepage

A button linking straight to `showcase.html` now sits between the
Featured Projects intro text and the logo grid on the homepage (in
`index.html`, inside `#projects`). Uses the same `.btn.btn-primary` style
as the hero's "View Projects" button for visual consistency.

## Latest adjustments: numbering removed, embed spacing fixed, Thriftbest video resized

**Section numbering removed.** The circular "01", "02"... badges next to
each project title on `showcase.html` are gone (`.sc-index` spans deleted
from the HTML). Titles now start flush left with just the category label
above them.

**Kemendikdasmen (Lumi Education) embeds — whitespace fix.** All 5 Lumi
iframes previously used a fixed `aspect-ratio: 1088/720` (matching Lumi's
own suggested embed size), but at the narrower width this page actually
renders them at, that ratio left visible empty space below the real
content. Fixed by:
1. Giving each iframe a unique `id="h5p-iframe-<runcode>"` and
   `class="h5p-iframe"`.
2. Adding Lumi's own **`h5p-resizer.js`** script (loaded once, near the end
   of `showcase.html`) — this is Lumi's official mechanism for having an
   embedded H5P activity report its real content height back to the parent
   page via `postMessage`, so the iframe auto-sizes to match instead of
   guessing a fixed ratio.
3. `.sc-embed-wrap iframe` now starts at a reasonable `height: 480px` as a
   fallback for the moment before the resizer script reports back.

If you swap in a different Lumi module later, just follow the same
pattern: give the iframe a unique id + the `h5p-iframe` class, and the
existing resizer script will handle it automatically — no per-module CSS
needed.

**Lemari Thriftbest — video thumbnail resized to match the slideshow.**
The "Video Rebranding" thumbnail was previously capped at `max-width: 460px`
while the "Logo Brief & Brand Guidance" slideshow above it was `720px`,
so the two looked mismatched in width. `.tb-video-wrap` is now also
`max-width: 720px`. The actual video stays in its native portrait
proportions once playing (centered, not stretched) — only the
thumbnail's container width changed.

## Latest update: homepage simplified to a logo grid, Creative Portfolio moved to showcase

**Homepage Featured Projects** is now a simple 8-logo grid (`#logoGrid` in
`index.html`, rendered from `FEATURED_DATA` in `js/data.js`). Each entry is
just `{ id, client, logo, href }` — no description, no tags, no modal. Every
logo links straight to its section on `showcase.html`. Order: Boga Group,
Lookmedia, Arkademi, Cariilmu, ICE Institute, Kemendikdasmen, LRT Jakarta,
Personal Client Project (→ links to `#sc-academic-thesis`, since that's
where the actual case study lives). Logo files are in
`assets/client-logos-v2/`.

**Creative Portfolio moved off the homepage entirely** and now lives at the
bottom of `showcase.html` (`#sc-creative`), styled as "Supporting visual
work." with a 4-column grid. It starts with only 4 tiles visible; a
"Load More" button reveals 4 more at a time until all are shown, then the
button disappears. This is driven by `js/creative-data.js`
(`CREATIVE_DATA_SC`, 15 tiles total — the original 8 plus 7 new sets: a
presentation-video reel, a promotion-video/reels set, and 5 new Instagram
feed sets from the "Secangkir Ilmu" folder) and rendered by `js/showcase.js`
(`renderCreativeGrid`, `initLoadMore`). Clicking any tile opens the same
gallery-modal pattern used elsewhere (image slideshow or video player,
depending on `isVideoSet`).

**New section: Lemari Thriftbest** (`#sc-thriftbest`, section 09 on
`showcase.html`) — a brand identity/rebranding project with two custom
interactive pieces:
- A **Logo Brief slideshow** (12 slides, `assets/thriftbest/logo-brief-*.jpg`)
  with its own lightweight prev/next carousel (`.tb-slideshow` in
  `css/showcase.css`, `initThriftbestSlideshow()` in `js/showcase.js`) —
  separate from the Creative Portfolio's gallery modal since this one is
  inline on the page, not a popup.
- An **inline video player** for the rebranding video
  (`assets/thriftbest/video-rebranding.mp4`, compressed from the original
  85MB to ~9.6MB). It shows a thumbnail by default; clicking it swaps in a
  native `<video controls>` element and calls `.play()` — **no autoplay,
  no popup, no new tab**, exactly as requested. See
  `initThriftbestVideo()` in `js/showcase.js`.

If you add more Creative Portfolio tiles later, just append an object to
`CREATIVE_DATA_SC` in `js/creative-data.js` — no HTML editing needed, the
grid and load-more logic re-run automatically.

## New: Project Showcase page

`showcase.html` is a dedicated, long-scroll case-study page — one detailed
section per Featured Project, with **live embedded demos** wherever a module
allows iframing. From the homepage, the Kemendikdasmen card's button ("View
Full Case Study") links directly to `showcase.html#sc-kemendikdasmen`.

- `css/showcase.css` — styling specific to this page (module cards, embed
  wrappers, jump nav). Reuses all color/spacing tokens from `css/style.css`.
- `js/showcase.js` — minimal JS: mobile nav toggle + icon rendering. No
  dependency on `data.js`/`main.js`, so this page works standalone.

### Kemendikdasmen section — structure

The Kemendikdasmen case study has two module sub-groups, matching the two
IFP curriculum tracks:

1. **Interactive Science Learning Modules — Phase B** (2 modules: *Ragam
   Bentang Alam Indonesia*, *Korelasi Ragam Bentang Alam dengan Profesi
   Masyarakat*)
2. **Interactive Social Studies Learning Modules — Grade 7–9** (3 modules:
   *Potensi Bencana Alam*, *Ekspor Impor*, *Potensi Indonesia Menjadi
   Negara Maju*)

Each module is its own `<article class="sc-module">` with a title, format/
grade/topic metadata line, description, and a live iframe embed. All 5
modules are live and playable directly on the page.

### Adding embeds for other projects

Currently only Kemendikdasmen (Lumi Education, iframe-friendly) and Yuk
Mengaji (Storyline via GitHub Pages, iframe-friendly) have live embeds.
Boga Group, LRT Jakarta, Lookmedia, and ICE Institute show a placeholder
visual + "no public demo available" note, since their deliverables are
confidential client work with no shareable link. If any of those ever get
a public demo, follow the same `sc-embed-wrap` + `<iframe>` pattern used
in the Kemendikdasmen section — a CSS class `.sc-embed-pending` (see
`css/showcase.css`) is still available if you ever need a "coming soon"
state for a new module while waiting on its embed link.

## Academic Thesis Project section (merged, self-hosted embeds)

Section 06 ("Academic Thesis Project") now bundles all four academic/thesis
projects into one section, matching the Kemendikdasmen section's pattern
(overview + multiple `sc-module-group` sub-items) instead of having each
project as its own top-level section:

- **Yuk Mengaji** — gamified Storyline module, embedded from
  `assets/embeds/yukmengaji/story_html5.html`
- **Menjaga Disintegrasi Indonesia** — Storyline module (portrait-designed,
  native canvas ~1124×1607), embedded from
  `assets/embeds/menjaga-disintegrasi/story_html5.html` using the
  `.sc-embed-portrait` CSS variant (narrower max-width, taller aspect-ratio)
- **Argumentative Essay** — Storyline module, embedded from
  `assets/embeds/argumentative-essay/index.html` (this export uses
  `index.html` as its entry point instead of `story_html5.html` — that's
  normal, not a bug, different Storyline export settings produce different
  filenames)
- **Persepsi dan Desain Pesan** — not embedded inline (it's a full
  multi-page course, not a single Storyline file). Instead, the module
  shows a summary and a "Open Full Course Page" link to
  `persepsi-desain-pesan/index.html`, a complete standalone course site
  bundled in this same project folder.

**All three Storyline modules are now self-hosted** inside
`assets/embeds/` — this replaced the previous setup where Yuk Mengaji
pointed to an external `fatkannn.github.io` URL. Self-hosting means the
embeds work immediately after deploying this folder, with no dependency on
a separate GitHub Pages repo staying online. It also means this project
folder is large (~270MB) — that's expected, Storyline exports with audio/
video are not lightweight. If you need to shrink it, the least-used content
is each Storyline's `story_flash.html` + `.swf` files (~6MB total, a legacy
Flash fallback essentially no browser still uses).

The homepage's Featured Projects grid was updated to match: the old
separate "Yuk Mengaji" and "Moodle-Based Course Development" cards are now
a single "Academic Thesis Project" card (`f06` in `js/data.js`), linking to
`showcase.html#sc-academic-thesis` — same pattern as the Kemendikdasmen
card.

## Structure

```
index.html         → homepage
showcase.html         → long-scroll project showcase with live embeds
css/style.css            → shared design tokens + homepage styling
css/showcase.css           → showcase-page-specific styling
js/data.js                    → EDIT HERE to add/change skills, projects, experience
js/icons.js                      → inline SVG icon set (no external CDN dependency)
js/main.js                          → homepage rendering, modals, gallery, form
js/showcase.js                         → showcase page nav + icons (standalone)
assets/video/                             → learning video & motion graphic files (mp4)
assets/thumbs/                              → auto-generated video thumbnails
assets/ppt-thumbs/                             → first-slide thumbnails from decks
assets/graphic-design-web/                        → compressed graphic design images
assets/feeds-ig-web/                                 → compressed Instagram feed images
assets/client-logos/                                    → client logos & project thumbnails
                                                           (Lookmedia client roster, Arkademi,
                                                           Cariilmu, LRT Jakarta visuals)
assets/images/                                          → portrait, placeholder graphics
```

## Showcase now covers 8 projects (client-credibility order)

`showcase.html` was expanded from 6 to 8 projects, reordered to:
**Boga Group → Lookmedia → Arkademi → Cariilmu (IBJ Group) → Kemendikdasmen →
LRT Jakarta → ICE Institute → Academic Thesis Project.** The homepage's
Featured Projects grid (`js/data.js`, `FEATURED_DATA`) mirrors the same
order and links to the matching showcase section for every project except
Boga Group and ICE Institute (which stay as in-place detail modals, since
neither has a public demo or client-owned visual set to link out to).

**Lookmedia** is the most structurally different: instead of one
description block, it now renders a **client roster** — one row per client
(UNDP, UNFPA, Kemenkes, KPK, BCA, Garudafood, Kemenhut, and the in-house
Learnova MOOC platform), each with its logo, a one-line description of your
specific involvement, and tool tags. This lives in
`.sc-client-roster` / `.sc-client-row` in `css/showcase.css` — to add
another client, copy one `<article class="sc-client-row">` block in the
Lookmedia section of `showcase.html` and drop a new logo in
`assets/client-logos/`.

**Arkademi, Cariilmu, and LRT Jakarta** each show a 2-image
`.sc-visual-grid` (project thumbnails) instead of the single `.sc-visual`
used elsewhere, since each of those clients contributed exactly two
visual assets.

**Watermark notice:** every client-owned thumbnail (Arkademi, Cariilmu, LRT
Jakarta) has a small overlay reading *"This project is presented for
portfolio demonstration purposes only. Visual assets and project materials
are owned by the respective organization and are not available for
redistribution."* — this is the `.sc-watermark` class, positioned
bottom-right on the image. If you add more client thumbnails later and
want the same disclosure, wrap the `<img>` in a `.sc-visual` div and add a
`.sc-watermark` div alongside it, following the pattern already used for
Arkademi/Cariilmu/LRT.

## Information architecture (v3 rebuild)

The Projects section was restructured from **output-based categories**
(Motion Graphic, Design Graphic, Learning Video...) to **client-credibility
ordering** — the earlier structure read as a generalist designer's
portfolio; this one reads as a Digital Learning Developer's track record.

### `FEATURED_DATA` (Featured Projects section)

One flat, ordered list — no category filter chips. Order = strength of
client credibility, not media type. Each entry shows a client name badge
and a project-type label (e.g. "CORPORATE LEARNING") instead of an
output-format label (e.g. "Motion Graphic"). Current order: Boga Group →
Kemendikdasmen → LRT Jakarta → Lookmedia → ICE Institute → two Academic
Thesis projects.

Each entry's `type` controls what clicking it does:
- `"interactive"` + `embedSrc` → opens in an iframe modal (Storyline modules)
- `"externalset"` + `items[]` → opens a modal listing multiple external
  links (used for Kemendikdasmen's several Lumi Education modules)
- `"video"` + `src` → opens the video lightbox
- `"gallery"` + `slides[]` → opens the slideshow viewer
- `"showcase"` → opens a detail modal with a branded placeholder image and
  full description, **no interactive asset** — used for Boga Group and LRT
  Jakarta, which are real CV experience but don't have a downloadable file
  yet. See "About showcase placeholders" below.

### `CREATIVE_DATA` (Creative Portfolio section, separate & below)

A single unified grid (currently 8 tiles) of supporting visual work — logo,
poster, social media, presentation, motion. Every tile opens a slideshow
(`slides[]`), image-based by default; set `isVideoSet: true` on an entry to
make its slideshow play video files instead of images. This section is
visually and structurally separate from Featured Projects — different
background, no client badges — so it reads as supporting evidence of visual
skill rather than the headline identity.

### `INTERACTIVE_EXTRA`

Two Storyline modules (Menjaga Disintegrasi Indonesia, Argumentative Essay)
that exist and work but aren't wired into any UI yet — kept in data for
future use, e.g. if you want to expand the Kemendikdasmen/thesis entries
into their own multi-item showcase later.

## About showcase placeholders

Boga Group, LRT Jakarta, Lookmedia, ICE Institute, and the Moodle
dissertation project are real work from your CV, but no downloadable file
(video, screenshot, export) was available for them when this was built —
so they use a branded gradient placeholder (`assets/images/featured-*.svg`)
with the real project description, rather than being left out or faked
with an unrelated asset. To upgrade any of these once you have a real file:

1. Replace `assets/images/featured-<name>.svg` with a real image (same
   filename, or update the `thumb` path in `js/data.js`).
2. If you have a real video or interactive file, change that entry's
   `type` from `"showcase"` to `"video"` (add `src`) or `"interactive"`
   (add `embedSrc`) so it opens the real asset instead of the detail modal.

## About the portrait

Your photo is in place at `assets/images/portrait.jpg`, cropped to keep your
face and the thumbs-up gesture in frame. Swap the file (same name) to change it.

## About the "Download CV" button

Points to `assets/Fatkan_Muhrozi_CV.pdf`, which doesn't exist yet — drop your
CV PDF at that exact path to activate it.

## Known gaps — content not yet added

**2 presentation decks couldn't be downloaded** (over the 10MB tool limit):
*Badan Urusan Rumah Tangga* (14.3MB) and *Badan Aspirasi* (26.6MB). Only 8 of
10 BPM decks are in the "BPM FIP UNJ" creative tile. To add the missing two:
convert each to PDF, export the first slide as a JPG into `assets/ppt-thumbs/`,
then add entries to the `slides` and `slideLabels` arrays on creative item `c05`.

**Only 1 of 6 Instagram Feed folders was downloaded** ("Jalan Jalan" content
series, 6 images). The other 5 folders (~30 more images, mostly "SEMU"
organizational content) are still on Drive but weren't pulled in — the volume
was too large for this session. To add more: download the images, compress
them (see the sizing pattern in `assets/feeds-ig-web/folder1/`), and either
extend creative item `c04`'s `slides` array or add a new Creative Portfolio tile.

**IG Story content is mostly locked in a 857MB `.rar` file** on Drive, which
is far beyond what can be downloaded through the current tool. Extract it
manually and upload a handful of chosen images if you want it represented.

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy free (GitHub Pages)

1. Create a new GitHub repo, e.g. `fatkan-portfolio`.
2. Push all files in this folder to the repo root.
3. Settings → Pages → Branch: `main`, folder: `/ (root)` → Save.
4. Live in ~1-2 minutes at `https://<your-username>.github.io/fatkan-portfolio/`.

