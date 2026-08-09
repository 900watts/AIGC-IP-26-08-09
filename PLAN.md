# Plan: ACTIF 莞仔 H5 Promo Prototype — 4hr Hackathon

> **Status**: Locked. Awaiting AI asset generation to begin build.
> **Authors**: 900watts (human) + Aiden (WorkBuddy local AI)
> **Event**: 16th China Intl Animation Copyright Fair (ACTIF), Aug 6–10 2026, ACTIF Center Shipai, Dongguan
> **Mascot**: 莞仔 (Guanzai) — blue overalls, orange cap with longan/leaf motif, large round eyes

## FABLE 5 Input Check

- **Input type**: mixed (clear goal, partial constraints)
- **Complexity score**: 8/10
- **Verdict**: compressed FABLE 5 — blindspot pass → concept → exit

## Blindspot Pass

| # | Unknown | Why it matters | Resolution |
|---|---------|----------------|------------|
| 1 | Other-AI teammate | If they push a brief we duplicate work | Repo empty; treat as no-op |
| 2 | Mascot ref assets | Visual ground truth | Provided: 5 PSDs + 5 PNGs |
| 3 | "AI-created" scope | Build must visibly use AI | AI for art, copy, palette |
| 4 | Runtime vs build-time AI | WeChat perf | Pre-bake heavy, none runtime |
| 5 | Interaction shape | "Interactable" not scroll-only | Tap mascot, long-press → card |
| 6 | Promotability | WeChat share pull-through | Personalized share-card artifact |
| 7 | 4hr ceiling | Hard cap | 3hr ship + 30min buffer |
| 8 | Asset license | Mascot usage | Reference + remix, no PSD redistribution |
| 9 | Demo env | No backend | Pure static folder |
| 10 | Rubric weights | Unknown | Equal weights, design all four |

## Concept

**"莞仔的漫博一日"** — *Guanzai's Day at ACTIF*

Five scenes, vertical mobile-first:
1. **清晨·东莞** — sunrise over Shipai
2. **展馆入口** — mascot welcomes the user at the gate
3. **潮玩馆** — 莞仔 inside the Art Toys hall surrounded by IP sculptures
4. **签售舞台** — 莞仔 on stage with crowd silhouettes
5. **夜幕·灯笼** — closing night with floating copyright-印章 lanterns

**Interactions**:
- Tap mascot → reacts (waves, blinks) + speech-bubble pops up with AI-generated caption
- Long-press final scene → triggers AI share-card generator (莞仔 + user's name + AI tagline) → downloadable image
- Drag to parallax-scroll
- CTA: "立即生成我的 ACTIF 纪念卡"

**Judging dimension coverage**:
- Creativity: AI-captioned mascot dialogue + name-based share card
- AI-created: every scene variant AI-generated, all copy AI-written
- Promotability: personal card → high WeChat Moments pull-through
- H5 visual design: layered parallax + micro-motion + mascot palette

## Tech Stack (locked)

- **Pure static**: `index.html` + `styles.css` + `app.js` + `assets/`. No bundler.
- **AI generation (build time)**:
  - Image: connected image-gen for 5 scenes + 1 sprite sheet + 1 share-card bg
  - Text: this agent drafts all on-screen copy
  - Layout: palette + typography tokens derived from mascot reference
- **Runtime AI**: in-browser `<canvas>` share-card composer using pre-baked prompt templates
- **Motion**: pure CSS keyframes + IntersectionObserver; tiny scroll-parallax
- **Distribution**: local file / static URL (CloudStudio deploy)

## File List

| File | Purpose |
|------|---------|
| `index.html` | The H5 — 5 scenes + share-card modal + CTA |
| `styles.css` | Design tokens from 莞仔 palette, layout, motion |
| `app.js` | Scroll parallax, tap reactions, share-card canvas composer |
| `assets/scene-1.png` … `scene-5.png` | AI-generated scene illustrations |
| `assets/guanzai-sprite.png` | Mascot sprite sheet (idle/wave/blink) |
| `assets/og-card-bg.png` | Share-card background |
| `README.md` | 1-pager for judges (concept + AI-created proof + how to demo) |

## Time Budget (3hr ship + 30min buffer)

| Block | Time | Output |
|-------|------|--------|
| 0:00–0:30 | Concept + prompt drafting + reference extraction | All AI prompts written |
| 0:30–1:30 | AI asset generation (parallel) | All PNGs ready |
| 1:30–2:30 | HTML/CSS/JS build | Functional H5 |
| 2:30–3:00 | Polish, motion tuning, mobile preview | Demo-ready |
| 3:00–3:30 | README, share-card polish, dry-run, deploy | Shipped |

## Risk + Fallback

| Risk | Fallback |
|------|----------|
| AI image gen style drift on 莞仔 | Re-prompt w/ stronger ref; cap 3 iters; fall back to last acceptable |
| WeChat blocks `canvas.toDataURL` save | Use long-press-to-save instruction |
| Image gen > 1.5hr | Cut to 3 core scenes (entrance/hall/closing) |
| Mascot drift between scenes | Sprite-sheet for mascot; only bg varies |

## AI-Created Proof Points

1. All 5 scene illustrations AI-generated from text prompts referencing official 莞仔
2. All on-screen copy AI-drafted
3. Share-card tagline personalized by prompt template engine
4. Palette + typography derived algorithmically from mascot ref
5. README maps each judging dimension to its AI feature

## Open Items

- Original ACTIF mascot contest had 莞仔 + 漫妹 pair; current ref is solo. 漫妹 as Easter-egg cameo in scene 3 if time.
- No backend, no analytics.
- Fallback distribution: `file://` or GitHub Pages on this repo.
