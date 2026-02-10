/** 🎮 Folk Games Hub Script */

document.addEventListener('DOMContentLoaded', () => {
  // Luôn hiển thị số xu hiện có
  const updateCoinsDisplay = () => {
    const coinEl = document.getElementById('user-coins');
    if (coinEl && window.ZToolsFolk) {
      coinEl.innerText = window.ZToolsFolk.wallet.getCoins().toLocaleString();
    }
  };

  updateCoinsDisplay();

  // Lắng nghe sự kiện cập nhật xu
  window.addEventListener('zt-coins-updated', (e) => {
    console.log('Coins updated:', e.detail);
    updateCoinsDisplay();
  });

  // Initialize Lucide icons if not already done by global.js
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
