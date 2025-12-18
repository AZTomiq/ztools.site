function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
}

function parseCurrency(str) {
  if (!str) return 0;
  return parseInt(str.replace(/[^\d]/g, ''), 10) || 0;
}

document.addEventListener('DOMContentLoaded', () => {
  // Inputs
  const amountInput = document.getElementById('loan-amount');
  const termInput = document.getElementById('loan-term');
  const rateInput = document.getElementById('interest-rate');
  const methodInputs = document.getElementsByName('calculation-method');
  const startDateInput = document.getElementById('start-date');

  // Display fields
  const resultSection = document.getElementById('result-section');
  const resultMonthly = document.getElementById('result-monthly');
  const resultTotalInterest = document.getElementById('result-total-interest');
  const resultTotalPayment = document.getElementById('result-total-payment');
  const scheduleBody = document.getElementById('schedule-body');

  // Buttons
  const btnCalculate = document.getElementById('btn-calculate');
  const btnReset = document.getElementById('btn-reset');

  // Auto-format currency input
  amountInput.addEventListener('input', function (e) {
    const val = e.target.value.replace(/[^\d]/g, '');
    if (val) {
      e.target.value = new Intl.NumberFormat('vi-VN').format(val);
    } else {
      e.target.value = '';
    }
  });

  // Set default date to today (first day of next month usually preferred, but today is fine)
  if (startDateInput) {
    startDateInput.valueAsDate = new Date();
  }

  btnCalculate.addEventListener('click', calculateLoan);
  btnReset.addEventListener('click', resetForm);

  function calculateLoan() {
    const principal = parseCurrency(amountInput.value);
    const termMonths = parseInt(termInput.value, 10);
    const yearlyRate = parseFloat(rateInput.value);

    let method = 'reducing';
    for (const radio of methodInputs) {
      if (radio.checked) {
        method = radio.value;
        break;
      }
    }

    if (!principal || !termMonths || !yearlyRate) {
      alert('Vui lòng nhập đầy đủ thông tin: Số tiền, thời hạn và lãi suất.');
      return;
    }

    const result = calculateLoanDetails(principal, termMonths, yearlyRate, method, startDateInput ? startDateInput.value : null);

    // Render Results
    resultMonthly.textContent = formatCurrency(result.firstMonthPayment);
    resultTotalInterest.textContent = formatCurrency(result.totalInterest);
    resultTotalPayment.textContent = formatCurrency(result.totalPayment);

    renderSchedule(result.schedule);
    resultSection.classList.add('show');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderSchedule(data) {
    let html = '';
    data.forEach(item => {
      html += `
                <tr>
                    <td class="month-col">${item.month}</td>
                    <td>${item.date}</td>
                    <td>${formatCurrency(item.remaining > 0 ? item.remaining + item.principal : item.principal)}</td> <!-- Dư nợ đầu kỳ -->
                    <td>${formatCurrency(item.principal)}</td>
                    <td>${formatCurrency(item.interest)}</td>
                    <td style="font-weight:bold">${formatCurrency(item.payment)}</td>
                    <td>${formatCurrency(Math.abs(item.remaining))}</td> <!-- Dư nợ cuối kỳ -->
                </tr>
            `;
    });
    scheduleBody.innerHTML = html;
  }

  function resetForm() {
    amountInput.value = '';
    termInput.value = '';
    rateInput.value = '';
    resultSection.classList.remove('show');
    scheduleBody.innerHTML = '';
    methodInputs[0].checked = true;
  }
});

function calculateLoanDetails(principal, termMonths, yearlyRate, method, startDateStr) {
  const monthlyRate = yearlyRate / 100 / 12;
  let schedule = [];
  let totalInterest = 0;
  let totalPayment = 0;
  let firstMonthPayment = 0;

  let currentPrincipal = principal;
  const startDate = startDateStr ? new Date(startDateStr) : new Date();

  if (method === 'reducing') {
    const principalPerMonth = principal / termMonths;
    for (let i = 1; i <= termMonths; i++) {
      const interestPayment = currentPrincipal * monthlyRate;
      const principalPayment = i === termMonths ? currentPrincipal : principalPerMonth;
      const totalMonthPayment = principalPayment + interestPayment;

      totalInterest += interestPayment;
      totalPayment += totalMonthPayment;
      if (i === 1) firstMonthPayment = totalMonthPayment;

      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);

      schedule.push({
        month: i,
        date: date.toLocaleDateString('vi-VN'),
        principal: principalPayment,
        interest: interestPayment,
        payment: totalMonthPayment,
        remaining: currentPrincipal - principalPayment
      });
      currentPrincipal -= principalPayment;
    }
  } else {
    const principalPerMonth = principal / termMonths;
    const interestPayment = principal * monthlyRate;
    const totalMonthPayment = principalPerMonth + interestPayment;
    firstMonthPayment = totalMonthPayment;

    for (let i = 1; i <= termMonths; i++) {
      const principalPayment = i === termMonths ? currentPrincipal : principalPerMonth;
      const totalCurrent = principalPayment + interestPayment;

      totalInterest += interestPayment;
      totalPayment += totalCurrent;

      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);

      schedule.push({
        month: i,
        date: date.toLocaleDateString('vi-VN'),
        principal: principalPayment,
        interest: interestPayment,
        payment: totalCurrent,
        remaining: currentPrincipal - principalPayment
      });
      currentPrincipal -= principalPayment;
    }
  }

  return { schedule, totalInterest, totalPayment, firstMonthPayment };
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateLoanDetails };
}
