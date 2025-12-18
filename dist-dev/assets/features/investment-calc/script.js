function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function parseInputCurrency(val) {
  return parseFloat(val.replace(/[^\d]/g, '')) || 0;
}

document.addEventListener('DOMContentLoaded', () => {
  ['initial-capital', 'final-capital'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', (e) => {
      let value = parseInputCurrency(e.target.value);
      if (value === 0) e.target.value = '';
      else e.target.value = value.toLocaleString('vi-VN');
    });
  });
});

function calculateROI() {
  const initial = parseInputCurrency(document.getElementById('initial-capital').value);
  const final = parseInputCurrency(document.getElementById('final-capital').value);
  const duration = parseFloat(document.getElementById('duration').value) || 1;

  if (initial <= 0) return;

  const profit = final - initial;
  const totalROI = (profit / initial) * 100;

  // Annualized Return (CAGR) = [(Final / Initial)^(1 / Years)] - 1
  const annualizedROI = (Math.pow(final / initial, 1 / duration) - 1) * 100;

  document.getElementById('roi-total').textContent = totalROI.toFixed(2) + '%';
  document.getElementById('roi-annual').textContent = annualizedROI.toFixed(2) + '%';
  document.getElementById('profit-value').textContent = formatVND(profit);

  document.getElementById('result-box').style.display = 'block';
}
