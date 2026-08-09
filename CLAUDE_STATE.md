# CLAUDE_STATE.md

Last updated: mid-session, immediately after diagnosing the CV date-formatting bug.
Written by the Claude instance that was mid-task when the state dump was requested.

## What this project is

Two related but separate deliverables for Fatkan Muhrozi (Instructional Designer /
Multimedia Developer):

1. **Portfolio website** — static HTML/CSS/JS site at `/home/claude/portfolio-final/`.
   Last delivered as `/mnt/user-data/outputs/fatkan-portfolio-showcase.zip` (Aug 8, ~310MB).
   This is the mature, many-sessions-old deliverable — see its own `README.md` at the
   project root for full internal documentation (it's been kept up to date across
   sessions and is the best source of truth for the website's history).

2. **CV document** — a Word doc built from scratch with the `docx` npm package.
   This is the **active task right now** and is NOT yet finished or delivered in its
   current state.

## Current task: fixing CV date formatting (IN PROGRESS, NOT DONE)

### What the user asked for (this turn)
"tolong buat tahun tidak italic, bold, dan berada di ujung kanan" — make the year/date
text in the CV: not italic, not bold, and right-aligned.

### Critical fact: the user has manually edited the CV in Word since I last generated it

The file at `/home/claude/cv-edit/unpacked/` was unzipped from
`/mnt/user-data/uploads/Fatkan_Muhrozi_CV.docx`, which the user uploaded THIS turn.
I diff-checked it against my own original script output
(`/home/claude/cv-build/Fatkan_Muhrozi_CV.docx`) using python-docx paragraph text
comparison. They differ in at least 3 places:
- Subtitle changed: "Instructional Designer & Multimedia Developer" →
  "Digital Learning, Instructional Designer, Multimedia Developer"
- Email changed: `fatkanwork@gmail.com` → `fatkanrozi@gmail.com`
- Portfolio link changed: `fatkanmuhrozi.github.io` → `fatkanportofolio`
- Minor whitespace difference in the Boga Group date line

**Implication: DO NOT regenerate the CV from `/home/claude/cv-build/build_cv.js`.**
Doing so would silently discard the user's manual edits. All further changes MUST be
made by editing the XML in `/home/claude/cv-edit/unpacked/word/document.xml` directly
and rezipping — not by re-running the build script.

### Diagnosis completed so far

Ran `python /mnt/skills/public/docx/scripts/merge_runs.py` on
`/home/claude/cv-edit/unpacked/` already (this coalesces adjacent same-formatted runs
so text is findable/replaceable — safe, non-destructive, already done, no need to
repeat).

Found **17 runs containing a 4-digit year** (the date fields after each job/education/
org-experience entry). Their current formatting is inconsistent:
- 15 of them: `<w:i/>` (italic), not bold
- 2 of them: `<w:b/>` (bold), not italic — these are "Jun 2026 – Present" (Boga Group)
  and "Jan 2019 – Jan 2021" (DPM TP UNJ), suggesting the user had already started
  manually fixing a couple of lines but didn't finish

Every date sits in its own `<w:r>` run, preceded by a separate `<w:r>` run that
contains just `<w:tab/>` plus a single space character — both runs currently carry
`<w:i/>` (or in 2 cases `<w:b/>`) that needs removing.

Confirmed the right-alignment mechanism is already structurally correct: each
paragraph's `<w:pPr>` has `<w:tabs><w:tab w:val="right" w:pos="9360"/></w:tabs>`
(9360 twips = 6.5"), and the date text is reached via `<w:tab/>` inside a run. So the
"right-aligned" part of the request is very likely **already satisfied by the
existing structure** — the user's complaint is almost certainly just about the
italic/bold styling, not actual position. This should be verified visually (render
to PDF, look at it) before assuming it's fully fine, but don't assume the tab-stop
itself needs rebuilding.

### Exact next action

1. In `/home/claude/cv-edit/unpacked/word/document.xml`, find all 17 `<w:r>` runs
   that contain a date (the ones matched by regex `<w:r>((?:(?!</w:r>).)*?(19|20)\d{2}
   (?:(?!</w:r>).)*?)</w:r>` when searching `<w:t>` contents) and their immediately
   preceding `<w:tab/>`-bearing sibling run. Strip `<w:i/><w:iCs/>` and/or
   `<w:b/><w:bCs/>` from both runs' `<w:rPr>`, leaving color (`4B5563`, the gray used
   for dates) and font intact.
2. A plain sed/python string-replace of `<w:i/><w:iCs/>` → `` and `<w:b/><w:bCs/>` →
   `` scoped to just those 17 run-pairs is the fastest safe approach — but do NOT
   blanket-replace those tags document-wide, since `<w:b/>` is legitimately used
   elsewhere (e.g. org/job names, section headings) and must stay bold there.
   Safest approach: regex-match each full `<w:r>...</w:r>` block that contains a
   year, capture it, strip the italic/bold tags from within just that captured
   string, and also handle its preceding tab-run the same way (it can be identified
   as "the run immediately before a date-run, containing `<w:tab/>`").
3. Rezip: `(cd unpacked && rm -f ../out.docx && zip -Xr ../out.docx .)`
4. Validate: `python /mnt/skills/public/docx/scripts/office/validate.py out.docx
   --original /mnt/user-data/uploads/Fatkan_Muhrozi_CV.docx`
5. Render to PDF and visually check via `pdftoppm -jpeg -r 100` per the docx skill's
   verification step — confirm dates are no longer italic/bold AND confirm they are
   still visually right-aligned (don't just trust the XML, look at the image).
6. Copy the fixed file to `/mnt/user-data/outputs/` with a clear filename (e.g.
   `Fatkan_Muhrozi_CV.docx`, matching what the user already has) and deliver via
   `present_files`.

### Known issues / things to watch

- The two runs that were already `<w:b/>` (Boga Group and DPM TP UNJ date lines)
  might indicate the user was hand-editing toward some specific intended style —
  worth a quick sanity check after the fix that ALL 17 dates end up visually
  identical to each other, not just "not italic/not bold" in isolation.
- `merge_runs.py` has already been run once on this unpacked folder. If you re-unzip
  from the uploaded file again for any reason, re-run it before attempting any
  text-based find/replace, or the target strings may be fragmented across multiple
  `<w:r>` runs and won't match.
- Don't reformat/pretty-print `document.xml` — edit in place per the docx skill's
  guidance.
- The `/home/claude/cv-build/` original script (`build_cv.js`) is still useful as
  **reference** for understanding what each section is supposed to look like /
  what data was originally sourced from where, but must not be re-run and its
  output must not be used to overwrite the uploaded file.

## Separate, unrelated, and NOT currently active: portfolio website

No portfolio work is in progress right now. The last delivered ZIP
(`fatkan-portfolio-showcase.zip`) reflects a Storyline-embed scaling fix that was
verified working (measured `.presentation-wrapper` rendered size matched its
container exactly for all three embeds: Yuk Mengaji, Menjaga Disintegrasi Indonesia,
Argumentative Essay). See the portfolio's own `README.md` (inside
`/home/claude/portfolio-final/`) for the full history — it's been kept current
across many sessions and documents things like the CSS `height:auto` gotcha for
Storyline iframes, the Creative Portfolio load-more pagination, the client-logo
homepage grid, and so on. Read that file, not this one, for anything portfolio-related.

If you're picking this up fresh and the user's next message is about the CV, ignore
this section — it's just here so you don't confuse the two deliverables or assume
mid-task portfolio work exists when it doesn't.

## Files relevant to the CV task, current locations

- `/mnt/user-data/uploads/Fatkan_Muhrozi_CV.docx` — user's uploaded file (has their
  manual edits). This is the one to fix.
- `/home/claude/cv-edit/unpacked/` — unzipped working copy of the above, already had
  `merge_runs.py` applied. Edit `word/document.xml` here.
- `/home/claude/cv-build/Fatkan_Muhrozi_CV.docx` — my original generated version,
  predates the user's manual edits. Reference only, do not use as the base to edit
  or deliver.
- `/home/claude/cv-build/build_cv.js` — the original generation script. Reference
  only for understanding structure/intent; do not re-run.
- Previously delivered CV files in `/mnt/user-data/outputs/`:
  `Fatkan_Muhrozi_CV.docx` (my original, now superseded by the user's edited
  version) and `Fatkan_Muhrozi_CV_ATS.docx` (an even older version from an earlier
  session — likely stale, ignore unless the user references it specifically).
