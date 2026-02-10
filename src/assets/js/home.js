document.addEventListener("DOMContentLoaded", () => {
  const toolGrids = document.querySelectorAll(".tools-grid");
  const viewToggleBtns = document.querySelectorAll("[data-view]");
  const sortSelect = document.getElementById("sort-select");

  if (toolGrids.length === 0) return;

  let globalUsage = {};
  let recentUsage = JSON.parse(localStorage.getItem('ztools_recent') || '{}');
  let localUsage = JSON.parse(localStorage.getItem('ztools_usage') || '{}');

  // --- 1. Fetch Global Usage from API ---
  async function fetchGlobalUsage() {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        data.forEach(item => {
          globalUsage[item.tool_id] = item.total_views;
        });

        // Populate Smart Picks with intelligent algorithm
        populateSmartPicks(data);

        if (sortSelect && sortSelect.value === "popular") {
          applySort("popular");
        }
      }
    } catch (err) {
      console.warn("zHome: Failed to fetch global stats.");
      // Fallback to local-only smart picks
      populateSmartPicks([]);
    }
  }

  // --- 2. Smart Picks Algorithm ---
  function populateSmartPicks(globalStats) {
    const smartPicksGrid = document.getElementById('smart-picks-grid');
    if (!smartPicksGrid) return;

    // Get all tool cards (exclude inner buttons with same data-id)
    const allCards = Array.from(document.querySelectorAll('.tool-card-wrapper[data-tool-id]'));

    // Scoring algorithm
    const scoredTools = allCards.map(card => {
      const toolId = card.getAttribute('data-tool-id');

      // Skip fast-access tools (already shown above)
      const fastAccessIds = ['web-playground', 'tax', 'json-toolkit', 'compound-interest', 'lunar-calendar'];
      if (fastAccessIds.includes(toolId)) return null;

      let score = 0;

      // 1. Recent usage (highest weight) - 50 points
      const recentTime = recentUsage[toolId] || 0;
      if (recentTime > 0) {
        const hoursSince = (Date.now() - recentTime) / (1000 * 60 * 60);
        score += Math.max(0, 50 - hoursSince); // Decay over time
      }

      // 2. Personal usage frequency - 30 points
      const personalCount = localUsage[toolId] || 0;
      score += Math.min(30, personalCount * 5);

      // 3. Global trending (normalized) - 20 points
      const globalCount = globalUsage[toolId] || 0;
      const maxGlobal = Math.max(...Object.values(globalUsage), 1);
      score += (globalCount / maxGlobal) * 20;

      return { card, toolId, score };
    }).filter(Boolean);

    // Sort by score and take top 8
    scoredTools.sort((a, b) => b.score - a.score);
    const topPicks = scoredTools.slice(0, 8);

    // Populate grid
    topPicks.forEach((pick, index) => {
      const clone = pick.card.cloneNode(true);

      // Add trending badge for top 3
      if (index < 3 && pick.score > 20) {
        // Remove existing badge if any to prevent dupes
        const existingBadge = clone.querySelector('.trending-badge');
        if (existingBadge) existingBadge.remove();

        const trendingBadge = document.createElement('div');
        trendingBadge.className = 'trending-badge';
        trendingBadge.innerHTML = '<i data-lucide="trending-up" style="width: 12px; height: 12px;"></i> Trending';
        clone.style.position = 'relative'; // Ensure relative for absolute badge
        clone.appendChild(trendingBadge); // Append to card, CSS will position absolute
      }

      // Add view count if available
      const globalCount = globalUsage[pick.toolId];
      if (globalCount) {
        // Check if card-footer exists (new layout)
        const footer = clone.querySelector('.card-footer');
        if (footer) {
          const viewSpan = document.createElement('span');
          viewSpan.className = 'view-count-mini';
          viewSpan.style.fontSize = '0.75rem';
          viewSpan.style.color = 'var(--text-muted)';
          viewSpan.style.display = 'flex';
          viewSpan.style.alignItems = 'center';
          viewSpan.style.gap = '4px';
          viewSpan.style.marginLeft = 'auto'; // Right align before arrow
          viewSpan.style.marginRight = '8px';
          viewSpan.innerHTML = `<i data-lucide="eye" style="width: 12px; height: 12px;"></i> ${formatViews(globalCount)}`;

          // Insert before the arrow icon
          const arrow = footer.querySelector('i[data-lucide="arrow-right"]');
          if (arrow) {
            footer.insertBefore(viewSpan, arrow);
          } else {
            footer.appendChild(viewSpan);
          }
        } else {
          // Fallback for old layout (rare)
          const viewBadge = document.createElement('div');
          viewBadge.className = 'view-count-badge';
          viewBadge.innerHTML = `<i data-lucide="eye" style="width: 14px; height: 14px;"></i> ${formatViews(globalCount)}`;
          const iconDiv = clone.querySelector('.icon');
          if (iconDiv) {
            iconDiv.style.position = 'relative';
            iconDiv.appendChild(viewBadge);
          }
        }
      }

      smartPicksGrid.appendChild(clone);
    });

    // Re-init Lucide icons
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function formatViews(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }

  fetchGlobalUsage();

  // --- 3. View Toggle Logic ---
  const savedView = localStorage.getItem("ztools_view_mode") || "grid";
  const savedSort = localStorage.getItem("ztools_sort_mode") || "default";

  applyView(savedView);
  if (sortSelect) {
    sortSelect.value = savedSort;
    applySort(savedSort);
  }

  viewToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.dataset.view;
      applyView(view);
      localStorage.setItem("ztools_view_mode", view);
    });
  });

  function applyView(viewMode) {
    toolGrids.forEach((grid) => {
      if (viewMode === "list") grid.classList.add("list-view");
      else grid.classList.remove("list-view");
    });
    viewToggleBtns.forEach((btn) => {
      if (btn.dataset.view === viewMode) {
        btn.classList.add("active");
        btn.style.backgroundColor = "var(--primary-color)";
        btn.style.color = "white";
      } else {
        btn.classList.remove("active");
        btn.style.backgroundColor = "transparent";
        btn.style.color = "var(--text-color)";
      }
    });
  }

  // --- 4. Sort Logic ---
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      const sortMode = e.target.value;
      applySort(sortMode);
      localStorage.setItem("ztools_sort_mode", sortMode);
    });
  }

  function applySort(sortMode) {
    toolGrids.forEach((grid) => {
      // Skip smart picks grid (already sorted)
      if (grid.id === 'smart-picks-grid') return;

      const items = Array.from(grid.children);

      if (!grid.dataset.indexed) {
        items.forEach((item, index) => item.dataset.originalIndex = index);
        grid.dataset.indexed = "true";
      }

      items.sort((a, b) => {
        const getID = (el) => {
          const id = el.getAttribute('data-tool-id');
          if (id) return id;

          const href = el.getAttribute('href');
          if (!href) return '';
          const parts = href.split('/').filter(Boolean);
          return parts[parts.length - 1];
        };

        const idA = getID(a);
        const idB = getID(b);

        if (sortMode === "az") {
          const titleA = a.querySelector("h3, h4")?.innerText.trim() || "";
          const titleB = b.querySelector("h3, h4")?.innerText.trim() || "";
          return titleA.localeCompare(titleB);
        } else if (sortMode === "za") {
          const titleA = a.querySelector("h3, h4")?.innerText.trim() || "";
          const titleB = b.querySelector("h3, h4")?.innerText.trim() || "";
          return titleB.localeCompare(titleA);
        } else if (sortMode === "recent") {
          const timeA = recentUsage[idA] || 0;
          const timeB = recentUsage[idB] || 0;
          return timeB - timeA;
        } else if (sortMode === "popular") {
          const countA = (globalUsage[idA] || 0) * 1000 + (localUsage[idA] || 0);
          const countB = (globalUsage[idB] || 0) * 1000 + (localUsage[idB] || 0);
          return countB - countA;
        } else {
          return parseInt(a.dataset.originalIndex) - parseInt(b.dataset.originalIndex);
        }
      });
      items.forEach((item) => grid.appendChild(item));
    });
  }

  // --- 5. Hero Search Logic ---
  const homeSearch = document.getElementById("home-search");
  if (homeSearch) {
    homeSearch.addEventListener("focus", () => {
      homeSearch.blur();
      document.getElementById("header-search-box")?.click() ||
        document.getElementById("search-btn")?.click() ||
        document.getElementById("search-btn-mobile")?.click();
    });
  }

  // --- 6. Category Filter Logic ---
  const catFilter = document.getElementById("category-filter");
  if (catFilter) {
    catFilter.addEventListener("change", (e) => {
      const cat = e.target.value;
      const sections = document.querySelectorAll(".category-section");
      sections.forEach(sec => {
        if (cat === "all" || sec.id === cat + "-tools") {
          sec.style.display = "block";
        } else {
          sec.style.display = "none";
        }
      });
    });
  }
  // --- 7. Tết 2026 Countdown Logic ---
  const tetDate = new Date("February 17, 2026 00:00:00").getTime();
  const timerElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  if (timerElements.days) {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = tetDate - now;

      if (distance < 0) {
        const title = document.querySelector(".countdown-title");
        if (title) title.innerText = "CHÚC MỪNG NĂM MỚI BÍNH NGỌ 2026!";
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      timerElements.days.innerText = d.toString().padStart(2, '0');
      timerElements.hours.innerText = h.toString().padStart(2, '0');
      timerElements.minutes.innerText = m.toString().padStart(2, '0');
      timerElements.seconds.innerText = s.toString().padStart(2, '0');
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  const fsBtn = document.getElementById("fullscreen-countdown");
  const countdownContainer = document.getElementById("tet-countdown");

  if (fsBtn && countdownContainer) {
    fsBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        countdownContainer.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
        countdownContainer.classList.add("fullscreen-tet");
      } else {
        document.exitFullscreen();
        countdownContainer.classList.remove("fullscreen-tet");
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        countdownContainer.classList.remove("fullscreen-tet");
      }
    });
  }
});
