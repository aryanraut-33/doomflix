# Doomflix Design Decisions & Audit Log (Operating Manual: `rn_design.md` Revamp Mode)

**Date:** November 2026  
**Git Branch:** `revamp/ui-layout`  
**Site:** `http://localhost:3001/` (Doomflix)  
**Status:** STEP 1 & STEP 2 Complete — Awaiting GATE 1 Approval

---

## 1. The Lock Contract (Owner Standing Redesign Defaults)

In accordance with section 15.2 of `rn_design.md`:

| LOCKED (Do Not Change) | IN SCOPE (Change Permitted) |
| :--- | :--- |
| **Colour Palette:** All existing tokens, hex values, HSL variables. No new colours or arbitrary hexes outside tokens. | **Page Layouts & Composition:** Section order, structural grids, alignment, asymmetric framing, visual rhythm, density. |
| **Typography:** Font families (`Bebas Neue`, `Oswald`, `Plus Jakarta Sans`, `JetBrains Mono`), existing type scale and weights. | **Component Boxes:** Cards, panels, tiles, containers, borders, radii, padding, grouping, internal hierarchy. |
| **Overall Look & Feel:** Cinematic dark tone, technical command centre / timeline atmosphere, brand character. | **Layout Shell:** Sidebar and header arrangement (subject to explicit user confirmation before modifying). |
| **Copy & Content:** All original titles, descriptions, lore texts, notes, and strings preserved intact. | |
| **Working Behaviour:** Navigation routes, forms, drag-and-drop, watch tracking, quiz logic, TMDB search, streaming links. | |
| **Brand Assets & SEO:** Name, logos, metadata, favicon, and canonical routes preserved. | |

---

## 2. Existing System (Locked Tokens)

### A. Colour System
- **Dark Bases / Backgrounds:**
  - `doom-950` / `--background`: `#090a0f` (HSL: `228 28% 5%`) — Deep obsidian graphite
  - `doom-900` / `--card`: `#10131b` (HSL: `226 22% 8%`) — Slate charcoal
  - `doom-850`: `#141824` — Secondary surface
  - `doom-800` / `--secondary`: `#1a1f2e` (HSL: `224 18% 13%`) — Elevated panel surface
  - `doom-750`: `#21273a` — High-tier surface
  - `doom-700`: `#2a3148` — Active control surface
  - `doom-600`: `#3d4764` — Subdued element surface
- **Borders & Dividers:**
  - `doom-border` / `--border`: `#23293b` (HSL: `224 14% 17%`)
  - `doom-border-light`: `#313950`
- **Accents:**
  - Primary Red: `doom-red` / `--primary`: `#e21b24` (HSL: `356 85% 48%`), dark: `#9e0d14`, bright: `#ff2a35`
  - Secondary Gold: `doom-gold` / `--accent`: `#d8a63f` (HSL: `43 65% 52%`), dark: `#b45309`
  - Supporting Green: `doom-emerald`: `#1bc775` (Watch verified / success)
  - Supporting Blue: `doom-blue`: `#0284c7` (Cosmic / timeline markers)
- **Ink / Text:**
  - `--foreground`: `hsl(210 40% 98%)` (Crisp off-white)
  - `--muted-foreground`: `hsl(215 16% 62%)` (Muted technical slate)
  - Gray scale: `gray-100`, `gray-300`, `gray-400`, `gray-500`

### B. Typography
- **Display Headlines:** `font-cinematic` (`"Bebas Neue", sans-serif`) — Compressed, architectural uppercase display type
- **Subheads & Section Headers:** `font-marvel` (`"Oswald", sans-serif`) — Dense, high-impact sans
- **Body & Editorial:** `font-sans` (`"Plus Jakarta Sans", system-ui, sans-serif`) — Highly legible modern geometric sans
- **Technical & Metrics:** `font-mono` (`"JetBrains Mono", ui-monospace, monospace`) — Precise numerical and telemetry labels

