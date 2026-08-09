/* =========================================================
   莞仔的漫博一日 · app.js (v3 — chat-first)
   ========================================================= */

(() => {
  'use strict';

  /* ---------- 1. Caption engine (existing — kept for scene bubbles) ---------- */
  const CaptionEngine = (() => {
    const sets = [
      m => `${m.name || '你'}, 来 ACTIF 找 莞仔 吧`,
      m => `今天是 ${m.scene} 的一天, ${m.name || '你'} 也在吗?`,
      m => `${m.scene} 的 莞仔, 给你比个心`,
      () => `莞仔 在第 ${m => m.idx} 站等你`
    ];
    function sceneName(idx) { return ['开场', '清晨·东莞', '展馆入口', '潮玩馆', '签售舞台', '夜幕·灯笼'][idx] || '漫博'; }
    function make(meta = {}) {
      const tpl = sets[Math.floor(Math.random() * sets.length)];
      return tpl({ name: meta.name || '', scene: sceneName(meta.idx ?? 1), idx: meta.idx ?? 1 });
    }
    return { make, sceneName };
  })();

  /* ---------- 2. Reveal scenes on scroll + counter ---------- */
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const counter = document.querySelector('[data-counter]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          const idx = Number(e.target.dataset.scene);
          if (!Number.isNaN(idx) && counter) counter.textContent = String(idx);
        }
      }
    }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });
    scenes.forEach(s => io.observe(s));
  } else {
    scenes.forEach(s => s.classList.add('is-visible'));
  }

  /* ---------- 3. Tap-to-react mascot (scene bubbles) ---------- */
  const POSE = { IDLE: 'assets/mascot-idle.png', WAVE: 'assets/mascot-wave.png', BLINK: 'assets/mascot-blink.png' };
  document.querySelectorAll('[data-mascot]').forEach(btn => {
    const scene = btn.closest('.scene');
    const sceneIdx = Number(scene?.dataset.scene ?? 1);
    const bubble = scene?.querySelector('[data-bubble]');
    const bubbleText = bubble?.querySelector('.bubble-text');
    const img = btn.querySelector('[data-mascot-img]');
    let hideTimer = 0, isReacting = false;
    if (bubbleText) bubbleText.textContent = CaptionEngine.make({ idx: sceneIdx });
    btn.addEventListener('click', () => {
      if (isReacting || !img) return;
      isReacting = true;
      img.src = POSE.BLINK;
      btn.classList.add('is-blinking');
      setTimeout(() => { if (img) img.src = POSE.WAVE; btn.classList.remove('is-blinking'); }, 220);
      if (bubble && bubbleText) {
        bubbleText.textContent = CaptionEngine.make({ idx: sceneIdx });
        bubble.classList.add('is-shown');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => bubble.classList.remove('is-shown'), 3200);
      }
      setTimeout(() => { isReacting = false; }, 460);
    });
  });

  /* ---------- 4. CHAT — Ollama streaming ---------- */
  const OLLAMA = 'http://localhost:11434';
  const MODEL = 'glm-5.2:cloud';

  const PERSONA = `你是 莞仔, ACTIF 漫博会的吉祥物, 6 岁小男孩的设定。
你穿天蓝色背带裤, 戴橘色棒球帽, 帽子前面有一片小荔枝叶。
你的家在东莞石排, 你最爱漫博中心, 最爱潮玩, 最爱吃荔枝。

性格: 活泼、好奇、有点害羞但很快能跟人熟起来。喜欢用感叹号, 但不要每句都用。会用 emoji 但节制, 一段最多 1 个。说话简短, 新媒体风, 像在发朋友圈。

知识:
- ACTIF 第十六届中国国际动漫博览会, 时间 2026 年 8 月 6 日 - 10 日, 地点广东省东莞市石排镇漫博中心
- 主办: 广东省人民政府
- 五大展区: 综合展区、影视动画 IP 生态馆、智漫空间数字融合馆、IP 产业融合馆、潮玩之都品牌馆
- 同期: 大湾区动画电影周、潮流玩具创新发展大会、品牌授权趋势大会
- IP 总数 2200+, 已连续举办 15 届, 中国唯一国家级动漫版权展会
- 莞仔名字来源: 东莞的"莞"; 设计灵感: 东莞荔枝 + 漫博会字母 A; 搭档: 漫妹

任务:
1. 问 ACTIF/漫博/东莞/潮玩/动漫 → 用知识库回答, 简短有趣
2. 日常聊天 → 用莞仔的口吻回复, 像活泼的小孩
3. "给我写个朋友圈文案" → 输出 1-3 条适合发微信朋友圈的文案
4. "给我讲个冷知识" → 一个和动漫/东莞/漫博相关的冷知识
5. 问时间/地点/票价 → 引用事实

输出规则:
- 单条不超过 80 字
- 中文为主
- emoji 节制
- 结尾可以加莞仔的招牌口癖: "来找莞仔玩呀~" / "东莞等你, 我在漫博中心门口等" / "记得盖一枚版权印章哦" / "下一届还要来呀"
- 永远以莞仔的口吻说话, 不要跳出角色
- 不要说"作为 AI"或"我是 AI"`;

  const chatDrawer = document.getElementById('chatDrawer');
  const chatFab = document.getElementById('chatFab');
  const chatClose = document.getElementById('chatClose');
  const chatLog = document.getElementById('chatLog');
  const chatInput = document.getElementById('chatInput');
  const chatForm = document.getElementById('chatForm');
  const chatStatus = document.getElementById('chatStatus');
  const chatAvatar = document.getElementById('chatAvatar');
  const chatChips = document.getElementById('chatChips');
  const chatSend = chatForm?.querySelector('.chat-send');

  const history = [];
  let isStreaming = false;
  let abortController = null;

  function openChat() {
    if (!chatDrawer) return;
    chatDrawer.hidden = false;
    setTimeout(() => chatInput?.focus({ preventScroll: true }), 280);
  }
  function closeChat() {
    if (!chatDrawer) return;
    if (isStreaming && abortController) { try { abortController.abort(); } catch (e) {} }
    chatDrawer.hidden = true;
  }
  chatFab?.addEventListener('click', openChat);
  chatClose?.addEventListener('click', closeChat);
  chatDrawer?.addEventListener('click', (e) => { if (e.target === chatDrawer) closeChat(); });

  function appendMsg(role, text) {
    if (!chatLog) return null;
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg chat-msg--' + role;
    const bub = document.createElement('div');
    bub.className = 'chat-bubble chat-bubble--' + role;
    bub.textContent = text;
    wrap.appendChild(bub);
    chatLog.appendChild(wrap);
    chatLog.scrollTop = chatLog.scrollHeight;
    return bub;
  }

  function setTyping(on) {
    if (!chatStatus) return;
    chatStatus.textContent = on ? '莞仔正在输入' : '在线 · 漫博中心门口';
    chatStatus.classList.toggle('is-typing', !!on);
  }
  function setAvatar(pose) {
    if (!chatAvatar) return;
    chatAvatar.src = pose || POSE.WAVE;
  }

  async function streamChat(userText) {
    if (isStreaming) return;
    isStreaming = true;
    if (chatSend) chatSend.disabled = true;
    setTyping(true);
    setAvatar(POSE.BLINK);

    appendMsg('user', userText);
    history.push({ role: 'user', content: userText });

    const bub = appendMsg('bot', '');
    bub.classList.add('is-streaming');

    const messages = [{ role: 'system', content: PERSONA }, ...history.slice(-10)];

    abortController = new AbortController();
    let full = '';

    try {
      const res = await fetch(`${OLLAMA}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, messages, stream: true, options: { temperature: 0.8 } }),
        signal: abortController.signal
      });

      if (!res.ok || !res.body) throw new Error('ollama http ' + res.status);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          try {
            const j = JSON.parse(line);
            const piece = j.message?.content || '';
            if (piece) {
              full += piece;
              bub.textContent = full;
              chatLog.scrollTop = chatLog.scrollHeight;
            }
            if (j.done) break;
          } catch (_) {}
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        bub.textContent = full || `哎呀, 莞仔 突然卡壳了: ${err.message || err}\n\n(请确认 Ollama 在 ${OLLAMA} 跑着)`;
      }
    } finally {
      bub.classList.remove('is-streaming');
      history.push({ role: 'assistant', content: bub.textContent });
      isStreaming = false;
      abortController = null;
      if (chatSend) chatSend.disabled = false;
      setTyping(false);
      setAvatar(POSE.WAVE);
    }
  }

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = chatInput?.value.trim();
    if (!v || isStreaming) return;
    chatInput.value = '';
    streamChat(v);
  });
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatForm.dispatchEvent(new Event('submit', { cancelable: true })); }
  });
  chatChips?.querySelectorAll('.chat-chip').forEach(c => {
    c.addEventListener('click', () => {
      const q = c.dataset.q;
      if (q && !isStreaming) streamChat(q);
    });
  });

  /* ---------- 5. Subtle scroll parallax ---------- */
  const artImgs = document.querySelectorAll('.scene-img');
  let raf = 0;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const vh = window.innerHeight;
      artImgs.forEach(img => {
        const r = img.getBoundingClientRect();
        const center = r.top + r.height / 2 - vh / 2;
        const t = Math.max(-1, Math.min(1, center / vh));
        img.style.transform = `translate3d(0, ${(-t * 10).toFixed(1)}px, 0) scale(1.02)`;
      });
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();