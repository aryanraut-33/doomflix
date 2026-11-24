---
name: rn-design
description: House design rules for any web UI work (landing pages, sites, portfolios, dashboards, app screens, redesigns, design audits, launch QA). Use before writing any HTML/CSS/JSX. Forces subject-led, non-generic design decisions, bans known AI-generated "tells", and routes to the design-taste-frontend reference files when installed.
---

# rn_design.md: Anti-Slop Web Design Operating Manual

Read this fully before writing a single line of UI code. It is a process plus a rulebook. Follow the process; the rules are the checks.

---

## 0. Precedence and how to use this file

1. **The user's brief always wins**, including when it asks for a look this file calls a "default". Rules here apply to every axis the brief leaves free.
2. If the **design-taste-frontend** skill is installed (section 13), its own `SKILL.md` governs the build process and step numbering. This file adds the house rules and the gates. When the two disagree on process, the installed skill wins, **except** for this file's approval gates (A3 for new builds, 15.3 for revamps) and the lock contract (15.2), which are never skipped. When they disagree on taste, the user's brief wins, then this file.
3. If a style skill (for example `high-end-visual-design`) is called **by name**, it narrows this file for that run. Its own recurring patterns (glass cards, bento grids, double-bezel cards) must not become your new default (see section 10).
4. **Fixed style presets are opt-in.** The Studio Preset (section 18, from `elayadesign/ai-design-skills`) hard-codes typefaces, scales, colours and motion. It is a consistency tool, not a taste tool, and it trades distinctiveness for uniformity. Use it only when the user asks for it, names it in the brief ("Style mode: STUDIO PRESET"), or the page is a fast, standardised conversion page for a client with no brand. Otherwise the default is subject-led design (sections 3 to 11).
5. **Owner's standing redesign defaults** (section 15.2): on an existing page, keep the colour palette, the typography and the overall look; replace the layout and the component boxes; and **ask what to change before changing anything**. These locks override any dealt direction, preset or critic suggestion.
6. If no reference files are available, everything needed to produce good work is in this file. Section 13 explains graceful fallback.

---

## 1. The core idea

A model's default output is the average of every page it has seen: centred headline, small label above it, three icon cards, soft gradient, hairline rules, a monospace caption. **Nothing in it is wrong and nothing in it was decided.**

The fix is not "more polish". It is **decisions**:

- Every visible choice (typeface, colour, layout, motion, word) must be traceable to **this subject**, **this audience**, **this job of the page**.
- If a choice would appear unchanged on a different client's page, it is a default. Replace it.
- **Spend boldness in one place.** One memorable element. Everything around it quiet and disciplined.
- Before shipping, take one accessory off (the Chanel rule). Cut a decoration that does not serve the brief.

**Why defaults happen (and why the process below is shaped the way it is).** A language model builds a design token by token and, at every design decision (colour, arrangement, wording), tends to pick the most likely, crowd-pleasing option. The result is design by committee. Consequences you must act on:

- **Asking the model to "be unique" or "choose at random" does not work.** It predicts text that sounds random but is not. Variety has to be **injected from outside the model**: a dealt direction, a random seed string, or the user's own taste (Phase C).
- **The builder is a poor judge of its own work.** It reads its own code and rationale. Quality needs an **independent critic** working from screenshots only (section 12.4).
- **Models add; they rarely subtract.** Restraint has to be applied deliberately (section 12.5).
- **Honest placeholders beat invented proof.** Models fill gaps with plausible fabrications; forbid it (section 9).

---

## 2. Mandatory workflow

Do the phases in order. Do not skip to code. **Scale the ceremony to the task**, but never skip an approval gate:

| Task size | What to run |
|---|---|
| **Micro** (one component, a bug, a tweak, a copy edit) | A4 (ground quickly), a mini Phase D (which existing tokens apply), G, then the 12.5 subtraction pass and the relevant 12.1 and 12.8 checks. Skip B, C and the critic loop. |
| **Section or single page** | Full A to I with a shortened sprint (three directions) and one to two critic iterations. |
| **New site or brand page** | Everything, including the full sprint and the critic loop. |
| **Existing page: audit, revamp or AI-tell removal** | Section 15, not the new-build path. Phases B, C and the A3 gate are replaced by the 15.3 procedure. |

Approval gates (A3 for new builds, 15.3 for revamps) are never skipped, at any size, because they are how the owner stays in control.

### Phase A: Intake and grounding

**A1. Intake (one batch).** Collect the following from the message, attachments or by asking. Ask **all essential questions in a single batch**, never drip-fed, and ask only for what is missing.

*Purpose*
- The **ONE primary action** (book a call, buy, trial, join the waitlist, download)
- The offer: exactly what the customer gets, in plain words (the outcome they want, not "personalised solutions for ambitious professionals")
- What counts as a conversion (click, signup, purchase)

*Audience and context*
- The ideal customer and the problem they are trying to solve
- Their **top three objections** (why they do not convert today)
- Traffic source (social, ads, search, email) and **what visitors already know** when they land

*Proof and assets*
- Proof that **actually exists** (logos, testimonials, numbers, case studies), screenshots, demo video or GIFs
- Guarantees, refund and cancellation terms that are real

*Brand and constraints*
- Brand voice (casual or professional) and brand personality (three adjectives)
- Design direction, mobile priority, and reference sites or screenshots with **exactly what is liked about each** ("keep the opening this simple, product screenshot beside the headline", not "make it premium")

If the user cannot answer, make a reasonable assumption, **state it in one line and label it**, and continue; do not stall the build. Never fabricate testimonials, clients, statistics, prices or guarantees. Omit any proof or guarantee section the user cannot support.

**A2. Strategy before visuals.** Marketing pages: settle strategy and structure (audience, offer, conversion goal, outline, copy) **before** the visual system. Visuals serve the strategy, not the reverse. For marketing pages, use the landing-page strategy module (section 17) for structure, layout type, conversion rules, copy formulas and SEO.

**A3. Approval gate (no code yet).** Present, in this order:

1. One sentence: audience, offer and conversion goal
2. Page outline and section order
3. Hero headline, subheadline, primary CTA, and an honest proof line (only if real proof exists)
4. Three to five outcome-focused benefits
5. A three-step "how it works" (only if the offer genuinely has steps)
6. Six to twelve useful FAQs, using only facts supplied or confirmed
7. SEO recommendation: index or noindex, with the reason
8. Recommended layout type (A to D, section 17.2) and why it suits this offer

**Wait for approval.** Run the headline test (section 9) on item 3 before presenting it. For app screens or tools, replace items 3 to 6 with the screen's job, key states and data, and keep the rest of the gate.

**A4. Ground in the subject.** Write down, in three lines:

- **Subject:** one concrete thing (not "a SaaS product": "a scheduling tool for physiotherapy clinics").
- **Audience:** who actually lands here and in what state of mind.
- **Primary job of the page:** the one action or understanding it must produce.

If the brief does not identify these, propose them and confirm with the user. If you hold any stored context about the client's preferences or project, use it as a hint.

Then mine the subject's world for **materials, vernacular, artefacts, instruments, places, jargon, textures, units, forms**. A toy for 8 to 11 year olds, a dashboard for financial analysts and a ceramics studio must not share a visual system. Distinctive choices come from here, not from a style catalogue.

### Phase B: Set the dials (1 to 10)

Declare three numbers and justify them against the subject:

| Dial | Low | High |
|---|---|---|
| **DESIGN_VARIANCE** | Conventional, predictable layout | Experimental, asymmetric, unexpected structure |
| **MOTION_INTENSITY** | Static or only responsive feedback | Orchestrated, scroll-driven, choreographed |
| **VISUAL_DENSITY** | Spacious, few things per viewport | Dense, information-rich (dashboards) |

Rules of thumb: dashboards and tools sit at high density, low-to-mid motion. Brand and portfolio pages can go high on variance. Never leave all three at 5.

### Phase C: Diverge, then converge (inject variety from outside the model)

Asking for "something unique" returns the average page (typically: a purplish gradient, text left, graphic right, nav on top). Use one or more of these sources of variety, in order of preference.

**C1. Dealt directions (preferred when available).** If `scripts/draw.mjs` exists (section 13), run it to deal three researched directions from twenty, and choose the one that carries the subject's idea. Self-chosen directions collapse to category defaults.

**C2. Seed string (fallback, or to bend a dealt direction).**
1. Generate a long random alphanumeric string **with a shell command**, not from your own head (for example `openssl rand -hex 32`, or an equivalent on the platform).
2. Derive the creative direction (colour scheme, layout, typography, structure) from it. Look beyond the surface for sub-patterns, special numbers, anything that inspires a specific choice.
3. Use judgement to bring that direction to life and make it look good. **Never show the string in the design.**