### C. Border Radii & Elevation
- **Radii:**
  - `rounded-sm`: 8px (`calc(var(--radius) - 4px)`)
  - `rounded-md`: 10px (`calc(var(--radius) - 2px)`)
  - `rounded-lg`: 12px (`var(--radius)`)
  - `rounded-xl`: 16px
  - `rounded-2xl`: 24px
  - `rounded-3xl`: 32px (used on hero and major editorial containers)
  - `rounded-full`
- **Shadows:**
  - `shadow-cinematic`: `0 20px 40px -15px rgba(0, 0, 0, 0.9)`
  - `shadow-card`: `0 8px 24px -4px rgba(0, 0, 0, 0.5)`
  - `shadow-subtle`: `0 2px 10px rgba(0, 0, 0, 0.4)`

---

## 3. Inventory of Pages, Templates & Shared Components

### Shared Components
1. **Sidebar Navigation** (`src/components/common/Sidebar.tsx`): Persistent collapsible desktop drawer with brand header, collections list, overall watch progress, and user account trigger.
2. **Top Header** (`src/components/common/Header.tsx`): Search trigger (Cmd+K), quick stats pill, India availability indicator, Sign In button, mobile hamburger.
3. **Mobile Bottom Navigation** (`src/components/common/MobileNav.tsx`): 6-item persistent bottom navigation bar.
4. **Doomsday Countdown** (`src/components/common/DoomsdayCountdown.tsx`): Three variants (`hero`, `compact`, `header`) with countdown clock, target date picker, and phase tag.
5. **Rotating Hero Pane** (`src/components/home/RotatingHeroPane.tsx`): Cross-fading carousel featuring curated Marvel titles or the user's active phase, with trailer/details and streaming actions.
6. **Title Details Modal** (`src/components/details/TitleDetailsModal.tsx`): Full inspection modal featuring backdrop, canon status, lore context, characters introduced, verified India streaming links, and episode tracking.
7. **Auth Modal** (`src/components/common/AuthModal.tsx`): Authentication & account sync dialog.

### Primary Pages
1. **Home / Command Centre** (`src/components/home/CommandCentre.tsx`):
   - Hero rotating pane
   - Doomsday countdown block
   - Mission Telemetry Bar
   - Continue Watching row
   - Editorial Next Up Spotlight
   - Multiverse Phase Progress cards
   - Knowledge Arena & Multiverse Explorer callouts
2. **My Watchlist** (`src/components/watchlist/WatchlistManager.tsx`):
   - Collection switcher bar
   - Filter & sort toolbar
   - Watchlist card list with drag-and-drop handles, sequence badges, priority flags, episode expansion drawers, and streaming badges.
3. **Discover & Add** (`src/components/discover/DiscoverCatalog.tsx`):
   - Category filter chips (Trending, Popular, Marvel Studios, Fox, Sony)
   - Search bar & TMDB API search
   - Movie/TV grid cards with poster art, rating, and "Add to Watchlist" action.
4. **Knowledge Arena** (`src/components/quiz/KnowledgeArena.tsx`):
   - Quiz lobby (spoiler protection mode, category filter, difficulty selection)
   - Active question cards with countdown timer and instant explanation feedback
   - Results summary card with accuracy scoring and achievement integration.
5. **Multiverse Explorer** (`src/components/multiverse/MultiverseExplorer.tsx`):
   - Interactive 3D Chronal Cube
   - Category filter bar (Alternate Earths, TVA, Incursions)
   - Timeline cards and node network visualizing multiversal connections.
6. **Profile & Settings** (`src/components/profile/UserProfile.tsx`):
   - Operative profile card, Level, Rank
   - Total watch time and accuracy telemetry
   - 9-Badge achievement showcase gallery
   - Local data backup and JSON import/export tools.

---

## 4. Before-Screenshots Inventory

All before-screenshots captured at 390px (Phone), 820px (Tablet), and 1440px (Desktop):

