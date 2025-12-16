// Social Insurance & Pension Calculator

// Constants
const INSURANCE_RATES = {
  employee: {
    bhxh: 0.08,   // 8% BHXH
    bhyt: 0.015,  // 1.5% BHYT
    bhtn: 0.01    // 1% BHTN
  },
  employer: {
    bhxh: 0.175,  // 17.5% BHXH
    bhyt: 0.03,   // 3% BHYT
    bhtn: 0.01    // 1% BHTN
  }
};

const CAPS = {
  bhxh_bhyt: 46800000,  // Trần BHXH, BHYT: 46.8M
  bhtn_multiplier: 20   // Trần BHTN = 20 × Lương tối thiểu vùng
};

const MIN_WAGES = {
  1: 4960000,  // Vùng I
  2: 4410000,  // Vùng II
  3: 3860000,  // Vùng III
  4: 3450000   // Vùng IV
};

const PENSION_RATES = {
  base: 0.45,           // 45% for first 20 years
  additional: 0.02,     // 2% per additional year
  max: 0.75,            // Maximum 75%
  min_years: 20         // Minimum 20 years
};

// Utility Functions
function parseNumber(str) {
  if (!str) return 0;
  return parseFloat(str.toString().replace(/[^\d.-]/g, '')) || 0;
}

function formatCurrency(num) {
  if (num === 0) return '0 đ';
  return Math.round(num).toLocaleString('vi-VN') + ' đ';
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

// Tab Switching
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  // Remove active from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(`tab-${tabName}`).classList.add('active');
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // Hide all results
  document.querySelectorAll('.result-section').forEach(section => {
    section.classList.remove('show');
  });
}

// Make switchTab global
window.switchTab = switchTab;

// DOM Elements - Contribution
const salaryInput = document.getElementById('salary');
const regionSelect = document.getElementById('region');
const insuranceTypeSelect = document.getElementById('insurance-type');
const btnCalculateContribution = document.getElementById('btn-calculate-contribution');
const btnResetContribution = document.getElementById('btn-reset-contribution');
const contributionResults = document.getElementById('contribution-results');

// DOM Elements - Pension
const avgSalaryInput = document.getElementById('avg-salary');
const yearsContributedInput = document.getElementById('years-contributed');
const genderSelect = document.getElementById('gender');
const btnCalculatePension = document.getElementById('btn-calculate-pension');
const btnResetPension = document.getElementById('btn-reset-pension');
const pensionResults = document.getElementById('pension-results');

// DOM Elements - One-time
const onetimeSalaryInput = document.getElementById('onetime-salary');
const onetimeYearsInput = document.getElementById('onetime-years');
const btnCalculateOnetime = document.getElementById('btn-calculate-onetime');
const btnResetOnetime = document.getElementById('btn-reset-onetime');
const onetimeResults = document.getElementById('onetime-results');

// Format number inputs
[salaryInput, avgSalaryInput, onetimeSalaryInput].forEach(formatNumberInput);

