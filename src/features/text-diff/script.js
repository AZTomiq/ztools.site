/**
 * Text Diff Checker Logic
 * Implements a simple diff algorithm (Myers Diff Algorithm or similar simplified version)
 */

let currentView = 'side';

document.addEventListener('DOMContentLoaded', () => {
  // If we had URL params to pre-fill, handle them here (optional)
});

function compareText() {
  const oldText = document.getElementById('text-old').value;
  const newText = document.getElementById('text-new').value;

  if (!oldText && !newText) return;

  const diffs = computeDiffLogic(oldText, newText);
  renderDiff(diffs);

  // Show results
  document.getElementById('diff-result-container').style.display = 'block';
  updateSummary(diffs);
}

function clearAll() {
  document.getElementById('text-old').value = '';
  document.getElementById('text-new').value = '';
  document.getElementById('diff-result-container').style.display = 'none';
  document.getElementById('diff-output').innerHTML = '';
}

function setDiffView(view) {
  currentView = view;
  const container = document.getElementById('diff-output');

  if (view === 'side') {
    container.className = 'diff-output side-by-side';
    document.getElementById('view-side').classList.add('active');
    document.getElementById('view-inline').classList.remove('active');
  } else {
    container.className = 'diff-output inline';
    document.getElementById('view-side').classList.remove('active');
    document.getElementById('view-inline').classList.add('active');
  }

  // Re-render if data exists
  compareText();
}

function updateSummary(diffs) {
  const changes = diffs.filter(d => d.type !== 'equal').length;
  // Use simple text for now, assuming template handles localization or hardcoded
  // In a real app, client-side translation would need i18n data passed to JS.
  // We'll rely on a simple string or attributes.
  const summaryEl = document.getElementById('diff-summary');
  if (summaryEl) summaryEl.textContent = `${changes} differences found`;
}

function renderDiff(diffs) {
  const container = document.getElementById('diff-output');
  if (!container) return;

  if (currentView === 'inline') {
    let html = '';
    diffs.forEach(part => {
      const escaped = escapeHtml(part.value);
      if (part.type === 'insert') {
        html += `<ins>${escaped}</ins>`;
      } else if (part.type === 'delete') {
        html += `<del>${escaped}</del>`;
      } else {
        html += `<span>${escaped}</span>`;
      }
    });
    container.innerHTML = html;
  } else {
    // Side by Side
    let leftHtml = '';
    let rightHtml = '';

    diffs.forEach(part => {
      const escaped = escapeHtml(part.value);
      if (part.type === 'equal') {
        leftHtml += `<span>${escaped}</span>`;
        rightHtml += `<span>${escaped}</span>`;
      } else if (part.type === 'delete') {
        leftHtml += `<del>${escaped}</del>`;
      } else if (part.type === 'insert') {
        rightHtml += `<ins>${escaped}</ins>`;
      }
    });

    container.innerHTML = `
      <div class="diff-pane old">${leftHtml}</div>
      <div class="diff-pane new">${rightHtml}</div>
    `;
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, '<br>');
}

// --- Core Diff Logic (Simple Implementation) ---
// Based on "Diff Match Patch" concepts but simplified for words/lines
function computeDiffLogic(text1, text2) {
  // Simple word-based diff
  // Split by whitespace but keep delimiters to reconstruct
  const tokenize = (text) => text.split(/(\s+)/);

  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  // Use Longest Common Subsequence (LCS) approach
  const matrix = Array(tokens1.length + 1).fill(null).map(() => Array(tokens2.length + 1).fill(0));

  for (let i = 1; i <= tokens1.length; i++) {
    for (let j = 1; j <= tokens2.length; j++) {
      if (tokens1[i - 1] === tokens2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const diff = [];
  let i = tokens1.length;
  let j = tokens2.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && tokens1[i - 1] === tokens2[j - 1]) {
      diff.unshift({ type: 'equal', value: tokens1[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      diff.unshift({ type: 'insert', value: tokens2[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      diff.unshift({ type: 'delete', value: tokens1[i - 1] });
      i--;
    }
  }

  return diff;
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeDiffLogic };
}

// Attach to window
if (typeof window !== 'undefined') {
  window.compareText = compareText;
  window.clearAll = clearAll;
  window.setDiffView = setDiffView;
}
