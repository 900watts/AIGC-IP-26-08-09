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

  /* ---------- 3. Auto-show scene bubble on first reveal ---------- */
  // (Mascot tap button removed per user request — single mascot entry = chat FAB)
  document.querySelectorAll('.scene').forEach(scene => {
    const sceneIdx = Number(scene.dataset.scene ?? 1);
    const bubble = scene.querySelector('[data-bubble]');
    const bubbleText = bubble?.querySelector('.bubble-text');
    if (bubbleText) bubbleText.textContent = CaptionEngine.make({ idx: sceneIdx });
    // Reveal bubble when scene becomes visible
    const mo = new MutationObserver(() => {
      if (scene.classList.contains('is-visible') && bubble) {
        bubble.classList.add('is-shown');
        // Hide after a few seconds so it doesn't block the image forever
        setTimeout(() => bubble.classList.remove('is-shown'), 4200);
        mo.disconnect();
      }
    });
    mo.observe(scene, { attributes: true, attributeFilter: ['class'] });
  });

  /* ---------- 4. CHAT — Ollama streaming via local proxy (avoids CORS) ---------- */
  const OLLAMA = '/api/ollama';
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

  /* ---------- 4b. Offline fallback (莞仔 in-character canned responses) ---------- */
  const FALLBACKS = [
    { match: /冷知识|有趣|新奇|cool|fact/i, replies: [
      '你知道吗? ACTIF 是中国唯一以版权命名 的国家级动漫展会, 已经办了 15 届啦',
      '东莞石排叫 "中国潮玩之都", 8000 多家潮玩工厂, 全球 80% 的动漫衍生品都来自这里',
      '漫博会的吉祥物 莞仔, 名字来自 "东莞" 的莞, 灵感是东莞荔枝加漫博会字母 A'
    ]},
    { match: /朋友圈|文案|分享|wechat|weibo/i, replies: [
      '来 ACTIF 找 莞仔 玩, 第 16 届漫博会 8.6-10 在东莞石排等你, 一起来抽盲盒吧',
      '在漫博中心门口看日落, 手里拿着潮玩馆刚抽到的盲盒, 这就是夏天的样子',
      '潮玩之都的快乐谁懂? 莞仔 给你比个心, 记得盖一枚版权印章'
    ]},
    { match: /时间|几点|什么时候|开门|几点|schedule|hour/i, replies: [
      '漫博会 8 月 6 日到 10 日, 上午 9 点到下午 5 点, 免费入场哦',
      '记得早点来, 下午人最多, 早上逛起来最舒服'
    ]},
    { match: /地点|在哪|怎么去|地址|where|venue/i, replies: [
      '在广东省东莞市石排镇 漫博中心 (ACTIF Center), 走东园大道就到啦',
      '坐高铁到东莞站再转 10 路公交, 或自驾过来, 附近有 4 个停车场'
    ]},
    { match: /好玩|玩什么|推荐|看什么|fun|play/i, replies: [
      '五大展区必逛: 潮玩馆抽盲盒, 智漫空间看 AI 动漫, IP 产业融合馆看授权, 还能看大湾区动画电影',
      '机甲巡游和国风动漫潮玩大巡游每天都有, 拍照超好看',
      '签售舞台能见到你喜欢的 IP 作者, 记得早点排队'
    ]},
    { match: /你好|hi|hello|在吗|嗨/i, replies: [
      '你好呀! 我是 莞仔, 在漫博中心门口等你呢',
      '嘿! 欢迎欢迎, 莞仔 在这里!'
    ]},
    { match: /谢谢|thank|感谢/i, replies: [
      '不客气~ 记得来找 莞仔 玩呀',
      '随时叫我, 莞仔 在漫博等你'
    ]}
  ];
  const FALLBACK_DEFAULT = [
    '嘿嘿, 莞仔 在听呢, 你想聊啥?',
    '我听到了, 让我想想~',
    '嗯嗯, 你继续说, 莞仔 听得很认真',
    '这个问题有意思! 你可以问我关于 ACTIF 漫博, 或者让我写朋友圈文案'
  ];
  function offlineReply(text) {
    for (const f of FALLBACKS) {
      if (f.match.test(text)) return f.replies[Math.floor(Math.random() * f.replies.length)];
    }
    return FALLBACK_DEFAULT[Math.floor(Math.random() * FALLBACK_DEFAULT.length)];
  }

  async function streamOffline(userText) {
    if (!chatLog) return;
    const reply = offlineReply(userText);
    const bub = appendMsg('bot', '');
    bub.classList.add('is-streaming');
    let i = 0;
    const speed = 60;
    await new Promise((resolve) => {
      const id = setInterval(() => {
        i++;
        bub.textContent = reply.slice(0, i);
        chatLog.scrollTop = chatLog.scrollHeight;
        if (i >= reply.length) { clearInterval(id); bub.classList.remove('is-streaming'); resolve(); }
      }, speed);
    });
    history.push({ role: 'assistant', content: reply });
  }

  async function streamChat(userText) {
    if (isStreaming) return;
    isStreaming = true;
    if (chatSend) chatSend.disabled = true;
    setTyping(true);
    setAvatar(POSE.BLINK);

    appendMsg('user', userText);
    history.push({ role: 'user', content: userText });

    const messages = [{ role: 'system', content: PERSONA }, ...history.slice(-10)];

    abortController = new AbortController();
    let full = '';
    let bub = null;
    let usedOffline = false;

    try {
      const res = await fetch(OLLAMA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, messages, stream: true, options: { temperature: 0.8 } }),
        signal: abortController.signal
      });

      if (!res.ok || !res.body) throw new Error('http ' + res.status);

      bub = appendMsg('bot', '');
      bub.classList.add('is-streaming');

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
            if (j.error) throw new Error(j.error);
            const piece = j.message?.content || '';
            if (piece) {
              full += piece;
              bub.textContent = full;
              chatLog.scrollTop = chatLog.scrollHeight;
            }
            if (j.done) break;
          } catch (innerErr) {
            if (innerErr.message && innerErr.message !== 'Unexpected end of JSON input') throw innerErr;
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') { isStreaming = false; setTyping(false); setAvatar(POSE.WAVE); return; }
      // Fall back to offline persona
      usedOffline = true;
      if (bub) { bub.classList.remove('is-streaming'); bub.remove(); }
      await streamOffline(userText);
    } finally {
      if (!usedOffline && bub) {
        bub.classList.remove('is-streaming');
        history.push({ role: 'assistant', content: bub.textContent });
      }
      isStreaming = false;
      abortController = null;
      if (chatSend) chatSend.disabled = false;
      setTyping(false);
      setAvatar(POSE.WAVE);
    }
  }

  // Probe Ollama at startup; show a tiny status pill so judges know which mode is active
  (async function probe() {
    try {
      const r = await fetch('/api/ollama/health', { cache: 'no-store' });
      if (!r.ok) throw new Error('health ' + r.status);
      const data = await r.json();
      const online = !!(data && (data.models || data.ok));
      if (chatStatus) {
        chatStatus.textContent = online ? '在线 · 接入本地 Ollama' : '离线模式 · 莞仔还在';
      }
    } catch (_) {
      if (chatStatus) chatStatus.textContent = '离线模式 · 莞仔还在';
    }
  })();

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