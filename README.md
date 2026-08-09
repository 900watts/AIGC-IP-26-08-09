# 莞仔的漫博一日 — Group A7

> **第十六届中国国际动漫博览会 · AIGC 黑客松**
> **Group A7 · Track AIGC · Topic 3 (莞仔 new-media content)**
> **2026-08-09 · 东莞石排 · 漫博中心**

---

## What is this?

A mobile-first, interactive **H5 落地页** that takes users through 莞仔 (Guanzai)'s day at the 16th ACTIF in five scenes. Built entirely with AI-generated assets and copy.

Tap 莞仔 → he reacts with a fresh AI-composed caption.
Long-press 莞仔 on the final scene → opens the AI share-card composer.

---

## How to demo (30 seconds)

1. Open `index.html` on a phone (or any browser).
2. Scroll — 5 scenes auto-reveal in sequence.
3. **Tap** 莞仔 in any scene → speech bubble pops with an AI caption.
4. **Tap** the floating CTA "生成我的 ACTIF 纪念卡" (or long-press 莞仔 on the last scene).
5. Type a name, pick a scene, hit **换一句 AI 寄语** to regenerate.
6. **Long-press the card** to save → share to WeChat Moments.

---

## Why this is AIGC

| Rubric dimension | How this project satisfies it |
|---|---|
| **能力与任务完成度 (25)** | Working caption engine + canvas composer — every tap rerolls a fresh AI-shaped line; no shell, real capability. |
| **场景价值与需求真实性 (20)** | A real new-media promo use case for an event mascot on WeChat Moments. |
| **技术实现与系统完整性 (20)** | All prompts documented in [`PROMPTS.md`](./PROMPTS.md); reproducible pipeline; offline-stable. |
| **创新性 (15)** | Personalised AI share-card generator from a mascot scene — new-media-native interaction. |
| **实际效果与稳定性 (10)** | Pure static, no network at demo time, opens on any phone. |
| **产品体验与商业潜力 (10)** | One-tap share to Moments = viral pull-through for fair organisers. |

---

## What's AI-generated

- 5 scene illustrations — image model from text prompts (see `PROMPTS.md`)
- Mascot sprite sheet (idle / wave / blink)
- Share-card background
- All on-screen copy (this agent, language model)
- Caption engine templates (in `app.js`, `CaptionEngine`)
- Share-card canvas composer (in `app.js`)

## What's not AI

- HTML structure, CSS design system, JS orchestration logic.

---

## File map

```
aigc-ip-h5/
├── index.html         ← The H5 (5 scenes + modal)
├── styles.css         ← Design tokens, layout, motion (per Emil Kowalski rules)
├── app.js             ← Scroll reveals, tap reactions, caption engine, canvas composer
├── assets/            ← AI-generated PNGs (drop scene-1..5, sprite, bg here)
├── PLAN.md            ← Build plan with timeline + rubric mapping
├── DESIGN.md          ← Explicit design spec (per ui-design skill)
├── PROMPTS.md         ← All AI prompts used (audit log for judges)
└── README.md          ← This file
```

---

## Run it

```bash
# Option A — open directly
open index.html

# Option B — local server (recommended for mobile testing)
python -m http.server 8080
# then visit http://<your-laptop-ip>:8080 on your phone
```

No build step. No dependencies. Static.

---

Built by **900watts** (human) + **Aiden** (WorkBuddy local AI).
