# Yao Wang portfolio — house style

Treat the existing pages (`index.html` spec-sheet ledger, `projects/tpu.html`, `projects/fluidic.html`) as the design system. Match them; do not introduce a new visual language.

## Type
- Roboto only. No Roboto Mono, no Roboto Serif, no italics, no second typeface.
- Weights: 300 body, 400 for small headings and labels. Titles are 300 at large sizes with negative letter-spacing.
- Labels and meta: uppercase, ~10px, letter-spacing ~1–1.4, muted.

## Color
- Ink `#0a0a0a` on white. Muted text `rgba(10,10,10,0.55)`. Hairlines `rgba(10,10,10,0.14)`.
- No accent color, no gradient, no colored state. Images carry all the color.

## Structure
- Hairline rules and grid alignment do the separating. Avoid card treatments: no filled boxes with borders and padding, no rounded corners, no shadows, no pills or badges.
- Images sit in plates with a 1px hairline border and small padding, nothing else.
- Section headings are a single muted uppercase label (`Method`), not a heading stack.

## Copy
- Short plain sentences. No em-dash asides, no "not X but Y", no summary or uplift line at the end of a section.
- No figure numbering in captions. Captions are one or two lines.
- Meta on project pages shows role / context / output only (tools and status stay in `data.jsx` for the index table).
- Numbers and conditions stay exact; drop adverbs and literary verbs.

## Avoid
- Bootstrap-style component looks: card decks, button bars, alert boxes, badge chips, icon bullets.
- Emoji, hand-drawn SVG illustration, stock iconography.
