/** 🐷 Đập Heo Lì Xì Tết (Bựa Edition) Logic */

document.addEventListener('DOMContentLoaded', () => {
  // --- Elements ---
  const screens = {
    setup: document.getElementById('screen-setup'),
    game: document.getElementById('screen-game'),
    reveal: document.getElementById('screen-reveal'),
    summary: document.getElementById('screen-summary')
  };

  const grid = document.getElementById('heo-grid');
  const remainingTurnsEl = document.getElementById('remaining-turns');
  const phaseForm = document.getElementById('phase-form');
  const phaseDice = document.getElementById('phase-dice');
  const diceGreeting = document.getElementById('dice-greeting');
  const diceResultArea = document.getElementById('dice-result-area');
  const rollValue = document.getElementById('roll-value');
  const rollText = document.getElementById('roll-text');
  const btnEnterGame = document.getElementById('btn-enter-game');
  const btnStop = document.getElementById('btn-stop');
  const btnContinue = document.getElementById('btn-continue');
  const btnPlayAgain = document.getElementById('btn-play-again');
  const summaryPlayerName = document.getElementById('summary-player-name');
  const btnExitFullscreen = document.getElementById('btn-exit-fullscreen');

  // Mini Wheel elements
  const wheelCanvas = document.getElementById('heo-wheel-canvas');
  const wheelCtx = wheelCanvas ? wheelCanvas.getContext('2d') : null;
  const wheelNamesInput = document.getElementById('heo-wheel-names');
  const btnSpinWheel = document.getElementById('btn-spin-wheel');

  // Reveal elements
  const revealTier = document.getElementById('reveal-tier');
  const revealEmoji = document.getElementById('reveal-pig-emoji');
  const revealAmount = document.getElementById('reveal-amount');
  const revealWish = document.getElementById('reveal-wish');
  const revealChallenge = document.getElementById('reveal-challenge');
  const challengeText = document.getElementById('challenge-text');

  // Summary elements
  const summaryTotal = document.getElementById('summary-total');
  const summaryBadge = document.getElementById('summary-badge').querySelector('span');

  // Admin elements
  const secretTrigger = document.getElementById('secret-trigger-emoji');
  const adminModal = document.getElementById('admin-modal');
  const btnCloseAdmin = document.getElementById('btn-close-admin');
  const btnSaveAdmin = document.getElementById('btn-save-admin');
  const btnResetAdmin = document.getElementById('btn-reset-admin');
  const budgetSumEl = document.getElementById('admin-budget-sum');
  const slotInfoEl = document.getElementById('admin-slot-info');
  const cfgBudgetInput = document.getElementById('cfg-budget');
  const cfgDiamondCount = document.getElementById('cfg-diamond-count');
  const cfgGoldCount = document.getElementById('cfg-gold-count');
  const cfgCommonCount = document.getElementById('cfg-common-count');
  const cfgEmptyCount = document.getElementById('cfg-empty-count');
  const cfgX2Count = document.getElementById('cfg-x2-count');
  const cfgTop2Count = document.getElementById('cfg-top2-count');
  const btnAutoDistribute = document.getElementById('btn-auto-distribute');

  // Game bar elements
  const currentMaxEl = document.getElementById('current-max');
  const barX2 = document.getElementById('bar-x2');
  const barTop2 = document.getElementById('bar-top2');

  // Admin game tools
  const adminGameTools = document.getElementById('admin-game-tools');
  const btnRevealPositions = document.getElementById('btn-reveal-positions');
  const btnReshuffle = document.getElementById('btn-reshuffle');
  const btnResetGrid = document.getElementById('btn-reset-grid');
  let isAdmin = false;

  // --- Animated Hammer Cursor ---
  const hammerCursor = document.createElement('div');
  hammerCursor.className = 'hammer-cursor';
  document.body.appendChild(hammerCursor);

  const updateCursorImage = () => {
    const currentTheme = THEMES[config.theme] || THEMES.heo;
    const cursorIcon = currentTheme.cursor === 'hammer' ? 'hammer.png' :
      (currentTheme.cursor === 'stick' ? 'stick.png' : 'pointer.png');
    hammerCursor.innerHTML = `<img src="${ASSET_PATH}${cursorIcon}" alt="cursor" />`;
  };

  // --- Constants & Data ---
  const ASSET_PATH = '/assets/images/dap-heo/';
  const COVER_ASSET = ASSET_PATH + 'heo_dat_nung.png';
  const COVER_CRACK_ASSET = ASSET_PATH + 'heo_dat_nung_crack.png';

  const THEMES = {
    heo: {
      id: 'heo',
      name: 'Đập Heo',
      assetPath: '/assets/images/dap-heo/',
      cover: 'heo_dat_nung.png',
      coverCrack: 'heo_dat_nung_crack.png',
      sound: 'crack',
      cursor: 'hammer',
      labelSuffix: 'HEO',
      specialSuffix: '',
      pigs: {
        common: [
          { base: 'heo_thuong_pink.png', broken: 'heo_thuong_pink_broken.png' },
          { base: 'heo_thuong_blue.png', broken: 'heo_thuong_blue_broken.png' },
          { base: 'heo_thuong_purple.png', broken: 'heo_thuong_purple_broken.png' },
          { base: 'heo_thuong_red.png', broken: 'heo_thuong_red_broken.png' },
          { base: 'heo_thuong_green.png', broken: 'heo_thuong_green.png' }
        ],
        gold: [{ base: 'heo_vang.png', broken: 'heo_vang_broken.png' }],
        diamond: [{ base: 'heo_diamond.png', broken: 'heo_diamond_broken.png' }]
      }
    },
    lixi: {
      id: 'lixi',
      name: 'Khui Lì Xì',
      emoji: '🧧',
      sound: 'paper',
      cursor: 'pointer',
      labelSuffix: 'LÌ XÌ',
      specialSuffix: 'MAY MẮN',
      pigs: {
        common: [{ base: '🧧', broken: '💸' }],
        gold: [{ base: '🧧', broken: '💎' }],
        diamond: [{ base: '🧧', broken: '👑' }]
      }
    },
    nieu: {
      id: 'nieu',
      name: 'Đập Niêu',
      emoji: '🏺',
      sound: 'pot',
      cursor: 'stick',
      labelSuffix: 'NIÊU',
      specialSuffix: 'VÀNG',
      pigs: {
        common: [{ base: '🏺', broken: '💥' }],
        gold: [{ base: '🏺', broken: '💰' }],
        diamond: [{ base: '🏺', broken: '✨' }]
      }
    }
  };

  const PIG_TIERS = {
    common: { label: 'THƯỜNG', weight: 70, class: 'tier-common' },
    gold: { label: 'VÀNG', weight: 25, class: 'tier-gold' },
    diamond: { label: 'KIM CƯƠNG', weight: 5, class: 'tier-diamond' }
  };

  const FUNNY_WISHES = [
    "Chúc bạn năm mới: Đau đầu vì nhà giàu, mệt mỏi vì học giỏi!",
    "Tết này không giống Tết xưa, không còn cầm cố, hết thời đi vay.",
    "Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cafe phin.",
    "Chúc năm mới: 1 vợ, 2 con, nhà 3 tầng, xe 4 bánh!",
    "Năm mới chúc bạn: Sức khỏe vô biên, kiếm được nhiều tiền, đời sướng như tiên."
  ];

  const CHALLENGES = [
    "Hát 1 câu bài Tết bất kỳ.",
    "Múa lân trong vòng 5 giây.",
    "Làm toán: 15 + 27 bằng bao nhiêu?",
    "Đọc bảng cửu chương 7 (ngược từ 10 xuống 1).",
    "Kể tên 3 món ăn ngày Tết."
  ];

  // --- Config & Persistence ---
  const TIER_PRIZES = {
    common: [10000, 20000, 50000],
    gold: [200000],
    diamond: [500000]
  };
  const COMMON_AVG = 27000; // average of 10+20+50 / 3

  const DEFAULT_CONFIG = {
    theme: 'heo',
    budget: 2000000,
    diamondCount: 1,
    goldCount: 3,
    commonCount: 29,
    emptyCount: 50,
    x2Count: 2,
    top2Count: 1
  };

  let config = JSON.parse(localStorage.getItem('DAP_HEO_CONFIG')) || JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  // --- State ---
  let state = {
    playerName: "Bạn",
    totalTurns: 0,
    turnsRemaining: 0,
    prizes: [],
    hasX2: false,
    hasTop2: false,
    currentEarnings: 0,
    history: [],
    isGameOver: false,
    gridSpawned: false
  };

  // --- Mini Wheel Logic (ported from lucky-wheel) ---
  const WHEEL_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F7DC6F', '#BB8FCE'];
  let wheelItems = [];
  let wheelRotation = 0;
  let wheelVelocity = 0;
  let wheelSpinning = false;
  const wheelFriction = 0.992;

  const updateWheelItems = () => {
    if (!wheelNamesInput) return;
    const lines = wheelNamesInput.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    wheelItems = lines.map((label, i) => ({ label, color: WHEEL_COLORS[i % WHEEL_COLORS.length] }));
    drawWheel();
  };

  const drawWheel = () => {
    if (!wheelCtx || !wheelCanvas) return;
    const radius = wheelCanvas.width / 2;
    const cx = wheelCanvas.width / 2;
    const cy = wheelCanvas.height / 2;
    const arc = (Math.PI * 2) / (wheelItems.length || 1);

    wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    wheelCtx.save();
    wheelCtx.translate(cx, cy);
    wheelCtx.rotate(wheelRotation);

    wheelItems.forEach((item, i) => {
      const angle = i * arc;
      wheelCtx.beginPath();
      wheelCtx.moveTo(0, 0);
      wheelCtx.arc(0, 0, radius, angle, angle + arc);
      wheelCtx.fillStyle = item.color;
      wheelCtx.fill();
      wheelCtx.strokeStyle = 'rgba(255,255,255,0.5)';
      wheelCtx.lineWidth = 2;
      wheelCtx.stroke();

      wheelCtx.save();
      wheelCtx.rotate(angle + arc / 2);
      wheelCtx.textAlign = 'right';
      wheelCtx.fillStyle = '#fff';
      wheelCtx.font = 'bold 16px Inter, sans-serif';
      wheelCtx.shadowColor = 'rgba(0,0,0,0.5)';
      wheelCtx.shadowBlur = 4;
      wheelCtx.fillText(item.label, radius - 15, 6);
      wheelCtx.restore();
    });

    wheelCtx.restore();

    // Center circle
    wheelCtx.beginPath();
    wheelCtx.arc(cx, cy, 24, 0, Math.PI * 2);
    wheelCtx.fillStyle = '#fff';
    wheelCtx.fill();
    wheelCtx.stroke();
  };

  const spinWheel = () => {
    if (wheelSpinning || wheelItems.length < 1) return;
    wheelVelocity = 0.3 + Math.random() * 0.2;
    wheelSpinning = true;
    if (window.ZToolsFolk) window.ZToolsFolk.sounds.play('spin');
    animateWheel();
  };

  const animateWheel = () => {
    if (!wheelSpinning) return;
    wheelRotation += wheelVelocity;
    wheelVelocity *= wheelFriction;
    drawWheel();
    if (wheelVelocity < 0.001) {
      wheelSpinning = false;
      wheelVelocity = 0;
      onWheelEnd();
    } else {
      requestAnimationFrame(animateWheel);
    }
  };

  const onWheelEnd = async () => {
    const arc = (Math.PI * 2) / wheelItems.length;
    const pointerAngle = 1.5 * Math.PI;
    const norm = wheelRotation % (Math.PI * 2);
    const idx = Math.floor(((pointerAngle - norm + Math.PI * 2) % (Math.PI * 2)) / arc);
    const winner = wheelItems[idx];
    state.playerName = winner.label;

    if (window.ZToolsFolk) {
      window.ZToolsFolk.sounds.play('jackpot');
      window.ZToolsFolk.particles.create(window.innerWidth / 2, window.innerHeight / 3, winner.color, 50);
    }

    // --- AUTO-REMOVE WINNER ---
    const winnerLabel = winner.label.trim().toLowerCase();
    const currentLines = wheelNamesInput.value.split('\n');
    const filteredLines = currentLines.filter(line => {
      const trimmedLine = line.trim();
      return trimmedLine !== '' && trimmedLine.toLowerCase() !== winnerLabel;
    });

    wheelNamesInput.value = filteredLines.join('\n');
    localStorage.setItem('DAP_HEO_WHEEL_NAMES', wheelNamesInput.value);
    updateWheelItems();

    // Auto-advance to dice phase after short delay
    await new Promise(r => setTimeout(r, 800));
    phaseForm.classList.add('fade-out');
    await new Promise(r => setTimeout(r, 400));
    phaseForm.classList.add('hidden');

    diceGreeting.innerHTML = `Chào <strong>${state.playerName}</strong>! Tung xúc xắc nào... 🎲`;
    diceResultArea.classList.add('hidden');
    diceResultArea.classList.remove('show');
    phaseDice.classList.remove('hidden');

    // 3D Dice Roll
    const diceCube = document.getElementById('dice-cube');
    state.totalTurns = Math.floor(Math.random() * 6) + 1;
    const faceRotations = {
      1: 'rotateX(1080deg) rotateY(1080deg)',
      2: 'rotateX(1080deg) rotateY(1260deg)',
      3: 'rotateX(1080deg) rotateY(1170deg)',
      4: 'rotateX(1080deg) rotateY(990deg)',
      5: 'rotateX(1170deg) rotateY(1080deg)',
      6: 'rotateX(990deg) rotateY(1080deg)',
    };
    diceCube.style.setProperty('--dice-final', faceRotations[state.totalTurns]);
    diceCube.classList.remove('rolling');
    void diceCube.offsetWidth;
    diceCube.classList.add('rolling');

    await new Promise(r => setTimeout(r, 2000));
    rollValue.innerText = state.totalTurns;
    rollText.innerText = 'lượt đập heo!';
    diceResultArea.classList.remove('hidden');
    requestAnimationFrame(() => diceResultArea.classList.add('show'));

    state.turnsRemaining = state.totalTurns;
    state.currentEarnings = 0;
    state.prizes = [];
    state.hasX2 = false;
    state.hasTop2 = false;
    state.history = [];
    state.isGameOver = false;
  };

  // Init wheel on textarea change
  if (wheelNamesInput) {
    wheelNamesInput.addEventListener('input', updateWheelItems);
    // Load saved names
    const savedNames = localStorage.getItem('DAP_HEO_WHEEL_NAMES');
    if (savedNames) wheelNamesInput.value = savedNames;
    updateWheelItems();
  }

  // --- Functions ---
  const showScreen = (name) => {
    Object.keys(screens).forEach(key => {
      const isCurrent = key === name;
      screens[key].classList.toggle('hidden', !isCurrent);
      if (isCurrent) {
        screens[key].classList.remove('screen-fade-in');
        void screens[key].offsetWidth; // trigger reflow
        screens[key].classList.add('screen-fade-in');
      }
    });
  };

  const spawnGrid = () => {
    grid.innerHTML = '';
    const currentTheme = THEMES[config.theme] || THEMES.heo;
    const isEmojiTheme = !!currentTheme.emoji;

    state.gridSpawned = true;

    // Header title update
    const gameTitle = document.querySelector('.heo-game-container > div:first-child h1');
    if (gameTitle) {
      if (config.theme === 'lixi') gameTitle.innerText = '🧧 KHUI LÌ XÌ TẾT';
      else if (config.theme === 'nieu') gameTitle.innerText = '🏺 ĐẬP NIÊU MAY MẮN';
      else gameTitle.innerText = '🐷 ĐẬP HEO LÌ XÌ';
    }

    // Set cursor class
    document.body.classList.remove('cursor-hammer', 'cursor-pointer', 'cursor-stick');
    document.body.classList.add('cursor-' + currentTheme.cursor);
    updateCursorImage();

    // Distribution
    const distribution = [];
    for (let i = 0; i < config.diamondCount; i++) distribution.push({ tier: 'diamond', special: null });
    for (let i = 0; i < config.goldCount; i++) distribution.push({ tier: 'gold', special: null });
    for (let i = 0; i < config.commonCount; i++) distribution.push({ tier: 'common', special: null });
    for (let i = 0; i < config.x2Count; i++) distribution.push({ tier: 'common', special: 'x2' });
    for (let i = 0; i < config.top2Count; i++) distribution.push({ tier: 'common', special: 'top2' });
    while (distribution.length < 100) distribution.push({ tier: 'empty', special: null });

    // Shuffle
    for (let i = distribution.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [distribution[i], distribution[j]] = [distribution[j], distribution[i]];
    }

    distribution.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = `heo-item ${PIG_TIERS[item.tier]?.class || 'tier-empty'}`;
      el.dataset.index = index;
      el.dataset.tier = item.tier;
      if (item.special) el.dataset.special = item.special;

      if (isEmojiTheme) {
        el.innerHTML = `<div class="heo-pig"><span class="heo-emoji">${currentTheme.emoji}</span></div>`;
      } else {
        el.innerHTML = `<div class="heo-pig"><img src="${currentTheme.assetPath}${currentTheme.cover}" alt="pig"></div>`;
      }

      el.addEventListener('click', () => handlePigClick(el));
      grid.appendChild(el);
    });
  };

  const createShatterEffect = (el, imgSrc, count = 16, tierColor = null) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Flash Effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: white; opacity: 0.3; z-index: 999; pointer-events: none;
    `;
    document.body.appendChild(flash);
    flash.animate([{ opacity: 0.3 }, { opacity: 0 }], { duration: 150 }).onfinish = () => flash.remove();

    for (let i = 0; i < count; i++) {
      const shard = document.createElement('div');
      shard.className = 'heo-shard';

      if (tierColor && Math.random() > 0.4) {
        shard.style.background = tierColor;
        shard.style.boxShadow = `0 0 10px ${tierColor}`;
      } else {
        shard.style.backgroundImage = `url(${imgSrc})`;
      }

      const size = 10 + Math.random() * 20;
      shard.style.width = size + 'px';
      shard.style.height = size + 'px';

      const bx = Math.random() * 100;
      const by = Math.random() * 100;
      shard.style.backgroundPosition = `-${bx}px -${by}px`;

      shard.style.left = centerX + 'px';
      shard.style.top = centerY + 'px';

      const angle = (Math.random() * Math.PI * 2);
      const velocity = 5 + Math.random() * 15;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      let x = 0;
      let y = 0;
      let rotation = 0;
      const rotSpeed = (Math.random() - 0.5) * 20;
      const gravity = 0.5;
      let currentVY = vy;

      const animateShard = () => {
        x += vx;
        y += currentVY;
        currentVY += gravity;
        rotation += rotSpeed;

        shard.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotation}deg)`;
        const opacity = parseFloat(shard.style.opacity || 1) - 0.02;
        shard.style.opacity = opacity;

        if (opacity > 0) {
          requestAnimationFrame(animateShard);
        } else {
          shard.remove();
        }
      };

      shard.style.opacity = 1;
      document.body.appendChild(shard);
      requestAnimationFrame(animateShard);
    }
  };

  const handlePigClick = async (el) => {
    const tier = el.dataset.tier;
    const special = el.dataset.special;
    if (state.turnsRemaining <= 0 || el.classList.contains('processing')) return;
    el.classList.add('processing');

    const pigContainer = el.querySelector('.heo-pig');
    const pigImg = pigContainer.querySelector('img');
    const currentTheme = THEMES[config.theme] || THEMES.heo;
    const isEmojiTheme = !!currentTheme.emoji;

    // --- STAGE 1: Cracks & Shake ---
    if (window.ZToolsFolk) {
      window.ZToolsFolk.sounds.play(currentTheme.sound);
      window.ZToolsFolk.vibrate();
    }

    if (!isEmojiTheme && pigImg) {
      pigImg.src = currentTheme.assetPath + currentTheme.coverCrack;
    }
    pigContainer.classList.add('animate-crack');

    await new Promise(r => setTimeout(r, 600));
    pigContainer.classList.remove('animate-crack');

    // --- STAGE 2: Reveal & Shatter ---
    let brokenAsset = '';
    let label = '';
    let tierColor = null;

    if (tier === 'empty') {
      label = isEmojiTheme ? 'XUI QUÁ 💨' : 'HEO RỖNG 💨';
      brokenAsset = isEmojiTheme ? '💨' : 'heo_dat_nung_broken.png';
    } else {
      const themePigs = currentTheme.pigs[tier];
      const assetObj = themePigs[Math.floor(Math.random() * themePigs.length)];
      brokenAsset = assetObj.broken;
      label = `${currentTheme.labelSuffix} ${PIG_TIERS[tier].label}`;
      if (tier === 'gold') tierColor = '#FFD700';
      if (tier === 'diamond') tierColor = '#00F2FF';
    }

    // Create shatter effect
    if (isEmojiTheme) {
      createShatterEffect(el, null, 12, tierColor);
      el.innerHTML = `<div class="heo-pig"><span class="heo-emoji broken">${brokenAsset}</span></div>`;
    } else {
      createShatterEffect(el, currentTheme.assetPath + brokenAsset, 16, tierColor);
      if (pigImg) pigImg.src = currentTheme.assetPath + brokenAsset;
    }

    // Handle Logic
    let prizeValue = 0;
    let revealLabel = label;

    if (tier !== 'empty') {
      const prizeOptions = TIER_PRIZES[tier];
      prizeValue = prizeOptions[Math.floor(Math.random() * prizeOptions.length)];

      if (special === 'x2') {
        state.hasX2 = true;
        revealLabel += ' x2';
        barX2.classList.add('active');
      } else if (special === 'top2') {
        state.hasTop2 = true;
        revealLabel += ' TOP2';
        barTop2.classList.add('active');
      }

      state.prizes.push(prizeValue);
      state.currentEarnings += prizeValue;
      state.history.push({ tier, amount: prizeValue, special });
    } else {
      state.history.push({ tier: 'empty', amount: 0 });
    }

    state.turnsRemaining--;
    remainingTurnsEl.innerText = state.turnsRemaining;

    // Update current MAX display
    const currentMax = Math.max(...state.prizes, 0);
    currentMaxEl.innerText = currentMax.toLocaleString();

    showRevealScreen(revealLabel, prizeValue, special, brokenAsset);

    if (state.turnsRemaining <= 0) {
      setTimeout(() => {
        showSummary();
      }, 1500);
    }
  };

  const showRevealScreen = (label, prize, special, brokenAsset) => {
    const currentTheme = THEMES[config.theme] || THEMES.heo;
    const isEmojiTheme = !!currentTheme.emoji;

    revealTier.innerText = label;
    revealAmount.innerText = prize > 0 ? `+${prize.toLocaleString()}đ` : (special ? 'POWER UP! 🔥' : '+0đ');

    if (isEmojiTheme) {
      revealEmoji.innerHTML = `<div style="font-size:4rem;">${brokenAsset}</div>`;
    } else {
      revealEmoji.innerHTML = `<img src="${currentTheme.assetPath}${brokenAsset}" class="reveal-pig-img" />`;
    }

    if (label.includes('RỖNG') || label.includes('XUI QUÁ')) {
      revealWish.innerText = 'Ôi trời! Trống không! 😭';
    } else if (special === 'x2') {
      revealWish.innerText = 'Siêu năng lực! Kết quả cuối cùng sẽ được x2! 🔥';
    } else if (special === 'top2') {
      revealWish.innerText = 'Quá đỉnh! Kết quả = tổng 2 giá trị cao nhất! 💎';
    } else {
      revealWish.innerText = FUNNY_WISHES[Math.floor(Math.random() * FUNNY_WISHES.length)];
    }

    // Reveal buttons update
    if (state.turnsRemaining <= 0) {
      btnContinue.classList.add('hidden');
      btnStop.innerText = '💰 XEM TỔNG KẾT';
    } else {
      btnContinue.classList.remove('hidden');
      btnStop.innerText = '💰 ĐỦ: DỪNG LẠI';
    }

    showScreen('reveal');
  };

  const computeFinalResult = () => {
    if (state.prizes.length === 0) return 0;
    let result;
    if (state.hasTop2) {
      const sorted = [...state.prizes].sort((a, b) => b - a);
      result = sorted[0] + (sorted[1] || 0);
    } else {
      result = Math.max(...state.prizes);
    }
    if (state.hasX2) result *= 2;
    return result;
  };

  const showSummary = () => {
    const finalResult = computeFinalResult();
    summaryTotal.innerText = finalResult.toLocaleString();
    summaryPlayerName.innerText = `XIN CHÚC MỪNG, ${state.playerName.toUpperCase()}!`;

    let badge = 'TAY ĐẬP LỤA';
    if (finalResult >= 800000) badge = 'ĐẠI GIA LÌ XÌ';
    else if (finalResult >= 300000) badge = 'TAY ĐẬP VÀNG';

    summaryBadge.innerText = badge;

    // Remove game-active from container
    document.querySelector('.heo-game-container').classList.remove('game-active');

    // Render chart
    renderSummaryChart();

    showScreen('summary');
  };

  const renderSummaryChart = () => {
    const canvas = document.getElementById('summary-chart');
    const legend = document.getElementById('summary-chart-legend');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = 360;
    const h = 180;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Count categories from history
    const cats = [
      { key: 'prize', label: '💰 Có thưởng', color: '#f0c040', count: 0 },
      { key: 'empty', label: '💨 Trống', color: '#ccc', count: 0 },
      { key: 'x2', label: '⚡ X2', color: '#e74c3c', count: 0 },
      { key: 'top2', label: '🏆 Top 2', color: '#3498db', count: 0 }
    ];

    state.history.forEach(h => {
      if (h.tier === 'empty') cats[1].count++;
      else if (h.tier === 'x2') cats[2].count++;
      else if (h.tier === 'top2') cats[3].count++;
      else cats[0].count++;
    });

    const total = state.history.length;
    if (total === 0) return;

    const barHeight = 28;
    const gap = 12;
    const labelWidth = 90;
    const chartLeft = labelWidth + 5;
    const chartWidth = w - chartLeft - 40;
    const startY = (h - (cats.length * (barHeight + gap) - gap)) / 2;

    cats.forEach((cat, i) => {
      const y = startY + i * (barHeight + gap);
      const barW = Math.max((cat.count / total) * chartWidth, cat.count > 0 ? 20 : 0);

      // Label
      ctx.fillStyle = '#555';
      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(cat.label, labelWidth, y + barHeight / 2);

      // Bar bg
      ctx.fillStyle = '#f0f0f0';
      ctx.beginPath();
      ctx.roundRect(chartLeft, y, chartWidth, barHeight, 6);
      ctx.fill();

      // Bar fill
      if (barW > 0) {
        ctx.fillStyle = cat.color;
        ctx.beginPath();
        ctx.roundRect(chartLeft, y, barW, barHeight, 6);
        ctx.fill();
      }

      // Count
      ctx.fillStyle = '#333';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(cat.count.toString(), chartLeft + barW + 6, y + barHeight / 2);
    });

    // Legend
    legend.innerHTML = cats.filter(c => c.count > 0).map(c =>
      `<span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:50%;background:${c.color};display:inline-block;"></span>${c.label}: ${c.count}</span>`
    ).join('');
  };

  // --- Event Listeners ---
  // Spin wheel button
  btnSpinWheel.addEventListener('click', () => {
    if (wheelItems.length < 2) {
      alert('Vui lòng nhập ít nhất 2 tên!');
      wheelNamesInput.focus();
      return;
    }
    // Save names to localStorage
    localStorage.setItem('DAP_HEO_WHEEL_NAMES', wheelNamesInput.value);
    spinWheel();
  });

  // "BẮT ĐẦU!" button — transition to game
  btnEnterGame.addEventListener('click', () => {
    const diceCube = document.getElementById('dice-cube');
    diceCube.classList.remove('rolling');
    diceCube.style.removeProperty('--dice-final');
    phaseDice.classList.add('hidden');
    phaseForm.classList.remove('fade-out', 'hidden');
    remainingTurnsEl.innerText = state.turnsRemaining;
    currentMaxEl.innerText = '0';
    barX2.classList.remove('active');
    barTop2.classList.remove('active');
    document.querySelector('.heo-game-container').classList.add('game-active');
    // Enter fullscreen
    document.body.classList.add('heo-fullscreen');
    // Only spawn grid if not yet spawned
    if (!state.gridSpawned) {
      spawnGrid();
      state.gridSpawned = true;
    }
    showScreen('game');
  });

  btnStop.addEventListener('click', () => {
    showSummary();
  });

  btnContinue.addEventListener('click', () => {
    if (state.turnsRemaining > 0) {
      showScreen('game');
    } else {
      showSummary();
    }
  });

  btnPlayAgain.addEventListener('click', () => {
    document.querySelector('.heo-game-container').classList.remove('game-active');
    document.body.classList.remove('heo-fullscreen');
    showScreen('setup');
  });
  // Fullscreen exit button
  btnExitFullscreen.addEventListener('click', () => {
    document.body.classList.remove('heo-fullscreen');
  });

  // Initialize core if needed
  if (window.ZToolsFolk && window.ZToolsFolk.sounds) {
    window.ZToolsFolk.sounds.init(['crack', 'jackpot']);
  }

  // --- Admin Logic ---
  const updateBudgetDisplay = () => {
    const dc = parseInt(cfgDiamondCount.value) || 0;
    const gc = parseInt(cfgGoldCount.value) || 0;
    const cc = parseInt(cfgCommonCount.value) || 0;
    const total = dc * 500000 + gc * 200000 + cc * COMMON_AVG;
    budgetSumEl.innerText = `Tổng ước: ${total.toLocaleString()}đ`;

    const ec = parseInt(cfgEmptyCount.value) || 0;
    const x2c = parseInt(cfgX2Count.value) || 0;
    const t2c = parseInt(cfgTop2Count.value) || 0;
    const used = dc + gc + cc + ec + x2c + t2c;
    slotInfoEl.innerText = `Tổng slots: 100 | Đã dùng: ${used} | Còn: ${100 - used}`;
    slotInfoEl.style.color = used > 100 ? '#e74c3c' : '#888';
  };

  const autoDistribute = () => {
    const budget = parseInt(cfgBudgetInput.value) || 0;
    const ec = parseInt(cfgEmptyCount.value) || 0;
    const x2c = parseInt(cfgX2Count.value) || 0;
    const t2c = parseInt(cfgTop2Count.value) || 0;
    const prizeSlots = Math.max(100 - ec - x2c - t2c, 0);

    let remaining = budget;

    // 1. Initial priority: Reserve at least 60-70% slots for Common pigs
    // Using a base value of 10k per common pig for conservative estimation
    let cc = Math.min(Math.floor(prizeSlots * 0.7), Math.floor(remaining / 10000));
    remaining -= cc * 10000;

    // 2. Distribute remaining budget to high-value tiers
    // Diamond first (500k each)
    let dc = Math.min(Math.floor(remaining / 500000), prizeSlots - cc, 5);
    remaining -= dc * 500000;

    // Gold (200k each)
    let gc = Math.min(Math.floor(remaining / 200000), prizeSlots - cc - dc, 15);
    remaining -= gc * 200000;

    // 3. Fill any remaining slots with more Common pigs
    cc += Math.min(prizeSlots - cc - dc - gc, Math.floor(remaining / 10000));

    cfgDiamondCount.value = cc === 0 && dc === 0 && gc === 0 ? 0 : dc; // prevent weird 0 state
    cfgGoldCount.value = gc;
    cfgCommonCount.value = cc;
    updateBudgetDisplay();
  };

  // Live update budget display when inputs change
  [cfgDiamondCount, cfgGoldCount, cfgCommonCount, cfgEmptyCount, cfgX2Count, cfgTop2Count].forEach(el => {
    el.addEventListener('input', updateBudgetDisplay);
  });
  btnAutoDistribute.addEventListener('click', autoDistribute);

  const populateAdminFields = () => {
    cfgBudgetInput.value = config.budget || 2000000;
    const themeSelect = document.getElementById('cfg-theme');
    if (themeSelect) themeSelect.value = config.theme || 'heo';

    cfgDiamondCount.value = config.diamondCount || 0;
    cfgGoldCount.value = config.goldCount || 0;
    cfgCommonCount.value = config.commonCount || 0;
    cfgEmptyCount.value = config.emptyCount || 0;
    cfgX2Count.value = config.x2Count || 0;
    cfgTop2Count.value = config.top2Count || 0;
    updateBudgetDisplay();
  };

  const saveConfig = () => {
    const themeSelect = document.getElementById('cfg-theme');
    config = {
      theme: themeSelect ? themeSelect.value : 'heo',
      budget: parseInt(cfgBudgetInput.value) || 0,
      diamondCount: parseInt(cfgDiamondCount.value) || 0,
      goldCount: parseInt(cfgGoldCount.value) || 0,
      commonCount: parseInt(cfgCommonCount.value) || 0,
      emptyCount: parseInt(cfgEmptyCount.value) || 0,
      x2Count: parseInt(cfgX2Count.value) || 0,
      top2Count: parseInt(cfgTop2Count.value) || 0
    };

    localStorage.setItem('DAP_HEO_CONFIG', JSON.stringify(config));
    adminModal.classList.add('hidden');
    alert('Đã lưu cấu hình!');
    // Re-spawn grid to apply theme
    state.gridSpawned = false;
  };

  // --- Secret Admin Trigger (double-click on 🐷 + password) ---
  secretTrigger.addEventListener('dblclick', () => {
    const pwd = prompt('🔒 Nhập mật khẩu Admin:');
    if (!pwd) return;

    const date = new Date();
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const DD = String(date.getDate()).padStart(2, '0');
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const YYYY = date.getFullYear();

    const expectedCode = `${HH}${mm}${DD}${MM}${YYYY}`;

    if (pwd === expectedCode) {
      isAdmin = true;
      populateAdminFields();
      adminModal.classList.remove('hidden');
      adminGameTools.classList.remove('hidden');
    } else {
      alert('Sai mật khẩu rồi bồ ơi! 🐷');
    }
  });

  btnCloseAdmin.addEventListener('click', () => adminModal.classList.add('hidden'));
  btnSaveAdmin.addEventListener('click', saveConfig);
  btnResetAdmin.addEventListener('click', () => {
    if (confirm('Reset về mặc định?')) {
      config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
      localStorage.setItem('DAP_HEO_CONFIG', JSON.stringify(config));
      populateAdminFields();
    }
  });

  // --- Admin Game Tools ---
  btnRevealPositions.addEventListener('click', () => {
    const items = grid.querySelectorAll('.heo-item');
    const isRevealing = btnRevealPositions.dataset.active === 'true';

    if (isRevealing) {
      // Turn off reveals
      items.forEach(item => item.classList.remove('reveal-empty', 'reveal-x2', 'reveal-top2'));
      btnRevealPositions.dataset.active = 'false';
      btnRevealPositions.innerHTML = '👁️ Tiết lộ vị trí';
    } else {
      // Show reveals
      items.forEach(item => {
        if (item.classList.contains('processing')) return;
        const tier = item.dataset.tier;
        const special = item.dataset.special;
        if (tier === 'empty') item.classList.add('reveal-empty');
        else if (special === 'x2') item.classList.add('reveal-x2');
        else if (special === 'top2') item.classList.add('reveal-top2');
      });
      btnRevealPositions.dataset.active = 'true';
      btnRevealPositions.innerHTML = '🙈 Ẩn vị trí';
    }
  });

  btnReshuffle.addEventListener('click', () => {
    if (confirm('Đảo lại vị trí tất cả heo chưa đập?')) {
      spawnGrid();
      state.gridSpawned = true;
      // Re-apply reveal if active
      if (btnRevealPositions.dataset.active === 'true') {
        btnRevealPositions.dataset.active = 'false';
        btnRevealPositions.click();
      }
    }
  });

  // Reset Grid button (admin)
  btnResetGrid.addEventListener('click', () => {
    if (confirm('Reset toàn bộ grid? Tất cả heo sẽ được tạo lại.')) {
      spawnGrid();
      state.gridSpawned = true;
      if (btnRevealPositions.dataset.active === 'true') {
        btnRevealPositions.dataset.active = 'false';
        btnRevealPositions.click();
      }
    }
  });

  let cursorInGrid = false;
  grid.addEventListener('mouseenter', () => {
    cursorInGrid = true;
    hammerCursor.classList.add('visible');
  });
  grid.addEventListener('mouseleave', () => {
    cursorInGrid = false;
    hammerCursor.classList.remove('visible');
    hammerCursor.classList.remove('swinging');
  });
  grid.addEventListener('mousemove', (e) => {
    if (cursorInGrid) {
      hammerCursor.style.left = e.clientX + 'px';
      hammerCursor.style.top = e.clientY + 'px';

      // Toggle swinging animation ONLY on active items
      const isOverItem = e.target.closest('.heo-item:not(.processing)');
      hammerCursor.classList.toggle('swinging', !!isOverItem);
    }
  });

  showScreen('setup');
});
