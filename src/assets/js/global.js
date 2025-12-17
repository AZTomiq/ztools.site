document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  // Update button icon based on current theme
  const updateIcon = (theme) => {
    toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  };

  updateIcon(htmlEl.getAttribute('data-theme'));

  toggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
  });

  console.log('ZTools Global JS Loaded');

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(req => console.log('SW Registered!', req.scope))
        .catch(err => console.error('SW Registration Failed', err));
    });
  }
  // --- Global Navigation & Mega Menu Logic ---
  const navItems = document.querySelectorAll('.nav-item');

  // 1. Logo/Menu Toggle
  navItems.forEach(item => {
    const toggle = item.querySelector('.dropdown-toggle');
    const menu = item.querySelector('.dropdown-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Close other open menus first
        document.querySelectorAll('.dropdown-menu.show').forEach(m => {
          if (m !== menu) m.classList.remove('show');
        });

        menu.classList.toggle('show');
        toggle.setAttribute('aria-expanded', menu.classList.contains('show'));
      });
    }
  });

  // 2. Mega Menu Category Toggles (Expand/Collapse)
  document.querySelectorAll('.mega-header').forEach(header => {
    header.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent closing the menu itself
      e.preventDefault();
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !expanded);
    });
  });

  // 3. Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
        const toggle = menu.parentElement.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // --- Tool Usage Tracking ---
  // Track clicks on tool items (both in Mega Menu and Homepage Grid)
  document.querySelectorAll('.tool-item, .mega-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const url = link.getAttribute('href');
      trackUsage(url);

      // Close any open mega-menu if this was a menu click
      if (link.classList.contains('mega-link')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          menu.classList.remove('show');
          const toggle = menu.parentElement.querySelector('.dropdown-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
      }
    });
  });

  function trackUsage(toolUrl) {
    if (!toolUrl) return;
    try {
      const parts = toolUrl.split('/').filter(Boolean);
      const id = parts[parts.length - 1];
      const now = Date.now();

      // 1. Recently Used
      let recent = JSON.parse(localStorage.getItem('ztools_recent') || '{}');
      recent[id] = now;
      localStorage.setItem('ztools_recent', JSON.stringify(recent));

      // 2. Most Used (Personal)
      let usage = JSON.parse(localStorage.getItem('ztools_usage') || '{}');
      usage[id] = (usage[id] || 0) + 1;
      localStorage.setItem('ztools_usage', JSON.stringify(usage));

    } catch (e) { console.error('Tracking error', e); }
  }
});
