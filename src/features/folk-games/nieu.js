/** 🏺 Đập Niêu Logic */

document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('nieu-stage');
  const player = document.getElementById('nieu-player');
  const pot = document.getElementById('nieu-pot');
  const blindfold = document.getElementById('nieu-blindfold');
  const status = document.getElementById('nieu-status');
  const modal = document.getElementById('nieu-modal');

  // Game State
  let playerPos = { x: 50, y: 80 }; // Percentage
  let playerRot = 0; // Degrees
  let potPos = { x: 0, y: 0 };
  let isFinished = false;

  const initGame = () => {
    isFinished = false;
    playerPos = { x: 50, y: 80 };
    playerRot = 0;

    // Random Pot Position (avoiding starting area)
    potPos = {
      x: 20 + Math.random() * 60,
      y: 10 + Math.random() * 40
    };

    pot.style.left = `${potPos.x}%`;
    pot.style.top = `${potPos.y}%`;

    updatePlayer();
    blindfold.style.opacity = 1;
    modal.style.display = 'none';
    status.innerText = "Sẵn sàng? Hãy nhớ vị trí niêu và bước tới!";
  };

  const updatePlayer = () => {
    player.style.left = `${playerPos.x}%`;
    player.style.top = `${playerPos.y}%`;
    player.querySelector('.player-direction').style.transform = `rotate(${playerRot}deg)`;
  };

  const rotate = (dir) => {
    playerRot += dir * 45;
    updatePlayer();
  };

  const step = () => {
    if (isFinished) return;

    const rad = (playerRot - 90) * (Math.PI / 180);
    const stepSize = 8; // percent

    const nextX = playerPos.x + Math.cos(rad) * stepSize;
    const nextY = playerPos.y + Math.sin(rad) * stepSize;

    // Boundary check
    if (nextX > 5 && nextX < 95 && nextY > 5 && nextY < 95) {
      playerPos.x = nextX;
      playerPos.y = nextY;
      updatePlayer();
      if (window.ZToolsFolk) window.ZToolsFolk.sounds.play('step', 0.3);
    }
  };

  const smash = () => {
    isFinished = true;
    blindfold.style.opacity = 0;

    // Calculate distance
    const dx = playerPos.x - potPos.x;
    const dy = playerPos.y - potPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const resultTitle = document.getElementById('nieu-result-title');
    const resultDesc = document.getElementById('nieu-result-desc');
    const rewardEl = document.getElementById('nieu-reward');

    if (dist < 10) { // Success
      resultTitle.innerText = "🎯 XUẤT SẮC!";
      resultDesc.innerText = "Bạn đã đập trúng niêu clay!";
      const reward = 500;
      rewardEl.innerText = `+${reward} xu`;
      if (window.ZToolsFolk) {
        window.ZToolsFolk.wallet.addCoins(reward);
        window.ZToolsFolk.sounds.play('jackpot');
        window.ZToolsFolk.particles.create(window.innerWidth / 2, window.innerHeight / 2, '#FFD700', 50);
      }
    } else {
      resultTitle.innerText = "❌ TRƯỢT MẤT RỒI!";
      resultDesc.innerText = `Bạn đứng cách niêu ${Math.round(dist)} bước. Tiếc quá!`;
      rewardEl.innerText = "+10 xu an ủi";
      if (window.ZToolsFolk) {
        window.ZToolsFolk.wallet.addCoins(10);
        window.ZToolsFolk.sounds.play('crack', 0.5);
      }
    }

    setTimeout(() => {
      modal.style.display = 'flex';
    }, 1000);
  };

  // Events
  document.getElementById('nieu-left').addEventListener('click', () => rotate(-1));
  document.getElementById('nieu-right').addEventListener('click', () => rotate(1));
  document.getElementById('nieu-step').addEventListener('click', step);
  document.getElementById('nieu-smash').addEventListener('click', smash);
  document.getElementById('nieu-restart').addEventListener('click', initGame);

  initGame();
});
