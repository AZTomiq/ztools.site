document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('compound-form');
  const btnCalculate = document.getElementById('btn-calculate');
  const btnReset = document.getElementById('btn-reset');
  const resultSection = document.getElementById('result-section');

  // Input Formatting
  const currencyInputs = ['initial', 'contribution'];
  currencyInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val) {
          e.target.value = parseInt(val, 10).toLocaleString('vi-VN');
        }
      });
    }
  });

  // Calculation Event
  if (btnCalculate) {
    btnCalculate.addEventListener('click', calculateCompoundInterest);
  }

  // Reset Event
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      form.reset();
      resultSection.classList.remove('show');
    });
  }

  function calculateCompoundInterest() {
    // 1. Get Inputs
    const initial = parseNumber(document.getElementById('initial').value);
    const rate = parseFloat(document.getElementById('rate').value) || 0;
    const years = parseInt(document.getElementById('years').value) || 0;
    const contribution = parseNumber(document.getElementById('contribution').value);
    const frequency = parseInt(document.getElementById('frequency').value) || 12; // Compounds per year

    // Validation
    if (years <= 0) {
      alert("Please enter a valid number of years.");
      return;
    }

    // 2. Simulation Logic
    let currentBalance = initial;
    let totalContributed = initial;
    let totalInterest = 0;

    const totalMonths = years * 12;
    const monthsPerCompound = 12 / frequency;

    // Annual breakdown data
    const breakdownData = [];

    // Monthly Iteration
    for (let m = 1; m <= totalMonths; m++) {
      // Add Monthly Contribution
      currentBalance += contribution;
      totalContributed += contribution;

      // Compound Interest Trigger
      if (m % monthsPerCompound === 0) { // e.g., if Monthly(12), 12/12=1 => every month. If Quarterly(4), 12/4=3 => every 3 months.
        const periodicRate = (rate / 100) / frequency;
        const interest = currentBalance * periodicRate;

        currentBalance += interest;
        totalInterest += interest;
      }

      // Record Annual Breakdown
      if (m % 12 === 0) {
        breakdownData.push({
          year: m / 12,
          balance: currentBalance,
          intro: totalContributed, // Actually we want interest earned this year? Or total?
          interest: totalInterest, // Cumulative
          contributed: totalContributed
        });
      }
    }

    // 3. Update Results DOM
    document.getElementById('res-future-value').textContent = formatCurrency(currentBalance);
    document.getElementById('res-total-principal').textContent = formatCurrency(totalContributed);
    document.getElementById('res-total-interest').textContent = formatCurrency(totalInterest);

    // 4. Update Table
    updateBreakdownTable(breakdownData);

    // 5. Show Results
    resultSection.classList.add('show');
  }

  function updateBreakdownTable(data) {
    const tbody = document.getElementById('breakdown-body');
    tbody.innerHTML = '';

    data.forEach(row => {
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

  // --- Utility Functions ---
  function parseNumber(str) {
    if (!str) return 0;
    // Remove all non-digits (handle "10.000.000" -> "10000000")
    // Safe for integers. For floats like 10.5, this implementation might be strict.
    // Given the fields are currency, integer parsing is usually safe in VN context.
    // If we support 10.5 for rate, we use parseFloat there directly.
    return parseInt(str.toString().replace(/\D/g, ''), 10) || 0;
  }

  function formatCurrency(num) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  }
});
