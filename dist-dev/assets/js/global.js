document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  // Update button icon based on current theme
  const updateIcon = (theme) => {
    if (!toggleBtn) return;
    const iconName = theme === 'dark' ? 'sun' : 'moon';
    toggleBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
    if (window.lucide) lucide.createIcons();
  };

  if (toggleBtn) {
    updateIcon(htmlEl.getAttribute('data-theme'));

    toggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme);
    });
  }

  console.log('AZtomiq Global JS v1.5.2-rev2 Loaded');

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(req => console.log('SW Registered!', req.scope))
        .catch(err => console.error('SW Registration Failed', err));
    });
  }

  // --- Global Navigation & Dropdown Logic (Unified delegation) ---
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.dropdown-toggle');
    const megaHeader = e.target.closest('.mega-cat-header');

    // 1. Handle Dropdown Toggles (Mega Menu, Preferences, etc.)
    if (toggle) {
      const item = toggle.closest('.nav-item');
      const menu = item ? item.querySelector('.dropdown-menu') : null;
      if (menu) {
        e.preventDefault();
        e.stopPropagation();
        const isShown = menu.classList.contains('show');

        // Close ALL other open menus first
        document.querySelectorAll('.dropdown-menu.show').forEach(m => {
          if (m !== menu) m.classList.remove('show');
        });
        document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach(btn => {
          if (btn !== toggle) btn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        menu.classList.toggle('show', !isShown);
        toggle.setAttribute('aria-expanded', !isShown);
        return;
      }
    }

    // 2. Handle Mega Menu Column Toggles (Expand/Collapse)
    if (megaHeader) {
      e.preventDefault();
      e.stopPropagation();
      const expanded = megaHeader.getAttribute('aria-expanded') === 'true';
      megaHeader.setAttribute('aria-expanded', !expanded);
      return;
    }

    // 3. Handle Outside Clicks (Close all if click is NOT inside a menu or on a toggle)
    if (!e.target.closest('.dropdown-menu') && !e.target.closest('.dropdown-toggle')) {
      document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
      document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
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
  let i18nData = {};
  try {
    const toolsScript = document.getElementById('tools-data');
    if (toolsScript) toolsData = JSON.parse(toolsScript.textContent);

    const i18nScript = document.getElementById('i18n-data');
    if (i18nScript) i18nData = JSON.parse(i18nScript.textContent);
  } catch (e) { console.error('Error loading search/i18n data', e); }

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
  const searchBtnMobile = document.getElementById('search-btn-mobile');
  if (searchBtnMobile) searchBtnMobile.addEventListener('click', openSearch);

  const headerSearchBox = document.getElementById('header-search-box');
  if (headerSearchBox) {
    headerSearchBox.addEventListener('click', openSearch);

    // Smart visibility for Homepage Hero Search
    const heroSearch = document.querySelector('.search-box-hero');
    if (heroSearch) {
      // Check initial state
      headerSearchBox.classList.add('search-hidden');

      window.addEventListener('scroll', () => {
        const rect = heroSearch.getBoundingClientRect();
        // If hero search bottom is above viewport (scrolled past)
        if (rect.bottom < 0) {
          headerSearchBox.classList.remove('search-hidden');
        } else {
          headerSearchBox.classList.add('search-hidden');
        }
      }, { passive: true });
    }
  }

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
      const emptyMsg = i18nData.search_no_results || 'No results for';
      searchResults.innerHTML = `<div class="search-no-results">${emptyMsg} "${query}"</div>`;
      return;
    }

    searchResults.innerHTML = filtered.map((tool, index) => `
      <a href="${tool.link}" class="search-result-item ${index === 0 ? 'selected' : ''}" data-index="${index}">
        <div class="result-icon"><i data-lucide="${tool.icon}"></i></div>
        <div class="result-info">
          <span class="result-title">${tool.title}</span>
          <span class="result-desc">${tool.desc}</span>
        </div>
        <span class="result-cat">${tool.category}</span>
      </a>
    `).join('');

    if (window.lucide) lucide.createIcons();

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

  // --- Changelog Modal Logic ---
  const changelogBtn = document.getElementById('open-changelog');
  const changelogModal = document.getElementById('changelog-modal');
  const closeChangelog = document.getElementById('close-changelog');
  const changelogOverlay = document.getElementById('close-changelog-overlay');

  if (changelogBtn && changelogModal) {
    changelogBtn.addEventListener('click', () => {
      changelogModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });

    const hideChangelog = () => {
      changelogModal.classList.remove('show');
      document.body.style.overflow = '';
    };

    if (closeChangelog) closeChangelog.addEventListener('click', hideChangelog);
    if (changelogOverlay) changelogOverlay.addEventListener('click', hideChangelog);
  }

  // --- End Search & Changelog Logic ---

  // Track clicks on tool items (using delegation for dynamic content)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.tool-item, .mega-link, .search-result-item, .tool-link');
    if (link) {
      const url = link.getAttribute('href');
      trackUsage(url);

      // Close mega-menu if this was a menu click
      if (link.classList.contains('mega-link')) {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          menu.classList.remove('show');
          const toggle = menu.parentElement.querySelector('.dropdown-toggle');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
      }
    }
  });

  function trackUsage(toolUrl) {
    if (!toolUrl) return;
    try {
      const parts = toolUrl.split('/').filter(Boolean);
      const id = parts[parts.length - 1];
      const now = Date.now();

      // 1. Recently Used
      let recent = JSON.parse(localStorage.getItem('aztomiq_recent') || '{}');
      recent[id] = now;
      localStorage.setItem('aztomiq_recent', JSON.stringify(recent));

      // 2. Most Used (Personal)
      let usage = JSON.parse(localStorage.getItem('aztomiq_usage') || '{}');
      usage[id] = (usage[id] || 0) + 1;
      localStorage.setItem('aztomiq_usage', JSON.stringify(usage));

    } catch (e) { console.error('Tracking error', e); }
  }
  // --- Favorite Tools Logic (Star System) ---
  const FAVORITES_KEY = 'aztomiq_favorites';
  const RECENT_KEY = 'aztomiq_recent';
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');

  function updateStars() {
    document.querySelectorAll('.star-btn').forEach(btn => {
      const id = btn.getAttribute('data-tool-id');
      const isActive = favorites.includes(id);
      btn.classList.toggle('active', isActive);
    });
  }

  function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
      favorites.push(id);
      showToast(i18nData.msg_starred || 'Added to favorites');
    } else {
      favorites.splice(index, 1);
      showToast(i18nData.msg_unstarred || 'Removed from favorites');
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    updateStars();
    renderFavorites();
  }

  function createToolCard(tool, isRecent = false) {
    if (!tool) return '';
    let modeClass = '';
    if (tool.mode === 'standard') modeClass = 'mode-standard-only';
    else if (tool.mode === 'advanced') modeClass = 'mode-advanced-only';

    const isStarred = favorites.includes(tool.id);

    return `
      <div class="tool-card-wrapper ${modeClass}">
        <div class="tool-card">
          <button class="star-btn ${isStarred ? 'active' : ''}" data-tool-id="${tool.id}" aria-label="Toggle favorite" title="Toggle favorite">
            <i data-lucide="star" style="width: 14px; height: 14px; fill: ${isStarred ? 'currentColor' : 'none'};"></i>
          </button>
          
          <div class="tool-badge-row">
             ${tool.highlight ? `<span class="tool-badge hot"><i data-lucide="sparkles" style="width: 12px; height: 12px;"></i> HOT</span>` : ''}
             ${tool.status === 'not-ready' ? `<span class="tool-badge beta">BETA</span>` : ''}
          </div>

          <a href="${tool.link}" class="tool-link">
            <div class="tool-icon-wrap">
              <i data-lucide="${tool.icon || 'tool'}" style="width: 32px; height: 32px;"></i>
            </div>
            <h3>${tool.title}</h3>
            <p>${tool.desc}</p>
          </a>
        </div>
      </div>
    `;
  }

  function renderFavorites() {
    const favoritesSection = document.getElementById('favorites-section');
    const favoritesGrid = document.getElementById('favorites-grid');
    if (!favoritesGrid) return;

    if (favorites.length === 0) {
      favoritesSection.style.display = 'none';
      return;
    }

    favoritesSection.style.display = 'block';
    const favoriteTools = favorites.map(id => toolsData.find(t => t.id === id)).filter(Boolean);
    favoritesGrid.innerHTML = favoriteTools.map(t => createToolCard(t)).join('');

    if (window.lucide) lucide.createIcons();
  }

  function renderRecent() {
    const recentSection = document.getElementById('recent-section');
    const recentGrid = document.getElementById('recent-grid');
    if (!recentGrid) return;

    const recentData = JSON.parse(localStorage.getItem(RECENT_KEY) || '{}');
    // Sort keys by timestamp descending
    const sortedIds = Object.keys(recentData).sort((a, b) => recentData[b] - recentData[a]).slice(0, 8);

    if (sortedIds.length === 0) {
      recentSection.style.display = 'none';
      return;
    }

    recentSection.style.display = 'block';
    const recentTools = sortedIds.map(id => toolsData.find(t => t.id === id)).filter(Boolean);
    recentGrid.innerHTML = recentTools.map(t => createToolCard(t, true)).join('');

    if (window.lucide) lucide.createIcons();
  }

  // --- Toast / Notification System (Stacking) ---
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'az-toast';
    toast.innerHTML = `<i data-lucide="info" style="width: 14px; height: 14px;"></i> <span>${message}</span>`;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    // Limit to 2 active notifications
    const activeToasts = Array.from(container.querySelectorAll('.az-toast:not(.hiding)'));
    if (activeToasts.length > 2) {
      const oldest = activeToasts[0];
      oldest.classList.add('hiding');
      setTimeout(() => oldest.remove(), 400);
    }

    setTimeout(() => {
      if (toast.parentNode && !toast.classList.contains('hiding')) {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 400);
      }
    }, 3000);
  }

  // --- End Toast System ---

  // Clear History
  const clearHistoryBtn = document.getElementById('clear-history');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      localStorage.removeItem(RECENT_KEY);
      renderRecent();
      showToast(i18nData.msg_history_cleared || 'History cleared');
    });
  }

  // Global delegate for stars
  document.addEventListener('click', (e) => {
    const starBtn = e.target.closest('.star-btn');
    if (starBtn) {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(starBtn.getAttribute('data-tool-id'));
    }
  });

  // Initial render
  updateStars();
  renderFavorites();
  renderRecent();

  // Final Lucide init
  if (window.lucide) lucide.createIcons();

  // --- End Favorite Tools Logic ---

  // --- Feedback Form Handling ---
  const feedbackForm = document.getElementById('feedback-form');
  const feedbackStatus = document.getElementById('feedback-status');

  if (feedbackForm && feedbackStatus) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = feedbackForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width: 14px; height: 14px;"></i>';
      if (window.lucide) lucide.createIcons();

      const formData = new FormData(feedbackForm);
      const data = Object.fromEntries(formData.entries());

      // Add metadata
      data._timestamp = new Date().toISOString();
      data._url = window.location.href;
      data._locale = document.documentElement.lang || 'vi';

      try {
        const response = await fetch(feedbackForm.action, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          feedbackStatus.textContent = i18nData.feedback_success || 'Thank you for your feedback!';
          feedbackStatus.className = 'feedback-status success';
          feedbackForm.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Feedback submission error:', error);
        feedbackStatus.textContent = i18nData.feedback_error || 'Something went wrong, please try again.';
        feedbackStatus.className = 'feedback-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        if (window.lucide) lucide.createIcons();

        // Clear status after 5 seconds
        setTimeout(() => {
          feedbackStatus.textContent = '';
          feedbackStatus.className = 'feedback-status';
        }, 5000);
      }
    });
  }
  // --- Subdomain Cross-Linking Logic ---
  const subdomains = i18nData.subdomains || []; // We'll need to inject this into i18nData
  const mainDomain = i18nData.mainDomain || window.location.hostname;

  function resolveInternalLink(url) {
    if (!url || url.startsWith('#') || url.startsWith('javascript:')) return url;

    // Convert absolute internal links to relative for processing
    let path = url;
    if (url.startsWith('http')) {
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname === mainDomain || subdomains.some(s => s.domain === urlObj.hostname)) {
          path = urlObj.pathname;
        } else {
          return url; // External link
        }
      } catch (e) { return url; }
    }

    if (!path.startsWith('/')) path = '/' + path;

    const mappedSub = subdomains.find(s => path.startsWith(s.path));

    if (mappedSub) {
      // Resolve to clean subdomain absolute URL (strip the subdirectory path)
      return `https://${mappedSub.domain}${path.replace(mappedSub.path, '/')}`;
    }

    // If not a subdomain path, and we are currently on a subdomain, point back to main
    if (window.location.hostname !== mainDomain && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      return `https://${mainDomain}${path}`;
    }

    return path;
  }

  // Intercept all internal links to resolve them
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      const resolved = resolveInternalLink(href);
      if (resolved !== href) {
        // We don't necessarily want to MUTATE the DOM href (which might break SPA-like behavior if added later)
        // but for this static site strategy, resolving it on click or just before is fine.
        // For SEO, we prefer them to be correct in the HTML (Mega Menu handles this via EJS usually)
        // This is a safety layer for dynamic links.
        link.setAttribute('href', resolved);
      }
    }
  }, true);

});