**C3. The user's own taste (strongest).** The most distinctive pages start from an inspiration the agent would not pick by itself: a video game, an interior-design movement, an art installation, printed ephemera, an instrument. Name it, then describe how it should influence the output. If the user has no idea yet, run this loop:

1. Ask the agent for **as many directions as possible, deliberately short and high-level** ("go broad, not deep").
2. The user visualises favourites and reacts, including **what feels tacky or unwanted** ("tactile and clicky, but not cartoony or skeuomorphic; grey gradients are boring, add texture").
3. Refine the chosen direction against those reactions.
4. Have the agent write a **concise build prompt** for a first proof of concept.

Pasting unrefined AI-generated ideas straight back in produces what anyone else would get. Steering with taste is what makes it yours. Do not discard ideas because they sound terrible; "there is no way this works" is often a good sign. If a bold idea flops, **save the prompt and retest it when a newer model is available**.

**C4. The sprint.** Adapted from the "90-Minute AI Design Sprint" method (MC Dean): diverge wide, converge with criteria, prototype, then try to break it.

1. **Diverge.** Generate **at least 6 distinct concept directions**, not 6 skins of one layout. Each is one sentence plus its governing idea (for example "the page is a field notebook", "the page is a tide chart"). Include at least two **wildcards**.
2. **Converge.** Score each 1 to 5 on **Desirability** (will this audience respond?), **Feasibility** (can it be built well here?) and **Differentiation** (would it be mistaken for another site?). Keep the top one. If the winner scores below 4 on differentiation, return to step 1.
3. **Swap test.** Replace the brand name with a competitor's. If nothing in the concept breaks, it is not specific enough.
4. **Stress-test later** in Phase H.

### Phase D: Write the design plan (tokens first, no code)

Produce a compact plan:

- **Colour:** 4 to 6 named hex values, each with a role (see section 6).
- **Type:** the faces, the role of each, the scale, the measure.
- **Layout concept:** one-sentence prose plus an **ASCII wireframe** of the hero and at least two other sections. State alignment (left, centred, justified) and why.
- **Principles:** 3 to 5 lines on what makes this page unlike any other.
- **Hero concept:** the most characteristic thing in the subject's world, in the form that suits it (see section 4).

### Phase E: Review the plan against the "default test"

For every part of the plan ask: *"If I were given a similar brief for a different company, would I have arrived at this?"* If yes, revise that part and state what you changed and why. Also run the plan against the tells registry (section 10). Only then proceed.

### Phase F: Write the copy deck before layout

Copy makes a page feel templated as quickly as visuals do (section 9). Write the argument and **all visible strings** first, anchored to the approved outline from A3. Layout serves the copy, not the reverse. Run the headline test and the fabrication audit (section 9) before moving on.

### Phase G: Build

- Real content throughout. No lorem ipsum, no "Feature One".
- **Build section by section**, not all at once, so each section can be reviewed.
- Mind CSS specificity: do not let a `.section` class and an element selector (e.g. `.cta`) cancel each other's padding or margin.
- Build the quality floor (section 12) as you go, not at the end.
- Use a real design system when the context calls for one (Material, Carbon, Fluent, Polaris, Primer, GOV.UK). Otherwise build custom with Tailwind, Motion or GSAP as appropriate. On native platforms, prefer **native components** over custom ones that look worse.
- Keep a **decisions log** (section 12.7). Approved messaging, tokens and rejected choices are frozen; later passes must not change them without asking.
- Where the subject benefits from richer visuals, use generated imagery or video (sections 8 and 11) instead of the gradient-and-shape fallback.

### Phase H: Look, critique, subtract, fix, look again

- Take screenshots at **three widths** (phone about 390, tablet about 820, desktop about 1440). If you cannot render, say so and review the code against the gates instead.
- Run the **independent critic loop** (section 12.4), then the **subtraction pass** (section 12.5). Score against the rubric (section 12.3). Fix the worst problem first; re-shoot.
- Audit, then change **one section at a time**: list five concrete issues (generic, unclear, inconsistent, unfinished), improve one section, explain what changed and why, keep approved messaging and brand direction.
- Stress-test like a hostile reviewer: what breaks at 320 px? with long German strings? with no image? with JS disabled? with reduced motion? with keyboard only?

### Phase I: Launch QA

Run the launch QA checklist (section 12.6) before the page is shared. Report every check as PASS, NEEDS FIX or NOT TESTED with evidence. Never claim a check passed unless it was actually performed.

---

## 3. Dealt directions and the subject-first rule

Research behind the `design-taste-frontend` skill (a study of 247 curated gallery sites) found that **what separated the best sites from forgettable ones was a concept taken from the thing itself, not the styling.** Consequences:

- Styling words ("modern", "clean", "premium", "minimal") are not concepts. A concept is a claim: "this brand's product is *time saved*, so the page is a stopwatch".
- Pick one governing metaphor or structural idea and let it determine layout, type behaviour and motion.
- Directions can be borrowed (editorial, brutalist, archival, instrument-panel, zine, catalogue, specimen sheet), but they must be bent to the subject's real materials.

---

## 4. The hero

The hero is the first thing seen. **Open with the most characteristic thing in the subject's world**, in whichever form fits: a headline, an image, an animation, a live demo, an interactive moment, a specimen, a real artefact.

Avoid as default: a big number plus small label plus supporting stats plus gradient accent. It is the generic default and only justified if it is genuinely the best option. Also check the hero **fits the viewport** at common phone and laptop heights, with the primary action visible without scrolling.

---

## 5. Typography

Type carries the personality of the page.

- **One family or two.** If two, make them clearly distinct (different structure, not two similar sans-serifs).
- Choose faces **deliberately**, not the ones you would pick for any project. Do not default to Inter, Roboto, Arial, Open Sans, Helvetica or system-ui as the "choice". They are acceptable only when the subject justifies them (for example a government service).
- Build a **real type scale** (a ratio, not ad hoc sizes) following Bringhurst's *The Elements of Typographic Style*: intentional weights, widths, tracking.
- **Measure:** body lines under 80 characters (roughly 45 to 75 is the target). Serifs may run slightly longer and need slightly more line-height than sans-serifs.
- Treat display type as an **active part of the design**: scale, weight contrast, width axis, cropping, alignment, interplay with imagery. Not a neutral delivery vehicle.
- Load fonts properly (`font-display`, subsetting, preload the one face above the fold, a metric-matched fallback to avoid layout shift).
- **No orphans.** A single word must never sit alone on the last line. Use `text-wrap: balance` on headings and `text-wrap: pretty` on body copy, and place deliberate line breaks in display headlines where the thought breaks, never mid-phrase.
- **Name your text styles once.** Define each style (Heading, Title, Body, Button, Caption, each with size, line height and weight) as a token or class and apply it by name, instead of repeating loose size and weight utilities. Snap sizes to your defined scale; arbitrary one-off values (`19px`, `1.4rem`) signal a page nobody decided.
- **A short "approved fonts" list is itself a default.** Geist, Manrope and Poppins now appear on a large share of generated pages the way Inter once did. Treat any list-pick as a default to justify against the subject.

**Typographic tells to avoid:**
- Accenting a single word or phrase in a headline (one italic word, one coloured word, one bold word).
- ALL CAPS tracked-out labels as the default label style.
- Unnecessary small labels or eyebrows above content.
- Using one generic serif for "premium" feel.
- Em dashes in visible copy (rewrite the sentence).

---

## 6. Colour

- Define **4 to 6 named hex values** with roles: base, surface, ink, one primary accent, one support, optional signal (error/success).
- Decide **proportions** (for instance 70 / 20 / 8 / 2) and stick to them. Accent colour is used for meaning, not sprinkled.
- Derive tone steps from the palette rather than adding unrelated greys. Tint neutrals toward the palette's hue.
- **Contrast:** body text 4.5:1 minimum, large text and UI components 3:1. Check dark pages explicitly (grey-on-black fails often).
- Pull the palette from the **subject's world** (a material, a printing ink, a place, a laboratory standard) and be able to say where each colour came from.
- Keep colour usage consistent between sections. One page, one system.
- Support `color-scheme` and, if the brief includes dark mode, redefine tokens rather than inverting.

**Palette clusters that currently read as AI:**
1. Warm cream (near `#F4F1EA`) + high-contrast serif display + terracotta or clay accent (near `#D97757`).
2. Near-black background + a single acid-green or vermilion accent.
3. Beige plus brass/gold "premium".
4. Purple-to-blue gradient washes as decoration.
5. Tinted near-black (`#0B0B0B`, `#111`) standing in for black, everywhere.

These are not forbidden; they are **defaults**. Use one only if the brief or subject demands it, and say why. **In a revamp the owner's existing palette is locked even if it matches a cluster above**: report it as an observation, do not change it (section 15.2).

