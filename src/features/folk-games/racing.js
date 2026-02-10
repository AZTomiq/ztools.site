/** 🦆 Racing Engine Logic */

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-race');
  const duckSelect = document.getElementById('duck-select');
  const betInput = document.getElementById('bet-amount');
  const coinsDisplay = document.getElementById('racing-coins');
  const statusOverlay = document.getElementById('race-status');
  const modal = document.getElementById('racing-modal');

  let isRacing = false;
  let ducks = [];
  let duckPositions = [0, 0, 0, 0, 0];
  let duckSpeeds = [0, 0, 0, 0, 0];
  const finishLine = 85; // percent

  const updateWallet = () => {
    if (window.ZToolsFolk) {
      coinsDisplay.innerText = window.ZToolsFolk.wallet.getCoins().toLocaleString();
    }
  };

  const initRace = () => {
    isRacing = false;
    duckPositions = [20, 20, 20, 20, 20]; // Initial left in px
    duckSpeeds = [0, 0, 0, 0, 0];
    statusOverlay.style.display = 'none';

    for (let i = 0; i < 5; i++) {
      const d = document.getElementById(`duck-${i}`);
      d.style.left = '20px';
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
    statusOverlay.style.display = 'block';
    statusOverlay.innerText = "3...";

    setTimeout(() => { statusOverlay.innerText = "2..."; }, 1000);
    setTimeout(() => { statusOverlay.innerText = "1..."; }, 2000);
    setTimeout(() => {
      statusOverlay.innerText = "XUẤT PHÁT!";
      setTimeout(() => { statusOverlay.style.display = 'none'; }, 500);
      animate();
    }, 3000);
  };

  const animate = () => {
    if (!isRacing) return;

    let winner = -1;
    const trackWidth = document.querySelector('.race-track').offsetWidth;
    const finishPx = trackWidth * (finishLine / 100);

    for (let i = 0; i < 5; i++) {
      // Random acceleration
      duckSpeeds[i] += Math.random() * 0.5;
      duckSpeeds[i] *= 0.95; // Friction

      duckPositions[i] += duckSpeeds[i];

      const d = document.getElementById(`duck-${i}`);
      d.style.left = `${duckPositions[i]}px`;

      if (duckPositions[i] >= finishPx) {
        winner = i;
        break;
      }
    }

    if (winner !== -1) {
      endRace(winner);
    } else {
      requestAnimationFrame(animate);
    }
  };

  const endRace = (winner) => {
    isRacing = false;
    startBtn.disabled = false;

    const chosenDuck = parseInt(duckSelect.value);
    const bet = parseInt(betInput.value);
    const resultTitle = document.getElementById('racing-result-title');
    const rewardEl = document.getElementById('racing-reward');
    const msgEl = document.getElementById('racing-result-msg');

    msgEl.innerText = `Chú vịt số ${winner} đã về nhất!`;

    if (winner === chosenDuck) {
      resultTitle.innerText = "🎉 BẠN ĐÃ THẮNG!";
      const reward = Math.floor(bet * 2.5);
      rewardEl.innerText = `+${reward} xu`;
      if (window.ZToolsFolk) {
        window.ZToolsFolk.wallet.addCoins(reward);
        window.ZToolsFolk.sounds.play('jackpot');
      }
    } else {
      resultTitle.innerText = "💸 THUA RỒI!";
      rewardEl.innerText = "Chúc bạn may mắn lần sau!";
    }

    setTimeout(() => { modal.style.display = 'flex'; }, 1000);
    updateWallet();
  };

  startBtn.addEventListener('click', startRace);
  document.getElementById('race-again').addEventListener('click', () => {
    modal.style.display = 'none';
    initRace();
  });

  initRace();
  updateWallet();
});
