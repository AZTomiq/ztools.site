function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function parseInputCurrency(val) {
  return parseFloat(val.replace(/[^\d]/g, '')) || 0;
}

document.addEventListener('DOMContentLoaded', () => {
  const salaryInput = document.getElementById('base-salary');

  salaryInput.addEventListener('input', (e) => {
    let value = parseInputCurrency(e.target.value);
    if (value === 0) e.target.value = '';
    else e.target.value = value.toLocaleString('vi-VN');
  });
});

function calculateOT() {
  const salary = parseInputCurrency(document.getElementById('base-salary').value);
  const workingDays = parseFloat(document.getElementById('working-days').value) || 26;
  const workingHours = parseFloat(document.getElementById('working-hours').value) || 8;

  if (salary <= 0) {
    alert("Vui lòng nhập mức lương hợp lệ!");
    return;
  }

  const hourlyRate = salary / (workingDays * workingHours);
  document.getElementById('hourly-rate').textContent = formatVND(hourlyRate);

  // Multipliers (Based on VT Labor Law)
  const MULT = {
    WEEKDAY_DAY: 1.5,
    WEEKDAY_NIGHT: 2.1, // 150% + 30% + (20% * 150%)
    WEEKEND_DAY: 2.0,
    WEEKEND_NIGHT: 2.7, // 200% + 30% + (20% * 200%)
    HOLIDAY_DAY: 3.0,
    HOLIDAY_NIGHT: 3.9  // 300% + 30% + (20% * 300%)
  };

  const inputs = {
    weekdayDay: parseFloat(document.getElementById('weekday-day').value) || 0,
    weekdayNight: parseFloat(document.getElementById('weekday-night').value) || 0,
    weekendDay: parseFloat(document.getElementById('weekend-day').value) || 0,
    weekendNight: parseFloat(document.getElementById('weekend-night').value) || 0,
    holidayDay: parseFloat(document.getElementById('holiday-day').value) || 0,
    holidayNight: parseFloat(document.getElementById('holiday-night').value) || 0
  };

  let totalOTPay = 0;
  const breakdown = [];

  const addBreakdown = (label, hours, mult) => {
    if (hours <= 0) return;
    const pay = hours * hourlyRate * mult;
    totalOTPay += pay;
    breakdown.push({ label, hours, mult, pay });
  };

  const isVi = document.documentElement.lang === 'vi';

  addBreakdown(isVi ? "Ngày thường (Sáng)" : "Weekday (Day)", inputs.weekdayDay, MULT.WEEKDAY_DAY);
  addBreakdown(isVi ? "Ngày thường (Đêm)" : "Weekday (Night)", inputs.weekdayNight, MULT.WEEKDAY_NIGHT);
  addBreakdown(isVi ? "Ngày nghỉ (Sáng)" : "Weekend (Day)", inputs.weekendDay, MULT.WEEKEND_DAY);
  addBreakdown(isVi ? "Ngày nghỉ (Đêm)" : "Weekend (Night)", inputs.weekendNight, MULT.WEEKEND_NIGHT);
  addBreakdown(isVi ? "Ngày Lễ (Sáng)" : "Holiday (Day)", inputs.holidayDay, MULT.HOLIDAY_DAY);
  addBreakdown(isVi ? "Ngày Lễ (Đêm)" : "Holiday (Night)", inputs.holidayNight, MULT.HOLIDAY_NIGHT);

  // Render results
  document.getElementById('total-ot-pay').textContent = formatVND(totalOTPay);
  document.getElementById('final-total').textContent = formatVND(salary + totalOTPay);

  const tbody = document.getElementById('breakdown-body');
  tbody.innerHTML = '';

  breakdown.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>
                <div class="label-muted">${item.label}</div>
                <div>${item.hours}h x ${item.mult * 100}%</div>
            </td>
            <td class="val-bold">${formatVND(item.pay)}</td>
        `;
    tbody.appendChild(row);
  });

  document.getElementById('result-box').style.display = 'block';

  // Smooth scroll to result
  if (window.innerWidth <= 900) {
    document.getElementById('result-box').scrollIntoView({ behavior: 'smooth' });
  }
}