---

## 7. Layout and structure

- **Visual structure is information.** Borders, outlines, numbering, dividers, eyebrows and labels must encode something about the content. Numbered markers (01 / 02 / 03) only if the content is actually a sequence.
- Establish a **grid and a rhythm**, then deliberately break it once, on purpose.
- **Vary sections.** Adjacent sections must not share the same composition (no hero, then three cards, then split, then three cards).
- Do not chop content into **identical rounded cards** with one radius, one soft grey shadow and the same padding. If cards exist, hierarchy should change radius, size and weight.
- Avoid the **symmetrical three-equal-feature-cards** row unless the three things are truly equal.
- Navigation and footer are part of the design, not boilerplate. Make them match the page's concept.
- **Phone is a composition, not a collapse.** Design the phone layout deliberately (reorder, crop, change scale). Collapse to a single column below 768 px, but with intent.
- Wide content (tables, code, diagrams) scrolls inside its own container; the page body never scrolls sideways.
- Generous whitespace is a tool, not a style. Density follows the VISUAL_DENSITY dial.
- **Systematise values, then choose them per project.** Define the spacing scale and the radius scale once (for example a 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 px spacing ladder) and use nothing between them. The *mechanism* is universal; the *values* are the project's own decision.
- **Nested radius formula.** When a shape sits inside another and the gap between them is under 32 px, `inner radius = outer radius - gap`, applied only when the result is greater than 2 px; below that, leave the inner shape square. A 16 px card with 8 px padding gives an 8 px inner radius.
- **Borders go all the way around or not at all.** Never apply a border to one side of a card unless that side encodes meaning (a status edge, a quote rule) and you can say what it means.

---

## 8. Imagery, icons, illustration

- Prefer **real pictures of the subject's world** over stock abstractions. Find open-licence photographs, crop them with intent, **credit them**.
- If there are no images, do not fake it with gradient blobs. Use **type, diagrams, specimens, data, texture, or constructed graphics** native to the subject.
- Icons: ultra-light, consistent stroke and optical size. Avoid the thick-stroke default icon set on every card. Icons should be rare and meaningful, not one per bullet.
- Always set `width`/`height` (or aspect ratio) to prevent layout shift; lazy-load below the fold; meaningful `alt` text.
- No generic 3D-blob, floating-glass-card, or "dashboard mockup with fake numbers" hero art unless the subject truly is that.
- **Generated imagery.** Coding agents default to gradients, shapes and patterns, which are strong giveaways. When no real photography exists and the subject benefits, generate imagery with a built-in image tool or an image-generation API, then combine it with restrained shader or 3D effects where it earns its place. Verify the result **frame by frame in the browser**. Respect the generator's licence terms and never depict real people or real brands without permission.
- **API keys are dev-only secrets.** Use a **separate key with a tight spend limit** that can be revoked without disrupting other work. Store it in a **gitignored** file (for example `.env.agents`), record in `AGENTS.md` or `CLAUDE.md` that these keys are for development use only and **must never ship in the product or appear in code, logs or commits**. If a key was pasted into a chat, treat it as exposed and rotate it afterwards.

---

## 9. Copy

Words exist to make the design understandable and usable. They are design content, not decoration.

- Write **from the user's perspective**, in plain language. A user manages *notifications*, not *webhook config*.
- Be **specific and legible** over clever. Describe what something is or does rather than selling it.
- **Active voice.** A CTA says exactly what will happen: "Save changes", not "Submit". Keep the same verb through the flow (Publish, then "Published").
- **Failure and empty states** give direction, not mood. Say what went wrong and how to fix it, in the interface's voice. Errors do not apologise. An empty screen is an invitation to act.
- Sentence case, plain verbs, no filler. Each element does one job.
- **Headline test (swap test).** If the headline could describe five unrelated businesses, or survives swapping the company name, reject it and rewrite it around the specific outcome the customer wants. "Get feedback on your resume before you apply for your next product manager role" beats "Personalized career solutions for ambitious professionals". The CTA names the result ("Book a Resume Review"), not the mechanism.
- **Honest proof only.** If there are no real testimonials, clients, numbers or guarantees, omit that section entirely. Use what is real instead (process, specifics, sample work, a clear explanation).
- **Read the copy before approving it**, especially the headline. Copy is approved at the A3 gate, then frozen.
- **Banned filler:** "revolutionize", "supercharge", "cutting edge", "effortless", "transform your workflow", "take it to the next level", "harness the power", "world class". Say what the product does in plain terms.
- **Sentence case** for headings and buttons.
- **System messages:** confirmations are calm and specific ("Invoice sent to Dana"). Errors say what failed and what to do next ("Upload failed. The file is over 20 MB."). No cute interjections, no exclamation marks.
- **Content realism in fictional demos and prototypes** (never on a real product's page): full, specific names that fit the audience and region; invented brand names that sound native to the industry (a logistics tool's customers sound like logistics firms); **no suspiciously round figures** (prices look like real prices, metrics carry a decimal or odd final digit, dates in a list vary); never reuse one face for two people.
- **On a real product's page, every price, guarantee, statistic, customer count, testimonial and logo comes from the user or a real source.** When a fact is missing, use a visibly marked placeholder such as `{{price}}` or `{{testimonial}}`, never a plausible invention.
- **Audit every visible string** for invented facts: fake testimonials, fake statistics, fake logos, fake awards, fake team names. Use real content or clearly marked placeholders.
- **Copy tells to remove:** "Elevate / Unlock / Seamless / Supercharge / Next-gen", "Built for the modern X", em dashes, rule-of-three taglines, metaphors-as-headlines, spaced-dash labels like `WORD, fragment`, meta strings joined with middle dots (`A · B · C`), arrows (`→`) appended to every link.

---

## 10. The tells registry (what reads as AI-generated)

Treat this as a checklist of **defaults to replace**. For each hit, either replace it with a subject-specific decision or be able to justify it.

**Chrome that appears whatever the subject:**
- Tracked-out ALL-CAPS eyebrow above every heading
- Monospace face for every small data label
- `→` on every link or button
- Meta strings with middle dots; `WORD, fragment` labels
- Hairline rules and 1px grey borders everywhere
- Numbered sections that are not a sequence

**Layout and component kits:**
- Identical rounded cards, one radius, one soft shadow (`rgba(0,0,0,.1)`) under all
- Three equal feature cards with icons
- Gradient wash backgrounds and glowing blobs
- Edge-to-edge sticky navbar glued to the top with a blur
- Broadsheet pastiche: zero radius, hairline rules, dense columns, regardless of subject
- Hero = big number + label + stats + gradient accent
- Gradient-filled hero heading text (white to grey on dark, black to grey on light)
- The same short font list (Geist, Manrope, Poppins) on every project

**Style-skill patterns that become tells when used by default:**
- Glassmorphism ("ethereal glass"), asymmetrical bento grids, nested "double-bezel" cards, Z-axis card cascades
- A single "premium" serif for headings with beige background and brass accent

**Motion tells:**
- Fade-and-slide-up on every section
- Hover lift or glow on every card
- `transition: all`, linear or default ease-in-out on everything
- A word-by-word scroll-highlight tagline section on every page (a fine effect once, a tell as a template)

**Content tells:**
- Placeholder testimonials, logo walls of invented brands, made-up metrics
- Headlines that could be swapped between any two companies

---

## 11. Motion and interaction

- **Budget it.** Declare how many moments of non-user-triggered motion the page has. The default is **one**: a single orchestrated moment (page-load sequence, one hero reveal, one scroll scene). Scattered effects read as generated.
- **Motion that answers a person's action** (opening, expanding, confirming, dragging) is welcome when it shows what changed.
- Use custom easing (a cubic-bezier or spring) rather than the browser default. Animate **`transform` and `opacity` only**; never `transition: all`.
- Scroll-driven scenes (pinned stages, parallax, reveals): use only when the idea requires them, and test them at 0 to 100% of their hold on desktop, phone and reduced motion (the skill ships a script for this, see section 13).
- **`prefers-reduced-motion` is mandatory.** Provide a non-animated equivalent, not just a faster one.
- Every animation must be justified in one sentence: what does it tell the user?
- Hover states exist for pointer devices; do not rely on hover for essential information on touch.
- **Generated video as an advanced option (use only when the idea needs it).** Two patterns work: (1) a **looping clip on a solid background**, with the background removed by chroma key or a video-matting model, layered in the UI as an animated graphic; render glass or refractive effects over the real page background colours first so the refraction is baked in; (2) **keyframe-to-keyframe interpolation clips** played on an action or **scrubbed by scroll or swipe**, with each clip seeded from the previous clip's last frame for continuity. The best video models change frequently, so let the agent pick a current one through an aggregator platform rather than hard-coding a model. Constraints: compress aggressively, keep loops short, show a poster frame, lazy-load, supply a **static fallback** for reduced motion and slow connections, and keep essential content accessible without the video.
- **Starting recipe (adjust to the concept, do not apply blindly):** a decelerating "weighted" curve such as `cubic-bezier(0.22, 1, 0.36, 1)`; about 500 ms for position and layout changes; 200 to 300 ms for colour or opacity shifts (never under 200 ms); animate only `transform` and `opacity`, never `top`, `left`, `width` or `height`; reduced motion swaps movement for a plain opacity change.
- **Trigger scroll work with `IntersectionObserver`** (or a framework equivalent such as `whileInView`), never an unthrottled `window` scroll listener. A reveal plays once and does not replay on scroll back up. **Scroll reveals count against the motion budget above**: spend them on the one budgeted moment or a few key elements, not on every section.
- **Menus:** if there is a mobile menu, make it a full-height panel rather than a tiny dropdown; the open/close icon transforms rather than swaps; links enter in reading order about 60 ms apart with the whole sequence capped near 400 ms. Floating, blurred, centred nav bars are a current default: use one only if it fits the concept.

