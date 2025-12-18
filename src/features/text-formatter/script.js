// Text Formatter - Clear Style Tool
// Removes formatting from copied text

let inputText = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const inputArea = document.getElementById('input-text');

  if (inputArea) {
    // Add input event listener
    inputArea.addEventListener('input', (e) => {
      inputText = e.target.value;
    });

    // Auto-format on paste
    inputArea.addEventListener('paste', (e) => {
      setTimeout(() => {
        formatText();
      }, 100);
    });

    // Auto-format if there's initial text
    if (inputArea.value) {
      inputText = inputArea.value;
      formatText();
    }
  }
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
  const statsEl = document.getElementById('format-stats');
  if (!statsEl) {
    // Create stats element if it doesn't exist
    const output = document.getElementById('formatted-output');
    if (output && output.parentElement) {
      const stats = document.createElement('div');
      stats.id = 'format-stats';
      stats.style.cssText = 'margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-secondary); display: flex; gap: 1rem;';
      output.parentElement.appendChild(stats);
      updateStats(original, formatted);
    }
    return;
  }

  const originalChars = original.length;
  const formattedChars = formatted.length;
  const reduction = originalChars - formattedChars;
  const reductionPercent = originalChars > 0 ? ((reduction / originalChars) * 100).toFixed(1) : 0;

  statsEl.innerHTML = `
    <span>Original: <strong>${originalChars}</strong> chars</span>
    <span>Formatted: <strong>${formattedChars}</strong> chars</span>
    ${reduction > 0 ? `<span style="color: var(--success);">Reduced by <strong>${reduction}</strong> chars (${reductionPercent}%)</span>` : ''}
  `;
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
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--success);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
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
