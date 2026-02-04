/**
 * OT Calculator UI
 */

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(amount));
}

function parseInputCurrency(val) {
  return parseFloat(val.toString().replace(/[^\d]/g, '')) || 0;
}

document.addEventListener('DOMContentLoaded', () => {
  const salaryInput = document.getElementById('base-salary');
  if (!salaryInput) return;

  salaryInput.addEventListener('input', (e) => {
    let value = parseInputCurrency(e.target.value);
    if (value === 0) e.target.value = '';
    else e.target.value = value.toLocaleString('vi-VN');
  });

  const btnCalc = document.getElementById('btn-calculate');
  if (btnCalc) {
    btnCalc.addEventListener('click', calculateOT);
  }
});

function calculateOT() {
  const salary = parseInputCurrency(document.getElementById('base-salary').value);
  const workingDays = parseFloat(document.getElementById('working-days').value) || 26;
  const workingHours = parseFloat(document.getElementById('working-hours').value) || 8;

  if (salary <= 0) {
    alert("Vui lòng nhập mức lương hợp lệ!");
    return;
  }

  const otHours = {
    weekdayDay: parseFloat(document.getElementById('weekday-day').value) || 0,
    weekdayNight: parseFloat(document.getElementById('weekday-night').value) || 0,
    weekendDay: parseFloat(document.getElementById('weekend-day').value) || 0,
    weekendNight: parseFloat(document.getElementById('weekend-night').value) || 0,
    holidayDay: parseFloat(document.getElementById('holiday-day').value) || 0,
    holidayNight: parseFloat(document.getElementById('holiday-night').value) || 0
  };

  if (typeof calculateOTLogic === 'function') {
    const res = calculateOTLogic(salary, workingDays, workingHours, otHours);

    // Render results
    document.getElementById('hourly-rate').textContent = formatVND(res.hourlyRate);
    document.getElementById('total-ot-pay').textContent = formatVND(res.totalOTPay);
    document.getElementById('final-total').textContent = formatVND(res.finalTotal);

    const tbody = document.getElementById('breakdown-body');
    tbody.innerHTML = '';

    const labels = {
      weekday_day: document.documentElement.lang === 'vi' ? 'Ngày thường (Sáng)' : 'Weekday (Day)',
      weekday_night: document.documentElement.lang === 'vi' ? 'Ngày thường (Đêm)' : 'Weekday (Night)',
      weekend_day: document.documentElement.lang === 'vi' ? 'Ngày nghỉ (Sáng)' : 'Weekend (Day)',
      weekend_night: document.documentElement.lang === 'vi' ? 'Ngày nghỉ (Đêm)' : 'Weekend (Night)',
      holiday_day: document.documentElement.lang === 'vi' ? 'Ngày Lễ (Sáng)' : 'Holiday (Day)',
      holiday_night: document.documentElement.lang === 'vi' ? 'Ngày Lễ (Đêm)' : 'Holiday (Night)'
    };

    res.breakdown.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>
                    <div class="label-muted">${labels[item.label] || item.label}</div>
                    <div>${item.hours}h x ${item.mult * 100}%</div>
                </td>
                <td class="val-bold">${formatVND(item.pay)}</td>
            `;
      tbody.appendChild(row);
    });

    document.getElementById('result-box').style.display = 'block';

    if (window.innerWidth <= 900) {
      document.getElementById('result-box').scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    console.error('calculateOTLogic function not found.');
  }
}
