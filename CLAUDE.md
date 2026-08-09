# CLAUDE.md — Portfolio Development Rules

Rules for working on Fatkan Muhrozi's portfolio website. Derived from the
project's own history — every rule here exists because of something that
actually happened. See `README.md` in this same directory for the fuller
narrative history; this file is the distilled "don't repeat these mistakes"
version.

## Source of truth

- **`js/data.js`** is where content lives. `FEATURED_DATA` (homepage logo
  grid), `EXPERIENCE_DATA`, `SKILLS_DATA` — edit here, not by hand-editing
  rendered HTML, since `js/main.js` renders these into the DOM at load time.
- **`showcase.html`** is hand-authored HTML (not data-driven from a JS
  array) for the project case-study sections, because each project's layout
  differs too much (client rosters, visual grids, embeds) to template
  generically. `js/creative-data.js` (`CREATIVE_DATA_SC`) is the one
  exception — the Creative Portfolio grid at the bottom of `showcase.html`
  *is* data-driven, rendered by `js/showcase.js`.
- If the person's CV and the website ever disagree on a fact (dates, skill
  list, project scope), **the website is the source of truth** unless the
  person explicitly says otherwise for that turn. Do not silently "fix" the
  website to match an uploaded CV or vice versa — surface the discrepancy
  and ask which one is authoritative, the way past sessions did for things
  like the Lookmedia end-date mismatch.

## Never regenerate a file the person may have hand-edited

If a project asset (CV `.docx`, in particular) was originally built by a
script (e.g. `build_cv.js` using the `docx` npm package) but the person
later uploads a copy for further edits, **diff it against the
originally-generated version before touching it** (python-docx paragraph
text comparison is enough). If it differs, the person edited it by hand —
edit the uploaded file's XML directly and rezip; do not re-run the
generation script, or their manual edits get silently discarded. This has
already happened once in this project (email address and portfolio link
were manually changed in Word, then almost overwritten by a script rerun).

## Storyline (Articulate) embed rules — hard-won, do not relitigate

Three self-hosted Storyline modules live in `assets/embeds/`: Yuk Mengaji,
Menjaga Disintegrasi Indonesia, and Argumentative Essay. Getting these to
render without gaps, scrollbars, or cropped content took several failed
attempts across sessions. The final, verified-working state:

- **Never add custom `transform: translate(...) scale(...)` combos** to a
  Storyline `story_html5.html`/`index.html` file to fix sizing. Two
  different translate-based approaches were tried and both produced subtle
  bugs (content rendering at half-height, or overflowing its container)
  that were only caught by measuring `getBoundingClientRect()` in a
  headless browser — they looked *plausible* in the CSS but were wrong.
- **The formula that actually works**, if a Storyline module needs to
  scale down to fit a smaller container than its native design size:
  ```js
  function fitStage() {
    var wrapper = document.querySelector('.presentation-wrapper');
    if (!wrapper) return;
    var nativeW = wrapper.offsetWidth, nativeH = wrapper.offsetHeight;
    if (!nativeW || !nativeH) return;
    var scale = Math.min(window.innerWidth / nativeW, window.innerHeight / nativeH, 1);
    wrapper.style.transform = 'scale(' + scale + ')';
  }
  ```
  Only sets `transform: scale(...)` — never touches `top`/`left`/
  `translate`. Combine with `transform-origin: 0 0 !important` on
  `.presentation-wrapper`. The `Math.min(..., 1)` cap means it's safe to
  apply this to every embed unconditionally, including ones that don't
  need scaling (the formula degrades to `scale(1)`, a no-op).
