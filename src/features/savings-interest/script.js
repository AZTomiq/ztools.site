/**
 * Savings Interest Calculator
 */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('savings-form');
  const btnCalculate = document.getElementById('btn-calculate');
  const btnReset = document.getElementById('btn-reset');
  const resultSection = document.getElementById('result-section');

  if (!form) return;

  const termSelect = document.getElementById('term');
  const customTermGroup = document.getElementById('custom-term-group');

  // Input Formatting
  const amountInput = document.getElementById('amount');
  if (amountInput) {
    amountInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val) {
        e.target.value = parseInt(val, 10).toLocaleString('vi-VN');
      }
    });
  }

  // Term Select Change
  if (termSelect) {
    termSelect.addEventListener('change', () => {
      if (termSelect.value === 'custom') {
        customTermGroup.style.display = 'block';
      } else {
        customTermGroup.style.display = 'none';
      }
    });
  }

  // Calculation Event
  if (btnCalculate) {
    btnCalculate.addEventListener('click', () => {
      const amount = parseNumber(document.getElementById('amount').value);
      const rate = parseFloat(document.getElementById('rate').value) || 0;

      let months = 0;
      if (termSelect.value === 'custom') {
        months = parseInt(document.getElementById('custom-months').value) || 0;
      } else {
        months = parseInt(termSelect.value) || 0;
      }

      if (amount <= 0 || rate <= 0 || months <= 0) {
        alert("Please enter valid amount, rate and term.");
        return;
      }

      const result = calculateSavingsInterest(amount, rate, months);

      document.getElementById('res-interest').textContent = formatCurrency(result.interest);
      document.getElementById('res-total').textContent = formatCurrency(result.total);
      resultSection.classList.add('show');
    });
  }

  // Reset Event
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      form.reset();
      if (customTermGroup) customTermGroup.style.display = 'none';
      resultSection.classList.remove('show');
    });
  }

  function parseNumber(str) {
    if (!str) return 0;
    return parseInt(str.toString().replace(/\D/g, ''), 10) || 0;
  }

  function formatCurrency(num) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  }
});

function calculateSavingsInterest(amount, rate, months) {
  const interest = amount * (rate / 100) * (months / 12);
  const total = amount + interest;
  return { interest, total };
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateSavingsInterest };
}
