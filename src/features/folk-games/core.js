/** 🎮 Folk Games Core Logic */

const ZToolsFolk = (() => {
  // --- Wallet System (LocalStorage) ---
  const wallet = {
    getCoins: () => parseInt(localStorage.getItem('zt_coins') || '0'),
    addCoins: (amount) => {
      const current = wallet.getCoins();
      const next = current + amount;
      localStorage.setItem('zt_coins', next.toString());
      window.dispatchEvent(new CustomEvent('zt-coins-updated', { detail: { amount: next, delta: amount } }));
      return next;
    },
    spendCoins: (amount) => {
      const current = wallet.getCoins();
      if (current < amount) return false;
      const next = current - amount;
      localStorage.setItem('zt_coins', next.toString());
      window.dispatchEvent(new CustomEvent('zt-coins-updated', { detail: { amount: next, delta: -amount } }));
      return true;
    }
  };

  // --- Sound Manager ---
  const sounds = {
    pool: {},
    init: (soundList) => {
      soundList.forEach(name => {
        const audio = new Audio(`/assets/audio/folk-games/${name}.mp3`);
        audio.preload = 'auto';
        sounds.pool[name] = audio;
      });
    },
    play: (name, volume = 0.5) => {
      const audio = sounds.pool[name];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch(e => console.warn('Sound blocked:', e));
      }
    }
  };

  // --- Particle System (Simplified) ---
  const particles = {
    create: (x, y, color, count = 10) => {
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'folk-particle';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.background = color;

        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        el.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
          duration: 500 + Math.random() * 500,
          easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => el.remove();

        document.body.appendChild(el);
      }
    }
  };

  return {
    wallet,
    sounds,
    particles,
    vibrate: (pattern = [50]) => "vibrate" in navigator && navigator.vibrate(pattern)
  };
})();

// Export for usage
window.ZToolsFolk = ZToolsFolk;
