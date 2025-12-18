// Text Formatter - Clear Style Tool
// Removes formatting from copied text

let inputText = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const inputArea = document.getElementById('input-text');
  if (inputArea) {
    inputArea.addEventListener('input', formatText);
    inputArea.addEventListener('paste', () => setTimeout(formatText, 100));

    if (inputArea.value) {
      formatText();
    }
  }

  // Add listeners to all option inputs for real-time update
  const optionInputs = [
    'remove_extra_spaces',
    'remove_line_breaks',
    'trim_lines',
    'normalize_quotes'
  ];

  optionInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', formatText);
  });

  const caseSelect = document.getElementById('case_transform');
  if (caseSelect) caseSelect.addEventListener('change', formatText);
});

// Main formatting function
function formatText() {
  const input = document.getElementById('input-text');
  const output = document.getElementById('formatted-output');

  if (!input || !output) return;

  let text = input.value;

  if (!text.trim()) {
    output.value = '';
    return;
  }

  // Get options
  const removeExtraSpaces = document.getElementById('remove_extra_spaces')?.checked ?? true;
  const removeLineBreaks = document.getElementById('remove_line_breaks')?.checked ?? false;
  const trimLines = document.getElementById('trim_lines')?.checked ?? true;
  const normalizeQuotes = document.getElementById('normalize_quotes')?.checked ?? true;
  const caseTransform = document.getElementById('case_transform')?.value ?? 'none';

  // Apply formatting

  // 1. Normalize line breaks (convert all to \n)
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Remove extra spaces
  if (removeExtraSpaces) {
    text = text.replace(/[ \t]+/g, ' ');
  }

  // 3. Trim lines
  if (trimLines) {
    text = text.split('\n').map(line => line.trim()).join('\n');
  }

  // 4. Remove line breaks
  if (removeLineBreaks) {
    text = text.replace(/\n+/g, ' ');
  } else {
    // Remove excessive line breaks (more than 2)
    text = text.replace(/\n{3,}/g, '\n\n');
  }

  // 5. Normalize quotes
  if (normalizeQuotes) {
    // Convert smart quotes to straight quotes
    text = text.replace(/[\u201C\u201D]/g, '"'); // Smart double quotes
    text = text.replace(/[\u2018\u2019]/g, "'"); // Smart single quotes
    text = text.replace(/[\u2013\u2014]/g, '-'); // En dash, Em dash
    text = text.replace(/\u2026/g, '...'); // Ellipsis
  }

  // 6. Case transformation
  switch (caseTransform) {
    case 'lowercase':
      text = text.toLowerCase();
      break;
    case 'uppercase':
      text = text.toUpperCase();
      break;
    case 'capitalize':
      text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      break;
    case 'title':
      text = text.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
      break;
  }

  // 7. Final cleanup - remove leading/trailing whitespace
  text = text.trim();

  // Update output
  output.value = text;

  // Show character count
  updateStats(input.value, text);
}

// Update statistics
function updateStats(original, formatted) {
  // Update display stats if elements exist
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

  // Fallback for generic generator layout
  const genericStats = document.getElementById('format-stats');
  if (genericStats) {
    genericStats.innerHTML = `
      <span>Original: <strong>${originalChars}</strong> chars</span>
      <span>Formatted: <strong>${formattedChars}</strong> chars</span>
      ${reduction > 0 ? `<span style="color: var(--success-color);">Reduced by <strong>${reduction}</strong> chars (${reductionPercent}%)</span>` : ''}
    `;
  }
}

// Copy formatted text
function copyFormatted() {
  const output = document.getElementById('formatted-output');
  if (!output || !output.value) return;

  output.select();
  document.execCommand('copy');

  // Show feedback
  showToast('✓ Copied to clipboard!');
}

// Clear all text
function clearText() {
  const input = document.getElementById('input-text');
  const output = document.getElementById('formatted-output');

  if (input) input.value = '';
  if (output) output.value = '';

  const stats = document.getElementById('format-stats');
  if (stats) stats.innerHTML = '';

  inputText = '';
}

// Toast notification
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Add CSS animations
if (!document.getElementById('toast-animations')) {
  const style = document.createElement('style');
  style.id = 'toast-animations';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