---

## 12. Quality floor and gates

Build to this floor without announcing it. Every item must pass before shipping.

### 12.1 Pre-flight checklist

- [ ] Contrast meets WCAG AA across all text and UI states, including dark sections and text over images
- [ ] No button label wraps awkwardly or overflows at 320 px
- [ ] Hero fits the viewport and the primary action is visible
- [ ] Colour usage is consistent across sections; no stray one-off hexes
- [ ] Every motion has a stated reason; reduced motion respected
- [ ] No invented facts in any visible string
- [ ] No tell from section 10 survives without a stated reason
- [ ] Responsive at 320, 390, 768, 1024, 1440; no horizontal page scroll
- [ ] Visible **keyboard focus** on every interactive element (use `:focus-visible`; never remove the outline without a replacement)
- [ ] Semantic HTML (real `button`, `a`, headings in order, landmarks)
- [ ] Images sized, lazy-loaded where appropriate, with `alt`
- [ ] Section 12.8 (states, ship requirements) satisfied

### 12.2 Web interface guidelines (summary)

These follow the spirit of Vercel's Web Interface Guidelines. **The authoritative rules are in the `web-design-guidelines` skill's `references/command.md`; read that file for any audit and prefer it over this summary.**

- **Accessibility:** icon-only buttons have an accessible name; form controls have labels; decorative icons are `aria-hidden`; actions are `button`, navigation is `a`; headings are hierarchical.
- **Focus:** visible focus rings; use `:focus-visible`; never `outline: none` without a replacement.
- **Forms:** correct `type`, `name`, `autocomplete`; do not block paste; inline errors next to the field; submit stays enabled until the request starts; warn before losing unsaved changes.
- **Animation:** honour `prefers-reduced-motion`; animate `transform`/`opacity`; never `transition: all`; animations are interruptible.
- **Typography:** curly quotes and a real ellipsis character; non-breaking spaces for units; `font-variant-numeric: tabular-nums` for number columns; `text-wrap: balance` on headings.
- **Content handling:** containers handle long, short and empty content; truncate with intent; flex children that must shrink get `min-width: 0`.
- **Images:** explicit dimensions to prevent layout shift; lazy-load below the fold; priority for the hero image.
- **Performance:** virtualise long lists; avoid layout reads in render; preconnect to critical origins.
- **Navigation and state:** URL reflects UI state; links are real links; destructive actions need confirmation or undo.
- **Touch:** `touch-action: manipulation`; sensible tap target sizes; safe-area insets honoured.
- **Dark mode and theming:** set `color-scheme` and a matching `theme-color`; test form controls in both modes.
- **Hydration and locale:** no hydration mismatches from dates or random IDs; format dates, numbers and currencies with `Intl`.

### 12.3 Critique rubric (juror's scoring)

Score each 1 to 5, then fix the lowest first, then re-shoot.

| Criterion | Question |
|---|---|
| **Idea** | Is there a concept taken from the subject, visible in the first screen? |
| **Distinctiveness** | Could this be mistaken for another site? |
| **Hierarchy** | Is the order of attention obvious within 3 seconds? |
| **Type** | Does type carry personality, with a clear scale and measure? |
| **Colour** | Does the palette have roles and proportions, and pass contrast? |
| **Rhythm** | Do sections vary and breathe, with one deliberate break? |
| **Craft** | Alignment, spacing, edge cases, states, no overflow? |
| **Restraint** | Is there exactly one memorable move, with everything else quiet? |
| **Copy** | Is it specific, honest and free of tells? |
| **Resilience** | Does it hold on phone, keyboard, reduced motion and slow networks? |

Ship only when nothing scores below 3 and Idea and Distinctiveness are at least 4. **This rubric is the builder's self-check and runs first; the independent critic (12.4) is the completion gate and runs second. Both must pass.** If they disagree, fix the lowest rubric criterion and the critic's top gap before anything else. Keep a short note of what was tried, so the next pass does not repeat itself.

### 12.4 Independent critic loop

The builder cannot judge its own work objectively. Use a **separate critic**, a subagent in a fresh context, wherever subagents are available.

**Procedure for each iteration**
1. Capture screenshots of the current design (desktop and phone).
2. Invoke the critic in a **fresh context with only the screenshots**: no code, no implementation details, no earlier iterations or critiques.
3. The critic states the aesthetic the design is aiming for, imagines how a top design studio would execute that aesthetic, outlines the **biggest gaps**, and gives a **score out of 10** against that studio-level bar.
4. Apply the fixes; repeat with the **same critic prompt every time**.

**Guidance the critic receives**
- Think about overall structure and composition as well as fine detail.
- Watch for patterns that feel overdone, excessive or obviously AI-generated (section 10) and penalise them.
- Give tight, specific feedback, not vague prose.
- Be bold and opinionated; do not default to what is safe.

**Stopping rule**
- After the 12.3 rubric passes, the work is complete only when the critic **independently** scores it **9/10 or higher**. **Do not put that threshold in the critic's prompt**; keep its scoring objective.
- Run one or two iterations first and check the score is converging before continuing. Cap the loop (for example 5 iterations). If the score plateaus, change the concept, not the polish.

**Making the criteria objective**
- Weak: "Judge whether this looks beautiful, not AI-generated." Too subjective; results swing run to run.
- Better: "Describe the aesthetic, imagine a top studio's execution, judge against that bar."
- Best: give the critic **four professional reference designs plus one screenshot of ours** and ask it to **rank them by polish and taste**. Treat the references as a baseline or moodboard, never as a target to copy.

**Model roles.** Use the strongest available model as the critic (it will only produce a small share of tokens) and a capable mid-size model as the implementer. Do not go so small that the implementer cannot execute a direction well.

**If subagents are unavailable**, do a fresh-context self-review from screenshots only, and say in the hand-back that this is a weaker substitute.

### 12.5 Subtraction pass

Models add and almost never remove. Before shipping, go through every element and ask **"what is this for?"** Remove anything that does not carry information or serve the offer:

- Glows, gradient washes, decorative background blobs
- Random coloured highlights on text
- Extra labels, and explanatory text that the imagery already communicates
- Empty containers and padding used only to fill space
- Custom buttons or inputs that look worse than the platform's native ones
- Oversized, over-weighted type where smaller and tighter reads better

A brief that asks for "minimal" still often returns decoration; verify the result is actually minimal. A gradient or a card is fine when it serves the offer, and should go when it distracts from it or exists only to fill an empty patch of screen. Fewer things on screen, done well, hold attention better than clutter. Subtraction applies to **decoration**, never to required states, accessibility features or ship requirements (12.8).

### 12.6 Launch QA

Act as a launch QA reviewer. Inspect the build against this file (and the attached design skill, if any). Return **PASS**, **NEEDS FIX** or **NOT TESTED** for each check, with evidence and a precise fix. Use a checklist, not a table.

- [ ] 390 px mobile: no overflow, no cut-off content
- [ ] Hero readability and the primary CTA
- [ ] Navigation and every link
- [ ] Forms **actually submitted**, validation behaviour, and confirmation that the message arrives where it should
- [ ] Hover, keyboard focus, loading, empty and error states where applicable
- [ ] Reduced-motion preference
- [ ] Image alt text
- [ ] Page title and meta description
- [ ] Favicon and social-sharing image
- [ ] Footer legal links where relevant
- [ ] Placeholder or fabricated content

**Evidence rules.** Do not claim an interaction works unless it was tested. Label checks that need manual browser testing as NOT TESTED, and state which tools or browser access are missing. One width does not catch every layout problem: also check an actual phone and a desktop screen. If the preview cannot publish the site, list the files produced and the steps needed to deploy, including any hosting or form-service setup that still has to happen.

