// Business Tax Calculator (Thuế TNDN)

// Tax rates configuration
const TAX_RATES = {
  general: 0.20,        // 20% - Doanh nghiệp phổ thông
  small: 0.20,          // 20% - DN doanh thu ≤ 20 tỷ
  'oil-gas-min': 0.32,  // 32% - Dầu khí (min)
  'oil-gas-max': 0.50,  // 50% - Dầu khí (max)
  'rare-resources': 0.40 // 40% - Tài nguyên quý hiếm
};

// Simple method rates (% on revenue)
const SIMPLE_RATES = {
  goods: 0.01,    // 1% - Kinh doanh hàng hóa
  services: 0.05, // 5% - Dịch vụ
  other: 0.02     // 2% - Hoạt động khác
};

// DOM Elements
const methodRadios = document.querySelectorAll('input[name="calculation-method"]');
const detailedForm = document.getElementById('detailed-form');
const simpleForm = document.getElementById('simple-form');
const resultSection = document.getElementById('result-section');
const detailedResults = document.getElementById('detailed-results');
const simpleResults = document.getElementById('simple-results');

// Detailed form elements
const revenueInput = document.getElementById('revenue');
const expensesInput = document.getElementById('deductible-expenses');
const otherIncomeInput = document.getElementById('other-income');
const exemptIncomeInput = document.getElementById('exempt-income');
const previousLossesInput = document.getElementById('previous-losses');
const businessTypeSelect = document.getElementById('business-type');
const rdFundInput = document.getElementById('rd-fund');

// Simple form elements
const simpleRevenueInput = document.getElementById('simple-revenue');
const businessSectorSelect = document.getElementById('business-sector');

// Buttons
const btnCalculateDetailed = document.getElementById('btn-calculate-detailed');
const btnResetDetailed = document.getElementById('btn-reset-detailed');
const btnCalculateSimple = document.getElementById('btn-calculate-simple');
const btnResetSimple = document.getElementById('btn-reset-simple');

// Utility Functions
function parseNumber(str) {
  if (!str) return 0;
  return parseFloat(str.toString().replace(/[^\d.-]/g, '')) || 0;
}

function formatCurrency(num) {
  if (num === 0) return '0 đ';
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  return sign + absNum.toLocaleString('vi-VN') + ' đ';
}

function formatPercent(num) {
  return (num * 100).toFixed(1) + '%';
}

function formatNumberInput(input) {
  input.addEventListener('input', function (e) {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value) {
      e.target.value = parseInt(value).toLocaleString('vi-VN');
    }
  });

  input.addEventListener('blur', function (e) {
    if (!e.target.value) {
      e.target.value = '0';
    }
  });
}

// Format all number inputs
[revenueInput, expensesInput, otherIncomeInput, exemptIncomeInput,
  previousLossesInput, simpleRevenueInput].forEach(formatNumberInput);

// Method Selection
methodRadios.forEach(radio => {
  radio.addEventListener('change', function () {
    if (this.value === 'detailed') {
      detailedForm.style.display = 'block';
      simpleForm.style.display = 'none';
      resultSection.classList.remove('show');
    } else {
      detailedForm.style.display = 'none';
      simpleForm.style.display = 'block';
      resultSection.classList.remove('show');
    }
  });
});