// ===== CONTRIBUTION CALCULATOR =====
function calculateContribution() {
  const salary = parseNumber(salaryInput.value);
  const region = parseInt(regionSelect.value);

  if (salary === 0) {
    alert('Vui lòng nhập lương đóng BHXH!');
    salaryInput.focus();
    return;
  }

  // Calculate caps
  const bhxhBhytCap = CAPS.bhxh_bhyt;
  const bhtnCap = MIN_WAGES[region] * CAPS.bhtn_multiplier;

  // Apply caps
  const salaryForBhxhBhyt = Math.min(salary, bhxhBhytCap);
  const salaryForBhtn = Math.min(salary, bhtnCap);

  // Calculate employee contributions
  const employeeBhxh = salaryForBhxhBhyt * INSURANCE_RATES.employee.bhxh;
  const employeeBhyt = salaryForBhxhBhyt * INSURANCE_RATES.employee.bhyt;
  const employeeBhtn = salaryForBhtn * INSURANCE_RATES.employee.bhtn;
  const employeeTotal = employeeBhxh + employeeBhyt + employeeBhtn;

  // Calculate employer contributions
  const employerBhxh = salaryForBhxhBhyt * INSURANCE_RATES.employer.bhxh;
  const employerBhyt = salaryForBhxhBhyt * INSURANCE_RATES.employer.bhyt;
  const employerBhtn = salaryForBhtn * INSURANCE_RATES.employer.bhtn;
  const employerTotal = employerBhxh + employerBhyt + employerBhtn;

  // Calculate net salary
  const salaryAfter = salary - employeeTotal;
  const totalCost = salary + employerTotal;

  // Display results
  document.getElementById('employee-bhxh').textContent = formatCurrency(employeeBhxh);
  document.getElementById('employee-bhyt').textContent = formatCurrency(employeeBhyt);
  document.getElementById('employee-bhtn').textContent = formatCurrency(employeeBhtn);
  document.getElementById('employee-total').textContent = formatCurrency(employeeTotal);

  document.getElementById('employer-bhxh').textContent = formatCurrency(employerBhxh);
  document.getElementById('employer-bhyt').textContent = formatCurrency(employerBhyt);
  document.getElementById('employer-bhtn').textContent = formatCurrency(employerBhtn);
  document.getElementById('employer-total').textContent = formatCurrency(employerTotal);

  document.getElementById('salary-before').textContent = formatCurrency(salary);
  document.getElementById('salary-after').textContent = formatCurrency(salaryAfter);
  document.getElementById('total-cost').textContent = formatCurrency(totalCost);

  contributionResults.classList.add('show');
  contributionResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetContribution() {
  salaryInput.value = '';
  regionSelect.value = '1';
  insuranceTypeSelect.value = 'mandatory';
  contributionResults.classList.remove('show');
}

// ===== PENSION CALCULATOR =====
function calculatePension() {
  const avgSalary = parseNumber(avgSalaryInput.value);
  const years = parseFloat(yearsContributedInput.value) || 0;

  if (avgSalary === 0) {
    alert('Vui lòng nhập lương bình quân!');
    avgSalaryInput.focus();
    return;
  }

  if (years < PENSION_RATES.min_years) {
    alert(`Cần đóng tối thiểu ${PENSION_RATES.min_years} năm để được hưởng lương hưu!`);
    yearsContributedInput.focus();
    return;
  }

  // Calculate pension rate
  let pensionRate = PENSION_RATES.base;
  if (years > PENSION_RATES.min_years) {
    const additionalYears = years - PENSION_RATES.min_years;
    pensionRate += additionalYears * PENSION_RATES.additional;
  }
  pensionRate = Math.min(pensionRate, PENSION_RATES.max);

  // Calculate pension amount
  const pensionAmount = avgSalary * pensionRate;
  const yearlyPension = pensionAmount * 12;
  const pension10Years = yearlyPension * 10;
  const pension20Years = yearlyPension * 20;

  // Display results
  document.getElementById('pension-avg-salary').textContent = formatCurrency(avgSalary);
  document.getElementById('pension-years').textContent = years + ' năm';
  document.getElementById('pension-rate').textContent = (pensionRate * 100).toFixed(1) + '%';
  document.getElementById('pension-amount').textContent = formatCurrency(pensionAmount);
  document.getElementById('pension-yearly').textContent = formatCurrency(yearlyPension);
  document.getElementById('pension-10years').textContent = formatCurrency(pension10Years);
  document.getElementById('pension-20years').textContent = formatCurrency(pension20Years);

  pensionResults.classList.add('show');
  pensionResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetPension() {
  avgSalaryInput.value = '';
  yearsContributedInput.value = '';
  genderSelect.value = 'male';
  pensionResults.classList.remove('show');
}

// ===== ONE-TIME BHXH CALCULATOR =====
function calculateOnetime() {
  const salary = parseNumber(onetimeSalaryInput.value);
  const years = parseFloat(onetimeYearsInput.value) || 0;

  if (salary === 0) {
    alert('Vui lòng nhập lương bình quân 6 tháng!');
    onetimeSalaryInput.focus();
    return;
  }

  if (years === 0) {
    alert('Vui lòng nhập số năm đã đóng BHXH!');
    onetimeYearsInput.focus();
    return;
  }

  if (years >= 20) {
    alert('BHXH một lần chỉ áp dụng cho người đóng dưới 20 năm!');
    onetimeYearsInput.focus();
    return;
  }

  // Calculate one-time BHXH
  // Formula: Lương BQ 6 tháng × Số năm × 1.5 tháng
  const coefficient = years * 1.5;
  const onetimeAmount = salary * coefficient;

  // Display results
  document.getElementById('onetime-avg').textContent = formatCurrency(salary);
  document.getElementById('onetime-years-display').textContent = years + ' năm';
  document.getElementById('onetime-coefficient').textContent = coefficient.toFixed(1) + ' tháng';
  document.getElementById('onetime-amount').textContent = formatCurrency(onetimeAmount);

  onetimeResults.classList.add('show');
  onetimeResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetOnetime() {
  onetimeSalaryInput.value = '';
  onetimeYearsInput.value = '';
  onetimeResults.classList.remove('show');
}

// Event Listeners
btnCalculateContribution.addEventListener('click', calculateContribution);
btnResetContribution.addEventListener('click', resetContribution);
btnCalculatePension.addEventListener('click', calculatePension);
btnResetPension.addEventListener('click', resetPension);
btnCalculateOnetime.addEventListener('click', calculateOnetime);
btnResetOnetime.addEventListener('click', resetOnetime);

// Allow Enter key to calculate
document.getElementById('contribution-form').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    calculateContribution();
  }
});

document.getElementById('pension-form').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    calculatePension();
  }
});

document.getElementById('onetime-form').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    calculateOnetime();
  }
});

// Initialize with example values (optional)
// Uncomment for testing
/*
salaryInput.value = '15,000,000';
avgSalaryInput.value = '20,000,000';
yearsContributedInput.value = '25';
onetimeSalaryInput.value = '18,000,000';
onetimeYearsInput.value = '10';
*/
