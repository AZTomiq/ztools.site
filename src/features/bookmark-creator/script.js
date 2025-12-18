document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('export-btn');
  const selectAllBtn = document.getElementById('select-all-btn');
  const deselectAllBtn = document.getElementById('deselect-all-btn');
  const toolSearch = document.getElementById('tool-search');
  const checkboxes = document.querySelectorAll('input[name="tool-choice"]');

  // Multi-select logic
  selectAllBtn.addEventListener('click', () => {
    checkboxes.forEach(cb => cb.checked = true);
  });

  deselectAllBtn.addEventListener('click', () => {
    checkboxes.forEach(cb => cb.checked = false);
  });

  // Search filter logic
  toolSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
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
    // Group tools by category name for a better folder structure
    const folders = {};
    selectedTools.forEach(cb => {
      const cat = cb.getAttribute('data-cat-name');
      if (!folders[cat]) folders[cat] = [];
      folders[cat].push({
        name: cb.getAttribute('data-name'),
        url: window.location.origin + cb.getAttribute('data-url')
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
    <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}" LAST_MODIFIED="${Math.floor(Date.now() / 1000)}">ZTools</H3>
    <DL><p>
`;

    for (const [catName, tools] of Object.entries(folders)) {
      html += `        <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}">${catName}</H3>\n        <DL><p>\n`;
      tools.forEach(tool => {
        html += `            <DT><A HREF="${tool.url}" ADD_DATE="${Math.floor(Date.now() / 1000)}">${tool.name}</A>\n`;
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
});
