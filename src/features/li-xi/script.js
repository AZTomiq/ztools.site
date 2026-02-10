/** 🧧 Lì Xì Tết 2026 Logic - Refined */

document.addEventListener('DOMContentLoaded', () => {
  const playground = document.getElementById('lixi-playground');
  const coinDisplay = document.getElementById('lixi-coins');
  const resetBtn = document.getElementById('lixi-reset');
  const lixiCountInput = document.getElementById('lixi-count');
  const lixiMaxValInput = document.getElementById('lixi-max-value');

  const modal = document.getElementById('lixi-modal');
  const amountEl = document.getElementById('lixi-amount');
  const blessingEl = document.getElementById('lixi-blessing');
  const closeBtn = document.getElementById('close-lixi');

  const BLESSINGS = [
    "Mã Đáo Thành Công - Công việc thuận lợi!",
    "Vạn Sự Như Ý - Sức khỏe dồi dào!",
    "Tấn Tài Tấn Lộc - Tiền vào như nước!",
    "An Khang Thịnh Vượng - Hạnh phúc ấm no!",
    "Năm Ngọ Phi Nhanh - Thành công rực rỡ!",
    "Sự Nghiệp Thăng Tiến - Mã Đáo Thành Công!"
  ];

  const updateWallet = () => {
    if (window.ZToolsFolk) {
      coinDisplay.innerText = window.ZToolsFolk.wallet.getCoins().toLocaleString();
    }
  };

  const getRandomAmount = (max) => {
    // Higher probabilities for smaller amounts
    const rand = Math.random();
    if (rand < 0.6) return Math.floor(max * 0.1); // 60% get 10% max
    if (rand < 0.9) return Math.floor(max * 0.3); // 30% get 30% max
    return max; // 10% get max
  };

  const spawnEnvelope = () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'envelope-wrapper-refined';

    // Random Position in playground
    const pWidth = playground.offsetWidth - 120;
    const pHeight = playground.offsetHeight - 180;
    wrapper.style.left = Math.random() * pWidth + 'px';
    wrapper.style.top = Math.random() * pHeight + 'px';
    wrapper.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;

    wrapper.innerHTML = `
            <div class="envelope">
                <div class="envelope-flap"></div>
                <div class="envelope-body">
                    <div class="zodiac-seal" style="font-size: 3rem;">🐴</div>
                    <div class="envelope-text" style="font-size: 1rem;">2026</div>
                </div>
            </div>
        `;

    wrapper.addEventListener('click', () => openLixi(wrapper));
    playground.appendChild(wrapper);
  };

  const openLixi = (wrapper) => {
    const today = new Date().toDateString();
    const lastOpened = localStorage.getItem('zt_lixi_last');
    const count = parseInt(localStorage.getItem('zt_lixi_count') || '0');

    if (lastOpened === today && count >= 10) { // Limit to 10 per day for refined version
      alert("Hôm nay bạn đã nhận đủ 10 bao lì xì rồi. Hãy quay lại vào ngày mai nhé! 🧧");
      return;
    }

    const maxVal = parseInt(lixiMaxValInput.value) || 100000;
    const amount = getRandomAmount(maxVal);
    const blessing = BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)];

    if (window.ZToolsFolk) {
      window.ZToolsFolk.sounds.play('envelope-open', 0.8);
      window.ZToolsFolk.wallet.addCoins(amount);

      // Animation
      wrapper.classList.add('opening');

      setTimeout(() => {
        amountEl.innerText = amount.toLocaleString() + ' xu';
        blessingEl.innerText = blessing;
        modal.style.display = 'flex';

        window.ZToolsFolk.sounds.play('coins');
        window.ZToolsFolk.particles.create(window.innerWidth / 2, window.innerHeight / 2, '#FFD700', 30);

        localStorage.setItem('zt_lixi_last', today);
        localStorage.setItem('zt_lixi_count', (lastOpened === today ? count + 1 : 1).toString());

        wrapper.remove();
        updateWallet();
      }, 500);
    }
  };

  const initPlayground = () => {
    playground.innerHTML = '';
    const count = Math.min(parseInt(lixiCountInput.value) || 5, 20);
    for (let i = 0; i < count; i++) {
      spawnEnvelope();
    }
  };

  resetBtn.addEventListener('click', initPlayground);
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Make playground responsive to window resize
  window.addEventListener('resize', initPlayground);

  initPlayground();
  updateWallet();
});
