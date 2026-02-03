/**
 * Investment Calculator UI
 */

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(amount));
}

function parseInputCurrency(val) {
  return parseFloat(val.toString().replace(/[^\d]/g, '')) || 0;
}

document.addEventListener('DOMContentLoaded', () => {
  const initialInput = document.getElementById('initial-capital');
  const finalInput = document.getElementById('final-capital');
  const btnCalc = document.getElementById('btn-calculate');

  if (!initialInput) return;

  [initialInput, finalInput].forEach(el => {
    el.addEventListener('input', (e) => {
      let value = parseInputCurrency(e.target.value);
      if (value === 0) e.target.value = '';
      else e.target.value = value.toLocaleString('vi-VN');
    });
  });

  if (btnCalc) {
    btnCalc.addEventListener('click', calculateROI);
  }
});

function calculateROI() {
  const initial = parseInputCurrency(document.getElementById('initial-capital').value);
  const final = parseInputCurrency(document.getElementById('final-capital').value);
  const duration = parseFloat(document.getElementById('duration').value) || 1;

  if (initial <= 0) {
    alert("Vui lòng nhập số vốn ban đầu!");
    return;
  }

  if (typeof calculateInvestmentLogic === 'function') {
    const res = calculateInvestmentLogic(initial, final, duration);
    if (!res) return;

    document.getElementById('roi-total').textContent = res.totalROI.toFixed(2) + '%';
    document.getElementById('roi-annual').textContent = res.annualizedROI.toFixed(2) + '%';
    document.getElementById('profit-value').textContent = formatVND(res.profit);

    document.getElementById('result-box').style.display = 'block';
  } else {
    console.error('calculateInvestmentLogic function not found.');
  }
}
