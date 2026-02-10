/** 🎡 Lucky Wheel Logic */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('wheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const nameInput = document.getElementById('wheel-names');
  const spinBtn = document.getElementById('spin-btn');
  const updateBtn = document.getElementById('update-wheel');
  const clearBtn = document.getElementById('clear-wheel');
  const historyEl = document.getElementById('wheel-history');
  const winModal = document.getElementById('win-modal');
  const winnerEl = document.getElementById('winner-name');
  const closeBtn = document.getElementById('close-modal');
  const removeWinnerCheck = document.getElementById('remove-winner');

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F7DC6F', '#BB8FCE'];

  let items = [];
  let rotation = 0;
  let velocity = 0;
  let isSpinning = false;
  const friction = 0.992;

  // --- Core Methods ---

  const updateItems = () => {
    const lines = nameInput.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    items = lines.map((label, i) => ({
      label,
      color: COLORS[i % COLORS.length]
    }));
    draw();
  };

  const draw = () => {
    const radius = canvas.width / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const arc = (Math.PI * 2) / (items.length || 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    items.forEach((item, i) => {
      const angle = i * arc;

      // Draw Segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + arc);
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Text
      ctx.save();
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px Inter';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(item.label, radius - 20, 10);
      ctx.restore();
    });

    ctx.restore();

    // Center Pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();
  };

  const spin = () => {
    if (isSpinning || items.length < 2) return;

    const minVelocity = 0.3;
    const randomExtra = Math.random() * 0.2;
    velocity = minVelocity + randomExtra;
    isSpinning = true;

    if (window.ZToolsFolk) window.ZToolsFolk.sounds.play('spin');

    animate();
  };

  const animate = () => {
    if (!isSpinning) return;

    rotation += velocity;
    velocity *= friction;

    draw();

    if (velocity < 0.001) {
      isSpinning = false;
      velocity = 0;
      onSpinEnd();
    } else {
      requestAnimationFrame(animate);
    }
  };

  const onSpinEnd = () => {
    const arc = (Math.PI * 2) / items.length;
    // Pointer is at Top (1.5 * PI)
    const pointerAngle = 1.5 * Math.PI;
    const normalizedRotation = rotation % (Math.PI * 2);
    const winningIndex = Math.floor(
      ((pointerAngle - normalizedRotation + Math.PI * 2) % (Math.PI * 2)) / arc
    );

    const winner = items[winningIndex];
    showWinner(winner);

    // Remove Winner if checked
    if (removeWinnerCheck && removeWinnerCheck.checked) {
      const lines = nameInput.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
      const newLines = lines.filter(l => l !== winner.label);
      nameInput.value = newLines.join('\n');
      // Delay update slightly for better UX after modal closes or particles show
      setTimeout(updateItems, 1500);
    }
  };

  const showWinner = (winner) => {
    winnerEl.innerText = winner.label;
    winModal.style.display = 'flex';

    if (window.ZToolsFolk) {
      window.ZToolsFolk.sounds.play('jackpot');
      window.ZToolsFolk.particles.create(window.innerWidth / 2, window.innerHeight / 2, winner.color, 50);
    }

    // Update History
    const p = document.createElement('p');
    p.className = 'history-item';
    p.innerHTML = `<strong>${winner.label}</strong> - ${new Date().toLocaleTimeString()}`;
    if (historyEl.querySelector('p:first-child')?.innerText === 'Chưa có kết quả.') {
      historyEl.innerHTML = '';
    }
    historyEl.prepend(p);
  };

  // --- Events ---
  spinBtn.addEventListener('click', spin);
  updateBtn.addEventListener('click', updateItems);
  clearBtn.addEventListener('click', () => {
    nameInput.value = '';
    updateItems();
  });
  closeBtn.addEventListener('click', () => {
    winModal.style.display = 'none';
  });

  // Init
  updateItems();
});