- Confirm each module's internal Storyline JS config has `scale:
  'letterbox'`, not `'noscale'`. `noscale` disables Storyline's own
  auto-scaling and was the actual root cause of one of the scrollbar bugs
  — not the container CSS, which had been (wrongly) the first suspect.
- **Verify by measurement, not by eyeballing a screenshot.** Query
  `.presentation-wrapper` or `#preso`'s `getBoundingClientRect()` inside
  the iframe's frame context (`page.frames().find(f =>
  f.url().includes(...))` in Playwright) and confirm `x:0, y:0` with
  width/height matching the container. A screenshot can look "close
  enough" while still being subtly wrong (e.g. content at 44% height with
  letterboxing that's easy to mistake for intentional).
- In `css/showcase.css`, `.sc-embed-wrap iframe` sets a fixed pixel
  `height` as a fallback (originally added for Kemendikdasmen's Lumi
  Education H5P embeds, which have no reliable native aspect ratio). Any
  more-specific embed class (`.sc-embed-tall`, `.sc-embed-portrait`, or a
  future one) **must explicitly set `height: auto`** before its own
  `aspect-ratio`, or it silently inherits that fixed height and the
  aspect-ratio is ignored per the CSS spec. This exact bug happened once
  already.
- For Lumi Education (Kemendikdasmen) iframes: give each a unique
  `id="h5p-iframe-<runcode>"` + `class="h5p-iframe"`, and make sure
  Lumi's own `h5p-resizer.js` script is loaded once near the end of
  `showcase.html`. That's the vendor's official mechanism for the embed
  to report its real content height back via `postMessage` — don't
  reinvent this with a guessed `aspect-ratio`.

## Client-owned visual assets need a watermark

Any thumbnail/screenshot that isn't the person's own original creation
(client logos, screenshots of client products, third-party project
visuals) gets wrapped in `.sc-visual` with a `.sc-watermark` sibling div
reading: *"This project is presented for portfolio demonstration purposes
only. Visual assets and project materials are owned by the respective
organization and are not available for redistribution."* This is already
applied to Arkademi, Cariilmu, LRT Jakarta, Boga Group, and ICE Institute
thumbnails. Apply it to any new client thumbnail by default — don't wait
to be asked a second time.

## Image/video compression is mandatory before packaging

Every asset batch added to this project has needed compression — raw
uploads have run 80-200MB+ per batch and been brought down to single-digit
MB with negligible visible quality loss:
- Images: resize to a sane max width (1000-1600px depending on use),
  re-save as JPEG quality ~82-85 (PNG only kept where transparency is
  actually used), via Pillow.
- Video: `ffmpeg -vcodec libx264 -crf 26-27 -preset medium -vf
  "scale=<width>:-2" -acodec aac -b:a 128k -movflags +faststart` — this
  formula has consistently produced 80-90% size reduction with acceptable
  quality for web embedding.
Do this before adding new assets to `assets/`, not after — don't let the
ZIP balloon and then think about compression as an afterthought.

## Verification standard before declaring something fixed

This project has a track record of visual bugs that looked fixed in one
screenshot and weren't. Before telling the person something is resolved:
1. Screenshot the actual rendered page (Playwright), not just re-read the
   CSS/HTML and reason about it.
2. For anything involving computed layout (scaling, aspect-ratio,
   overflow), pull the actual `getBoundingClientRect()` numbers and check
   they match the arithmetic, not just "looks about right."
3. Cross-check every asset reference (`assets/...` paths in `data.js`,
   `creative-data.js`, `showcase.html`, `index.html`) resolves to a real
   file before packaging — a quick `re.findall` + `os.path.exists` loop
   catches broken links cheaply.
4. Scroll/interact through multi-state UI (load-more pagination, gallery
   modals, video play-on-click) programmatically and confirm the state
   actually changes, not just that the initial render looks right.

## Structural conventions already established

- Section order on `showcase.html` (client-credibility order, not
  chronological): Boga Group → Lookmedia → Arkademi → Cariilmu →
  Kemendikdasmen → LRT Jakarta → ICE Institute → Academic Thesis Project →
  Lemari Thriftbest → Creative Portfolio (unnumbered, at the very bottom).
  The homepage logo grid (`FEATURED_DATA`) mirrors this order.
- No numbered badges ("01", "02"...) next to project section titles —
  these were deliberately removed; don't reintroduce them.
- Homepage Featured Projects is a plain logo grid (client logo + name,
  linking straight to the matching `showcase.html#section-id`) — not
  cards with descriptions/tags. That richer card style was intentionally
  replaced; don't revert without being asked.
- The Creative Portfolio section lives only on `showcase.html`, not the
  homepage. It renders 4 tiles at a time with a "Load More" button that
  reveals 4 more per click and hides itself once everything is shown.
- Inline video players (e.g. Thriftbest's rebranding video) must be
  click-to-play, never autoplay, and must never open a new tab/popup —
  swap a thumbnail `<img>` for a `<video controls>` element in place on
  click. This was an explicit, repeated instruction — treat it as a
  standing rule for any future inline video, not a one-off.

## Before packaging a delivery ZIP

1. Remove any `shots/` or other screenshot-testing scratch directories
   from inside `portfolio-final/` — these accumulate during verification
   and must not ship.
2. Re-run the asset cross-check (see Verification standard above).
3. Update `README.md` with a dated entry describing what changed — this
   project's README has been the primary continuity mechanism across many
   sessions; don't let it fall out of sync with reality.
