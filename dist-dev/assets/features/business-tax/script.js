/**
 * Business Tax Calculator Logic
 */

const TAX_RATES = {
  general: 0.20,
  small: 0.20,
  'oil-gas-min': 0.32,
  'oil-gas-max': 0.50,
  'rare-resources': 0.40
};

const SIMPLE_RATES = {
  goods: 0.01,
  services: 0.05,
  other: 0.02
};

document.addEventListener('DOMContentLoaded', function () {
  const methodRadios = document.querySelectorAll('input[name="calculation-method"]');
  const detailedForm = document.getElementById('detailed-form');
  const simpleForm = document.getElementById('simple-form');
  const resultSection = document.getElementById('result-section');

  if (!detailedForm) return;

  methodRadios.forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.value === 'detailed') {
        detailedForm.style.display = 'block';
        simpleForm.style.display = 'none';
      } else {
        detailedForm.style.display = 'none';
        simpleForm.style.display = 'block';
      }
      resultSection.classList.remove('show');
    });
  });

  const btnCalculateDetailed = document.getElementById('btn-calculate-detailed');
  if (btnCalculateDetailed) {
    btnCalculateDetailed.addEventListener('click', () => {
      const inputs = {
        revenue: parseNumber(document.getElementById('revenue').value),
        expenses: parseNumber(document.getElementById('deductible-expenses').value),
        otherIncome: parseNumber(document.getElementById('other-income').value),
        exemptIncome: parseNumber(document.getElementById('exempt-income').value),
        previousLosses: parseNumber(document.getElementById('previous-losses').value),
        businessType: document.getElementById('business-type').value,
        rdFundPercent: parseFloat(document.getElementById('rd-fund').value) / 100
      };

      if (inputs.revenue === 0) return alert('Vui lòng nhập doanh thu!');
      const res = calculateDetailedTaxLogic(inputs);
      displayDetailedResults(res);
    });
  }

  const btnCalculateSimple = document.getElementById('btn-calculate-simple');
  if (btnCalculateSimple) {
    btnCalculateSimple.addEventListener('click', () => {
      const revenue = parseNumber(document.getElementById('simple-revenue').value);
      const sector = document.getElementById('business-sector').value;
      if (revenue === 0) return alert('Vui lòng nhập doanh thu!');
      const res = calculateSimpleTaxLogic(revenue, sector);
      displaySimpleResults(res);
    });
  }

  // Format all number inputs
  document.querySelectorAll('input[type="text"]').forEach(input => {
    if (input.id !== 'rd-fund') {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value) e.target.value = parseInt(value).toLocaleString('vi-VN');
      });
    }
  });

  function displayDetailedResults(data) {
    document.getElementById('result-revenue').textContent = formatCurrency(data.revenue);
    document.getElementById('result-expenses').textContent = formatCurrency(data.expenses);
    document.getElementById('result-other-income').textContent = formatCurrency(data.otherIncome);
    document.getElementById('result-taxable-income').textContent = formatCurrency(data.taxableIncome);
    document.getElementById('result-exempt').textContent = formatCurrency(data.exemptIncome);
    document.getElementById('result-losses').textContent = formatCurrency(data.previousLosses);
    document.getElementById('result-rd-fund').textContent = formatCurrency(data.rdFund);
    document.getElementById('result-income-for-tax').textContent = formatCurrency(data.incomeForTax);
    document.getElementById('result-tax-rate').textContent = (data.taxRate * 100).toFixed(1) + '%';
    document.getElementById('result-total-tax').textContent = formatCurrency(data.totalTax);
    document.getElementById('detailed-results').style.display = 'block';
    document.getElementById('simple-results').style.display = 'none';
    resultSection.classList.add('show');
  }

  function displaySimpleResults(data) {
    document.getElementById('simple-result-revenue').textContent = formatCurrency(data.revenue);
    document.getElementById('simple-result-rate').textContent = (data.rate * 100).toFixed(1) + '%';
    document.getElementById('simple-result-total').textContent = formatCurrency(data.totalTax);
    document.getElementById('detailed-results').style.display = 'none';
    document.getElementById('simple-results').style.display = 'block';
    resultSection.classList.add('show');
  }

  function parseNumber(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/\./g, '').replace(',', '.')) || 0;
  }

  function formatCurrency(num) {
    return Math.round(num).toLocaleString('vi-VN') + ' đ';
  }
});

function calculateDetailedTaxLogic(inputs) {
  const taxableIncome = inputs.revenue - inputs.expenses + inputs.otherIncome;
  let incomeForTax = Math.max(0, taxableIncome - inputs.exemptIncome - inputs.previousLosses);
  const rdFund = incomeForTax * Math.min(inputs.rdFundPercent || 0, 0.10);
  const finalIncomeForTax = incomeForTax - rdFund;

  let taxRate = TAX_RATES.general;
  if (inputs.businessType === 'small') taxRate = TAX_RATES.small;
  else if (inputs.businessType === 'oil-gas') taxRate = TAX_RATES['oil-gas-min'];
  else if (inputs.businessType === 'rare-resources') taxRate = TAX_RATES['rare-resources'];

  return {
    ...inputs,
    taxableIncome,
    incomeForTax,
    rdFund,
    taxRate,
    totalTax: finalIncomeForTax * taxRate
  };
}

function calculateSimpleTaxLogic(revenue, sector) {
  const rate = SIMPLE_RATES[sector] || 0.01;
  return { revenue, rate, totalTax: revenue * rate };
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateDetailedTaxLogic, calculateSimpleTaxLogic };
}
