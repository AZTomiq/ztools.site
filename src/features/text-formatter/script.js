/**
 * Text Formatter Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const inputArea = document.getElementById('input-text');
  if (!inputArea) return;

  const updateAll = () => {
    const text = inputArea.value;
    const options = {
      removeExtraSpaces: document.getElementById('remove_extra_spaces')?.checked ?? true,
      removeLineBreaks: document.getElementById('remove_line_breaks')?.checked ?? false,
      trimLines: document.getElementById('trim_lines')?.checked ?? true,
      normalizeQuotes: document.getElementById('normalize_quotes')?.checked ?? true,
      caseTransform: document.getElementById('case_transform')?.value ?? 'none'
    };

    const formatted = formatTextLogic(text, options);
    const output = document.getElementById('formatted-output');
    if (output) output.value = formatted;

    updateStats(text, formatted);
  };

  inputArea.addEventListener('input', updateAll);
  inputArea.addEventListener('paste', () => setTimeout(updateAll, 100));

  const optionIds = ['remove_extra_spaces', 'remove_line_breaks', 'trim_lines', 'normalize_quotes', 'case_transform'];
  optionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', updateAll);
  });

  if (inputArea.value) updateAll();

  window.clearText = () => {
    inputArea.value = '';
    updateAll();
  };

  window.copyFormatted = () => {
    const output = document.getElementById('formatted-output');
    if (!output || !output.value) return;
    output.select();
    document.execCommand('copy');
    showToast('✓ Copied to clipboard!');
  };
});

function formatTextLogic(text, options) {
  if (!text) return '';

  let result = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  if (options.removeExtraSpaces) {
    result = result.replace(/[ \t]+/g, ' ');
  }

  if (options.trimLines) {
    result = result.split('\n').map(line => line.trim()).join('\n');
  }

  if (options.removeLineBreaks) {
    result = result.replace(/\n+/g, ' ');
  } else {
    result = result.replace(/\n{3,}/g, '\n\n');
  }

  if (options.normalizeQuotes) {
    result = result.replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\u2026/g, '...');
  }

  switch (options.caseTransform) {
    case 'lowercase': result = result.toLowerCase(); break;
    case 'uppercase': result = result.toUpperCase(); break;
    case 'capitalize': result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase(); break;
    case 'title': result = result.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()); break;
  }

  return result.trim();
}

function updateStats(original, formatted) {
  const statsOriginal = document.getElementById('stats-original');
  const statsFormatted = document.getElementById('stats-formatted');
  const statsReduction = document.getElementById('stats-reduction');
  const statsPercent = document.getElementById('stats-percent');

  const originalChars = original.length;
  const formattedChars = formatted.length;
  const reduction = originalChars - formattedChars;
  const reductionPercent = originalChars > 0 ? ((reduction / originalChars) * 100).toFixed(1) : 0;

  if (statsOriginal) statsOriginal.textContent = originalChars;
  if (statsFormatted) statsFormatted.textContent = formattedChars;
  if (statsReduction) statsReduction.textContent = reduction > 0 ? reduction : 0;
  if (statsPercent) statsPercent.textContent = reductionPercent + '%';
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatTextLogic };
}
