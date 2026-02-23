/**
 * iZTools Neo-Festive Homepage Script
 * (c) 2026 iZTools Team
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroParallax();
  initSearchCommand();
  initParticles();

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});

/**
 * Hero Section Parallax Effect
 * Moves elements slightly based on mouse position to create depth.
 */
function initHeroParallax() {
  const hero = document.querySelector('.hero-neo');
  const glow = document.querySelector('.hero-glow');
  const title = document.querySelector('.neo-title');

  if (!hero || !glow || !title) return;

  hero.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    glow.style.transform = `translate(-50%, -50%) translate(${x * 2}px, ${y * 2}px)`;
    title.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/**
 * Command Bar Search Functionality
 * Focusing opens a pseudo-modal or highlights the bar.
 */
function initSearchCommand() {
  const searchInput = document.getElementById('neo-search');
  const cmdBar = document.querySelector('.cmd-bar');

  if (!searchInput) return;

  // Focus on CMD+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  searchInput.addEventListener('focus', () => {
    cmdBar.classList.add('active');
  });

  searchInput.addEventListener('blur', () => {
    cmdBar.classList.remove('active');
  });
}

/**
 * Lightweight Particle System
 * draws subtle floating particles in the background.
 */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles';
  const hero = document.querySelector('.hero-neo');

  if (!hero) return;

  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2;
      this.alpha = Math.random() * 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    resize();
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
}

