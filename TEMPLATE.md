# Ragnarok Online Tools — Design Documentation

**Version**: 1.0
**Date**: June 3, 2026
**Reference implementation**: `index.html` (Cumulative Probability calculator)

---

## Design Philosophy

This is a **gaming dashboard**, not a reading document. Design decisions are optimised for:
- At-a-glance data scanning
- Dense numeric output (kill counts in the thousands, probabilities to two decimals)
- Short sessions — open, check numbers, close
- Fun/personality over polish

This is explicitly **not** the UOW study notes template. Do not cross-contaminate palettes or typography rules between the two projects.

---

## Typography

**Rule: monospace everywhere.** IBM Plex Mono is the primary font across all UI elements — labels, inputs, table data, buttons, headings. IBM Plex Sans is the body fallback only.

This is intentional and correct for a data tool. It aligns numbers in columns, gives a terminal/calculator aesthetic, and is readable at short durations. The "no monospace for prose" rule from the study template does not apply here.

| Element | Font | Size | Weight | Case |
|---|---|---|---|---|
| `h1` (page title) | IBM Plex Mono | 13px | 600 | UPPERCASE |
| Labels (`label`) | IBM Plex Mono | 10px | 400 | UPPERCASE, 0.1em tracking |
| Table headers (`th`) | IBM Plex Mono | 10px | 600 | UPPERCASE, 0.1em tracking |
| Table data (`td`) | IBM Plex Mono | 13px | 400 | — |
| Inputs | IBM Plex Mono | 14px | 400 | — |
| Buttons | IBM Plex Mono | 11px | 400 | 0.08em tracking |
| Effective rate / skull label | IBM Plex Mono | 14–16px | 600 | — |
| Meme label | IBM Plex Mono | 22px | 600 | UPPERCASE, 0.08em tracking |

**Base body size**: 14px (smaller than study notes — dense data context).

---

## Color Palette

### Dark Mode (Default) — Teal

The canonical palette. Cool blue-grey undertones, teal accent. High contrast for data readability.

| Variable | Value | Usage |
|---|---|---|
| `--bg` | `#0e0f11` | Page background (near-black, cool) |
| `--surface` | `#16181c` | Table background, cards |
| `--border` | `#2a2d34` | All borders |
| `--text` | `#e2e4e9` | Primary text (cool off-white) |
| `--muted` | `#5a5f6e` | Labels, table headers, placeholder text |
| `--accent` | `#4fc3a1` | Teal — active states, highlighted values, h1 |
| `--accent-dim` | `rgba(79,195,161,0.12)` | Bar fill, button hover background |
| `--row-alt` | `#13151a` | Alternating table row tint |
| `--input-bg` | `#1e2028` | Input field background |
| `--header-bg` | `#1a1c22` | Table header row background |

### Light Mode — Cool Grey

| Variable | Value | Usage |
|---|---|---|
| `--bg` | `#f4f5f7` | Page background (cool light grey) |
| `--surface` | `#ffffff` | Table background |
| `--border` | `#dde0e8` | All borders |
| `--text` | `#1a1d26` | Primary text |
| `--muted` | `#8a8f9e` | Labels, metadata |
| `--accent` | `#1a8f6f` | Dark teal — readable on light bg |
| `--accent-dim` | `rgba(26,143,111,0.08)` | Bar fill, button hover |
| `--row-alt` | `#f9fafb` | Alternating row tint |
| `--input-bg` | `#f0f1f4` | Input background |
| `--header-bg` | `#eaecf0` | Table header |

### Rainbow / Rainbow-Light Modes

Special personality modes — same bg/surface as dark/light respectively, but `--accent` becomes `#ff00ff` with animated gradient effects on bars, h1, and skull fills.

**Do not use `--accent` directly for rainbow text** — apply the gradient clip technique separately.

---

## Theme System

Themes are controlled via `data-theme` attribute on `<html>`, not a CSS class. Four states:

