document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('export-btn');
  const selectAllBtn = document.getElementById('select-all-btn');
  const deselectAllBtn = document.getElementById('deselect-all-btn');
  const toolSearch = document.getElementById('tool-search');
  const checkboxes = document.querySelectorAll('input[name="tool-choice"]');

  // Collapse/Expand Logic
  const toggleViewBtn = document.getElementById('toggle-view-btn');
  const catGroups = document.querySelectorAll('.category-group');
  let isAllExpanded = true;
  const i18n = {
    collapse: window.i18nData?.collapse || 'Thu gọn',
    expand: window.i18nData?.expand || 'Mở rộng',
    selectAll: window.i18nData?.selectAll || 'Chọn tất cả',
    deselectAll: window.i18nData?.deselectAll || 'Bỏ chọn'
  };

  // Toggle View
  if (toggleViewBtn) {
    toggleViewBtn.addEventListener('click', () => {
      isAllExpanded = !isAllExpanded;
      catGroups.forEach(group => {
        if (isAllExpanded) group.classList.add('expanded');
        else group.classList.remove('expanded');
      });

      const viewText = document.getElementById('view-text');
      if (viewText) viewText.textContent = isAllExpanded ? i18n.collapse : i18n.expand;
    });
  }

  // Toggle Select
  const toggleSelectBtn = document.getElementById('toggle-select-btn');
  let isAllSelected = true;

  if (toggleSelectBtn) {
    toggleSelectBtn.addEventListener('click', () => {
      isAllSelected = !isAllSelected;
      checkboxes.forEach(cb => cb.checked = isAllSelected);

      const selectText = document.getElementById('select-text');
      if (selectText) selectText.textContent = isAllSelected ? i18n.deselectAll : i18n.selectAll;
    });
  }

  // Individual Group Toggle
  document.querySelectorAll('.toggle-cat').forEach(header => {
    header.addEventListener('click', () => {
      const group = header.closest('.category-group');
      group.classList.toggle('expanded');
    });
  });

  // Search filter logic
  toolSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();

    // Auto-expand all if searching
    if (q.length > 0) {
      catGroups.forEach(group => group.classList.add('expanded'));
    }

    document.querySelectorAll('.tool-checkbox-item').forEach(item => {
      const title = item.getAttribute('data-title').toLowerCase();
      item.style.display = title.includes(q) ? 'flex' : 'none';
    });

    // Hide empty categories
    document.querySelectorAll('.category-group').forEach(group => {
      const visibleTools = group.querySelectorAll('.tool-checkbox-item[style="display: flex;"], .tool-checkbox-item:not([style])');
      group.style.display = visibleTools.length > 0 ? 'block' : 'none';
    });
  });

  // Export Logic
  exportBtn.addEventListener('click', () => {
    const selected = Array.from(checkboxes).filter(cb => cb.checked);
    if (selected.length === 0) {
      alert('Vui lòng chọn ít nhất một công cụ!');
      return;
    }

    const bookmarkHtml = generateBookmarkHtml(selected);
    downloadBlob(bookmarkHtml, 'ztools-bookmarks.html', 'text/html');
  });

  function generateBookmarkHtml(selectedTools) {
    const now = Math.floor(Date.now() / 1000);
    // Group tools by category name for a better folder structure
    const folders = {};
    selectedTools.forEach(cb => {
      const cat = cb.getAttribute('data-cat-name');
      if (!folders[cat]) folders[cat] = [];

      // Resolve absolute URL correctly
      const relUrl = cb.getAttribute('data-url');
      const absUrl = new URL(relUrl, window.location.href).href;

      folders[cat].push({
        name: cb.getAttribute('data-name'),
        url: absUrl
      });
    });

    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="${now}" LAST_MODIFIED="${now}">ZTools</H3>
    <DL><p>
`;

    for (const [catName, tools] of Object.entries(folders)) {
      html += `        <DT><H3 ADD_DATE="${now}" LAST_MODIFIED="${now}">${catName}</H3>\n        <DL><p>\n`;
      tools.forEach(tool => {
        html += `            <DT><A HREF="${tool.url}" ADD_DATE="${now}">${tool.name}</A>\n`;
      });
      html += `        </DL><p>\n`;
    }

    html += `    </DL><p>\n</DL><p>`;

    return html;
  }

  function downloadBlob(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // PATCH: Register missing emoji icons (from verified bug report)
  if (window.lucide && window.lucide.icons) {
    const iconMap = {
      '🛠️': 'hammer',
      '💰': 'coins',
      '📝': 'file-text', // notepad/memo
      '⚙️': 'settings',
      '🗓️': 'calendar',
      '💻': 'laptop',
      '🐸': 'message-circle-question' // Fallback for frog
    };

    // Attempt to register mappings if target icon exists
    Object.keys(iconMap).forEach(emoji => {
      const targetName = iconMap[emoji];
      if (window.lucide.icons[targetName]) {
        window.lucide.icons[emoji] = window.lucide.icons[targetName];
      }
    });

    // Re-scan incase icons are already in DOM
    window.lucide.createIcons();
  }
});
