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
});