| `data-theme` | Description |
|---|---|
| `dark` | Default. Teal on near-black. |
| `light` | Cool grey. Teal accent darkened for contrast. |
| `rainbow` | Dark bg + animated pride gradient on accent elements. |
| `rainbow-light` | Light bg + same gradient treatment. |

Toggle buttons cycle: dark → light, and independently toggle rainbow overlay.

**Note**: Unlike the study notes template (`html.light-mode` class), this project uses `data-theme` attribute selectors — `:root[data-theme="dark"]`. Do not switch to class-based theming.

---

## Layout

Single-column, centred, max-width **640px**. No sidebar, no multi-column layout.

```
body (flex, column, centred)
└── .shell (640px max-width)
    ├── header (space-between: h1 + theme buttons)
    ├── .controls (2-col grid: drop rate | server multiplier)
    ├── .error-msg
    ├── effective rate display
    ├── table (full width)
    └── kill count + skull display (centred)
```

Collapses to single-column on `<520px`.

---

## Components

### Table (Probability Output)

The primary data display. Key rules:
- `border-collapse: collapse`, `border-radius: 6px`, `overflow: hidden` — rounded border via parent clip
- `th`: muted colour, uppercase, monospace — deliberately understated
- `td`: monospace 13px, right-aligned for numeric columns
- `.col-periods` — muted (less important: individual period count)
- `.col-single` — text colour (neutral)
- `.col-cum` — **accent colour, bold** — the number the user cares about most
- `.bar-cell`: contains `.bar-bg` (absolute positioned fill) + `.bar-val` — progress bar overlaid on cell
- Bar width set via `--bar-pct` CSS variable per row

### Buttons

Two types:

**`.toggle-btn`** — theme switchers in header. Minimal: no fill, just border + muted text. Accent colour on hover only.

**`.preset-btn`** — drop rate and multiplier presets. Same minimal treatment but with `.active` state (accent border + background-dim fill). `flex: 1` so they share width equally in their row.

Both use `transform: scale(0.98)` on `:active` for tactile feedback.

### Inputs

Monospace, dark background, accent border on focus. Red border (`#e05555`) on `.invalid`. No border-radius variation — consistent 4px throughout.

### Skull Display

Visual kill count indicator. 10 skulls maximum shown — each represents 10% of the ≥99% threshold. Filled vs unfilled skulls indicate progress.

- `.skull-wrap` — relative container per skull
- `.skull-base` — greyed out (opacity 0.15, grayscale) ghost skull
- `.skull-filled` — coloured overlay, clipped to fill percentage

### Meme Label

`#memeLabel` — large (22px), uppercase, accent coloured. Text chosen from `MEME_BUCKETS` based on current cumulative probability. Randomised from each bucket on update. Personality feature — keep it.

---

## Rules & Lessons Learned

- **Warm palette is wrong for this tool.** Orange/brown was applied Jun 3 2026 to match the study notes aesthetic — it made bars muddy and killed the data-pop contrast the teal provided. Teal is the canonical accent.
- **Do not use the UOW study template as a base.** Different product, different constraints, different user behaviour.
- **`data-theme` attribute, not CSS class.** The theming system predates the study notes project. Changing it to class-based would break the rainbow logic.
- **Monospace everywhere is correct here.** Numbers need to align. Don't introduce IBM Plex Sans for any new data elements.
- **640px max-width is intentional.** The tool has two inputs and a table — it doesn't need more width. Do not widen for new features.
- **Inline styles exist in the HTML** — some one-off layout wrappers use `style=""` directly. Acceptable for a single-file tool with no recurring pattern. Don't extract them unless the pattern repeats 3+ times.
- **External font dependency** — IBM Plex Mono/Sans loaded from Google Fonts. File requires internet to render correctly. Acceptable for a personal hosted tool; note it if ever making offline-capable.

---

## Version History

- **v1.0** (Jun 3, 2026): Initial documentation. Canonical teal palette recorded. Warm palette revert flagged.
