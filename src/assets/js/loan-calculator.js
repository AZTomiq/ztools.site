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

    const monthlyRate = yearlyRate / 100 / 12;
    let schedule = [];
    let totalInterest = 0;
    let totalPayment = 0;
    let firstMonthPayment = 0;

    let currentPrincipal = principal;
    const startDate = startDateInput ? new Date(startDateInput.value) : new Date();

    if (method === 'reducing') {
      // Dư nợ giảm dần (Reducing Balance)
      // PMT = P * r * (1+r)^n / ((1+r)^n - 1)
      // But usually in VN banks, "Dư nợ giảm dần" implies fixed principal payment + variable interest
      // Wait, there are TWO types of "reducing balance":
      // 1. Annuity (EMI): Fixed monthly payment. Interest decreases, Principal increases.
      // 2. Linear (Fixed Principal): Principal/Propotion is fixed. Interest decreases. Monthly payment decreases.

      // "Dư nợ giảm dần" in VN usually refers to Type 2 (Fixed Principal), 
      // but "Trả góp" usually implies Type 1 (EMI).
      // Let's implement Type 1 (EMI) as Standard Reducing Balance, 
      // and Type 2 as "Dư nợ giảm dần (Gốc đều)".
      // Actually, based on typical demand, let's look at the label in UI.
      // Usually simpler:
      // - Dư nợ giảm dần (Paying debt on reducing balance) -> usually means Interest is calculated on remaining balance. Payment can be fixed or decreasing.
      // - Dư nợ ban đầu (Flat rate) -> Interest calculated on original principal.

      // Let's implement typical bank style:
      // Method 1: Dư nợ giảm dần (Gốc chia đều) - Most common in VN commercial loans.
      // Monthly Principal = Principal / Months
      // Monthly Interest = Remaining Principal * Monthly Rate
      // Total Monthly = Principal + Interest (Decreasing over time)

      const principalPerMonth = principal / termMonths;

      for (let i = 1; i <= termMonths; i++) {
        const interestPayment = currentPrincipal * monthlyRate;
        const principalPayment = i === termMonths ? currentPrincipal : principalPerMonth; // Adjust last month
        const totalMonthPayment = principalPayment + interestPayment;

        totalInterest += interestPayment;
        totalPayment += totalMonthPayment;

        // For "First Month Payment" display
        if (i === 1) firstMonthPayment = totalMonthPayment;

        // Date Calculation
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
      // Dư nợ ban đầu (Flat Rate)
      // Monthly Principal = Principal / Months
      // Monthly Interest = Principal (Original) * Monthly Rate
      // Monthly Payment = Fixed

      const principalPerMonth = principal / termMonths;
      const interestPayment = principal * monthlyRate;
      const totalMonthPayment = principalPerMonth + interestPayment;

      firstMonthPayment = totalMonthPayment; // It's constant actually

      for (let i = 1; i <= termMonths; i++) {
        // Adjust last month principal round off
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

    // Render Results
    resultMonthly.textContent = formatCurrency(firstMonthPayment);
    resultTotalInterest.textContent = formatCurrency(totalInterest);
    resultTotalPayment.textContent = formatCurrency(totalPayment);

    renderSchedule(schedule);
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
