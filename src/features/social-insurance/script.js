/**
 * Social Insurance & Pension Calculator
 */

document.addEventListener('DOMContentLoaded', function () {
  const salaryInput = document.getElementById('salary');
  if (!salaryInput) return;

  const regionSelect = document.getElementById('region');
  const btnCalculateContribution = document.getElementById('btn-calculate-contribution');
  const btnResetContribution = document.getElementById('btn-reset-contribution');
  const contributionResults = document.getElementById('contribution-results');

  const avgSalaryInput = document.getElementById('avg-salary');
  const yearsContributedInput = document.getElementById('years-contributed');
  const genderSelect = document.getElementById('gender');
  const btnCalculatePension = document.getElementById('btn-calculate-pension');
  const btnResetPension = document.getElementById('btn-reset-pension');
  const pensionResults = document.getElementById('pension-results');

  const onetimeSalaryInput = document.getElementById('onetime-salary');
  const yearsPre2014Input = document.getElementById('years-pre-2014');
  const yearsPost2014Input = document.getElementById('years-post-2014');
  const btnCalculateOnetime = document.getElementById('btn-calculate-onetime');
  const btnResetOnetime = document.getElementById('btn-reset-onetime');
  const onetimeResults = document.getElementById('onetime-results');

  // Format inputs
  [salaryInput, avgSalaryInput, onetimeSalaryInput].forEach(input => {
    if (input) {
      input.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val) e.target.value = parseInt(val).toLocaleString('vi-VN');
      });
    }
  });

  if (btnCalculateContribution) {
    btnCalculateContribution.addEventListener('click', () => {
      const salary = parseNumber(salaryInput.value);
      const region = parseInt(regionSelect.value);
      if (salary === 0) return alert('Vui lòng nhập lương!');

      if (typeof calculateInsuranceContribution === 'function') {
        const res = calculateInsuranceContribution(salary, region);
        updateContributionDisplay(res, salary);
      }
    });
  }

  function updateContributionDisplay(res, salary) {
    document.getElementById('employee-bhxh').textContent = formatCurrency(res.employee.bhxh);
    document.getElementById('employee-bhyt').textContent = formatCurrency(res.employee.bhyt);
    document.getElementById('employee-bhtn').textContent = formatCurrency(res.employee.bhtn);
    document.getElementById('employee-total').textContent = formatCurrency(res.employee.total);
    document.getElementById('employer-bhxh').textContent = formatCurrency(res.employer.bhxh);
    document.getElementById('employer-bhyt').textContent = formatCurrency(res.employer.bhyt);
    document.getElementById('employer-bhtn').textContent = formatCurrency(res.employer.bhtn);
    document.getElementById('employer-total').textContent = formatCurrency(res.employer.total);
    document.getElementById('salary-before').textContent = formatCurrency(salary);
    document.getElementById('salary-after').textContent = formatCurrency(salary - res.employee.total);
    document.getElementById('total-cost').textContent = formatCurrency(salary + res.employer.total);
    contributionResults.classList.add('show');
  }

  if (btnCalculatePension) {
    btnCalculatePension.addEventListener('click', () => {
      const avgSalary = parseNumber(avgSalaryInput.value);
      const years = parseFloat(yearsContributedInput.value) || 0;
      const gender = genderSelect.value;
      if (avgSalary === 0 || years < 20) return alert('Vui lòng kiểm tra lại thông tin!');

      if (typeof calculatePensionAmount === 'function') {
        const res = calculatePensionAmount(avgSalary, years, gender);
        updatePensionDisplay(res, avgSalary, years);
      }
    });
  }

  function updatePensionDisplay(res, avgSalary, years) {
    document.getElementById('pension-avg-salary').textContent = formatCurrency(avgSalary);
    document.getElementById('pension-years').textContent = years + ' năm';
    document.getElementById('pension-rate').textContent = (res.rate * 100).toFixed(1) + '%';
    document.getElementById('pension-amount').textContent = formatCurrency(res.monthly);
    document.getElementById('pension-yearly').textContent = formatCurrency(res.yearly);
    document.getElementById('pension-10years').textContent = formatCurrency(res.yearly * 10);
    document.getElementById('pension-20years').textContent = formatCurrency(res.yearly * 20);
    pensionResults.classList.add('show');
  }

  if (btnCalculateOnetime) {
    btnCalculateOnetime.addEventListener('click', () => {
      const salary = parseNumber(onetimeSalaryInput.value);
      const pre = parseFloat(yearsPre2014Input.value) || 0;
      const post = parseFloat(yearsPost2014Input.value) || 0;
      if (salary === 0 || (pre === 0 && post === 0)) return alert('Vui lòng nhập đầy đủ!');

      if (typeof calculateOneTimeBHXH === 'function') {
        const res = calculateOneTimeBHXH(salary, pre, post);
        document.getElementById('onetime-avg').textContent = formatCurrency(salary);
        document.getElementById('onetime-total-years').textContent = (pre + post) + ' năm';
        document.getElementById('onetime-coefficient').textContent = res.coeff.toFixed(2) + ' tháng';
        document.getElementById('onetime-amount').textContent = formatCurrency(res.amount);
        onetimeResults.classList.add('show');
      }
    });
  }

  function parseNumber(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/\./g, '').replace(',', '.')) || 0;
  }

  function formatCurrency(num) {
    return Math.round(num).toLocaleString('vi-VN') + ' đ';
  }
});
