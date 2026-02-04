/**
 * Percentage Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
});

function prettify(num) {
  if (isNaN(num) || num === Infinity || num === -Infinity) return num.toString();
  return parseFloat(num.toFixed(4)).toString();
}

function showResult(boxId, valId, result) {
  const box = document.getElementById(boxId);
  const valEl = document.getElementById(valId);
  if (valEl) valEl.textContent = result;
  if (box) {
    box.style.display = 'flex';
    box.style.animation = 'fadeIn 0.3s';
  }
}

// Global functions for onclick handlers
window.calcBasic = function () {
  const pct = parseFloat(document.getElementById('basic-percent').value);
  const num = parseFloat(document.getElementById('basic-num').value);
  if (isNaN(pct) || isNaN(num)) return;

  if (typeof calculateBasicPercentage === 'function') {
    const res = calculateBasicPercentage(pct, num);
    showResult('res-basic-box', 'res-basic-val', prettify(res));
  }
};

window.calcChange = function () {
  const from = parseFloat(document.getElementById('change-from').value);
  const to = parseFloat(document.getElementById('change-to').value);
  if (isNaN(from) || isNaN(to)) return;

  if (typeof calculatePercentageChange === 'function') {
    const result = calculatePercentageChange(from, to);
    let sign = result > 0 ? "+" : "";
    let display = (result === Infinity || result === -Infinity) ? result.toString() : (sign + prettify(result) + "%");
    showResult('res-change-box', 'res-change-val', display);
  }
};

window.calcPhrase = function () {
  const x = parseFloat(document.getElementById('phrase-x').value);
  const y = parseFloat(document.getElementById('phrase-y').value);
  if (isNaN(x) || isNaN(y)) return;

  if (typeof calculateWhatPercentage === 'function') {
    const result = calculateWhatPercentage(x, y);
    let display = (result === Infinity || result === -Infinity) ? result.toString() : (prettify(result) + "%");
    showResult('res-phrase-box', 'res-phrase-val', display);
  }
};