// Detailed Calculation
function calculateDetailedTax() {
  // Get input values
  const revenue = parseNumber(revenueInput.value);
  const expenses = parseNumber(expensesInput.value);
  const otherIncome = parseNumber(otherIncomeInput.value);
  const exemptIncome = parseNumber(exemptIncomeInput.value);
  const previousLosses = parseNumber(previousLossesInput.value);
  const businessType = businessTypeSelect.value;
  const rdFundPercent = parseFloat(rdFundInput.value) / 100;

  // Validation
  if (revenue === 0) {
    alert('Vui lòng nhập doanh thu!');
    revenueInput.focus();
    return;
  }

  // Step 1: Calculate taxable income (Thu nhập chịu thuế)
  const taxableIncome = revenue - expenses + otherIncome;

  // Step 2: Calculate income for tax (Thu nhập tính thuế)
  let incomeForTax = taxableIncome - exemptIncome - previousLosses;

  // Ensure non-negative
  if (incomeForTax < 0) {
    incomeForTax = 0;
  }

  // Step 3: Calculate R&D fund deduction (Quỹ KH&CN)
  let rdFund = 0;
  if (rdFundPercent > 0 && incomeForTax > 0) {
    rdFund = incomeForTax * Math.min(rdFundPercent, 0.10); // Max 10%
  }

  // Step 4: Calculate final taxable income
  const finalIncomeForTax = incomeForTax - rdFund;

  // Step 5: Get tax rate based on business type
  let taxRate = TAX_RATES.general;
  if (businessType === 'small') {
    taxRate = TAX_RATES.small;
  } else if (businessType === 'oil-gas') {
    taxRate = TAX_RATES['oil-gas-min']; // Use minimum rate
  } else if (businessType === 'rare-resources') {
    taxRate = TAX_RATES['rare-resources'];
  }

  // Step 6: Calculate tax
  const totalTax = finalIncomeForTax * taxRate;

  // Display results
  displayDetailedResults({
    revenue,
    expenses,
    otherIncome,
    taxableIncome,
    exemptIncome,
    previousLosses,
    rdFund,
    incomeForTax,
    taxRate,
    totalTax
  });
}

function displayDetailedResults(data) {
  document.getElementById('result-revenue').textContent = formatCurrency(data.revenue);
  document.getElementById('result-expenses').textContent = formatCurrency(data.expenses);
  document.getElementById('result-other-income').textContent = formatCurrency(data.otherIncome);
  document.getElementById('result-taxable-income').textContent = formatCurrency(data.taxableIncome);
  document.getElementById('result-exempt').textContent = formatCurrency(data.exemptIncome);
  document.getElementById('result-losses').textContent = formatCurrency(data.previousLosses);
  document.getElementById('result-rd-fund').textContent = formatCurrency(data.rdFund);
  document.getElementById('result-income-for-tax').textContent = formatCurrency(data.incomeForTax);
  document.getElementById('result-tax-rate').textContent = formatPercent(data.taxRate);
  document.getElementById('result-total-tax').textContent = formatCurrency(data.totalTax);

  // Show results
  detailedResults.style.display = 'block';
  simpleResults.style.display = 'none';
  resultSection.classList.add('show');

  // Scroll to results
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Simple Calculation
function calculateSimpleTax() {
  const revenue = parseNumber(simpleRevenueInput.value);
  const sector = businessSectorSelect.value;

  // Validation
  if (revenue === 0) {
    alert('Vui lòng nhập doanh thu!');
    simpleRevenueInput.focus();
    return;
  }

  // Get rate based on sector
  const rate = SIMPLE_RATES[sector];

  // Calculate tax
  const totalTax = revenue * rate;

  // Display results
  displaySimpleResults({
    revenue,
    rate,
    totalTax
  });
}

function displaySimpleResults(data) {
  document.getElementById('simple-result-revenue').textContent = formatCurrency(data.revenue);
  document.getElementById('simple-result-rate').textContent = formatPercent(data.rate);
  document.getElementById('simple-result-total').textContent = formatCurrency(data.totalTax);

  // Show results
  detailedResults.style.display = 'none';
  simpleResults.style.display = 'block';
  resultSection.classList.add('show');

  // Scroll to results
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Reset Functions
function resetDetailedForm() {
  revenueInput.value = '';
  expensesInput.value = '';
  otherIncomeInput.value = '';
  exemptIncomeInput.value = '';
  previousLossesInput.value = '';
  businessTypeSelect.value = 'general';
  rdFundInput.value = '0';
  resultSection.classList.remove('show');
}

function resetSimpleForm() {
  simpleRevenueInput.value = '';
  businessSectorSelect.value = 'goods';
  resultSection.classList.remove('show');
}

// Event Listeners
btnCalculateDetailed.addEventListener('click', calculateDetailedTax);
btnResetDetailed.addEventListener('click', resetDetailedForm);
btnCalculateSimple.addEventListener('click', calculateSimpleTax);
btnResetSimple.addEventListener('click', resetSimpleForm);

// Allow Enter key to calculate
detailedForm.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    calculateDetailedTax();
  }
});

simpleForm.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    calculateSimpleTax();
  }
});

// Initialize with some example values (optional)
// Uncomment to pre-fill for testing
/*
revenueInput.value = '10,000,000,000';
expensesInput.value = '7,000,000,000';
otherIncomeInput.value = '500,000,000';
*/
