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
  const turnOptions = document.querySelectorAll('.turn-option');
  const btnStart = document.getElementById('btn-start-game');
  const btnContinue = document.getElementById('btn-continue');
  const btnPlayAgain = document.getElementById('btn-play-again');

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

  // --- Constants & Data ---
  const ASSET_PATH = '/assets/images/dap-heo/';
  const COVER_ASSET = ASSET_PATH + 'heo_dat_nung.png';
  const COVER_CRACK_ASSET = ASSET_PATH + 'heo_dat_nung_crack.png';

  const PIG_TIERS = {
    common: {
      assets: [
        { base: 'heo_thuong_pink.png', broken: 'heo_thuong_pink_broken.png' },
        { base: 'heo_thuong_blue.png', broken: 'heo_thuong_blue_broken.png' },
        { base: 'heo_thuong_purple.png', broken: 'heo_thuong_purple_broken.png' },
        { base: 'heo_thuong_red.png', broken: 'heo_thuong_red_broken.png' },
        { base: 'heo_thuong_green.png', broken: 'heo_thuong_green_broken.png' }
      ],
      label: 'HEO THƯỜNG',
      weight: 70,
      class: 'tier-common'
    },
    gold: {
      assets: [{ base: 'heo_vang.png', broken: 'heo_broken_generic_coins.png' }],
      label: 'HEO VÀNG',
      weight: 25,
      class: 'tier-gold'
    },
    diamond: {
      assets: [{ base: 'heo_diamond.png', broken: 'heo_broken_generic_coins.png' }],
      label: 'HEO KIM CƯƠNG',
      weight: 5,
      class: 'tier-diamond'
    }
  };

  const PRIZE_POOL = [10000, 20000, 50000, 100000, 200000, 500000];

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

  // --- State ---
  let state = {
    totalTurns: 2,
    turnsRemaining: 0,
    currentEarnings: 0,
    history: []
  };

  // --- Functions ---
  const showScreen = (name) => {
    Object.keys(screens).forEach(key => {
      screens[key].classList.toggle('hidden', key !== name);
    });
  };

  const getRandomTier = () => {
    const rand = Math.random() * 100;
    if (rand < 5) return 'diamond';
    if (rand < 30) return 'gold';
    return 'common';
  };

  const getPrizeByTier = (tier) => {
    if (tier === 'diamond') return PRIZE_POOL[Math.floor(Math.random() * 2) + 4]; // 200k-500k
    if (tier === 'gold') return PRIZE_POOL[Math.floor(Math.random() * 3) + 1];    // 20k-100k
    return PRIZE_POOL[Math.floor(Math.random() * 2)];                           // 10k-20k
  };

  const spawnGrid = () => {
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const item = document.createElement('div');
      item.className = 'heo-item';

      const tierKey = getRandomTier();
      const tier = PIG_TIERS[tierKey];
      const assetObj = tier.assets[Math.floor(Math.random() * tier.assets.length)];

      // Initial view is always the terracotta cover
      item.innerHTML = `<div class="heo-pig tier-common"><img src="${COVER_ASSET}" alt="pig" /></div>`;

      item.addEventListener('click', () => handlePigClick(item, tierKey, assetObj));
      grid.appendChild(item);
    }
  };

  const createShatterEffect = (el, imgSrc, count = 12) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const shard = document.createElement('div');
      shard.className = 'heo-shard';
      shard.style.backgroundImage = `url(${imgSrc})`;

      const bx = Math.random() * 100;
      const by = Math.random() * 100;
      shard.style.backgroundPosition = `-${bx}px -${by}px`;

      shard.style.left = centerX + 'px';
      shard.style.top = centerY + 'px';

      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 150;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const rot = Math.random() * 720;

      shard.animate([
        { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rot}deg) scale(0)`, opacity: 0 }
      ], {
        duration: 600 + Math.random() * 400,
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
      }).onfinish = () => shard.remove();

      document.body.appendChild(shard);
    }
  };

  const handlePigClick = async (el, tierKey, assetObj) => {
    if (state.turnsRemaining <= 0 || el.classList.contains('processing')) return;
    el.classList.add('processing');

    const pigContainer = el.querySelector('.heo-pig');
    const pigImg = pigContainer.querySelector('img');
    const baseImg = ASSET_PATH + assetObj.base;
    const brokenImg = ASSET_PATH + assetObj.broken;

    // --- STAGE 1: Terracotta Cracks & Shake ---
    if (window.ZToolsFolk) {
      window.ZToolsFolk.sounds.play('crack');
      window.ZToolsFolk.vibrate();
    }

    // Swap to crack asset and start intense shake
    pigImg.src = COVER_CRACK_ASSET;
    pigContainer.classList.add('animate-crack');

    // --- STAGE 2: Suspense (800ms) ---
    await new Promise(resolve => setTimeout(resolve, 800));

    // --- STAGE 3: Shatter Terracotta & Reveal tier Pig ---
    if (window.ZToolsFolk) {
      window.ZToolsFolk.sounds.play('crack');
      window.ZToolsFolk.vibrate();
    }

    createShatterEffect(el, COVER_ASSET, 15);
    pigImg.src = baseImg; // Reveal the real pig briefly
    pigContainer.classList.remove('animate-crack');
    pigContainer.classList.add('animate-reveal'); // Add a quick pop-in effect

    setTimeout(() => {
      const prize = getPrizeByTier(tierKey);
      state.currentEarnings += prize;
      state.turnsRemaining--;

      state.history.push({ tier: tierKey, amount: prize });

      if (window.ZToolsFolk) {
        window.ZToolsFolk.wallet.addCoins(prize);
        // Particle at click location
        const rect = el.getBoundingClientRect();
        window.ZToolsFolk.particles.create(rect.left + rect.width / 2, rect.top + rect.height / 2, '#FFD700', 40);
      }

      remainingTurnsEl.innerText = state.turnsRemaining;
      showRevealScreen(tierKey, prize, brokenImg);
    }, 500);
  };

  const showRevealScreen = (tierKey, prize, realImgSrc) => {
    const tier = PIG_TIERS[tierKey];
    revealTier.innerText = tier.label;
    revealEmoji.innerHTML = `<img src="${realImgSrc}" style="width: 200px; height: 200px; object-fit: contain;" />`;
    revealAmount.innerText = `+${prize.toLocaleString()}đ`;
    revealWish.innerText = FUNNY_WISHES[Math.floor(Math.random() * FUNNY_WISHES.length)];

    // Random challenge (30% chance)
    const hasChallenge = Math.random() < 0.3;
    revealChallenge.classList.toggle('hidden', !hasChallenge);
    if (hasChallenge) {
      challengeText.innerText = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
      if (window.ZToolsFolk) window.ZToolsFolk.sounds.play('jackpot');
    }

    showScreen('reveal');
  };

  const showSummary = () => {
    summaryTotal.innerText = state.currentEarnings.toLocaleString();

    // Dynamic badge
    let badge = "TAY ĐẬP LỤA";
    if (state.currentEarnings >= 500000) badge = "ĐẠI GIA LÌ XÌ";
    else if (state.currentEarnings >= 100000) badge = "TAY ĐẬP VÀNG";

    summaryBadge.innerText = badge;
    showScreen('summary');
  };

  // --- Event Listeners ---
  turnOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      turnOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      state.totalTurns = parseInt(opt.dataset.turns);
    });
  });

  btnStart.addEventListener('click', () => {
    state.turnsRemaining = state.totalTurns;
    state.currentEarnings = 0;
    state.history = [];
    remainingTurnsEl.innerText = state.turnsRemaining;
    spawnGrid();
    showScreen('game');
  });

  btnContinue.addEventListener('click', () => {
    if (state.turnsRemaining > 0) {
      showScreen('game');
    } else {
      showSummary();
    }
  });

  btnPlayAgain.addEventListener('click', () => {
    showScreen('setup');
  });

  // Initialize core if needed
  if (window.ZToolsFolk && window.ZToolsFolk.sounds) {
    window.ZToolsFolk.sounds.init(['crack', 'jackpot']);
  }

  showScreen('setup');
});
