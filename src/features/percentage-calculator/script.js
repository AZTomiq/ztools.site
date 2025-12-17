document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactive all
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      // Active current
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      document.getElementById('tab-' + target).classList.add('active');
    });
  });
});

function prettify(num) {
  // Remove trailing zeros, max 4 decimals
  return parseFloat(num.toFixed(4)).toString();
}

function showResult(boxId, valId, result) {
  const box = document.getElementById(boxId);
  const valEl = document.getElementById(valId);
  valEl.textContent = result;
  box.style.display = 'flex';
  box.style.animation = 'fadeIn 0.3s';
}

// 1. Basic: X% of Y
function calcBasic() {
  const pct = parseFloat(document.getElementById('basic-percent').value);
  const num = parseFloat(document.getElementById('basic-num').value);
  if (isNaN(pct) || isNaN(num)) return;

  const res = (pct / 100) * num;
  showResult('res-basic-box', 'res-basic-val', prettify(res));
}

// 2. Change: From X to Y
function calcChange() {
  const from = parseFloat(document.getElementById('change-from').value);
  const to = parseFloat(document.getElementById('change-to').value);
  if (isNaN(from) || isNaN(to)) return;

  if (from === 0) {
    showResult('res-change-box', 'res-change-val', "Infinity%");
    return;
  }

  const diff = to - from;
  const pct = (diff / from) * 100;

  let sign = pct > 0 ? "+" : "";
  showResult('res-change-box', 'res-change-val', sign + prettify(pct) + "%");
}

// 3. Phrase: X is what % of Y
function calcPhrase() {
  const x = parseFloat(document.getElementById('phrase-x').value);
  const y = parseFloat(document.getElementById('phrase-y').value);
  if (isNaN(x) || isNaN(y)) return;

  if (y === 0) {
    showResult('res-phrase-box', 'res-phrase-val', "Infinity%");
    return;
  }

  const res = (x / y) * 100;
  showResult('res-phrase-box', 'res-phrase-val', prettify(res) + "%");
}