| Viewport | Width | Height | Screenshot Files |
| :--- | :--- | :--- | :--- |
| **Phone** | 390 px | 844 px | `home_phone-390.png`, `watchlist_phone-390.png`, `discover_phone-390.png`, `quiz_phone-390.png`, `multiverse_phone-390.png`, `profile_phone-390.png`, `modal_details_phone-390.png`, `modal_auth_phone-390.png` |
| **Tablet** | 820 px | 1180 px | `home_tablet-820.png`, `watchlist_tablet-820.png`, `discover_tablet-820.png`, `quiz_tablet-820.png`, `multiverse_tablet-820.png`, `profile_tablet-820.png`, `modal_details_tablet-820.png`, `modal_auth_tablet-820.png` |
| **Desktop** | 1440 px | 900 px | `home_desktop-1440.png`, `watchlist_desktop-1440.png`, `discover_desktop-1440.png`, `quiz_desktop-1440.png`, `multiverse_desktop-1440.png`, `profile_desktop-1440.png`, `modal_details_desktop-1440.png`, `modal_auth_desktop-1440.png` |

Local directory: `file:///Users/aryan/doomsday_ready/audit_screenshots/`

---

## 5. Site-Wide Audit Findings (Tagged by Severity & Domain)

### A. Tells Registry (Section 10 of `rn_design.md`)

| Finding ID | Tag | File / Line | Evidence & Description | Severity | Proposed Direction |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TELL-01** | `[COMPONENT]` | `CommandCentre.tsx:330-380` | **Uniform Card Grid for Phases:** 4 identical rounded boxes in a row (`md:grid-cols-2 lg:grid-cols-4 gap-4`) with the exact same padding, radius, and progress bar layout. | **HIGH** | Replace the 4 identical cards with an asymmetrical timeline progress strip or vertical mission tracker with clear hierarchy between active and completed phases. |
| **TELL-02** | `[COMPONENT]` | `CommandCentre.tsx:384-432` | **Symmetrical 2-Column Callout Grid:** Symmetrical side-by-side equal boxes for Knowledge Arena and Multiverse Explorer with identical button arrows and icon boxes. | **MEDIUM** | Break symmetry: create an editorial cinematic command banner where one feature leads and the secondary acts as a technical instrument panel. |
| **TELL-03** | `[LAYOUT]` | `CommandCentre.tsx:87-149` | **Mission Telemetry Container:** While merged into one section, the stats on the right still read as stacked counter boxes with small labels above/below. | **MEDIUM** | Integrate stats directly into the active mission narrative as an authentic flight-data / chronal readiness gauge rather than stacked stat blocks. |
| **TELL-04** | `[COMPONENT]` | `WatchlistManager.tsx:160-220` | **Nested Rounded Pills & Filter Toolbar:** Toolbar has dense repetition of rounded badge buttons, select boxes, and hairline borders that clutter the top viewport. | **HIGH** | Redesign the watchlist header into a unified command console with clean tab dividers and an integrated search/filter dock instead of disjointed floating controls. |
| **TELL-05** | `[COMPONENT]` | `WatchlistManager.tsx:280-450` | **Repetitive Card List Stack:** Each movie in the watchlist is a separate rounded box with identical borders and paddings stacked vertically. | **HIGH** | Convert the watchlist into an editorial phase docket or technical sequence ledger with varied density, distinct treatment for completed vs. active titles, and cleaner episode disclosure. |
| **TELL-06** | `[COMPONENT]` | `DiscoverCatalog.tsx:180-260` | **Card Grid Wall:** Repetitive grid of rounded movie cards with identical badges and buttons. | **MEDIUM** | Group discovery into an editorial showcase (featured spotlight at the top) followed by dense horizontal category reels or an index table. |
| **TELL-07** | `[LAYOUT]` | `UserProfile.tsx:84-180` | **Stacked Box Slices:** Operative header, sync box, and stats are three consecutive stacked rounded containers with 1px border. | **MEDIUM** | Unify the operative profile into an asymmetric identity badge and high-density telemetry console with fewer nested border boxes. |
| **TELL-08** | `[COPY]` | Multiple files | Spaced-dash labels or middle dots in meta strings (e.g. `• #1 in sequence`, `2025 • Marvel`). | **LOW (LOCKED)** | *Noted, not changed* (Copy and content are locked per contract). |
| **TELL-09** | `[TYPE/COLOUR]` | `tailwind.config.js` | Dark palette with red/gold accents matching cinematic universe aesthetic. | **LOCKED** | *Noted, not changed* (Colour and typography are locked per contract). |