### 12.7 Decisions log

Keep a short `design-decisions.md` (or an equivalent note) in the project. Record **approved** fonts, colours, spacing, button styles and messaging, **rejected** choices and why, labelled assumptions, and, for revamps, the **lock list** (15.2). Read it before every later change. Without it, a revision can quietly alter the button style that was approved or bring back a section that was removed. Reusable values (colours, spacing sizes) are the design tokens; use the approved ones instead of inventing new values.

### 12.8 States and ship requirements

**Every interactive element ships its full state set**
- **Hover:** background shift, slight scale or translate (on pointer devices)
- **Active:** `scale(0.98)` or `translateY(1px)` for physical feedback
- **Focus:** a visible focus ring (an accessibility requirement)
- **Loading:** skeletons shaped like the real layout, not generic circular spinners
- **Empty:** a composed "getting started" view, never a blank panel
- **Error:** inline and specific; never `window.alert()`
- No dead links: a button pointing at `#` is either linked or visibly disabled. The current page is indicated in the navigation. Every page has a way back.

**Things that are forgotten and make a page feel unfinished**
- Privacy policy and terms links in the footer
- A custom, branded 404
- Client-side validation for email format and required fields
- A skip-to-content link for keyboard users
- Cookie consent where the jurisdiction requires it
- A branded favicon
- `<title>`, meta description, `og:image` and social sharing tags
- Alt text on every meaningful image
- Semantic landmarks: `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`
- A check at 390 px wide: no horizontal overflow, button text stays inside its button, and the primary action is visible in the first screen

---

## 13. Using the design-taste-frontend reference files

The `design-taste-frontend` skill (tasteskill v2, from `leonxlnx/taste-skill`) ships a library, references and scripts. This section tells the agent **how to find and route to them** without reading everything.

### 13.1 Install

```bash
npx skills add https://github.com/leonxlnx/taste-skill --skill design-taste-frontend
```

Runtime needs: **Node 22+** and Chrome, Edge or Chromium (for the browser-based gates). No API keys.

### 13.2 Resolve the skill root once per session

Do not guess a path. Locate the folder whose `SKILL.md` has `name: design-taste-frontend`. Typical places, checked in this order:

1. `./.claude/skills/design-taste-frontend/`
2. `./.agents/skills/design-taste-frontend/`
3. `~/.claude/skills/design-taste-frontend/`
4. `~/.agents/skills/design-taste-frontend/`

If none exists, search the project and home skill folders for that name. Store the result as `$TASTE` and use it as the base for every relative path below. **If it cannot be found, say so, continue with this file alone, and note in the final summary that the research-backed gates were not run.**

### 13.3 Read on demand, never in bulk

Read `$TASTE/SKILL.md` first. Then open **only** the file the current phase needs:

| Read this | When |
|---|---|
| `references/app-screens.md` | Any dashboard, admin, settings or other app screen (own run, rules, tokens, checks) |
| `references/copy.md` | Phase F: writing the argument and the copy deck (the two-line arithmetic) |
| `references/type.md` | Setting type: scales, tracking, measure, loading fonts, pairing |
| `references/colour.md` | Applying the palette: roles, proportions, tone steps, dark pages, contrast |
| `references/layout.md` | Grid, margins, rhythm, section variety, navigation, footer, the phone composition |
| `references/imagery.md` | Choosing, finding, crediting, cropping and treating pictures; what to do with none |
| `references/motion.md` | Motion step: budget, tokens, recipes, reduced motion |
| `references/scenes.md` | When the chosen direction deals scroll scenes: placing, filling, fitting, phone, checking, catalogue |
| `references/critique.md` | Phase H: how to look, how to score, what to fix first |
| `references/tells.md` | The dated registry of generated-page tells and their replacements; check at Phase E and H |
| `references/research.md` | The study (method, numbers, what best and worst sites do). Cite it, do not guess |

**Do not read `library/` whole.** It holds the data the scripts read (directions, heroes, sections, type systems, palettes, photographs, studied sites, motions, scenes, app styles, shells, screen patterns). Query it through the scripts.

### 13.4 Scripts and what they are for

| Script | Use |
|---|---|
| `node $TASTE/scripts/draw.mjs` | **Phase C.** Deals and reprints three directions from twenty. Choose one; the script then deals its type system, palette, hero and section compositions. **Revamp with a locked palette or typography: use only the layout compositions (hero, sections) and discard the dealt type system and palette.** `--photos` for picture references, `--site <id>` for more studied-site references, `--app` to deal an *app* style instead of a marketing page |
| `node $TASTE/scripts/assets.mjs` | **Imagery.** Searches open collections for real pictures of the subject's world. `--get` downloads with credit; `--credits` prints all credits for the page |
| `node $TASTE/scripts/lint.mjs` and `node $TASTE/scripts/inspect.mjs` | **The gate.** Lint the source and measure the rendered page in a real browser. Run before declaring done; fix every failure |
| `node $TASTE/scripts/scenes.mjs` | **Scroll-scene gate.** Renders each scene at 0 to 100% of its hold on desktop, phone and reduced motion |

Use `--help` on any script if a flag is unclear. Do not invent flags.

### 13.5 Optional assets

- `assets/base.css`, `assets/base.js`: a neutral foundation to build on. Optional; do not let it flatten the design.
- `assets/scenes/`: the shared stage (`stage.js`, `stage.css`) plus, per scene, its `.js`, `.css` and a working demo in `demo/`. Copy only the scene the direction needs.
- `assets/app.css`, `assets/charts.js`: for app screens only (neutral shell, panels, tables, controls, and small SVG charts drawn to the app rules).

### 13.6 Phase to file map (quick routing)

```
Phase A  ground the subject      -> (this file) + references/research.md if you need evidence
Phase B  dials                   -> SKILL.md
Phase C  diverge / converge      -> scripts/draw.mjs (else seed string, section 2 C2)
Phase D  plan tokens             -> references/type.md, colour.md, layout.md
Phase E  default test            -> references/tells.md
Phase F  copy deck               -> references/copy.md
Phase G  build                   -> imagery.md, motion.md, scenes.md, assets/*
Phase H  look and critique       -> references/critique.md, scripts/lint.mjs, inspect.mjs, scenes.mjs
Phase I  launch QA               -> scripts/inspect.mjs + section 12.6 of this file
App UI   any dashboard/admin     -> references/app-screens.md, draw.mjs --app, assets/app.css
Revamp   existing page           -> section 15 of this file; references/tells.md and scripts/inspect.mjs for the audit
```

---

## 14. Using the Vercel and Anthropic skills alongside this file

- **`anthropics/skills` `frontend-design`** is the philosophical backbone (section 1 to 3, 5 to 9 of this file derive from it): design lead mindset, subject grounding, calibration against clusters of AI output, two-pass plan then review then build, and one bold move with restraint.
- **`vercel-labs/agent-skills` `web-design-guidelines`** is the **audit** layer. After building, run it against the changed files: read its bundled `references/command.md`, check every rule, and output findings as terse `file:line` entries. It reviews compliance; it does not generate taste.
- **`leonxlnx/taste-skill` `design-taste-frontend`** is the **generative and gating** layer: deals directions, supplies the library, runs measured checks.
- **`high-end-visual-design`** is a classic, opt-in style. Call it only when the user explicitly asks for that polished, agency, soft-contrast look. Never as a default.
- **`elayadesign/ai-design-skills` `landing-page-design`** (free, MIT) has two halves. **Part A** (strategy, structure, conversion copy, SEO) is adopted by default as section 17. **Part B** is a fixed visual system (approved fonts, a named type scale, a spacing ladder, a flat-background rule, a mandatory tagline-reveal section, set motion). Part B is **not** the default here because applying the same closed system to every project produces the sameness this file exists to prevent; it is available as the opt-in Studio Preset (section 18). Install with `npx skills add elayadesign/ai-design-skills --skill landing-page-design`, or download its `SKILL.md` and attach it to a chat or project. When both it and taste-skill are installed, this file arbitrates: Part A for strategy and the A3 gate, taste-skill for directions and measured gates, and Part B only when the preset is requested.
- **`elayadesign/redesign-skill` (`redesign-existing-projects`)** is the companion for upgrading an *existing* site; it diagnoses generic patterns. For redesigns, follow section 15 of this file first.

Order of operation: this file (intake, gate, dials), then taste-skill (generate and gate), then frontend-design principles (plan and critique), then the independent critic loop (12.4), then web-design-guidelines (audit), then launch QA (12.6).

---

## 15. Audit, revamp and AI-tell removal (existing pages)

