/**
 * Compound Interest Calculator
 */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('compound-form');
  const btnCalculate = document.getElementById('btn-calculate');
  const btnReset = document.getElementById('btn-reset');
  const resultSection = document.getElementById('result-section');

  if (!form) return;

  // Input Formatting
  const currencyInputs = ['initial', 'contribution'];
  currencyInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('focus', (e) => {
        e.target.select();
      });

      el.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val) {
          const formatted = parseInt(val, 10).toLocaleString('vi-VN');
          if (e.target.value !== formatted) {
            e.target.value = formatted;
          }
        }
      });
    }
  });

  // Calculation Event
  if (btnCalculate) {
    btnCalculate.addEventListener('click', () => {
      const initial = parseNumber(document.getElementById('initial').value);
      const rate = parseFloat(document.getElementById('rate').value) || 0;
      const years = parseInt(document.getElementById('years').value) || 0;
      const contribution = parseNumber(document.getElementById('contribution').value);
      const frequency = parseInt(document.getElementById('frequency').value) || 12;

      if (years <= 0) {
        alert("Please enter a valid number of years.");
        return;
      }

      const result = calculateCompoundInterest(initial, rate, years, contribution, frequency);
      updateDisplay(result);
    });
  }

  // Reset Event
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      form.reset();
      resultSection.classList.remove('show');
    });
  }

  function updateDisplay(result) {
    document.getElementById('res-future-value').textContent = formatCurrency(result.currentBalance);
    document.getElementById('res-total-principal').textContent = formatCurrency(result.totalContributed);
    document.getElementById('res-total-interest').textContent = formatCurrency(result.totalInterest);

    const tbody = document.getElementById('breakdown-body');
    if (tbody) {
      tbody.innerHTML = '';
      result.breakdownData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.year}</td>
          <td style="font-weight:bold">${formatCurrency(row.balance)}</td>
          <td style="color:var(--success)">+${formatCurrency(row.interest)}</td>
          <td>${formatCurrency(row.contributed)}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    resultSection.classList.add('show');
  }

  function parseNumber(str) {
    if (!str) return 0;
    return parseInt(str.toString().replace(/\D/g, ''), 10) || 0;
  }

  function formatCurrency(num) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  }
});

function calculateCompoundInterest(initial, rate, years, contribution, frequency) {
  let currentBalance = initial;
  let totalContributed = initial;
  let totalInterest = 0;

  const totalMonths = years * 12;
  const monthsPerCompound = 12 / frequency;
  const breakdownData = [];

  for (let m = 1; m <= totalMonths; m++) {
    currentBalance += contribution;
    totalContributed += contribution;

    if (m % monthsPerCompound === 0) {
      const periodicRate = (rate / 100) / frequency;
      const interest = currentBalance * periodicRate;
      currentBalance += interest;
      totalInterest += interest;
    }

    if (m % 12 === 0) {
      breakdownData.push({
        year: m / 12,
        balance: currentBalance,
        interest: totalInterest,
        contributed: totalContributed
      });
    }
  }

  return { currentBalance, totalContributed, totalInterest, breakdownData };
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateCompoundInterest };
}
