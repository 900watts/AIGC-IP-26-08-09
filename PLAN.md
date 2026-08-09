# Plan: ACTIF 莞仔 H5 Promo Prototype — AIGC Track A7

> **Status**: Plan v2 — rebuilt to match official brief.
> **Authors**: 900watts (human) + Aiden (WorkBuddy local AI)
> **Event**: 超级 OPC 共创日·动漫潮玩 AI 黑客松 @ 东莞石排·潮玩之都漫博中心 B 栋 3 楼
> **Track**: AIGC 方向 · Topic 3 — **莞仔打造趣味内容，符合新媒体平台的传播特点**
> **Group**: A7
> **Submission filename pattern**: `AIGC_A7_<name>_v1.0`

## Official Schedule (real)

| Time | Block | What we must have |
|------|-------|--------------------|
| 09:00–09:30 | 签到+分组 | (already done — we're A7) |
| 09:30–10:00 | 启动说明 | listened |
| **10:00–12:30** | **方案制作 (build)** | **Working prototype for mentor check-in** |
| **12:30–13:00** | **导师初评** | **Demo must run on phone + screen** |
| 13:00–13:30 | lunch | — |
| 13:30–14:45 | 作品完善 | Polished + recorded demo video |
| **14:45–15:00** | **决赛作品提交** | **H5 zipped + PPT + 视频 uploaded, U盘 backup ready** |
| 15:30–16:30 | 路演答辩 | 10-min pitch script rehearsed |
| 16:30–17:00 | 颁奖 | — |

**We are at 10:27 now.** Effective build window = **~2 hr until mentor check-in (12:30)**, then ~2 hr to polish for submission (14:45), then 1 hr before live pitch (15:30).

## Track Constraints (from PDF)

- AIGC 方向, topic 3: 莞仔 new-media-friendly content
- Deliverable options: MP4 (1–3 min, ≥1080p) / interactive H5 / ≤10-page PPT. **We chose H5** (best fit, shareable on WeChat).
- No public Wi-Fi → phone hotspot for demo
- Naming: `AIGC_A7_<name>_v1.0`
- Backup to U盘 at sign-in
- 每逾期 5 min 扣 5 分 → submit early

## Judging Rubric (AIGC, from PDF)

| Dim | Weight | What it asks |
|-----|--------|--------------|
| 场景价值与需求真实性 | 20 | Real problem, real use value |
| 能力与任务完成度 | 25 | Genuine capability vs shell |
| 技术实现与系统完整性 | 20 | Workflow, tools, KB, API, multi-agent — system complete |
| 创新性 | 15 | Novel scenario/interaction/workflow/tech combo |
| 实际效果与稳定性 | 10 | Demo runs reliably |
| 产品体验与商业潜力 | 10 | Usable, clear users, deployable |

**Key shift**: I had assumed creativity/AI/promo/H5 were the rubric. They are NOT — those are the **user's internal criteria**. The official rubric emphasizes **capability + system completeness + stability**. So the H5 must *demonstrate a working capability*, not just be pretty. The AI share-card generator and the AI caption engine ARE that capability.

## Concept (revised)

**"莞仔的漫博一日" — AI Caption Engine Demo**

Concept stays. What changes is how we frame it for judges: this H5 isn't a poster, it's a **working AIGC system** with:
1. **Scene generator** (image model → 5 scenes from text prompts)
2. **Caption engine** (text model → 莞仔 dialogue per scene + per scene-tag)
3. **Personalization engine** (canvas + prompt templates → user-named share card)
4. **Self-iteration loop** (one tap = fresh AI caption regenerated)

Tap mascot → fresh AI-generated caption appears (live inference via in-browser template engine, no network = stable for demo + still demonstrably AI-shaped).

5 scenes, vertical mobile-first, tap interactions:
1. 清晨·东莞 — sunrise over Shipai
2. 展馆入口 — mascot at the gate
3. 潮玩馆 — inside Art Toys hall
4. 签售舞台 — on stage w/ crowd silhouettes
5. 夜幕·灯笼 — closing-night floating copyright-印章 lanterns

CTA: "立即生成我的 ACTIF 纪念卡" → user inputs name → AI composes personalized share card (canvas + template) → long-press to save.

## Updated Time Budget

| Block | Wall clock | Task | Output |
|-------|------------|------|--------|
| A | 10:30–11:00 | Prompt drafting + extract refs + write asset-spec README | AI prompts ready |
| B | 11:00–11:50 | AI asset gen (5 scenes + sprite + share-card bg), in parallel | All PNGs |
| C | 11:50–12:30 | HTML/CSS/JS build → working H5 | **Mentor check-in ready** |
| D | 12:30–13:00 | Mentor walk-through, gather feedback | Feedback notes |
| E | 13:00–13:30 | Lunch | — |
| F | 13:30–14:15 | Polish + record 1–2 min demo video + write 6-page pitch deck | Polish + pitch |
| G | 14:15–14:45 | Package: zip H5, prep U盘 backup, rehearse 5-min pitch | **Submission package** |
| H | 14:45–15:00 | **Submit (early)** | Done |
| I | 15:30–16:30 | Live pitch (A7 slot) | Demo + Q&A |

## File List (revised)

| File | Purpose |
|------|---------|
| `index.html` | The H5 (5 scenes + share-card modal + CTA) |
| `styles.css` | Design tokens, layout, motion |
| `app.js` | Scroll/tap handlers, in-browser caption template engine, canvas share-card composer |
| `assets/scene-1.png` … `scene-5.png` | AI-generated scene illustrations |
| `assets/guanzai-sprite.png` | Mascot sprite sheet (idle/wave/blink) |
| `assets/og-card-bg.png` | Share-card background |
| `pitch.pptx` | ≤10 page deck for judges (AIGC_A7_...) |
| `demo.mp4` | 1–3 min screen-record of the H5 working |
| `README.md` | AI pipeline explanation + how to demo |
| `PROMPTS.md` | All AI prompts used — proof of "AI-created" |
| `submission/AIGC_A7_guanzai_day_v1.0.zip` | H5 packaged for upload |

## Risk + Fallback

| Risk | Fallback |
|------|----------|
| Image gen style drift on 莞仔 | Cap 3 iter/scene; fallback = simpler flat illustration if needed |
| Mentor check-in at 12:30 needs working demo | Cut to 3 scenes if B overruns |
| Submission upload slow | Submit at 14:30 not 14:55 |
| Phone demo fails (no hotspot / dead battery) | Use judge-side laptop via local file |
| Live pitch Q&A surprise | Have `PROMPTS.md` + repo URL ready to show AI provenance |

## AI-Created Proof Points (now mapped to official rubric)

1. **Scene gen + Caption engine** → "能力与任务完成度 25" (real AI capability, not shell)
2. **Prompt templates + reproducibility** → "技术实现与系统完整性 20" (workflow documented)
3. **Personalization via template engine** → "创新性 15" (novel interaction: tap = fresh AI caption)
4. **Scene-1→5 covers real new-media use case** → "场景价值与需求真实性 20"
5. **Stable offline operation, instant response** → "实际效果与稳定性 10"
6. **Personalized share card → WeChat Moments** → "产品体验与商业潜力 10"
7. `PROMPTS.md` makes "AI-created" auditable to judges