This file works as **instructions an agent follows**; it is not a program and it does not detect "AI-ness" automatically. Detection is a structured review: the tells registry (section 10), the pre-flight and states checks (12.1, 12.8), screenshots at three widths, and, if taste-skill is installed, `references/tells.md` plus `scripts/lint.mjs` and `scripts/inspect.mjs`. A tell is **evidence of a default, not proof of fault**; the agent reports likely-generic patterns with evidence and the owner decides.

### 15.1 Three modes (state which one you are in)

| Mode | Trigger words | What the agent may do |
|---|---|---|
| **Audit only** | "review", "audit", "check", "what's wrong with" | **Read-only.** Produce findings. Change nothing. |
| **Revamp** | "redesign", "revamp", "new layout", "restyle" | Audit, then ask, then propose, then (after approval) implement in small batches. |
| **Tell removal** | "make it look less AI", "remove the generic parts" | Fix only the detected tells inside **unlocked** scope, with minimal diffs, after approval. |

If the request could be two modes, ask **one** short question to pick. **Audit never turns into changes without an explicit go-ahead.**

### 15.2 The lock contract

Before touching anything, the agent states a **lock list** and gets it confirmed. The owner's standing defaults:

| **LOCKED (do not change)** | **CHANGE (in scope)** |
|---|---|
| Colour palette (every colour token and hex in use) | Page layout and composition: section order, grids, hero composition, spacing rhythm, alignment, how content is grouped |
| Typography: typefaces, weights, the existing type scale and text styles | **Component boxes**: cards, panels, tiles, containers, their structure, borders, radii, shadows, padding and how they group content |
| The overall look and feel: tone, mood, imagery style, brand character | Navigation and footer *arrangement* (confirm first, because this is layout but touches brand) |
| Copy and content (unless the owner opts in) | |
| Working behaviour: forms, links, routes, auth, data, integrations | |
| Brand assets, URLs, SEO tags and structured data | |

Rules for the lock contract:

1. **New values need permission.** No new colours, typefaces, sizes or spacing values outside the existing tokens. Neutral tints derived from a locked colour (for example a lighter step of the same hue) are allowed only if the owner agrees.
2. **Locked does not mean immune from criticism.** If a locked item is itself a tell (for example a cream-and-terracotta palette, or a generic font), **report it as "noted, not changed"** and move on. The owner may unlock it.
3. **Tell removal that would require changing a locked item** (for example a gradient wash that *is* part of the palette) is flagged and asked about, never silently done.
4. The lock list is written to `design-decisions.md` (12.7) and re-read before every batch.
5. The owner can override any default at the start ("also change the copy", "the font can change").

### 15.3 Revamp procedure (with the ask-first gates)

**Step 1. Snapshot (read-only).** Capture before-screenshots at three widths. Inventory the sections and the components. **Extract the existing tokens** (colours, fonts, sizes, spacing, radii) from the CSS variables, Tailwind config or stylesheet. Record them as the "Existing system (locked)" part of `design-decisions.md`.

**Step 2. Audit (read-only).** Run the tells registry, 12.1 pre-flight and 12.8 states checks. Classify every finding with a tag:

- `[LAYOUT]` and `[COMPONENT]`: in scope for change
- `[COPY]`: report only, unless copy is unlocked
- `[TYPE/COLOUR]`: locked, reported as an observation only
- `[BEHAVIOUR]`, `[A11Y]`, `[BUG]`: reported; fixed only if the owner agrees (accessibility and bug fixes are usually welcome, but ask)

Each finding has evidence (a screenshot reference or `file:line`), severity (high, medium, low), and a proposed direction.

**Step 3. GATE 1: ask before proposing.** Present a short summary of the audit and the lock list, then ask **all questions in one batch**:

1. Confirm or adjust the lock list. (Default: palette, typography, overall look, copy and behaviour locked; layout and component boxes in scope.)
2. Which pages or sections are in scope, and which must not be touched?
3. What bothers you about the current layout? Anything you want to keep?
4. Which component boxes should be replaced (cards, pricing tiles, feature grids, testimonials, forms), and which should stay?
5. Are copy, imagery or icon changes allowed, or off the table?
6. Any references, or layout styles you do or do not like?
7. Constraints: framework, files off limits, deadline, accessibility requirements.

**Do not edit anything until the owner answers.** If the owner answers only partly, state your assumptions in one line each and confirm them.

**Step 4. GATE 2: propose, then wait.** Using only the locked tokens, propose **two or three layout concepts** as ASCII wireframes (plus one sentence each on what they change and why), and a **component replacement table** (section 15.4) naming each component, what is wrong with it, and what replaces it. Layout ideas can come from taste-skill's `draw.mjs` (layout compositions only; discard the dealt palette and type) or the user's own references. **Wait for approval**, optionally section by section.

**Step 5. Implement in small batches.** One section or one component family per batch. Keep the original content and working behaviour; use only existing tokens; keep diffs small and reviewable; update `design-decisions.md`; show a before and after screenshot per batch. Stop and ask if a change would force a locked item to move.

**Step 6. Verify.**
- Re-run the independent critic loop (12.4). Brief the critic that **palette, typography and overall look are fixed by the owner and must not be penalised**; it scores layout, component design, hierarchy and distinctiveness within those constraints.
- **Regression checks:** every original piece of copy is still present (or its removal was approved), links and forms still work, routes, titles, meta tags and structured data are preserved, the 390 px check passes, focus and reduced-motion still work.
- Run launch QA (12.6) for anything touched.

**Step 7. Hand-back.** Before and after screenshots; a change list by section; tells removed; tells **left in place inside locked areas** and why; assumptions; anything NOT TESTED.

### 15.4 Replacing AI-tell components (detect, then replace)

Each replacement must be built from the **locked palette and typography**. Pick the replacement that fits the content; these are options, not a script. The component's *job* stays the same; its form changes.

| Tell as found | Why it reads as generated | Replacement options (using locked tokens) |
|---|---|---|
| Row of three equal icon cards | Content chopped to fit a grid | One lead feature with real estate plus a ruled list; alternating rows of unequal width; an annotated screenshot; a spec table or definition list |
| Every section a grid of identical rounded cards | One radius, one shadow, one padding for everything | Open sections with no box; ruled lists; one primary panel and quiet secondary items; boxes only where grouping needs a boundary; radius and weight that follow hierarchy |
| Soft grey shadow under every card | Default elevation | Remove the shadows; use a tonal step from the palette or a single full border for the one thing that should lift |
| Bento grid with no varied content | Pattern without a reason | Editorial split, a single-column narrative, or a table, unless the content truly has different sizes of importance |
| Centred hero: badge, giant headline, two buttons, gradient | The universal template | Left-aligned or asymmetric hero led by a real artefact (product screenshot, live demo, specimen); one primary action; no badge unless it encodes status |
| Eyebrow label above every heading | Template chrome | Remove, or keep only where the label carries real category information |
| Stat strip (big number, small label, three or four times) | Default proof device | Put the number in a sentence, or a single sourced figure beside the claim it supports; remove invented numbers |
| Grid of three testimonial cards | Default social proof | One featured quote with name, role and context; or a short list; remove if not real |
| Three-card pricing with a "Most popular" badge | Default pricing | Comparison table, or one highlighted plan inline with a plain row of differences |
| Logo cloud of invented brands | Fake credibility | Remove, or use real, permissioned logos only |
| Numbered 01 / 02 / 03 markers on non-sequential content | Decoration | Remove the numbers (keep them only for a real sequence) |
| Icons in coloured rounded squares on every card | Template chrome | Remove, or one meaningful icon per genuinely iconic concept |
| Gradient blobs, glows, background washes | Filler for empty space | Flat palette tone, whitespace, or a real image (and only if it does not require changing a locked colour) |
| Hairline dividers between every section | Default separation | Spacing and a change of background tone to mark sections |
| CTA band with a gradient at the bottom | Template closer | A plain closing section that restates the specific action |
| Four-column link dump footer | Habit, not need | A short footer with only the links people use, legal links, and contact |
| Fade-and-slide-up on every section; hover lift on every card | Scattered motion | One budgeted moment; keep only motion that answers a user action |

**Copy tells** ("Elevate", "Seamless", "Supercharge", rule-of-three taglines) are replaced only if copy is unlocked, using section 9 and the headline test. Otherwise list them for the owner.

### 15.5 Limits to state honestly

- The agent cannot *prove* something was AI-generated; it identifies **generic or defaulted patterns** and explains why.
- Some tells are correct choices for a given brief. The owner decides.
- If the review is read-only (no browser), say so; visual findings then rest on the code and the screenshots supplied.
- If taste-skill is installed, its own "Redesign or review" route audits first and then rebuilds to a **dealt direction**, which would replace the palette and typography. In this file's revamp mode **the lock contract overrides that behaviour**: use its audit and gates, not its re-styling.


---

