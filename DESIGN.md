# DESIGN SPECIFICATION — ACTIF 莞仔 H5
> Per ui-design skill: explicit spec before any code.

## 1. Purpose Statement
A vertical, mobile-first interactive H5 promoting ACTIF mascot 莞仔 for the 16th China Intl Animation Copyright Fair. Audiences are judges at an on-site hackathon (immediate polish) and WeChat Moments users (share-pulled new-media reach). The product must demonstrate a working AIGC capability (scene gen + caption engine + personalization) inside a polished, brand-consistent container.

## 2. Aesthetic Direction
**Soft / Pastel Toy Editorial** — pastel mascot palette, large rounded shapes, generous negative space, editorial-typographic headlines. Inspired by Bear Ceramics × Studio AKAA × Chinese toy fair posters (长场雄 editorial flatness + modern toon-pastel). Friendly, not childish; premium, not corporate.

## 3. Color Palette (derived from 莞仔 reference: blue overalls + orange cap + longan cream)
- `--ink: #1A1F2E` — primary text, deep ink blue (matches the overalls shadow)
- `--cream: #FFF5E6` — page background, longan-flesh cream
- `--sky: #7FB8E8` — primary brand, sky-blue (overalls)
- `--apricot: #FF8A4C` — accent, apricot (cap)
- `--longan: #C9A36A` — secondary accent, dried-longan brown
- `--petal: #FFD9C2` — soft tint, peach blush
- `--shadow: rgba(26, 31, 46, 0.08)` — soft tinted shadow (warm, not pure black)

❌ Forbidden: purple, violet, indigo, fuchsia, blue-purple gradients.

## 4. Typography
- **Display / Headline**: **Fraunces** (variable serif with optical-size axis; editorial warmth) — for scene titles, CTA
- **Body / UI**: **Plus Jakarta Sans** — soft humanist sans, friendly but not cartoonish
- **Accent / Chinese**: **Noto Sans SC** weight 600 for 莞仔 / ACTIF nameplates, weight 400 for body
- ❌ Forbidden: Inter, Roboto, Arial, Helvetica, system-ui, -apple-system

## 5. Layout Strategy
- **Vertical scroll** with full-bleed scenes (5 stacked, ~100vh each, parallax-y shift)
- **Asymmetric per scene**: mascot is offset (not centered); scene title slides in from left, body from right
- **Floating CTA**: fixed bottom-left, rounded pill, with apricot glow shadow
- **Tilt-on-scroll**: each scene image has a subtle 3° skew shift on scroll (mimics card flip)
- **Speech bubble**: mascot reactions pop from mascot's chest (transform-origin: bottom center, scale-from-0.92 + fade)
- **Share card**: full-screen modal, asymmetric (text left, mascot right), tap-to-save via long-press

## 6. Motion (per emilkowalski animate skill)
- **Frequency tier**: rare / first-time (judges see once; sharers see once) → delight budget unlocked
- **Purpose**: explanation + feedback (taps confirm AI capability) + delight (mascot reacts)
- **Tool**: CSS transitions + `@starting-style` for entrance; minimal WAAPI for tap reactions; **no motion library** (smaller, faster on WeChat)
- **Properties**: `transform` + `opacity` only. `scale(0.92)` entrance, never `scale(0)`
- **Curves**:
  - `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` — entrance, mascot reactions
  - `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` — scroll parallax
  - `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)` — share-card modal
- **Duration**: 200–280ms for taps, 600–900ms for scene entrance, 250ms for share-card
- **Stagger**: 60–80ms between scene elements on entry
- **Hover gating**: `@media (hover: hover) and (pointer: fine)` — touch surfaces don't fake hovers
- **Reduced motion**: keep fade, drop transform

## 7. Iconography
✅ Use Lucide inline SVG (24×24 viewBox, 1.6px stroke).
❌ No emoji icons anywhere. 🌅 → custom SVG sunrise line.

## 8. AI-Created Surface
Visible to judges, mapped to rubric:
- **5 scene illustrations** — AI-generated from text prompts (image model, build time)
- **All on-screen copy** — AI-drafted (this agent, build time)
- **Caption engine** — in-browser template engine with AI-composed template fragments
- **Share-card composer** — canvas + AI prompt template
- **`PROMPTS.md`** — every prompt recorded, auditable

## 9. Self-Audit (pre-delivery)
- [ ] No purple/violet/indigo
- [ ] No Inter/Roboto/system-ui
- [ ] No emoji icons
- [ ] Mascot asymmetric (not centered)
- [ ] All animations use `--ease-out` for entrance, never `ease-in`
- [ ] No `scale(0)`; use `scale(0.92)` + `opacity: 0`
- [ ] `prefers-reduced-motion` honored
- [ ] Mobile (390×844) and small tablet (768) verified
- [ ] All interactive elements have `cursor: pointer`
