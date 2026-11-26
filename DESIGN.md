# DOOMFLIX DESIGN SYSTEM (`DESIGN.md`)

> Single source of truth for typography, color, spacing, radii, layout geometry, motion, and prohibited AI-slop patterns.

---

## 1. Direction

- **Concept:** An obsidian cinema briefing room and tactical screening ledger for *Avengers: Doomsday* readiness — widescreen film key art set against matte slate surfaces, hairline borders, crisp tabular counters, and purposeful Doom emerald signals.
- **Target qualities:** Editorial cinema density, silent chrome that lets film artwork lead, strict keylined geometry, responsive tactile motion.
- **Avoided qualities:** SaaS admin 4-stat card grids, cyberpunk neon clouds/glows, red/gold mismatched v1 modals, generic eyebrow narration.
- **Motion character:** Crisp, weighty, and physical — immediate ≤80 ms press compression proportional to element perimeter, soft touch bloom, damped spring recovery (`--ui-spring-pop`), no idle pulsing chrome (`fx:grain`, `fx:scroll-fade-edges`, `fx:hover-set`).

---

## 2. Fonts & Type Scale

- **Display (`font-cinematic`):** `Bebas Neue`, uppercase, `letter-spacing: 0.04em–0.05em` — hero film titles and primary operative identity wordmarks.
- **Compact Labels / Section Stamps (`font-marvel`):** `Oswald` — used sparingly only for structural media/title plates (`Bebas`/`Oswald` display pairing), never as generic tracked-caps card eyebrows.
- **UI Body & Navigation (`font-sans`):** `Plus Jakarta Sans` (`400`, `500`, `600`, `700`) — primary interface text, section headings, navigation labels, controls, and modals (`Inter` is removed).
- **Telemetry & Figures (`font-mono`):** `JetBrains Mono` with `font-variant-numeric: tabular-nums` — reserved strictly for numeric counters, sequence codes (`#01`), years, runtimes, scores, timers, and percentages.

| Role | Size | Line Height | Weight | Usage |
| --- | --- | --- | --- | --- |
| Hero Display | `36px–80px` | `0.92` | `700` (`Bebas Neue`) | Widescreen backdrop hero title |
| Modal / Page Title | `20px–24px` | `1.2` | `600–700` (`Plus Jakarta Sans`) | View headers (`My List`, `Discover`, `Quiz`, `Profile`, modals) |
| Section Heading | `16px–20px` | `1.3` | `600` | Rail headers, phase headers, badge gallery |
| Body | `14px` | `1.5` | `400–500` | Synopses, lore context, quiz questions, modal copy |
| Control / Meta | `12px` | `1.3` | `500–600` | Buttons, filter pills, card metadata, inputs |
| Micro Badge / Figure | `10px–11px` | `1.2` | `500–700` (`JetBrains Mono`) | Sequence indices (`#01`), ratings (`7.8`), runtime, fractions |

---

## 3. Color Palette (Obsidian & Doom Emerald System)

All neutrals are cool-slate tinted toward the `#090a0f` obsidian cinema canvas.

| Role | Hex / HSL | CSS Variable | Usage |
| --- | --- | --- | --- |
| Canvas | `#090a0f` (`228 28% 5%`) | `--bg-canvas` / `--background` | App background |
| Surface 1 | `#0f131b` (`224 28% 8%`) | `--bg-surface-1` / `--card` | Cards, quiz panels, subtle sections, dialogs |
| Surface 2 (Raised) | `#171c28` (`224 26% 12%`) | `--bg-surface-2` / `--secondary` | Inputs, hover states, active pills, secondary buttons |
| Hairline Border | `rgba(255, 255, 255, 0.08)` | `--border-hairline` | Cards, panels, dividers |
| Control Border | `rgba(255, 255, 255, 0.14)` | `--border-control` | Inputs, filter selects, secondary controls |
| Text Primary | `#f8fafc` | `--text-primary` | Headings, active labels, titles |
| Text Secondary | `#cbd5e1` | `--text-secondary` | Synopses, descriptions, inactive options |
| Text Muted | `#94a3b8` | `--text-muted` | Metadata, helper limits, timestamps (meets ≥4.5:1 on Surface 1) |
| Primary Action (Light) | `#ffffff` on `#090a0f` | `--action-primary` | Hero Watch CTA, Modal Primary Submit, Details Stream CTA |
| Signal Emerald | `#10b981` / `#34d399` | `--accent-emerald` | Watched status, active timeline phase, readiness bar, focus ring |
| Chronal Gold | `#f59e0b` | `--accent-gold` | Ratings, Watching status (`in_progress`) |
| Alert Crimson | `#f43f5e` / `#e21b24` | `--accent-crimson` | Destructive removal, validation errors, Sign Out accent |

---

## 4. Spacing, Alignment & Radii

- **Spacing Scale:** `4, 8, 12, 16, 24, 32, 48, 64` px (`gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-6`, `gap-8`, `gap-12`, `gap-16`).
- **Proximity Ladder:** icon↔label (`6–8px`) < sibling controls (`8px`) < group gap (`16–24px`) ≤ container padding (`16px` mobile cards/sections, `24–32px` desktop panels/modals).
- **Control Heights (Uniform Sets):**
  - Compact row pills, card actions, filter chips, & selects: `32px` (`h-8`) with uniform `12px` (`px-3`) inset and `13px` icons.
  - Primary / Modal form actions & inputs: `36px–40px` (`h-9` / `h-10`).
  - Mobile touch targets: minimum `32px–44px` spacing-compliant hit targets inside `MobileNav`, header actions, and card controls.
- **Concentric Nesting Radii:**
  - Cards: outer `16px` (`rounded-2xl`) − `8px` (`p-2`) padding = inner poster `8px` (`rounded-lg`).
  - Modals / Panels: `16px`–`24px` (`rounded-2xl` / `rounded-3xl`) with internal inputs at `10px`–`12px` (`rounded-xl`).
  - Pills / Chips / Docks: `9999px` (`rounded-full`).
- **Optical Offsets:** Asymmetric `<Play />` icons inside buttons receive `ml-px` (`+1px` inline offset) so triangle mass sits visually centered.

---

## 5. Icons, Motion & Prohibited Patterns

- **Icons:** Single coherent stroke set (`lucide-react` at `1.75–2px` stroke for UI controls; Phosphor geometry regular/fill pairs for `Sidebar` and `MobileNav` navigation routes). Never mix emoji as UI icons (country/status text remains plain text or verified Lucide icon).
- **Keyboard Focus:** Every interactive control uses `.ui-focus` (`2px solid #34d399`, `2px` offset on `:focus-visible`). Never apply global `outline: none !important` on `:focus-visible`.
- **Signature Details Recorded:**
  - `better-design` three-layer press + bloom + `--ui-spring-pop` release across interactive controls.
  - `fx:scroll-fade-edges` (`scroll-fade-x`) on mobile overflowing filter strips and horizontal rails.
  - `fx:hover-set` subtle border + opacity + optical play nudge on media tiles.
- **Strict Prohibitions:**
  - ❌ `Inter` font anywhere in CSS/HTML
  - ❌ Four identical stat cards in a row (`slop:identical-card-grid`)
  - ❌ Infinite glowing blur clouds or neon box-shadows (`slop:background-glow`, `slop:glow-shadow`, `slop:pulsing-status-dot`)
  - ❌ Stacked square icon-tiles + redundant eyebrows in modals (`slop:icon-tile`, `slop:eyebrow-and-badge`, `slop:page-narration`)
  - ❌ `transition: all` on components or missing `:focus-visible` outlines