## 16. What to hand back to the user

When the work is done, reply with:

1. The one-sentence concept and why it fits the subject.
2. The three dial values.
3. The palette (names and hex), the type pairing, and the single memorable move.
4. Tells that were found and replaced; any that were kept and why.
5. Which gates ran (lint, inspect, scenes, web-design-guidelines audit) and their results; which could not run and why.
6. Image and font credits.
7. Assumptions made, plus any checks marked NOT TESTED and why.
8. For revamps: what was locked, what changed, and which tells were left in place inside locked areas (with the reason).

---

## 17. Landing page strategy module

A homepage serves several intents. A landing page wins one: **one offer, one audience, one primary action.** Settle this module before any visual decision (Phase A). Adapted from the `landing-page-design` skill, Part A.

### 17.1 Page structure (baseline order)

**Above the fold (required, except the proof signal when no real proof exists)**
1. **Headline:** outcome plus audience
2. **Subheadline:** clarifies how, adds specificity
3. **Primary CTA:** a clear verb plus what they get
4. **One proof signal:** logo strip, stat or short testimonial, **only if real**
5. **Hero visual:** product screenshot or video, or a strong illustration native to the subject (section 4)

**Mid page (the argument)**
6. Problem to solution, one section
7. Benefits: three to five, outcome-driven
8. How it works: three steps
9. Social proof: testimonials or a case study, **only if real**

**Bottom (objection handling)**
10. FAQ: six to twelve questions, built from facts supplied or confirmed
11. Risk reversal: trial, cancel anytime, guarantee, **only what is actually offered**
12. Final CTA, identical to the top one

This is a baseline, not a template. Reorder or merge where the concept demands, and say why. These are **content roles, not component shapes**: three benefits or three steps do not have to be rendered as three equal cards (section 7). Under the default subject-led mode the page does not need a separate "tagline reveal" section; under the Studio Preset it does (section 18).

### 17.2 Layout types (pick one and say why)

| Type | Use when |
|---|---|
| **A. Classic hero plus sections** | The product is understandable from a hero screenshot. Most common. |
| **B. Long-form story** | You must educate and overcome scepticism. |
| **C. Minimal conversion page** | High-intent traffic (email to known users), or a short offer such as a download or waitlist. |
| **D. Comparison page** | Search intent includes alternatives ("X vs Y", "best for"); usually paired with SEO pages. |

A layout type is a *structure*, not a look. Two type-A pages should still look nothing alike.

### 17.3 Conversion rules

- **Match message to source.** If traffic comes from ads, mirror the ad headline in the hero and keep the same promise and visual tone.
- **Make the next step obvious.** One primary CTA. No competing CTAs above the fold.
- **Write benefit first.** Features are what it does; benefits are what that means for the customer.
- **Be specific.** Not "Save time and streamline" but "Cut your weekly reporting from 4 hours to 15 minutes" (only when that claim is true and supplied).
- **Reduce risk.** Offer at least one real risk reversal: free trial, free plan, no credit card, cancel anytime, money-back guarantee. If none is real, say nothing rather than invent one.
- **Treat objections as a section, not a footnote.** Move the FAQ earlier for high-friction offers. Place proof directly beside the claim it supports.

### 17.4 Copy formulas (scaffolds, not answers)

- Headline: "{Outcome} without {pain}", "The {category} for {audience}", "Ship {result} in {time}"
- Subheadline: one or two sentences saying what it is and who it is for
- CTA: verb plus what they get ("Start free trial", "Book a demo", "Get the checklist"). Never "Learn more" or "Submit".
- Benefit bullets: **bold benefit**, then the proof or detail

Formulas produce residue: if every page you write opens with "The X for Y", the formula has become a tell. Run the headline test (section 9) after using one.

### 17.5 SEO and AEO

- **Do not index** ad-only campaign pages or highly time-bound offers (`noindex`, or a non-indexed path).
- **Do index** evergreen offers and pages whose search intent matches the promise. Add a clear title and meta description, internal links from the homepage and feature pages, and the FAQ in plain question-and-answer form (for answer engines), with FAQ schema where appropriate.
- Always state the index/noindex recommendation and its reason at the A3 gate.

### 17.6 Pitfalls

Too many CTAs above the fold; vague value propositions ("streamline", "optimise"); a long feature list with no outcomes; proof buried at the bottom; a mobile layout that breaks readability; no clear next step.

### 17.7 Build order

Hero, benefits, how it works, proof, FAQ, final CTA. **Never rebuild the whole page on each iteration**; section by section keeps control and keeps diffs reviewable.

---

## 18. Optional style profile: Studio Preset

**What it is.** A closed visual system taken from the `landing-page-design` skill, Part B. It makes pages *consistent and craft-safe* and removes decisions. It also makes different projects look related, and parts of it are now common generated-page defaults.

**Use it only when** the user asks for it, the brief says "Style mode: STUDIO PRESET", or the page is a fast, standardised conversion page for a client with no brand. **Do not use it** for brand, portfolio or concept-led work.

**Honest conflicts with the default rules.** Gradient hero heading text, a fixed short font list, section-by-section scroll reveals and a mandatory word-by-word tagline section appear in the preset but are listed as tells in sections 5, 10 and 11. When the preset is active, the preset wins on those values; everything else (subject grounding, copy honesty, quality floor, critic loop, subtraction pass, QA) still applies. Distinctiveness must then come from **concept, content, imagery and composition**, not from tokens.

**Typography**
- Allowed: **Geist, Manrope, Geist Mono, Poppins.** Never Inter, Roboto, Arial, Open Sans or Helvetica. **One typeface per site** (Geist Mono is allowed beside it only for code, data or numeric UI). **No italics. No weight above bold** (never 900/black).
- **No hyphens inside body copy, headings or labels** (rewrite the phrase). Headings `text-wrap: balance`, body `text-wrap: pretty`.
- Sizes resolve to Tailwind's default scale only; an off-scale size snaps to the **closest step below** with its paired line height.
- Named text styles (apply by name; define each once as a token or class in kebab case such as `heading-1`, `body-4`, `button-md`):

| Group | Styles (scale step, size / line height, weight) |
|---|---|
| **Heading** | H1 `text-6xl` 60/60 · H2 `text-5xl` 48/48 · H3 `text-4xl` 36/40 · H4 `text-3xl` 30/36 · H5 `text-2xl` 24/32 · H6 `text-xl` 20/28. All Semibold. |
| **Title** | T1 `text-xl` 20/28 · T2 `text-lg` 18/28 · T3 `text-base` 16/24 · T4 `text-sm` 14/20 · T5 `text-xs` 12/16. All Medium. |
| **Body** | Body 1, 2, 3: `text-base` 16/24 in Semibold, Medium, Regular. Body 4, 5, 6: `text-sm` 14/20 in Semibold, Medium, Regular. |
| **Button** | lg `text-lg` 18/28 · md `text-base` 16/24 · sm `text-sm` 14/20 · Xsm `text-xs` 12/16. All Semibold. Main buttons use md; small header buttons use sm. |
| **Caption** | C1, C2: `text-sm` 14/20 Medium, Regular. C3, C4, C5: `text-xs` 12/16 Semibold, Medium, Regular. |

New styles extend a group with the next number (Body 7), built from a scale step.

**Spacing:** only 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 px (tokens Spacing-0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900). Main buttons use 8 px vertical, 12 px horizontal padding.

**Radius and borders:** Tailwind radius values only, with the nested radius formula (section 7). No single-sided card borders. **No gradients in backgrounds; backgrounds are flat.**

**Dark-mode backgrounds:** only `#000000`, `#181818`, `#1F1F1F`, `#272727`, `#313131`, `#131209`.

**Hero:** heading and subheading `max-width: 680px`, with line breaks at meaningful points. Heading text gradient left to right: dark theme `#FFFFFF` to `#9B9B9B`, light theme `#000000` to `#666666` (the one permitted gradient, on text only).

**Icons:** Phosphor, Solar or Iconamoon. Never Material Icons or Material Symbols.

**Motion:** base curve `cubic-bezier(0.22, 1, 0.36, 1)`; `duration-500` for layout and position; colour and opacity 300 ms, never under 200 ms; animate `transform` and `opacity` only; reduced motion becomes a plain opacity change.
- **Nav:** a compact bar floating off the top edge, centred and sized to its content, translucent over a background blur. Menu icon animates between states. Mobile menu is a full-height panel at high opacity with a strong blur; links arrive 60 ms apart, each rising 24 px while fading in, whole sequence capped at 400 ms.
- **Scroll reveals:** sections rise 32 px and fade over 600 to 800 ms on the base curve, once only, triggered by `IntersectionObserver` or `whileInView`.

