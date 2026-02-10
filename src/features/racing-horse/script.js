/** 🏇 Đua Ngựa Bính Ngọ Logic */

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('horse-track');
  const startBtn = document.getElementById('start-horse-race');
  const horseCountInput = document.getElementById('horse-count');
  const betInput = document.getElementById('horse-bet');
  const horseChoiceInput = document.getElementById('horse-choice');
  const coinsDisplay = document.getElementById('horse-coins');
  const timerDisplay = document.getElementById('race-timer');

  const awardModal = document.getElementById('award-modal');
  const awardTitle = document.getElementById('award-title');
  const awardMsg = document.getElementById('award-msg');
  const awardReward = document.getElementById('award-reward');
  const winnerVisual = document.getElementById('winner-horse-visual');
  const winnerNameEl = document.getElementById('winner-name');

  let isRacing = false;
  let horseElements = [];
  let horseStates = [];
  const finishLinePercent = 85;

  const HORSE_COLORS = [
    { body: '#8B4513', mane: '#2F4F4F' }, // Brown / Dark Gray
    { body: '#D2691E', mane: '#FFD700' }, // Chocolate / Gold
    { body: '#F5F5DC', mane: '#DEB887' }, // Beige / Burlywood
    { body: '#2F4F4F', mane: '#000000' }, // Dark Slate / Black
    { body: '#A52A2A', mane: '#FFFFFF' }, // Brown / White
    { body: '#FFD700', mane: '#B8860B' }, // Gold / Dark Gold
    { body: '#808080', mane: '#C0C0C0' }, // Gray / Silver
    { body: '#000000', mane: '#B71C1C' }  // Black / Red
  ];

  const updateWallet = () => {
    if (window.ZToolsFolk) {
      coinsDisplay.innerText = window.ZToolsFolk.wallet.getCoins().toLocaleString();
    }
  };

  const initTrack = () => {
    isRacing = false;
    track.innerHTML = '<div class="horse-finish-line"></div>';
    horseElements = [];
    horseStates = [];

    const count = Math.min(parseInt(horseCountInput.value) || 4, 8);

    // Update selection options
    horseChoiceInput.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.innerText = `Ngựa số ${i + 1}`;
      horseChoiceInput.appendChild(opt);

      // Create Lane
      const lane = document.createElement('div');
      lane.className = 'horse-lane';

      const racer = document.createElement('div');
      racer.className = 'horse-racer';
      racer.id = `horse-${i}`;

      const horseColor = HORSE_COLORS[i % HORSE_COLORS.length];
      racer.innerHTML = `
                <div class="horse-visual" style="color: ${horseColor.body}">
                    🏇
                    <div class="horse-mane" style="background: ${horseColor.mane}; opacity: 0.6;"></div>
                </div>
                <div class="horse-label">Số ${i + 1}</div>
            `;

      lane.appendChild(racer);
      track.appendChild(lane);

      horseElements.push(racer);
      horseStates.push({
        pos: 20,
        speed: 0,
        burst: 0
      });
    }
  };

  const startRace = () => {
    if (isRacing) return;

    const bet = parseInt(betInput.value);
    const playerCoins = window.ZToolsFolk?.wallet.getCoins() || 0;

    if (bet > playerCoins) {
      alert("Bạn không đủ xu để đặt cược! 💰");
      return;
    }

    if (window.ZToolsFolk) {
      window.ZToolsFolk.wallet.spendCoins(bet);
      window.ZToolsFolk.sounds.play('cheer');
    }

    isRacing = true;
    startBtn.disabled = true;
    timerDisplay.style.display = 'block';

    let countdown = 3;
    const timer = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        timerDisplay.innerText = countdown + "...";
      } else {
        clearInterval(timer);
        timerDisplay.innerText = "CHẠY!";
        setTimeout(() => { timerDisplay.style.display = 'none'; }, 500);

        horseElements.forEach(el => el.classList.add('running'));
        if (window.ZToolsFolk) window.ZToolsFolk.sounds.play('horse-gallop');

        requestAnimationFrame(raceLoop);
      }
    }, 800);
  };

  const raceLoop = () => {
    if (!isRacing) return;

    let winner = -1;
    const trackWidth = track.offsetWidth;
    const finishPx = trackWidth * (finishLinePercent / 100);

    for (let i = 0; i < horseElements.length; i++) {
      // Random acceleration logic
      const accel = Math.random() * 0.4;

      // Random bursts (Mã Đáo Thành Công momentum)
      if (Math.random() < 0.05) horseStates[i].burst = Math.random() * 2;

      horseStates[i].speed += accel + horseStates[i].burst;
      horseStates[i].speed *= 0.96; // Friction
      horseStates[i].burst *= 0.8; // Decay burst

      horseStates[i].pos += horseStates[i].speed;

      horseElements[i].style.left = `${horseStates[i].pos}px`;

      if (horseStates[i].pos >= finishPx) {
        winner = i;
        break;
      }
    }

    if (winner !== -1) {
      endRace(winner);
    } else {
      requestAnimationFrame(raceLoop);
    }
  };

  const endRace = (winnerIndex) => {
    isRacing = false;
    startBtn.disabled = false;
    horseElements.forEach(el => el.classList.remove('running'));

    const chosen = parseInt(horseChoiceInput.value);
    const bet = parseInt(betInput.value);
    const horseColor = HORSE_COLORS[winnerIndex % HORSE_COLORS.length];

    winnerVisual.style.color = horseColor.body;
    winnerNameEl.innerText = `Ngựa số ${winnerIndex + 1}`;

    if (winnerIndex === chosen) {
      awardTitle.innerText = "🎉 BẠN ĐÃ ĐẠI THẮNG!";
      awardMsg.innerText = "Mã Đáo Thành Công! Ngựa của bạn đã về nhất.";
      const reward = bet * 3;
      awardReward.innerText = `+${reward} xu`;
      if (window.ZToolsFolk) {
        window.ZToolsFolk.wallet.addCoins(reward);
        window.ZToolsFolk.sounds.play('jackpot');
        window.ZToolsFolk.particles.create(window.innerWidth / 2, window.innerHeight / 2, '#FFD700', 50);
      }
    } else {
      awardTitle.innerText = "💸 LẦN SAU MAY MẮN!";
      awardMsg.innerText = `Ngựa số ${winnerIndex + 1} đã về nhất. Chúc bạn may mắn hơn!`;
      awardReward.innerText = "0 xu";
    }

    setTimeout(() => { awardModal.style.display = 'flex'; }, 1000);
    updateWallet();
  };

  startBtn.addEventListener('click', startRace);
  horseCountInput.addEventListener('change', initTrack);
  document.getElementById('close-award').addEventListener('click', () => {
    awardModal.style.display = 'none';
    initTrack();
  });

  initTrack();
  updateWallet();
});
