# Portfolio — what is live, what is hidden

Site entry: `index.html` → `variants/plain-list.jsx` (single-column list index).
Content lives in `data.jsx`. Project pages are in `projects/`, each backed by a variant in `variants/`.

## Held back

`drafts/senfabric/` holds the full SenFabric page, its fifteen paper figures, and its long-form text. **Do not upload that folder** while the CHI submission is under review. `projects/tpu.html` and `variants/project-senfabric.jsx` no longer exist in the published tree, and `data.jsx` keeps only title, subtitle line, venue and thumbnail — no blurb, body or figure captions ship to visitors.

The index still shows the row and its thumbnail, unlinked (`locked: true`). Restore instructions are in `drafts/senfabric/README.md`.

## Hidden right now

All three are switched off with a literal `false` in `variants/plain-list.jsx` — delete the `false &&` to bring one back.

| What | Where | How to restore |
| --- | --- | --- |
| SenFabric project page | `drafts/senfabric/` | see that folder's README |
| Printed "Yao" logo in the top-left corner | line ~63, `{false && (` | remove `false && ` |
| **In progress** section (Hygromorphic Coatings, Biochar DIW) | line ~87, `{wip.length > 0 && false && (` | remove `&& false` |
| **Smaller projects** section (EEG Crochet, LCE Embroidery, Rockite, EEG Embroidery, Memo Umbrella, Icarus) | line ~95, `{minor.length > 0 && false && (` | remove `&& false` |

Also removed: the `Spring 2026` date line that used to sit at the bottom of the index. `data.date` still exists in `data.jsx`; the markup that rendered it is gone.

The hidden projects are still in `data.jsx`, flagged `wip: true` or `minor: true`. Nothing was deleted.

## Deploying

Static site, no build step. Upload everything **except `drafts/`** to the repo and turn on GitHub Pages (Settings → Pages → Deploy from a branch → `main` / `/ (root)`).

`drafts/` holds the under-review SenFabric material and must never be uploaded.

## Search engines

Every HTML page carries `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">`, and `robots.txt` disallows everything. The site is meant to be shared by link, not found by search, while SenFabric is under review. Do not link to it from anywhere indexable.

`robots.txt` only takes effect when it sits at the domain root. Served from `<user>.github.io/Portfolio/`, the file at this repo's root is ignored — it has to live in the `<user>.github.io` repo. The meta tag is what actually does the work on a project-path site, so keep it on every new page.

## Printed wordmark

`variants/logo-print.jsx` exports `window.PrintLogo`. Glyphs are drawn on a 12-row module grid (`G`), one rounded bar per horizontal run, printed bottom layer first with the nozzle travelling left to right.

Current locked-in defaults: cell width 1.3, bar weight 0.86, bar gap 0, 1 layer line per row, letter gap 0.7, word gap 1.4, optical kern 0.6, round ends, 130 ms layer delay, 300 ms nozzle pass.

Props worth knowing: `text`, `height`, `track` (grey full-width layer bars behind the ink — logo only), `mode` (`layer` · `sweep` · `spread`), `playKey` (increment to replay).

`logo.html` (the wordmark tuning bench) has been deleted. The component itself is still at `variants/logo-print.jsx`; rebuild a bench from the props listed above if you need to tune again.

## Index hover

Rows open a thumbnail plate inline beneath the hovered line (height + margin transition, `prefers-reduced-motion` respected). Two earlier approaches — a cursor-following preview and a margin-shift preview — were built, compared, and removed. Inline is final.

## House style

See `CLAUDE.md`. Roboto only, ink `#0a0a0a` on white, hairline rules, no accent colour, no card treatments.