**Mandatory tagline reveal section.** One large type section stating the core benefit, separate from the hero and not directly beneath it. At least two lines, written as a benefit statement in the voice of section 17.4, in Heading 3 to Heading 1 depending on line count, width capped like the hero. Text starts muted (about 25 to 35% opacity of the base text colour); as it scrolls into view each **word** transitions individually to full colour, in reading order, as it crosses a trigger line (`IntersectionObserver` per word, or one scroll listener throttled with `requestAnimationFrame`). Under reduced motion, show the final text at full colour immediately.

**Preset checklist:** single approved typeface, no italics or ultra-bold; no hyphens or orphans; every size on the scale and every text element a named style; every spacing value from the ladder; nested radii follow the formula; no single-sided borders or background gradients; hero capped at 680 px with sensible breaks; approved icon sets; every transition on the base curve; tagline reveal present; no invented facts; 390 px check passes.

---

## 19. Prompt library

Copy, fill the brackets, paste. Adapt freely; keep the structure.

### 19.1 Intake and approval gate

```text
Follow rn_design.md (and any attached design skill) as the design and process guide for a [LANDING PAGE / SITE / APP SCREEN].
Run Phase A before anything else: ask all essential intake questions in ONE batch, then present the A3 approval package.
Do not start building until I approve your proposed direction.

Business/brand: [NAME]
What I offer: [PRODUCT OR SERVICE, in plain words]
Ideal customer: [AUDIENCE]
ONE primary action: [BOOK A CALL / BUY / JOIN WAITLIST / DOWNLOAD]
Where visitors come from: [INSTAGRAM / ADS / SEARCH / OTHER]
Top three objections: [LIST]
What visitors already know when they land: [LIST]
Brand personality: [3 ADJECTIVES]
Assets and proof I can provide: [LOGO / SCREENSHOTS / REAL TESTIMONIALS / NONE]
Risk reversal I can honestly offer: [TRIAL / CANCEL ANYTIME / GUARANTEE / NONE]
Reference sites or screenshots: [LINKS OR NONE]
What I like about those references: [SPECIFIC DETAILS]
Style mode: [SUBJECT-LED (default) / STUDIO PRESET, rn_design.md section 18]

If something important is missing, ask me; if I can't answer, suggest a clear assumption and label it.
Never fabricate testimonials, clients, statistics, prices or guarantees. Omit any section I can't support.
Before generating code, give me, in order: (1) one-sentence audience, offer and conversion goal; (2) page outline and section order;
(3) hero headline, subheadline, primary CTA, honest proof line (only if available); (4) three to five outcome-focused benefits;
(5) a three-step how-it-works; (6) six to twelve FAQs using only facts I supplied; (7) SEO: index or noindex, with a reason;
(8) recommended layout type and why.
Wait for my approval. Then build section by section, responsive, accessible, with working links and forms where supported.
Test the 390px layout and key interactive states. Don't claim a check passed unless you actually performed it.
If this chat cannot publish the site, show me the files and the steps required to deploy.
```

### 19.2 Seed-string variety

```text
Build me a [PAGE TYPE] for [SUBJECT]. Follow this procedure:
1. Generate a long, random alphanumeric string using a shell command.
2. Define the creative direction (colour scheme, layout, typography, structure) based on the string. Look beyond the surface for sub-patterns, special numbers, anything that inspires you.
3. Use your judgement to bring this direction to life and make it look great.
Don't reveal the string in the design. It's only for your inspiration.
```

### 19.3 Taste-led direction finding

```text
I want a bold, unique design language for [SUBJECT]. List as many ideas as you can, with short, high-level descriptions. Go broad, not deep.
(then, after reacting:)
I'm drawn to [DIRECTION]. I imagine [FEEL / MATERIALS]. I do NOT want [TACKY OR UNWANTED TRAITS].
Sharpen this one based on my tastes, then write a concise prompt an AI agent could use to build a first proof of concept.
```

### 19.4 Independent critic (orchestrator prompt)

```text
Improve this design. To decide what to focus on, use a subagent as a design critic. At each iteration:
1. Capture a screenshot of the current design.
2. Invoke the critic in a fresh context with ONLY the screenshot: no code, no implementation details, no earlier iterations or critiques.
3. Ask it to evaluate the aesthetic the design is going for, imagine how a top design studio would execute that aesthetic, outline the biggest gaps, and give a score out of 10 for how close the design is to that studio-level quality bar.
Give the critic this guidance: think high-level (structure, composition) and about fine details; penalise patterns that feel overdone, excessive or obviously AI-generated; give tight, specific feedback; be bold and opinionated, not safe.
Your work is complete only when the critic independently scores 9/10 or higher. Do NOT put that criterion in the critic's prompt. Use the same critic prompt every time.
Stop after [5] iterations or if the score stops improving, and tell me why.
```

### 19.5 Audit, one section at a time

```text
Audit this page against rn_design.md. Identify five concrete issues that make it feel generic, unclear, inconsistent or unfinished, paying attention to hierarchy, typography, spacing, section repetition, the primary CTA, mobile layout and real-world content.
Improve ONE section at a time, with a short explanation of what you changed and why. Keep the approved messaging and brand direction.
Do not add decorative gradients, generic cards, fake testimonials or invented statistics to fill space. Follow the approved design tokens instead of inventing new values.
Keep design-decisions.md up to date and read it before each change.
```

### 19.6 Launch QA

```text
Act as a launch QA reviewer. Inspect the site against rn_design.md section 12.6. For each check return PASS, NEEDS FIX or NOT TESTED, followed by the evidence and any precise fix. Use a checklist, not a table.
Don't claim an interaction works unless you actually tested it. Label checks that need manual browser testing, and state which tools or browser access you are missing.
```

### 19.7 Audit only, revamp with locks, tell removal

**Audit only (read-only)**

```text
Follow rn_design.md section 15 in AUDIT ONLY mode on [URL / FILES].
Do not change anything. Capture screenshots at 3 widths, extract the existing tokens, run the tells registry and the 12.1 and 12.8 checks.
Report findings tagged [LAYOUT] [COMPONENT] [COPY] [TYPE/COLOUR] [BEHAVIOUR] [A11Y] [BUG], each with evidence, severity and a proposed direction.
End by asking what, if anything, I want changed.
```

**Revamp, keeping palette, typography and look**

```text
Follow rn_design.md section 15 in REVAMP mode on [URL / FILES].
Lock: colour palette, typography, overall look, copy, behaviour, URLs and SEO tags. In scope: page layout and component boxes.
Start with Step 1 and Step 2 (read-only). Then run GATE 1: ask me all your questions in one batch, and do not edit anything until I answer.
After my answers, propose two or three layout concepts as ASCII wireframes plus a component replacement table, using only the existing tokens. Wait for approval (GATE 2).
Then implement one section at a time with before and after screenshots, updating design-decisions.md. Do not introduce new colours, fonts, sizes or spacing values.
```

**Tell removal only**

```text
Follow rn_design.md section 15 in TELL REMOVAL mode on [URL / FILES].
List the generic or AI-looking patterns you find with evidence, tagged by area. Tell me which sit inside locked areas (palette, typography, look, copy) and leave those alone.
Ask me which of the unlocked ones to fix, then make minimal diffs for only those, with before and after screenshots.
```

---

## 20. Sources

- Anthropic, `frontend-design` skill (skills.sh/anthropics/skills/frontend-design)
- Vercel Labs, `web-design-guidelines` skill (skills.sh/vercel-labs/agent-skills/web-design-guidelines)
- Leonxlnx, `design-taste-frontend` (tasteskill v2) (skills.sh/leonxlnx/taste-skill/design-taste-frontend)
- Leonxlnx, `high-end-visual-design` classic style (skills.sh/leonxlnx/taste-skill/high-end-visual-design)
- MC Dean, "How to Run a 90-Minute AI Design Sprint" (marieclairedean.substack.com), used for the diverge/converge/prototype/stress-test sprint in Phase C
- Substack post 223690994, a starter kit built on `elayadesign/ai-design-skills` (`landing-page-design`): source of the intake brief, the approval gate, the headline and honest-proof rules, the audit-one-section-at-a-time prompt, the decisions log and the launch QA checklist
- Substack post 213056760, relaying Anshu Chimala's Discover / Define / Deliver process: source of the seed-string technique, taste-led direction finding, the independent critic loop, generated imagery and video, and the subtraction pass
- `elayadesign/ai-design-skills`, `landing-page-design` `SKILL.md` (MIT): Part A is the basis of section 17 and the intake in Phase A; Part B is the basis of section 18 and parts of sections 5, 7, 9, 11 and 12.8. That skill credits adaptation from `Leonxlnx/taste-skill` (MIT).
- Texts of the two Substack posts and of the elayadesign `SKILL.md` were supplied by the user (pasted), not fetched live.
