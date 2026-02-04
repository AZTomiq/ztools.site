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

  if (!amountInput) return;

  // Auto-format currency input
  amountInput.addEventListener('input', function (e) {
    const val = e.target.value.replace(/[^\d]/g, '');
    if (val) {
      e.target.value = new Intl.NumberFormat('vi-VN').format(val);
    } else {
      e.target.value = '';
    }
  });

  // Set default date to today
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

    if (!principal || !termMonths || isNaN(yearlyRate)) {
      alert('Vui lòng nhập đầy đủ thông tin: Số tiền, thời hạn và lãi suất.');
      return;
    }

    if (typeof calculateLoanDetails === 'function') {
      const result = calculateLoanDetails(principal, termMonths, yearlyRate, method, startDateInput ? startDateInput.value : null);

      // Render Results
      resultMonthly.textContent = formatCurrency(result.firstMonthPayment);
      resultTotalInterest.textContent = formatCurrency(result.totalInterest);
      resultTotalPayment.textContent = formatCurrency(result.totalPayment);

      renderSchedule(result.schedule);
      resultSection.classList.add('show');
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error('calculateLoanDetails function not found. logic.js might not be loaded.');
    }
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
    if (methodInputs[0]) methodInputs[0].checked = true;
  }
});