---

### B. Pre-flight Checks (Section 12.1) & States Checks (Section 12.8)

| Check | Status | Evidence / Notes |
| :--- | :--- | :--- |
| **390 px Mobile Layout** | **NEEDS FIX** | On 390px, `WatchlistManager` filter toolbar overflows horizontally; multiple button labels wrap tightly; TitleDetailsModal header backdrop takes up substantial vertical viewport height before synopsis. |
| **820 px Tablet Layout** | **PASS** | Responsive grid drops to 2 columns smoothly. |
| **1440 px Desktop Layout** | **PASS** | Sidebar collapse toggle works; main content constrained to `max-w-7xl`. |
| **Keyboard Focus Ring (`:focus-visible`)** | **NEEDS FIX** | Several custom buttons (`div onClick` or unstyled buttons) lack visible `:focus-visible` outline rings for accessibility. |
| **Hover States & Transitions** | **NEEDS FIX** | Some cards use `transition-all duration-300` instead of specific `transform` and `opacity` transitions. |
| **Empty States** | **PASS** | Custom empty states implemented for search, watchlist filters, and in-progress sections. |
| **Semantic HTML** | **NEEDS FIX** | Several interactive clickable items are implemented as `<div onClick>` instead of `<button>` with accessible attributes (e.g. `TitleDetailsModal` backdrop click, phase card triggers). |
| **Reduced Motion (`prefers-reduced-motion`)** | **NEEDS FIX** | `NumberTicker` and rotating banner lack explicit `prefers-reduced-motion` fallbacks to instant static states. |

---

## 6. Implementation Summary & Verification (Step 4 & Step 5)

### A. Completed Batches
1. **Batch 1 (Design Tokens & Shared Shell):**
   - Extended `tailwind.config.js` with Doctor Doom emerald palette (`doom.emerald`, `emerald-dark`, `emerald-light`).
   - Added `.doom-metallic-card` in `src/index.css` with subtle emerald specular highlights, deep obsidian graphite backgrounds (`#090a0f`), and smooth transform transitions.
   - Updated `Header.tsx`, `Sidebar.tsx`, `MobileNav.tsx`, and `App.tsx` with Doctor Doom emerald active indicators and badges.

2. **Batch 2 (Home / Command Centre):**
   - `RotatingHeroPane.tsx`: Single automated rotating screen (active phase movies if logged in, curated showcase if guest) with zero manual toggle controls. Added direct streaming CTA (`[▶ Stream on JioHotstar]`) on the billboard and simplified `[View Movie Info]` button.
   - `DoomsdayCountdown.tsx`: Upgraded to `.doom-metallic-card` with digital block counters and Doctor Doom emerald accents.
   - `CommandCentre.tsx`: Updated Telemetry Bar to `.doom-metallic-card`; Recommended Next Spotlight features direct India streaming CTA; Phase Progress upgraded to an asymmetrical sequence with active phase glow; Knowledge Arena & Multiverse Explorer callouts upgraded to distinct high-contrast cards.

3. **Batch 3 (Title Details Modal):**
   - `TitleDetailsModal.tsx`: Direct streaming link (`[▶ Stream on JioHotstar]`) prominently displayed right on the status bar and in the primary overview tab. Added `Escape` key listener for instant closing. De-slopped notes copy to "Personal Notes & Observations".

