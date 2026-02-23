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

  // --- Supabase Config ---
  console.log('🔍 Checking Supabase Env:', window.DAP_HEO_ENV);
  const SUPABASE_URL = window.DAP_HEO_ENV?.SUPABASE_URL || 'MISSING_ENV_URL';
  const SUPABASE_KEY = window.DAP_HEO_ENV?.SUPABASE_KEY || 'MISSING_ENV_KEY';
  let supabase = null;

  if (window.supabase && SUPABASE_URL.startsWith('http')) {
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('✅ Supabase initialized');
    } catch (e) {
      console.error('❌ Supabase init failed:', e);
    }
  } else {
    console.warn('⚠️ Supabase skipped! URL:', SUPABASE_URL, 'SDK:', !!window.supabase);
  }
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
  const btnDirectPlay = document.getElementById('btn-direct-play');
  const directInput = document.getElementById('direct-player-name');

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
  // Admin elements (Dashboard 2.0)
  const adminModal = document.getElementById('admin-modal');
  const btnCloseAdmin = document.getElementById('btn-close-admin');
  const btnSaveAdmin = document.getElementById('btn-save-admin');
  const btnResetAdmin = document.getElementById('btn-reset-admin');

  // Inputs
  const cfgBudgetInput = document.getElementById('cfg-budget');
  const cfgThemeInput = document.getElementById('cfg-theme');
  const rangeDiamond = document.getElementById('range-diamond');
  const rangeGold = document.getElementById('range-gold');
  const rangeSilver = document.getElementById('range-silver');
  const rangeBronze = document.getElementById('range-bronze');
  const cfgCommonCount = document.getElementById('cfg-common-count');
  const cfgEmptyCount = document.getElementById('cfg-empty-count');
  const cfgX2Count = document.getElementById('cfg-x2-count');
  const cfgTop2Count = document.getElementById('cfg-top2-count');
  const cfgMaxPrize = document.getElementById('cfg-max-prize');
  const cfgMinPrize = document.getElementById('cfg-min-prize');

  // Display Badges & Stats
  const valDiamond = document.getElementById('val-diamond');
  const valGold = document.getElementById('val-gold');
  const valSilver = document.getElementById('val-silver');
  const valBronze = document.getElementById('val-bronze');
  const valCommon = document.getElementById('val-common');
  const valEmpty = document.getElementById('val-empty');
  const statTotalSlots = document.getElementById('stat-total-slots');
  const statWinRate = document.getElementById('stat-win-rate');
  const adminBudgetDisplay = document.getElementById('admin-budget-display');
  const adminBudgetProgress = document.getElementById('admin-budget-progress');

  // Presets
  const btnPresets = document.querySelectorAll('.btn-preset');

  // Game bar elements
  const currentMaxEl = document.getElementById('current-max');
  const barX2 = document.getElementById('bar-x2');
  const barTop2 = document.getElementById('bar-top2');
  const barPlus25 = document.getElementById('bar-plus25');
  const barPlus50 = document.getElementById('bar-plus50');
  const historyList = document.getElementById('history-list');
  const cfgPlus25Count = document.getElementById('cfg-plus25-count');
  const cfgPlus50Count = document.getElementById('cfg-plus50-count');

  // Admin game tools
  const adminGameTools = document.getElementById('admin-game-tools');
  const btnRevealPositions = document.getElementById('btn-reveal-positions');
  const btnReshuffle = document.getElementById('btn-reshuffle');
  const btnResetGrid = document.getElementById('btn-reset-grid');
  const btnToggleFullscreen = document.getElementById('btn-toggle-fullscreen');
  let isAdmin = false;

  // --- Helper: Lock Scroll ---
  const setScrollLock = (isLocked) => {
    document.body.style.overflow = isLocked ? 'hidden' : '';
  };

  // --- Helpers ---
  const showScreen = (screenName) => {
    Object.values(screens).forEach(s => s.classList.add('hidden'));

    // Unlock scroll by default, lock only for specific screens if needed (e.g. summary/reveal if they are overlays)
    // But since requested "modal fixed no scroll", we handle it specifically.
    // Actually, if we are in fullscreen, we might want no scroll at all? 
    // Let's stick to the request: "modal fixed no scroll". 
    // Reveal and Summary are technically screens, but visually act like modals/overlays.

    if (screens[screenName]) {
      screens[screenName].classList.remove('hidden');

      // Add animation class
      screens[screenName].classList.remove('screen-fade-in');
      void screens[screenName].offsetWidth;
      screens[screenName].classList.add('screen-fade-in');

      // Lock scroll for Reveal and Summary
      if (screenName === 'reveal' || screenName === 'summary') {
        setScrollLock(true);
      } else {
        setScrollLock(false);
      }
    }
  };

  // 1. Enter Fullscreen by Default - REMOVED per request
  // document.body.classList.add('heo-fullscreen'); 
  // Adjust container for fullscreen
  const gameContainer = document.querySelector('.heo-game-container');

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
    silver: { label: 'BẠC', weight: 15, class: 'tier-silver' },
    gold: { label: 'VÀNG', weight: 25, class: 'tier-gold' },
    diamond: { label: 'KIM CƯƠNG', weight: 5, class: 'tier-diamond' },
    bronze: { label: 'ĐỒNG', weight: 10, class: 'tier-bronze' },
    empty: { label: 'RỖNG', weight: 0, class: 'tier-empty' }
  };

  const FUNNY_WISHES = [
    "Chúc bạn năm mới: Đau đầu vì nhà giàu, mệt mỏi vì học giỏi!",
    "Tiền vào như nước sông Đà, tiền ra nhỏ giọt như cafe phin.",
    "Năm mới chúc bạn: Sức khỏe vô biên, kiếm được nhiều tiền, đời sướng như tiên.",
    "Năm mới phát tài, đừng có mà 'phát phì' nhé bồ!",
    "Chúc bạn năm mới: Không bị cô 'dí', không bị mẹ 'kí'!",
    "Chúc bạn ăn không béo, ngủ không ngáy, yêu không ghen, và trade không lỗ!",
    "Năm mới phát tài, vạn sự như ý, lixi đầy túi!"
  ];

  const CHALLENGES = [
    "Hát 1 câu bài Tết bất kỳ thật 'bựa'.",
    "Làm mặt xấu nhất có thể trong 3 giây.",
    "Kể một chuyện cười 'bựa' nhất bạn biết.",
    "Kêu một tiếng con heo thật to cho cả làng nghe!",
    "Nhảy 1 đoạn tiktok trend bất kỳ mà bạn biết.",
    "Kể tên 3 người bạn muốn lì xì cho nhất.",
    "Lì xì cho người gần nhất 10k",
    "Làm toán: 123 + 456 bằng bao nhiêu? (Trả lời trong 3 giây).",
    "Đọc bảng cửu chương 9 (ngược từ 10 xuống 1).",
    "Đọc bảng cửu chương 3 (ngược từ 10 xuống 1).",
    "Đọc bảng cửu chương 4 (ngược từ 10 xuống 1).",
    "Đọc bảng cửu chương 5 (ngược từ 10 xuống 1).",
    "Đọc bảng cửu chương 6 (ngược từ 10 xuống 1).",
    "Đọc bảng cửu chương 7 (ngược từ 10 xuống 1).",
    "Đọc bảng cửu chương 8 (ngược từ 10 xuống 1).",
    "Đọc bảng cửu chương 9 (ngược từ 10 xuống 1).",
    "Đọc bảng cửu chương 4",
    "Đọc bảng cửu chương 3",
    "Đọc bảng cửu chương 5",
    "Đọc bảng cửu chương 6",
    "Đọc bảng cửu chương 7",
    "Đọc bảng cửu chương 8",
    "Đọc bảng cửu chương 9",
    "Thử thách không cười trong 10 giây khi mọi người làm trò."
  ];

  const FUNNY_GREETINGS = [
    "Hê lô <strong>{name}</strong>, dân chơi đã tới!",
    "Chào <strong>{name}</strong>, thánh gõ heo đây?",
    "<strong>{name}</strong> đã gia nhập, anh em cẩn thận!",
    "Ú òa! <strong>{name}</strong> tham gia rồi nè.",
    "Chào đại gia <strong>{name}</strong>, lì xì đi rồi đập!",
    "Thánh đập heo <strong>{name}</strong> đã xuất hiện!",
    "A hế lô <strong>{name}</strong>! Vào đập heo đi chờ gì nữa?",
    "Chào <strong>{name}</strong>! Cây búa của bạn đâu?",
    "Chào <strong>{name}</strong>! Cây búa vàng tới kìa anh em!",
  ];

  const DICE_TTS_TEMPLATES = [
    "Bạn được {turns} lượt, đập nát heo đi!",
    "{turns} lượt đập, cơ hội kiếm tiền tới rồi!",
    "Trời độ bạn rồi, {turns} lượt đập nhé!",
    "Chúc mừng, bạn có {turns} cơ hội đổi đời!",
    "{turns} nhát búa, liệu có ra kim cương không?",
    "Ngon lành, {turns} lượt, triển luôn bồ tèo!",
    "Được {turns} lượt, đừng làm anh em thất vọng nha!"
  ];

  // --- Config & Persistence ---
  const TIER_PRIZES = {
    common: [10000, 20000],
    bronze: [50000],
    silver: [100000],
    gold: [200000],
    diamond: [500000]
  };
  const COMMON_AVG = 15000; // average of 10k + 20k / 2

  // --- Shared TTS Helper ---
  const speakVietnamese = (text, { rate = 1.1, pitch = 1.0, delay = 0 } = {}) => {
    if (!('speechSynthesis' in window)) return;
    const speak = () => {
      try {
        // Strip HTML tags and emoji/icons
        const clean = text
          .replace(/<[^>]*>/g, '')
          .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (!clean) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'vi-VN';
        utterance.rate = rate;
        utterance.pitch = pitch;
        const voices = speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang.startsWith('vi'));
        if (viVoice) utterance.voice = viVoice;
        speechSynthesis.speak(utterance);
      } catch (e) { /* TTS not available */ }
    };
    if (delay > 0) setTimeout(speak, delay);
    else speak();
  };

  const DEFAULT_CONFIG = {
    theme: 'heo',
    budget: 2000000,
    maxPrize: 0,
    minPrize: 0,
    diamondCount: 1,
    goldCount: 3,
    silverCount: 5,
    bronzeCount: 0,
    commonCount: 24,
    emptyCount: 50,
    x2Count: 2,
    top2Count: 1,
    plus25Count: 2,
    plus50Count: 1
  };

  let config = JSON.parse(localStorage.getItem('DAP_HEO_CONFIG')) || JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  // Load from Supabase
  const loadConfigFromSupabase = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('game_configs').select('content').eq('id', 'dap-heo-main').single();
      if (data && data.content) {
        console.log('📥 Loaded config from Supabase');
        config = { ...DEFAULT_CONFIG, ...data.content }; // Merge to ensure new fields
        // Save to local for fallback
        localStorage.setItem('DAP_HEO_CONFIG', JSON.stringify(config));
        // Update UI if admin is open, or just ensure next game uses it
      }
    } catch (err) {
      console.warn('⚠️ Could not load config from Supabase', err);
    }
  };

  // Init load
  loadConfigFromSupabase();

  // --- State ---

  // --- State ---
  let state = {
    playerName: "Bạn",
    totalTurns: 0,
    turnsRemaining: 0,
    prizes: [],
    hasX2: false,
    hasTop2: false,
    hasPlus25: false,
    hasPlus50: false,
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
  let activeWheelSound = null;
  let activeDiceSound = null;
  const wheelFriction = 0.985; // Increased friction (0.992 -> 0.985) for ~50% faster spin

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

    // Direct win if only 1 person
    if (wheelItems.length === 1) {
      onWheelEnd();
      return;
    }

    wheelVelocity = 0.3 + Math.random() * 0.2;
    wheelSpinning = true;
    if (window.ZToolsFolk) activeWheelSound = window.ZToolsFolk.sounds.play('wheel');
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
      if (activeWheelSound) {
        activeWheelSound.pause();
        activeWheelSound.currentTime = 0;
        activeWheelSound = null;
      }
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
    goToDicePhase();
  };

  const goToDicePhase = async () => {
    phaseForm.classList.add('fade-out');
    await new Promise(r => setTimeout(r, 400));
    phaseForm.classList.add('hidden');

    const greetingTemplate = FUNNY_GREETINGS[Math.floor(Math.random() * FUNNY_GREETINGS.length)];
    const fullGreeting = greetingTemplate.replace('{name}', state.playerName);
    diceGreeting.innerHTML = fullGreeting + " 🎲";

    // --- TTS: Speak Greeting ---
    speakVietnamese(fullGreeting);

    diceResultArea.classList.add('hidden');
    diceResultArea.classList.remove('show');
    phaseDice.classList.remove('hidden');

    // 3D Dice Roll preparation
    const diceCube = document.getElementById('dice-cube');
    state.totalTurns = Math.floor(Math.random() * 4) + 3; // Min 3, max 6
    // Pre-calculate rotation (will be applied on click)
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
    if (window.ZToolsFolk) activeDiceSound = window.ZToolsFolk.sounds.play('xucxac');

    await new Promise(r => setTimeout(r, 2000));
    if (activeDiceSound) {
      activeDiceSound.pause();
      activeDiceSound.currentTime = 0;
      activeDiceSound = null;
    }
    rollValue.innerText = state.totalTurns;
    rollText.innerText = 'lượt đập heo!';
    diceResultArea.classList.remove('hidden');
    requestAnimationFrame(() => diceResultArea.classList.add('show'));

    // --- TTS: Speak Dice Result (50% chance) ---
    if (Math.random() > 0.5) {
      const template = DICE_TTS_TEMPLATES[Math.floor(Math.random() * DICE_TTS_TEMPLATES.length)];
      const turnText = template.replace('{turns}', state.totalTurns);
      speakVietnamese(turnText, { delay: 500 });
    }

    state.turnsRemaining = state.totalTurns;
    state.currentEarnings = 0;
    state.prizes = [];
    state.hasX2 = false;
    state.hasTop2 = false;
    state.hasPlus25 = false;
    state.hasPlus50 = false;
    state.history = [];
    state.isGameOver = false;
  };

  const handleDirectPlay = () => {
    const name = directInput.value.trim();
    if (!name) {
      alert('Vui lòng nhập tên người chơi!');
      return;
    }
    state.playerName = name;

    // Attempt to remove from list if exists
    const nameLower = name.toLowerCase();
    const currentLines = wheelNamesInput.value.split('\n');
    const filteredLines = currentLines.filter(line => {
      const trimmedLine = line.trim();
      return trimmedLine !== '' && trimmedLine.toLowerCase() !== nameLower;
    });

    // Update list if changed
    if (filteredLines.length !== currentLines.length) {
      wheelNamesInput.value = filteredLines.join('\n');
      localStorage.setItem('DAP_HEO_WHEEL_NAMES', wheelNamesInput.value);
      updateWheelItems();
    }

    goToDicePhase();
  };

  // Init wheel on textarea change
  if (wheelNamesInput) {
    wheelNamesInput.addEventListener('input', () => {
      updateWheelItems();
      localStorage.setItem('DAP_HEO_WHEEL_NAMES', wheelNamesInput.value);
    });
    // Load saved names
    const savedNames = localStorage.getItem('DAP_HEO_WHEEL_NAMES');
    if (savedNames) wheelNamesInput.value = savedNames;
    updateWheelItems();
  }

  if (btnSpinWheel) btnSpinWheel.addEventListener('click', spinWheel);
  if (btnDirectPlay) btnDirectPlay.addEventListener('click', handleDirectPlay);

  // --- Functions ---
  // [REMOVED DUPLICATE showScreen HERE - moved to global scope or consolidated]
  // Keeping this block empty or removing it to avoid conflict with the new definition below/above


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

    // Distribution — x2/top2 are EMBEDDED into bronze/common pigs, not separate
    const distribution = [];
    for (let i = 0; i < config.diamondCount; i++) distribution.push({ tier: 'diamond', special: null });
    for (let i = 0; i < config.goldCount; i++) distribution.push({ tier: 'gold', special: null });
    for (let i = 0; i < config.silverCount; i++) distribution.push({ tier: 'silver', special: null });
    for (let i = 0; i < config.bronzeCount; i++) distribution.push({ tier: 'bronze', special: null });
    for (let i = 0; i < config.commonCount; i++) distribution.push({ tier: 'common', special: null });

    while (distribution.length < 100) distribution.push({ tier: 'empty', special: null });

    // Tag random bronze/common pigs with x2/top2 specials
    const taggable = distribution.filter(d => (d.tier === 'bronze' || d.tier === 'common') && !d.special);
    // Shuffle taggable pool
    for (let i = taggable.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [taggable[i], taggable[j]] = [taggable[j], taggable[i]];
    }
    let tagIdx = 0;
    for (let i = 0; i < (config.x2Count || 0) && tagIdx < taggable.length; i++, tagIdx++) {
      taggable[tagIdx].special = 'x2';
    }
    for (let i = 0; i < (config.top2Count || 0) && tagIdx < taggable.length; i++, tagIdx++) {
      taggable[tagIdx].special = 'top2';
    }
    for (let i = 0; i < (config.plus25Count || 0) && tagIdx < taggable.length; i++, tagIdx++) {
      taggable[tagIdx].special = 'plus25';
    }
    for (let i = 0; i < (config.plus50Count || 0) && tagIdx < taggable.length; i++, tagIdx++) {
      taggable[tagIdx].special = 'plus50';
    }

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

      // Hover sound
      el.addEventListener('mouseenter', () => {
        if (!el.classList.contains('processing') && window.ZToolsFolk) {
          window.ZToolsFolk.sounds.play('hover');
        }
      });

      grid.appendChild(el);
    });

    // Initial Guardian: protect max cap from the start (min only runs during gameplay)
    enforceMaxPrize();
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
      // Play theme sound + funny bonk
      window.ZToolsFolk.sounds.play(currentTheme.sound);
      setTimeout(() => {
        const crackSound = window.ZToolsFolk.sounds.play('crack', 0.25);
        if (crackSound) {
          setTimeout(() => {
            crackSound.pause();
            crackSound.currentTime = 0;
          }, 500);
        }
      }, 100);
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
      const pigs = currentTheme.pigs || {};
      let safeTier = tier;
      if (!pigs[tier]) safeTier = 'common';

      const safeAssetObj = pigs[safeTier][Math.floor(Math.random() * pigs[safeTier].length)];
      brokenAsset = safeAssetObj.broken;

      label = `${currentTheme.labelSuffix} ${(PIG_TIERS[tier] || PIG_TIERS.common).label}`;
      if (tier === 'diamond') tierColor = '#00F2FF';
      if (tier === 'gold') tierColor = '#FFD700';
      if (tier === 'silver') tierColor = '#bdc3c7';
      if (tier === 'bronze') tierColor = '#cd6133';
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
      const prizeOptions = TIER_PRIZES[tier] || TIER_PRIZES.common;
      prizeValue = prizeOptions[Math.floor(Math.random() * prizeOptions.length)];

      if (special === 'x2') {
        state.hasX2 = true;
        revealLabel += ' x2';
        barX2.classList.add('active');
      } else if (special === 'top2') {
        state.hasTop2 = true;
        revealLabel += ' TOP1';
        barTop2.classList.add('active');
      } else if (special === 'plus25') {
        state.hasPlus25 = true;
        revealLabel += ' +25%';
        if (barPlus25) barPlus25.classList.add('active');
      } else if (special === 'plus50') {
        state.hasPlus50 = true;
        revealLabel += ' +50%';
        if (barPlus50) barPlus50.classList.add('active');
      }

      state.prizes.push(prizeValue);
      state.currentEarnings += prizeValue;
      state.history.push({ tier, amount: prizeValue, special });
    } else {
      state.history.push({ tier: 'empty', amount: 0 });
    }

    state.turnsRemaining--;
    remainingTurnsEl.innerText = state.turnsRemaining;

    // Update display to show CURRENT prize (Last Value)
    currentMaxEl.innerText = prizeValue.toLocaleString();
    if (prizeValue === 0) currentMaxEl.innerText = "0 (Rỗng)";

    // Update Timeline (simple text: 10k x2 → 50k → 100k)
    if (historyList) {
      const placeholder = historyList.querySelector('.history-placeholder');
      if (placeholder) placeholder.remove();

      // Add arrow if not first
      if (historyList.querySelector('.tl-item')) {
        const arrow = document.createElement('span');
        arrow.className = 'tl-arrow';
        arrow.textContent = '→';
        historyList.appendChild(arrow);
      }

      const valText = prizeValue > 0 ? (prizeValue / 1000) + 'k' : '0đ';
      const span = document.createElement('span');
      span.className = `tl-item tier-${tier}`;

      let specialTag = '';
      if (special === 'x2') specialTag = '<span class="tl-special sp-x2">x2</span>';
      else if (special === 'top2') specialTag = '<span class="tl-special sp-top2">TOP1</span>';
      else if (special === 'plus25') specialTag = '<span class="tl-special sp-plus25">+25%</span>';
      else if (special === 'plus50') specialTag = '<span class="tl-special sp-plus50">+50%</span>';

      span.innerHTML = valText + specialTag;
      historyList.appendChild(span);

      // Auto-scroll to newest
      const timeline = document.getElementById('history-timeline');
      if (timeline) timeline.scrollLeft = timeline.scrollWidth;
    }

    showRevealScreen(revealLabel, prizeValue, special, brokenAsset);

    // Guardian Shuffle: protect remaining pigs after each turn
    enforceMaxPrize();
    enforceMinPrize();

    if (state.turnsRemaining <= 0) {
      setTimeout(() => {
        showSummary();
      }, 1500);
    }

    // Reaction sounds
    if (window.ZToolsFolk) {
      if (tier === 'empty') {
        window.ZToolsFolk.sounds.play('disappoint');
      } else if (tier === 'gold' || tier === 'diamond' || special) {
        window.ZToolsFolk.sounds.play('success');
      }
    }

    // --- TTS: Speak the wish (Cleaned) ---
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Even more robust emoji removal: handles more categories and combinations
      const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F02B}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F18E}]|[\u{1F191}-\u{1F19A}]|[\u{1F170}-\u{1F171}]|[\u{1F17E}-\u{1F17F}]|[\u{1F18E}]|[\u{3030}]|[\u{2B50}]|[\u{2B55}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{3297}]|[\u{3299}]|[\u{303D}]|[\u{00A9}]|[\u{00AE}]|[\u{2122}]|[\u{23E9}-\u{23EF}]|[\u{23F0}]|[\u{23F3}]/gu;
      const cleanLabel = revealLabel.replace(emojiRegex, '').trim();
      const cleanWish = revealWish.innerText.replace(emojiRegex, '').trim();

      // Format prize for reading (e.g. 50000 -> 50 nghìn)
      let prizeSpeech = '';
      if (prizeValue > 0) {
        if (prizeValue >= 1000) {
          const thousands = Math.floor(prizeValue / 1000);
          prizeSpeech = ` ${thousands} nghìn đồng`;
        } else {
          prizeSpeech = ` ${prizeValue} đồng`;
        }
      }

      speakVietnamese(cleanLabel + prizeSpeech + ". " + cleanWish);
    }
  };

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
      if (window.ZToolsFolk) window.ZToolsFolk.sounds.play('laugh');
    } else if (special === 'x2') {
      revealWish.innerText = 'Siêu năng lực! Kết quả cuối cùng sẽ được x2! 🔥';
      if (window.ZToolsFolk) window.ZToolsFolk.sounds.play('cheer');
    } else if (special === 'top2') {
      revealWish.innerText = 'Quá đỉnh! Kết quả = giá trị CAO NHẤT bạn đập được! 💎';
      if (window.ZToolsFolk) window.ZToolsFolk.sounds.play('cheer');
    } else {
      const randomChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
      revealWish.innerHTML = '<strong>🔥 THỬ THÁCH:</strong> ' + randomChallenge;
      if (window.ZToolsFolk) window.ZToolsFolk.sounds.play('pop');
    }

    // Reveal buttons update
    if (state.turnsRemaining <= 0) {
      btnContinue.classList.add('hidden');
      btnStop.innerText = '💰 XEM TỔNG KẾT';
    } else {
      btnContinue.classList.remove('hidden');
      btnStop.innerText = '💰 DỪNG LẠI';
    }

    showScreen('reveal');
  };

  const computeFinalResult = () => {
    if (state.prizes.length === 0) return 0;

    let result = 0;

    // Rule: TOP1 = max single prize, beats all multipliers
    // Otherwise: last prize × multipliers (+25%, +50%, x2 stack)
    if (state.hasTop2) {
      result = Math.max(...state.prizes, 0);
    } else {
      result = state.prizes[state.prizes.length - 1]; // Last Value
      if (state.hasX2) result *= 2;
      if (state.hasPlus50) result *= 1.5;
      if (state.hasPlus25) result *= 1.25;
    }

    return result;
  };

  // --- Guardian Shuffle: Enforce Max Prize Cap ---
  // After each turn, silently downgrade dangerous pigs to empty
  // Uses same logic as computeFinalResult: Top1 = max single, Top1 beats X2
  const enforceMaxPrize = () => {
    const maxPrize = config.maxPrize;
    if (!maxPrize || maxPrize <= 0) return;

    const items = grid.querySelectorAll('.heo-item:not(.processing)');
    if (!items.length) return;

    // Helper: simulate final result if player gets this prize
    const simulateResult = (pigPrize, willHaveTop1, willHaveX2, willHavePlus25, willHavePlus50) => {
      if (willHaveTop1) {
        return Math.max(...state.prizes, pigPrize, 0);
      } else {
        let result = pigPrize;
        if (willHaveX2) result *= 2;
        if (willHavePlus50) result *= 1.5;
        if (willHavePlus25) result *= 1.25;
        return result;
      }
    };

    const dangerousPigs = [];

    items.forEach(el => {
      const tier = el.dataset.tier;
      if (tier === 'empty') return;

      const prizeOptions = TIER_PRIZES[tier] || TIER_PRIZES.common;
      const maxPossiblePrize = Math.max(...prizeOptions);
      const special = el.dataset.special;

      // Determine worst-case flags after clicking this pig
      const willHaveTop1 = state.hasTop2 || special === 'top2';
      const willHaveX2 = state.hasX2 || special === 'x2';
      const willHavePlus25 = state.hasPlus25 || special === 'plus25';
      const willHavePlus50 = state.hasPlus50 || special === 'plus50';

      const simulatedResult = simulateResult(maxPossiblePrize, willHaveTop1, willHaveX2, willHavePlus25, willHavePlus50);

      if (simulatedResult > maxPrize) {
        dangerousPigs.push(el);
      }
    });

    // Downgrade dangerous pigs to highest SAFE tier (not empty!)
    // Tier ladder from high to low — pick the best that fits under maxPrize
    const safeTierLadder = ['silver', 'bronze', 'common'];

    dangerousPigs.forEach(el => {
      const special = el.dataset.special;
      const willHaveTop1 = state.hasTop2 || special === 'top2';
      const willHaveX2 = state.hasX2 || special === 'x2';

      let safeTier = 'empty'; // fallback only if nothing fits
      for (const candidate of safeTierLadder) {
        const candidateMax = Math.max(...(TIER_PRIZES[candidate] || [0]));
        if (simulateResult(candidateMax, willHaveTop1, willHaveX2) <= maxPrize) {
          safeTier = candidate;
          break;
        }
      }

      el.dataset.tier = safeTier;
      if (safeTier === 'empty') delete el.dataset.special;
    });

    if (dangerousPigs.length > 0) {
      console.log(`🛡️ Guardian: Downgraded ${dangerousPigs.length} pig(s) to fit max prize cap of ${maxPrize.toLocaleString()}đ`);
    }
  };

  // --- Guardian Boost: Enforce Min Prize Guarantee ---
  // On the LAST turn only, promote a FEW random weak pigs (not all!)
  // Uses same logic as computeFinalResult: Top1 = max single, Top1 beats X2
  const enforceMinPrize = () => {
    const minPrize = config.minPrize;
    if (!minPrize || minPrize <= 0) return;
    if (state.turnsRemaining > 1) return; // Only on the LAST turn

    const items = [...grid.querySelectorAll('.heo-item:not(.processing)')];
    if (!items.length) return;

    // Determine what value a pig needs to meet minPrize
    let requiredValue;
    if (state.hasTop2) {
      const currentMax = state.prizes.length > 0 ? Math.max(...state.prizes) : 0;
      if (currentMax >= minPrize) return;
      requiredValue = minPrize;
    } else {
      let mult = 1;
      if (state.hasX2) mult *= 2;
      if (state.hasPlus50) mult *= 1.5;
      if (state.hasPlus25) mult *= 1.25;
      requiredValue = Math.ceil(minPrize / mult);
    }

    const tierLadder = [
      { tier: 'common', value: 10000 },
      { tier: 'bronze', value: 50000 },
      { tier: 'silver', value: 100000 },
      { tier: 'gold', value: 200000 },
      { tier: 'diamond', value: 500000 }
    ];

    let targetTier = 'diamond'; // fallback
    for (const t of tierLadder) {
      if (t.value >= requiredValue) {
        targetTier = t.tier;
        break;
      }
    }

    // Collect weak pigs (would give result < minPrize)
    const weakPigs = items.filter(el => {
      const tier = el.dataset.tier;
      const prizeOptions = TIER_PRIZES[tier] || [0];
      const pigValue = tier === 'empty' ? 0 : Math.min(...prizeOptions);

      let simResult;
      if (state.hasTop2) {
        simResult = Math.max(...state.prizes, pigValue, 0);
      } else {
        simResult = pigValue;
        if (state.hasX2) simResult *= 2;
        if (state.hasPlus50) simResult *= 1.5;
        if (state.hasPlus25) simResult *= 1.25;
      }
      return simResult < minPrize;
    });

    if (weakPigs.length === 0) return;

    // Promote only a SMALL random subset — not all!
    const maxPromotions = Math.max(1, Math.min(5, Math.ceil(items.length * 0.3)));

    // Shuffle weak pigs randomly
    for (let i = weakPigs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [weakPigs[i], weakPigs[j]] = [weakPigs[j], weakPigs[i]];
    }

    // Promote only the first N
    const toPromote = weakPigs.slice(0, maxPromotions);
    toPromote.forEach(el => {
      el.dataset.tier = targetTier;
    });

    console.log(`🎯 Guardian Boost: Promoted ${toPromote.length}/${items.length} pig(s) to ${targetTier} for min prize ${minPrize.toLocaleString()}đ`);
  };

  const showSummary = () => {
    const finalResult = computeFinalResult();
    const summaryPath = document.getElementById('summary-path');
    const summaryRegret = document.getElementById('summary-regret');

    summaryTotal.innerText = finalResult.toLocaleString();
    summaryPlayerName.innerText = `KẾT QUẢ CỦA ${state.playerName.toUpperCase()}`;

    // Prize Path
    if (summaryPath) {
      const pathStr = state.history.map(h => {
        if (h.tier === 'empty') return '💨';
        const kValue = Math.floor(h.amount / 1000);
        let icon = '';
        if (h.amount >= 500000) icon = '💎';
        else if (h.amount >= 200000) icon = '🥇';

        return `[${icon}${kValue}k]`;
      }).join(' ➔ ');
      summaryPath.innerHTML = pathStr;
    }

    // Regret Logic — show what player could have won with their active flags
    if (summaryRegret) {
      let maxPotential = Math.max(...state.prizes, 0);

      // Apply multipliers to show the REAL potential value
      if (!state.hasTop2) {
        if (state.hasX2) maxPotential *= 2;
        if (state.hasPlus50) maxPotential *= 1.5;
        if (state.hasPlus25) maxPotential *= 1.25;
      }

      if (maxPotential > finalResult) {
        const diff = maxPotential - finalResult;
        summaryRegret.innerText = `😱 Tiếc quá! Đáng lẽ bạn được ${maxPotential.toLocaleString()}đ (Mất ${diff.toLocaleString()}đ)`;
      } else {
        summaryRegret.innerText = "😎 Bạn là thiên tài đập heo!";
      }
    }

    let badge = 'TAY ĐẬP LỤA';
    if (finalResult >= 800000) badge = 'ĐẠI GIA LÌ XÌ';
    else if (finalResult >= 300000) badge = 'TAY ĐẬP VÀNG';
    else if (finalResult === 0) badge = 'CHÚC BẠN MAY MẮN LẦN SAU';

    summaryBadge.innerText = badge;

    // Remove game-active from container
    document.querySelector('.heo-game-container').classList.remove('game-active');

    // Render chart
    renderSummaryChart();

    // 🔊 Text-to-Speech announcement
    const resultText = finalResult.toLocaleString('vi-VN');
    const regretText = summaryRegret ? summaryRegret.innerText : '';
    const speech = `Kết quả của ${state.playerName}! ${resultText} đồng! Huy hiệu: ${badge}. ${regretText}`;
    speakVietnamese(speech, { rate: 1.05, pitch: 1.1, delay: 800 });

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
      { key: 'special', label: '⚡ Đặc biệt', color: '#e74c3c', count: 0 }
    ];

    state.history.forEach(h => {
      if (h.special) { cats[2].count++; cats[0].count++; }
      else if (h.tier === 'empty') cats[1].count++;
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
    if (barPlus25) barPlus25.classList.remove('active');
    if (barPlus50) barPlus50.classList.remove('active');
    document.querySelector('.heo-game-container').classList.add('game-active');
    // Enter fullscreen
    document.body.classList.add('heo-fullscreen');
    // Only spawn grid if not yet spawned
    if (!state.gridSpawned) {
      spawnGrid();
      state.gridSpawned = true;
    }
    // Clear history sidebar
    if (historyList) {
      historyList.innerHTML = '<div class="history-placeholder">Chưa đập heo nào...</div>';
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

  // Initialize core with expanded funny sound set
  if (window.ZToolsFolk && window.ZToolsFolk.sounds) {
    const soundFiles = ['crack', 'jackpot', 'bonk', 'laugh', 'cheer', 'pop', 'hover', 'disappoint', 'success', 'wheel', 'xucxac'];
    window.ZToolsFolk.sounds.init(soundFiles);

    // Debug: Check if sounds are actually accessible
    console.log('🎵 Audio system initialized. If sounds do not play, please check if files exist in /assets/audio/folk-games/');
  }

  // --- Admin Logic ---
  // --- Admin Logic (Dashboard 2.0) ---
  const updateAdminUI = () => {
    if (cfgBudgetInput) cfgBudgetInput.value = config.budget;
    if (cfgMaxPrize) cfgMaxPrize.value = config.maxPrize || 0;
    if (cfgMinPrize) cfgMinPrize.value = config.minPrize || 0;
    if (cfgThemeInput) cfgThemeInput.value = config.theme;

    if (rangeDiamond) rangeDiamond.value = config.diamondCount;
    if (valDiamond) valDiamond.innerText = config.diamondCount;

    if (rangeGold) rangeGold.value = config.goldCount;
    if (valGold) valGold.innerText = config.goldCount;

    if (rangeSilver) rangeSilver.value = config.silverCount || 0;
    if (valSilver) valSilver.innerText = config.silverCount || 0;

    if (rangeBronze) rangeBronze.value = config.bronzeCount || 0;
    if (valBronze) valBronze.innerText = config.bronzeCount || 0;

    if (cfgCommonCount) cfgCommonCount.value = config.commonCount;
    if (valCommon) valCommon.innerText = config.commonCount;

    if (valEmpty) valEmpty.innerText = config.emptyCount;

    if (cfgX2Count) cfgX2Count.value = config.x2Count;
    if (cfgTop2Count) cfgTop2Count.value = config.top2Count;
    if (cfgPlus25Count) cfgPlus25Count.value = config.plus25Count || 0;
    if (cfgPlus50Count) cfgPlus50Count.value = config.plus50Count || 0;

    recalculateStats();
  };

  const recalculateStats = () => {
    // 1. Get current values
    const budget = cfgBudgetInput ? (parseInt(cfgBudgetInput.value) || 0) : config.budget;
    const dCount = rangeDiamond ? (parseInt(rangeDiamond.value) || 0) : config.diamondCount;
    const gCount = rangeGold ? (parseInt(rangeGold.value) || 0) : config.goldCount;
    const sCount = rangeSilver ? (parseInt(rangeSilver.value) || 0) : (config.silverCount || 0);
    const bCount = rangeBronze ? (parseInt(rangeBronze.value) || 0) : (config.bronzeCount || 0);
    const commonCount = cfgCommonCount ? (parseInt(cfgCommonCount.value) || 0) : config.commonCount;
    const x2Count = cfgX2Count ? (parseInt(cfgX2Count.value) || 0) : config.x2Count;
    const top2Count = cfgTop2Count ? (parseInt(cfgTop2Count.value) || 0) : config.top2Count;
    const plus25Count = cfgPlus25Count ? (parseInt(cfgPlus25Count.value) || 0) : (config.plus25Count || 0);
    const plus50Count = cfgPlus50Count ? (parseInt(cfgPlus50Count.value) || 0) : (config.plus50Count || 0);

    // 2. Calculate Empty Slots (Auto-balance to 100)
    // x2/top2 are embedded in bronze/common, not separate slots
    const filledSlots = dCount + gCount + sCount + bCount + commonCount;
    let emptyCount = 100 - filledSlots;
    if (emptyCount < 0) emptyCount = 0;

    if (valDiamond) valDiamond.innerText = dCount;
    if (valGold) valGold.innerText = gCount;
    if (valSilver) valSilver.innerText = sCount;
    if (valBronze) valBronze.innerText = bCount;
    if (valCommon) valCommon.innerText = commonCount;
    if (valEmpty) valEmpty.innerText = emptyCount;

    // 3. Calculate Budget Usage
    // Costs: Diamond=500k, Gold=200k, Silver=100k, Bronze=50k, Common=~27k
    const cost = (dCount * 500000) + (gCount * 200000) + (sCount * 100000) + (bCount * 50000) + (commonCount * COMMON_AVG);
    const percent = Math.min((cost / budget) * 100, 100);

    if (adminBudgetDisplay) adminBudgetDisplay.innerText = `${cost.toLocaleString()}đ / ${budget.toLocaleString()}đ`;
    if (adminBudgetProgress) {
      adminBudgetProgress.style.width = `${percent}%`;
      adminBudgetProgress.style.background = percent > 100 ? '#e74c3c' : (percent > 90 ? '#f1c40f' : 'linear-gradient(90deg, #00b894, #00cec9)');
    }

    // 4. Stats
    if (statTotalSlots) statTotalSlots.innerText = 100;
    const winRate = ((100 - emptyCount) / 100) * 100;
    if (statWinRate) statWinRate.innerText = `${winRate}%`;

    // Return calculated config for saving
    const maxPrize = cfgMaxPrize ? (parseInt(cfgMaxPrize.value) || 0) : (config.maxPrize || 0);
    const minPrize = cfgMinPrize ? (parseInt(cfgMinPrize.value) || 0) : (config.minPrize || 0);

    return {
      budget,
      maxPrize,
      minPrize,
      theme: cfgThemeInput ? cfgThemeInput.value : config.theme,
      diamondCount: dCount,
      goldCount: gCount,
      silverCount: sCount,
      bronzeCount: bCount,
      commonCount: commonCount,
      emptyCount: emptyCount,
      x2Count: x2Count,
      top2Count: top2Count,
      plus25Count: plus25Count,
      plus50Count: plus50Count
    };
  };

  // Event Listeners for Real-time updates
  [cfgBudgetInput, cfgMaxPrize, cfgMinPrize, rangeDiamond, rangeGold, rangeSilver, rangeBronze, cfgCommonCount, cfgX2Count, cfgTop2Count, cfgPlus25Count, cfgPlus50Count].forEach(el => {
    if (el) el.addEventListener('input', recalculateStats);
  });
  if (cfgThemeInput) cfgThemeInput.addEventListener('change', recalculateStats);

  const PRESETS = {
    low: { budget: 500000, diamond: 0, gold: 1, silver: 3, empty: 60, x2: 1, top2: 0 },
    balanced: { budget: 2000000, diamond: 1, gold: 3, silver: 5, empty: 17, x2: 2, top2: 1 },
    rich: { budget: 10000000, diamond: 5, gold: 10, silver: 15, empty: 5, x2: 5, top2: 2 }
  };

  btnPresets.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = PRESETS[btn.dataset.preset];
      if (p) {
        if (cfgBudgetInput) cfgBudgetInput.value = p.budget;
        if (rangeDiamond) rangeDiamond.value = p.diamond;
        if (rangeGold) rangeGold.value = p.gold;
        if (rangeSilver) rangeSilver.value = p.silver;

        if (cfgCommonCount) {
          // New logic: Common is manual, Empty is auto.
          // Presets define 'empty', so we calculate what 'common' should be to match that.
          const targetCommon = 100 - (p.diamond + p.gold + p.silver + p.empty + p.x2 + p.top2);
          cfgCommonCount.value = Math.max(0, targetCommon);
        }

        if (cfgX2Count) cfgX2Count.value = p.x2;
        if (cfgTop2Count) cfgTop2Count.value = p.top2;
        recalculateStats();
      }
    });
  });

  if (btnSaveAdmin) {
    btnSaveAdmin.addEventListener('click', () => {
      const newConfig = recalculateStats(); // Get latest
      config = newConfig;
      localStorage.setItem('DAP_HEO_CONFIG', JSON.stringify(config));

      const applyAndClose = () => {
        adminModal.classList.add('hidden');
        setScrollLock(false);
        // Re-spawn grid with new config (no page reload!)
        if (state.gridSpawned) {
          spawnGrid();
        }
        // Show inline admin tools in game screen
        const gameAdminToolsInline = document.getElementById('game-admin-tools-inline');
        if (gameAdminToolsInline) gameAdminToolsInline.classList.remove('hidden');
        if (adminGameTools) adminGameTools.classList.remove('hidden');
      };

      // Save to Supabase
      if (supabase) {
        btnSaveAdmin.innerHTML = 'Đang lưu... ⏳';
        supabase.from('game_configs').upsert({ id: 'dap-heo-main', content: config })
          .then(({ error }) => {
            if (error) {
              alert('❌ Lỗi lưu lên mây: ' + error.message);
            } else {
              alert('✅ Đã lưu cấu hình lên Mây & Local!');
              applyAndClose();
            }
          })
          .finally(() => {
            btnSaveAdmin.innerHTML = 'LƯU CẤU HÌNH LIỀN TAY 💾';
          });
      } else {
        alert('✅ Đã lưu cấu hình (Local)!');
        applyAndClose();
      }
    });
  }

  // --- Secret Trigger (Triple Click) ---
  if (diceGreeting) {
    let clickCount = 0;
    diceGreeting.addEventListener('click', () => {
      clickCount++;
      if (clickCount === 3) {
        updateAdminUI(); // Load data to UI
        adminModal.classList.remove('hidden');
        clickCount = 0;
      }
      setTimeout(() => clickCount = 0, 1000); // Reset if too slow
    });
  }

  // --- Secret Admin Trigger (double-click on 🐷 + password) ---
  if (secretTrigger) {
    secretTrigger.addEventListener('dblclick', () => {
      const pwd = prompt('🔒 Nhập mật khẩu Admin:');
      if (!pwd) return;

      const date = new Date();
      const HH = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      const DD = String(date.getDate()).padStart(2, '0');
      const MM = String(date.getMonth() + 1).padStart(2, '0');
      const expectedCode = `${HH}${mm}${DD}${MM}`;

      console.log('🔑 Admin Code:', expectedCode);


      if (pwd === expectedCode || pwd === 'BINHNGO') {
        isAdmin = true;
        updateAdminUI();
        adminModal.classList.remove('hidden');
        adminGameTools.classList.remove('hidden');
        setScrollLock(true);
      } else {
        alert('Sai mật khẩu rồi đại ca ơi! 🐷');
      }
    });
  }

  // --- Backup Trigger in Game Screen (Triple Click on Remaining Turns) ---
  if (remainingTurnsEl) {
    let clickCount = 0;
    remainingTurnsEl.parentElement.addEventListener('click', () => { // Click on the badge container
      clickCount++;
      if (clickCount >= 5) { // 5 clicks to be safe
        const pwd = prompt('🔒 Admin Password (Game Screen):');
        const date = new Date();
        const HH = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        const DD = String(date.getDate()).padStart(2, '0');
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        const expectedCode = `${HH}${mm}${DD}${MM}`;

        if (pwd === expectedCode || pwd === 'admin') {
          isAdmin = true;
          updateAdminUI();
          adminModal.classList.remove('hidden');
          adminGameTools.classList.remove('hidden');
        } else {
          alert('Wrong pass!');
        }
        clickCount = 0;
      }
      setTimeout(() => clickCount = 0, 1000);
    });
  }

  if (btnCloseAdmin) btnCloseAdmin.addEventListener('click', () => {
    adminModal.classList.add('hidden');
    setScrollLock(false);
  });
  if (btnResetAdmin) btnResetAdmin.addEventListener('click', () => {
    if (confirm('Reset về mặc định?')) {
      localStorage.removeItem('DAP_HEO_CONFIG');
      location.reload();
    }
  });

  // Global debug
  window.openAdmin = () => {
    updateAdminUI();
    adminModal.classList.remove('hidden');
  };



  // --- Admin Game Tools ---
  // Helper to wire both original and game-screen duplicate buttons
  const setupAdminToolBtn = (btn, action) => { if (btn) btn.addEventListener('click', action); };

  const revealAction = () => {
    const items = grid.querySelectorAll('.heo-item');
    const isRevealing = btnRevealPositions && btnRevealPositions.dataset.active === 'true';

    if (isRevealing) {
      items.forEach(item => {
        item.classList.remove('reveal-empty', 'reveal-active', 'reveal-vip');
        const oldRibbon = item.querySelector('.heo-ribbon');
        if (oldRibbon) oldRibbon.remove();
      });
      if (btnRevealPositions) { btnRevealPositions.dataset.active = 'false'; btnRevealPositions.innerHTML = '👁️ Tiết lộ vị trí'; }
    } else {
      items.forEach(item => {
        if (item.classList.contains('processing')) return;
        const tier = item.dataset.tier;
        const special = item.dataset.special;

        item.classList.add('reveal-active');

        if (tier === 'empty') {
          item.classList.add('reveal-empty');
        } else {
          item.classList.add('reveal-vip');
          let label = '';
          let type = '';

          if (tier === 'diamond') { label = '💎 DIA'; type = 'diamond'; }
          else if (tier === 'gold') { label = '💰 GOLD'; type = 'gold'; }
          else if (tier === 'silver') { label = '🥈 SIL'; type = 'silver'; }
          else if (tier === 'bronze') { label = '🥉 BRZ'; type = 'common'; }
          else if (special === 'x2') { label = '⚡ X2'; type = 'x2'; }
          else if (special === 'top2') { label = '🏆 T1'; type = 'top2'; }
          else if (special === 'plus25') { label = '📈 +25%'; type = 'plus25'; }
          else if (special === 'plus50') { label = '🚀 +50%'; type = 'plus50'; }
          else if (tier === 'common') { label = '🎁 CMN'; type = 'common'; }

          if (label) {
            const ribbon = document.createElement('div');
            ribbon.className = `heo-ribbon ribbon-${type}`;
            ribbon.innerText = label;
            item.appendChild(ribbon);
          }
        }
      });
      if (btnRevealPositions) { btnRevealPositions.dataset.active = 'true'; btnRevealPositions.innerHTML = '🙈 Ẩn vị trí'; }
    }
  };

  const reshuffleAction = () => {
    if (confirm('Đảo lại vị trí tất cả heo chưa đập?')) {
      spawnGrid();
      state.gridSpawned = true;
      if (btnRevealPositions && btnRevealPositions.dataset.active === 'true') {
        btnRevealPositions.dataset.active = 'false';
        btnRevealPositions.click();
      }
    }
  };

  const resetGridAction = () => {
    if (confirm('Reset toàn bộ grid? Tất cả heo sẽ được tạo lại.')) {
      spawnGrid();
      state.gridSpawned = true;
      if (btnRevealPositions && btnRevealPositions.dataset.active === 'true') {
        btnRevealPositions.dataset.active = 'false';
        btnRevealPositions.click();
      }
    }
  };

  // Original buttons
  setupAdminToolBtn(btnRevealPositions, revealAction);
  setupAdminToolBtn(btnReshuffle, reshuffleAction);
  setupAdminToolBtn(btnResetGrid, resetGridAction);

  // Game-screen duplicate buttons
  setupAdminToolBtn(document.getElementById('btn-reveal-positions-2'), revealAction);
  setupAdminToolBtn(document.getElementById('btn-reshuffle-2'), reshuffleAction);
  setupAdminToolBtn(document.getElementById('btn-reset-grid-2'), resetGridAction);

  // Floating pig trigger in game screen
  const gamePigTrigger = document.getElementById('game-pig-trigger');
  const gameAdminToolsInline = document.getElementById('game-admin-tools-inline');
  if (gamePigTrigger) {
    gamePigTrigger.addEventListener('dblclick', () => {
      const pwd = prompt('🔒 Nhập mật khẩu Admin:');
      if (!pwd) return;

      const date = new Date();
      const HH = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      const DD = String(date.getDate()).padStart(2, '0');
      const MM = String(date.getMonth() + 1).padStart(2, '0');
      const expectedCode = `${HH}${mm}${DD}${MM}`;

      if (pwd === expectedCode || pwd === 'BINHNGO') {
        isAdmin = true;
        updateAdminUI();
        adminModal.classList.remove('hidden');
        if (gameAdminToolsInline) gameAdminToolsInline.classList.remove('hidden');
        if (adminGameTools) adminGameTools.classList.remove('hidden');
        setScrollLock(true);
      } else {
        alert('Sai mật khẩu rồi đại ca ơi! 🐷');
      }
    });
  }

  // Fullscreen toggle button - REMOVED per request
  if (btnToggleFullscreen) {
    btnToggleFullscreen.style.display = 'none';
  }

  if (btnExitFullscreen) {
    btnExitFullscreen.style.display = 'none';
  }

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
    }
  });

  // Add click smash effect
  grid.addEventListener('mousedown', () => {
    hammerCursor.classList.remove('smashing');
    void hammerCursor.offsetWidth; // trigger reflow
    hammerCursor.classList.add('smashing');
  });

  grid.addEventListener('mouseup', () => {
    // Optional: Logic if needed on mouse up
  });

  hammerCursor.addEventListener('animationend', () => {
    hammerCursor.classList.remove('smashing');
  });

  showScreen('setup');
});
