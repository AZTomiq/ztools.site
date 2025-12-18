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

  // --- Search Modal Logic ---
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const closeSearch = document.getElementById('close-search');
  const searchOverlay = document.querySelector('.search-overlay');

  let toolsData = [];
  try {
    const toolsScript = document.getElementById('tools-data');
    if (toolsScript) {
      toolsData = JSON.parse(toolsScript.textContent);
    }
  } catch (e) { console.error('Error loading search data', e); }

  const openSearch = () => {
    searchModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 50);
    renderResults('');
  };

  const hideSearch = () => {
    searchModal.classList.remove('show');
    document.body.style.overflow = '';
    searchInput.value = '';
  };

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (closeSearch) closeSearch.addEventListener('click', hideSearch);
  if (searchOverlay) searchOverlay.addEventListener('click', hideSearch);

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') hideSearch();
  });

  // Search Logic
  searchInput.addEventListener('input', (e) => {
    renderResults(e.target.value.trim());
  });

  function renderResults(query) {
    if (!searchResults) return;

    const q = query.toLowerCase();
    const filtered = toolsData.filter(tool => {
      if (!q) return true;
      return tool.title.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.id.toLowerCase().includes(q);
    }).slice(0, 10);

    if (filtered.length === 0) {
      const emptyMsg = document.documentElement.lang === 'vi' ? 'Không tìm thấy kết quả cho' : 'No results for';
      searchResults.innerHTML = `<div class="search-no-results">${emptyMsg} "${query}"</div>`;
      return;
    }

    searchResults.innerHTML = filtered.map((tool, index) => `
      <a href="${tool.link}" class="search-result-item ${index === 0 ? 'selected' : ''}" data-index="${index}">
        <div class="result-icon">${tool.icon}</div>
        <div class="result-info">
          <span class="result-title">${tool.title}</span>
          <span class="result-desc">${tool.desc}</span>
        </div>
        <span class="result-cat">${tool.category}</span>
      </a>
    `).join('');

    // Handle Keyboard Navigation within results
    setupResultNavigation();
  }

  function setupResultNavigation() {
    let selectedIndex = 0;
    const items = searchResults.querySelectorAll('.search-result-item');

    searchInput.onkeydown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[selectedIndex].classList.remove('selected');
        selectedIndex = (selectedIndex + 1) % items.length;
        items[selectedIndex].classList.add('selected');
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[selectedIndex].classList.remove('selected');
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items[selectedIndex].classList.add('selected');
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = searchResults.querySelector('.search-result-item.selected');
        if (selected) selected.click();
      }
    };
  }

  // --- End Search Modal Logic ---

  // Track clicks on tool items (both in Mega Menu and Homepage Grid)
  document.querySelectorAll('.tool-item, .mega-link, .search-result-item').forEach(link => {
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
