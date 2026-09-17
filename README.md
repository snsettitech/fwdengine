# FwdEngine

Marketing site for FwdEngine — forward deployed engineering teams, human and
agentic, embedded inside financial institutions.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP
ScrollTrigger · React Three Fiber.

```bash
npm install
npm run dev          # http://localhost:3000
```

---

## Before this goes live

**Every figure a prospect sees is a placeholder.** They live in one file:
[`content/metrics.ts`](content/metrics.ts).

FwdEngine sells to regulated financial institutions. Procurement and model-risk
teams diligence performance claims, and the FTC has an active enforcement line
on unverifiable AI performance marketing. So the codebase makes an unfilled
number impossible to ship by accident:

- A metric renders as fact only when `verified: true`.
- Anything still set to `PLACEHOLDER` renders the literal `__REPLACE__` token
  in amber, and the Proof section shows a build-state banner.
- `basis` is not optional. If you cannot write down what the number is measured
  against, it is not ready for the page.
- The hero status strip carries a permanent **SIMULATED** marker while
  `statusStrip.isLive` is false. If you wire it to a real feed, flip the flag
  and remove the marker in the same change, not before.

To go live: replace the values, write a real `basis`, flip `verified`. Nothing
else in the codebase needs to change.

The live hub clock in the footer and on Global Delivery is **real** — it is
computed from the visitor's own clock via `Intl`, including daylight saving —
so it carries no placeholder marking.

---

## Content

All copy lives in `content/` as typed data, not inside components.

| File | What it drives |
|---|---|
| `metrics.ts` | Proof figures and the hero status strip |
| `platform.ts` | The six pipeline stages, architecture principles, exclusions |
| `use-cases.ts` | The seven financial-services use cases |
| `industries.ts` | Banking, asset & wealth, insurance, payments sub-pages |
| `hubs.ts` | Delivery hubs: coordinates, IANA time zone, staffing status |
| `engagement.ts` | Embed → Build → Ship → Operate |
| `fde-model.ts` | Methodology theses and pod composition |
| `careers.ts` | The archetype and open roles |
| `insights/*.mdx` | Articles. Frontmatter is zod-validated at build time |

**House rule for `use-cases.ts` and `industries.ts`:** every entry states a
mechanism, not a benefit. "Drafts the credit memo with each assertion
line-linked to its source document" is allowed. "Transforms underwriting with
AI" is not.

Adding an insight: drop an `.mdx` file in `content/insights/`. A malformed
date or a missing title fails the build rather than rendering a broken card.
Note that MDX means content changes need a deploy; if editing without a deploy
becomes a requirement, `lib/insights.ts` is the only file a headless CMS would
replace.

---

## Two things about this codebase that will bite you

### 1. Above the fold animates in CSS, below the fold in JavaScript

Framer Motion serialises its hidden `initial` state into the server HTML, so
anything it wraps is `opacity: 0` until hydration completes — and Largest
Contentful Paint ignores transparent text. Wrapping the hero headline in
`Reveal` made mobile LCP equal to time-to-hydrate: **4.6 seconds**.

So there are two entrance systems, and the choice is not stylistic:

- **`components/motion/enter.tsx`** — `Enter`, `EnterWords`. Pure CSS, zero
  JavaScript, server components. Starts at first paint and completes whether
  or not the bundle ever arrives. **Use above the fold.**
- **`components/motion/reveal.tsx`** — `Reveal`, `RevealItem`,
  `RevealListItem`. Framer Motion, scroll-triggered. **Use below the fold**,
  where the cost does not land on LCP.

`RevealListItem` exists because a `div` between `<ul>` and `<li>` breaks list
semantics and fails the axe `list` / `listitem` rules. Inside a list, the
animated element has to *be* the `li`.

A `<noscript>` block in the root layout reveals anything still hidden, so the
page is readable with JavaScript disabled.

### 2. `useSyncExternalStore` arguments must be module-level