4. **Batch 4 (My Watchlist):**
   - `WatchlistManager.tsx`: Upgraded collection header and filter toolbar to `.doom-metallic-card` with Doctor Doom emerald active indicators. Added direct streaming launch button directly on each watchlist row. Refined watched status and info buttons.

5. **Batch 5 (Discover, Knowledge Arena, Multiverse, Profile):**
   - `DiscoverCatalog.tsx`: `.doom-metallic-card` containers, emerald category pills, emerald search focus ring, direct add-to-list buttons.
   - `KnowledgeArena.tsx`: `.doom-metallic-card` lobby, emerald challenge configuration pills, emerald feedback state, and debrief card.
   - `MultiverseExplorer.tsx`: `.doom-metallic-card` atlas view, de-slopped labels, emerald Chronal Core badges and filter pills.
   - `UserProfile.tsx`: `.doom-metallic-card` operative profile, emerald avatar and sync buttons, emerald target date configurator.

6. **Batch 6 (Header Navbar, Minimal Hero, Numbered 1-2-3-4 Rail, Watchlist Card Pattern, Glassmorphism):**
   - **Sticky Top Navbar:** Moved desktop navigation from the left sidebar into a sticky top header bar with glassmorphic backdrop (`.doom-glass-header`), DOOMFLIX logo, horizontal nav links, search bar, and user profile pill. Removed left persistent sidebar for full-width cinematic Netflix viewport.
   - **Minimalist Rotating Hero Pane:** Stripped redundant HUD telemetry, status pills, separate "Doomsday Relevance" sub-boxes, and episode bars from the hero billboard. Left only the giant title, year/runtime/rating, 2-line synopsis, prominent Doom green gradient streaming CTA (`▶ Stream on JioHotstar ↗`), and `More Info` button.
   - **Countdown Removed from Homescreen:** Removed the countdown block from `CommandCentre.tsx` main body; retained only as a sleek pill in the top header.
   - **Netflix-Style Top-10 Numbered Sequence Rail:** Implemented giant outlined hollow Bebas Neue numbers (`1`, `2`, `3`, `4`, `5`...) overlapping partially behind each vertical movie card with emerald glow on hover (`.netflix-rank-number`).
   - **Watchlist Card Pattern:** Replaced stacked table row layout with a 4-column responsive card grid (`.doom-glass-card`) featuring card backdrop artwork, sequence badge, priority pill, TV episode progress bar & collapsible accordion, and direct streaming CTA.
   - **Doom Green Gradient & Glassmorphism:** Applied multi-stop Doom gradient (`from-emerald-600 via-emerald-500 to-teal-400`), translucent frosted glass cards (`backdrop-blur-xl`, border highlights), and ambient background luminous glow orbs in `App.tsx`.

### B. Verification & After-Screenshots Inventory
All after-screenshots captured at 390px, 820px, and 1440px in `file:///Users/aryan/doomsday_ready/after_screenshots/`:
- Phone (390px): `home_phone-390.png`, `watchlist_phone-390.png`, `discover_phone-390.png`, `quiz_phone-390.png`, `multiverse_phone-390.png`, `profile_phone-390.png`, `modal_details_phone-390.png`, `modal_auth_phone-390.png`, `watchlist_phone_scrolled-390.png`
- Tablet (820px): `home_tablet-820.png`, `watchlist_tablet-820.png`, `discover_tablet-820.png`, `quiz_tablet-820.png`, `multiverse_tablet-820.png`, `profile_tablet-820.png`, `modal_details_tablet-820.png`, `modal_auth_tablet-820.png`
- Desktop (1440px): `home_desktop-1440.png`, `home_scrolled-1440.png`, `watchlist_desktop-1440.png`, `discover_desktop-1440.png`, `quiz_desktop-1440.png`, `multiverse_desktop-1440.png`, `profile_desktop-1440.png`, `modal_details_desktop-1440.png`, `modal_auth_desktop-1440.png`

Build Status: `npm run build` compiled cleanly with 0 TypeScript/Vite errors.
