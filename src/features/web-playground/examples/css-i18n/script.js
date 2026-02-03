const btns = document.querySelectorAll('.lang-btn');

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Basic language switching logic (as seen in Blog)
    const lang = btn.getAttribute('data-lang');
    document.documentElement.lang = lang;

    // UI Update (Pro Level)
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Animate the card
    const card = document.querySelector('.glass-card');
    card.style.opacity = '0.5';
    card.style.transform = 'translateY(10px)';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 150);
  });
});

// Default to EN
document.documentElement.lang = 'en';