`lib/use-hydrated.ts` holds `useHydrated()` and `useNow()`. All three
arguments to `useSyncExternalStore` are module constants. That is not tidiness:
an inline `subscribe` is a new function every render, React tears down and
recreates the subscription each time, and if subscribing publishes a value you
get an unbounded render loop (React error #185). It shipped that way once and
the whole site rendered Next's error shell.

---

## Design system

Tokens are CSS custom properties on `:root`, redefined under
`:root[data-theme="light"]` — see [`app/globals.css`](app/globals.css).
Components reference `var(--ink)`, `var(--accent-text)` and friends, never raw
hex. Dark is the default and the brand; light is a supported variant, persisted
client-side via `next-themes`.

- **Display / body:** General Sans, self-hosted from `public/fonts/`. Two
  weights only, 400 and 600. Every declared face is preloaded by `next/font`
  and competes with the LCP paint, so unused weights are deleted, not kept
  "just in case".
- **Data, metrics, system output:** JetBrains Mono. The contrast between
  editorial display type and terminal mono is the brand's typographic
  signature.
- **Signal colours:** indigo and cyan for the system. **Amber is reserved for
  human-in-the-loop and urgency** — if amber appears anywhere else, that is a
  bug, because amber is how the site says "a person decides this".
- **Body text floor is 16px.** Anything smaller must declare itself with
  `data-footnote` or `data-dense` in the markup. The audit flags unmarked
  small prose, because that is an accident rather than a decision.

The `AmbientField` canvas mirrors the palette in JavaScript (a canvas cannot
read CSS custom properties). If you change the accent colours, change
`PALETTES` there too.

---

## Verification

```bash
npm run typecheck    # tsc --noEmit
npm run lint
npm run audit        # layout + accessibility, every route x 3 viewports x 2 themes
npm run lighthouse   # performance budget (needs a production build, see below)
npm run lcp          # what the LCP element actually is, under real throttling
```

`npm run audit` drives a real browser over all 14 routes at phone, tablet and
desktop widths in both themes — 84 page renders — and fails on horizontal
overflow, console errors (including hydration mismatches), heading structure,
missing alt text, controls without an accessible name, touch targets under
44px, text colour contrast under 4.5:1, and unmarked body text under 16px.

For the performance budget, build and serve first:

```bash
npm run build
npx next start -p 3100
npm run lighthouse -- http://localhost:3100
```

On Windows, point Lighthouse at a browser: `CHROME_PATH="C:\Program Files
(x86)\Microsoft\Edge\Application\msedge.exe"`.

### Where performance currently stands

Desktop is **100 / 100 / 100 / 100** (performance, accessibility, best
practices, SEO) on every page measured, with LCP at 0.6–0.7s.

Mobile is **85–94 performance** with 100 across the other three categories,
against an 80 budget. Mobile LCP reports **2.9–3.1s** under Lighthouse's
default *simulated* throttling, against the 2.5s target. Measured with
*applied* throttling on the same slow-4G and 4x-CPU profile
(`npm run lcp`), the same pages land at **1.3–2.2s**. Both numbers are real;
they differ because Lighthouse's Lantern model is deliberately pessimistic.
The gap is dominated by web-font delivery, and closing it further would mean
dropping to a system font stack.

---

## Notable implementation details

- **The 3D globe** (`components/three/`) is code-split, mounted only when it
  scrolls near the viewport, and gated to devices that can afford it: WebGL
  present, not Save-Data, at least 4 cores, viewport ≥ 1024px. That gate is
  measured, not squeamish — on a throttled mid-tier phone the scene cost 2.2s
  of main-thread blocking and took the page to a Lighthouse 51. Everything
  else gets `GlobeFallback`, an SVG orthographic projection drawn from the
  same hub data.
- **The qualification form** validates with one zod schema used in the browser
  for inline errors and again in the route handler, where it is the real trust
  boundary. It has a honeypot field, a per-instance sliding-window rate limit,
  and it never reports success it cannot back up.
- **OpenGraph images** are generated per page by `lib/og.tsx` using
  `next/og`. Satori has no CSS grid and cannot read woff2, so the grid is
  positioned divs and the fonts are the TTFs in `assets/fonts/`. It also
  rotates elements about their centre and ignores `transform-origin`, which is
  why the lattice edges are laid out from their midpoints.
- **Motion respects `prefers-reduced-motion` throughout.** The ambient canvas
  and cursor glow are not mounted at all; GSAP tweens are inside a
  `matchMedia` block that never runs; the globe falls back to the still
  projection.

---

## Deployment

Built for Vercel. Set the environment variables from
[`.env.example`](.env.example) — the contact form is inert without a delivery
channel, by design. `next start` behind any Node host works equally well; 34
of 35 routes are static or SSG, and only `/api/contact` needs a server.
