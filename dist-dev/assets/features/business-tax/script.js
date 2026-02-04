/**
 * Business Tax Calculator UI
 */

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
        revenue: parseNumber(detailedForm.querySelector('#revenue').value),
        expenses: parseNumber(detailedForm.querySelector('#deductible-expenses').value),
        otherIncome: parseNumber(detailedForm.querySelector('#other-income').value),
        exemptIncome: parseNumber(detailedForm.querySelector('#exempt-income').value),
        previousLosses: parseNumber(detailedForm.querySelector('#previous-losses').value),
        businessType: detailedForm.querySelector('#business-type').value,
        rdFundPercent: parseFloat(detailedForm.querySelector('#rd-fund').value) / 100
      };

      if (inputs.revenue === 0 && inputs.otherIncome === 0) {
        alert('Vui lòng nhập doanh thu!');
        return;
      }

      if (typeof calculateDetailedTaxLogic === 'function') {
        const res = calculateDetailedTaxLogic(inputs);
        displayDetailedResults(res);
      } else {
        console.error('calculateDetailedTaxLogic function not found.');
      }
    });
  }

  const btnCalculateSimple = document.getElementById('btn-calculate-simple');
  if (btnCalculateSimple) {
    btnCalculateSimple.addEventListener('click', () => {
      const revenueInput = simpleForm.querySelector('#simple-revenue');
      const sectorSelect = simpleForm.querySelector('#business-sector');

      const revenue = parseNumber(revenueInput.value);
      const sector = sectorSelect.value;

      if (revenue === 0) {
        alert('Vui lòng nhập doanh thu!');
        return;
      }

      if (typeof calculateSimpleTaxLogic === 'function') {
        const res = calculateSimpleTaxLogic(revenue, sector);
        displaySimpleResults(res);
      } else {
        console.error('calculateSimpleTaxLogic function not found.');
      }
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
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }

  function displaySimpleResults(data) {
    document.getElementById('simple-result-revenue').textContent = formatCurrency(data.revenue);
    document.getElementById('simple-result-rate').textContent = (data.rate * 100).toFixed(1) + '%';
    document.getElementById('simple-result-total').textContent = formatCurrency(data.totalTax);
    document.getElementById('detailed-results').style.display = 'none';
    document.getElementById('simple-results').style.display = 'block';
    resultSection.classList.add('show');
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }

  function parseNumber(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/\./g, '').replace(',', '.')) || 0;
  }

  function formatCurrency(num) {
    return Math.round(num).toLocaleString('vi-VN') + ' đ';
  }
});
