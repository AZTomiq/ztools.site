/**
 * Lunar Calendar Converter
 * Based on Vietnamese Lunar Calendar algorithms
 */

// Constants
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const ZODIAC_ANIMALS = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];
const TIMEZONE_OFFSET = 7;

document.addEventListener('DOMContentLoaded', function () {
  const today = new Date();
  const solarDateInput = document.getElementById('solar-date-input');
  if (!solarDateInput) return;

  initLunarInputs();
  updateMainCalendar(today);

  const modeToggle = document.getElementById('input-mode-toggle');
  if (modeToggle) modeToggle.addEventListener('click', toggleInputMode);

  solarDateInput.addEventListener('change', handleDateConversion);
  solarDateInput.addEventListener('input', handleDateConversion);

  const lDay = document.getElementById('lunar-day-input');
  const lMonth = document.getElementById('lunar-month-input');
  const lYear = document.getElementById('lunar-year-input');
  const lLeap = document.getElementById('lunar-leap-input');

  [lDay, lMonth, lYear, lLeap].forEach(el => {
    if (el) {
      el.addEventListener('change', handleLunarConversion);
      if (el.tagName === 'INPUT') el.addEventListener('input', handleLunarConversion);
    }
  });

  const prevDayBtn = document.getElementById('prev-day-btn');
  const nextDayBtn = document.getElementById('next-day-btn');
  if (prevDayBtn) prevDayBtn.addEventListener('click', () => {
    const d = new Date(currentSelectedDate);
    d.setDate(d.getDate() - 1);
    updateMainCalendar(d);
  });
  if (nextDayBtn) nextDayBtn.addEventListener('click', () => {
    const d = new Date(currentSelectedDate);
    d.setDate(d.getDate() + 1);
    updateMainCalendar(d);
  });

  renderMonthView(today.getMonth() + 1, today.getFullYear());

  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');
  const todayBtn = document.getElementById('today-btn');

  if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => {
    currentViewMonth--;
    if (currentViewMonth < 1) { currentViewMonth = 12; currentViewYear--; }
    renderMonthView(currentViewMonth, currentViewYear);
  });
  if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => {
    currentViewMonth++;
    if (currentViewMonth > 12) { currentViewMonth = 1; currentViewYear++; }
    renderMonthView(currentViewMonth, currentViewYear);
  });
  if (todayBtn) todayBtn.addEventListener('click', () => {
    const now = new Date();
    currentViewMonth = now.getMonth() + 1;
    currentViewYear = now.getFullYear();
    renderMonthView(currentViewMonth, currentViewYear);
  });

  // Modal Logic
  const viewHoursBtn = document.getElementById('view-hours-btn');
  const hoursModal = document.getElementById('lunar-hours-modal');
  const closeHoursModal = document.getElementById('close-hours-modal');
  const closeHoursOverlay = document.getElementById('close-hours-overlay');

  if (viewHoursBtn && hoursModal) {
    viewHoursBtn.addEventListener('click', () => {
      hoursModal.style.display = 'flex';
      displayGoodHours(currentSelectedDate.getDate(), currentSelectedDate.getMonth() + 1, currentSelectedDate.getFullYear());
    });
  }

  const hideModal = () => { if (hoursModal) hoursModal.style.display = 'none'; };
  if (closeHoursModal) closeHoursModal.addEventListener('click', hideModal);
  if (closeHoursOverlay) closeHoursOverlay.addEventListener('click', hideModal);
});

let currentSelectedDate = new Date();
let currentViewMonth = new Date().getMonth() + 1;
let currentViewYear = new Date().getFullYear();

function updateMainCalendar(date) {
  currentSelectedDate = new Date(date);
  const dd = currentSelectedDate.getDate();
  const mm = currentSelectedDate.getMonth() + 1;
  const yy = currentSelectedDate.getFullYear();

  displayTodayLunar(dd, mm, yy);

  const datePicker = document.getElementById('solar-date-input');
  if (datePicker) datePicker.value = `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;

  currentViewMonth = mm;
  currentViewYear = yy;
  renderMonthView(currentViewMonth, currentViewYear);
}

function displayTodayLunar(dd, mm, yy) {
  const [lunarDay, lunarMonth, lunarYear, lunarLeap] = convertSolar2Lunar(dd, mm, yy);
  const date = new Date(yy, mm - 1, dd);

  const isVietnamese = (document.documentElement.lang || 'vi') === 'vi';
  const weekdays = isVietnamese ? ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = isVietnamese ? ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const elMap = {
    'today-solar-day': dd,
    'today-solar-month': monthNames[mm - 1],
    'today-solar-year': yy,
    'today-solar-weekday': weekdays[date.getDay()],
    'today-lunar-day-month': `${String(lunarDay).padStart(2, '0')}/${String(lunarMonth).padStart(2, '0')}${lunarLeap ? (isVietnamese ? ' (Nhuận)' : ' (Leap)') : ''}`,
    'today-year-canchi': getYearCanChi(lunarYear),
    'today-month-canchi': getMonthCanChi(lunarMonth, lunarYear),
    'today-day-canchi': getDayCanChi(dd, mm, yy),
    'today-zodiac': getZodiacAnimal(lunarYear)
  };

  for (const [id, val] of Object.entries(elMap)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  const solarDayEl = document.getElementById('today-solar-day');
  if (solarDayEl) {
    if (date.getDay() === 0) solarDayEl.classList.add('is-sunday');
    else solarDayEl.classList.remove('is-sunday');
  }

  displayGoodHours(dd, mm, yy);
}

function displayGoodHours(dd, mm, yy) {
  const jd = jdFromDate(dd, mm, yy);
  const goodHours = getGoodHours(jd);
  const modalContainer = document.getElementById('modal-good-hours-list');
  const sideContainer = document.getElementById('side-good-hours-list');

  if (!modalContainer && !sideContainer) return;

  const ranges = [
    '23:00 - 01:00', '01:00 - 03:00', '03:00 - 05:00', '05:00 - 07:00',
    '07:00 - 09:00', '09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00',
    '15:00 - 17:00', '17:00 - 19:00', '19:00 - 21:00', '21:00 - 23:00'
  ];

  const content = [];
  for (let i = 0; i < 12; i++) {
    const isGood = goodHours.includes(i);
    const label = isGood ? 'Hoàng Đạo' : 'Hắc Đạo';
    content.push(`
      <div class="hour-item ${isGood ? 'good' : 'bad'}">
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span class="hour-chi">Giờ ${CHI[i]}</span>
          <span class="hour-range">${ranges[i]}</span>
        </div>
        <span class="hour-status">${label}</span>
      </div>
    `);
  }

  if (modalContainer) modalContainer.innerHTML = content.join('');
  if (sideContainer) sideContainer.innerHTML = content.join('');
}

function handleDateConversion() {
  const datePicker = document.getElementById('solar-date-input');
  if (!datePicker || !datePicker.value) return;
  const [yy, mm, dd] = datePicker.value.split('-').map(Number);
  currentSelectedDate = new Date(yy, mm - 1, dd);
  displayTodayLunar(dd, mm, yy);
}

function handleLunarConversion() {
  const ld = parseInt(document.getElementById('lunar-day-input').value);
  const lm = parseInt(document.getElementById('lunar-month-input').value);
  const ly = parseInt(document.getElementById('lunar-year-input').value);
  const isLeap = document.getElementById('lunar-leap-input').checked ? 1 : 0;
  if (!ld || !lm || !ly) return;
  const [sd, sm, sy] = convertLunar2Solar(ld, lm, ly, isLeap);
  if (sd > 0) updateMainCalendar(new Date(sy, sm - 1, sd));
}

function toggleInputMode() {
  const solarContainer = document.getElementById('solar-input-container');
  const lunarContainer = document.getElementById('lunar-input-container');
  const modeLabel = document.getElementById('current-mode-label');
  const isSolar = solarContainer.style.display !== 'none';

  if (isSolar) {
    solarContainer.style.display = 'none';
    lunarContainer.style.display = 'flex';
    if (modeLabel) modeLabel.textContent = 'Âm lịch';
    const [ld, lm, ly, isLeap] = convertSolar2Lunar(currentSelectedDate.getDate(), currentSelectedDate.getMonth() + 1, currentSelectedDate.getFullYear());
    document.getElementById('lunar-day-input').value = ld;
    document.getElementById('lunar-month-input').value = lm;
    document.getElementById('lunar-year-input').value = ly;
    document.getElementById('lunar-leap-input').checked = !!isLeap;
  } else {
    solarContainer.style.display = 'block';
    lunarContainer.style.display = 'none';
    if (modeLabel) modeLabel.textContent = 'Dương lịch';
  }
}

function renderMonthView(month, year) {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;
  const monthYearDisplay = document.getElementById('current-month-year');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (monthYearDisplay) monthYearDisplay.textContent = `${monthNames[month - 1]} ${year}`;

  grid.innerHTML = '';
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
    const h = document.createElement('div');
    h.className = 'calendar-header';
    h.textContent = day;
    grid.appendChild(h);
  });

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const today = new Date();

  for (let i = firstDay - 1; i >= 0; i--) {
    addCalendarDay(grid, daysInPrevMonth - i, month === 1 ? 12 : month - 1, month === 1 ? year - 1 : year, true);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    addCalendarDay(grid, d, month, year, false, month === today.getMonth() + 1 && year === today.getFullYear() && d === today.getDate());
  }
  const totalCells = grid.children.length - 7;
  const remaining = (Math.ceil(totalCells / 7) * 7) - totalCells;
  for (let d = 1; d <= remaining; d++) {
    addCalendarDay(grid, d, month === 12 ? 1 : month + 1, month === 12 ? year + 1 : year, true);
  }
}

function addCalendarDay(container, day, month, year, isOtherMonth, isToday) {
  const cell = document.createElement('div');
  cell.className = 'calendar-day';
  if (isOtherMonth) cell.classList.add('other-month');
  if (isToday) cell.classList.add('today');

  const [ld, lm, ly, isLeap] = convertSolar2Lunar(day, month, year);
  cell.innerHTML = `<div class="solar-date">${day}</div><div class="lunar-date">${ld}/${lm}</div>`;

  if (!isOtherMonth && day === currentSelectedDate.getDate() && month === currentSelectedDate.getMonth() + 1 && year === currentSelectedDate.getFullYear()) {
    cell.classList.add('selected');
  }

  if (!isOtherMonth) {
    cell.addEventListener('click', () => {
      updateMainCalendar(new Date(year, month - 1, day));
    });
  }
  container.appendChild(cell);
}

function initLunarInputs() {
  const dSelect = document.getElementById('lunar-day-input');
  const mSelect = document.getElementById('lunar-month-input');
  if (dSelect) for (let i = 1; i <= 30; i++) dSelect.add(new Option(i, i));
  if (mSelect) for (let i = 1; i <= 12; i++) mSelect.add(new Option(i, i));
}

// Algorithm Functions
function jdFromDate(dd, mm, yy) {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  return jd;
}

function jdToDate(jd) {
  let a, b, c, d, e, m, day, month, year;
  if (jd > 2299160) {
    a = jd + 32044; b = Math.floor((4 * a + 3) / 146097); c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0; c = jd + 32082;
  }
  d = Math.floor((4 * c + 3) / 1461); e = c - Math.floor((1461 * d) / 4);
  m = Math.floor((5 * e + 2) / 153); day = e - Math.floor((153 * m + 2) / 5) + 1;
  month = m + 3 - 12 * Math.floor(m / 10); year = b * 100 + d - 4800 + Math.floor(m / 10);
  return [day, month, year];
}

function getNewMoonDay(k, timeZone) {
  const T = k / 1236.85; const T2 = T * T; const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr) - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr)) - 0.0074 * Math.sin(dr * (M - Mpr));
  C1 = C1 + 0.0004 * Math.sin(dr * (2 * F + M)) - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat = T < -11 ? (0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3) : (-0.000278 + 0.000265 * T + 0.000262 * T2);
  return Math.floor(Jd1 + C1 - deltat + 0.5 + timeZone / 24);
}

function getSunLongitude(jdn, timeZone) {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const dr = Math.PI / 180;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T * T - 0.00000048 * T * T * T;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T * T;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T * T) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L = L - Math.PI * 2 * (Math.floor(L / (Math.PI * 2)));
  return Math.floor(L / Math.PI * 6 + 1e-9);
}

function getLunarMonth11(yy, timeZone) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  if (getSunLongitude(nm, timeZone) >= 9) nm = getNewMoonDay(k - 1, timeZone);
  return nm;
}

function getLeapMonthOffset(a11, timeZone) {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0, i = 1, arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do { last = arc; i++; arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone); } while (arc != last && i < 14);
  return i - 1;
}

function convertSolar2Lunar(dd, mm, yy, timeZone = TIMEZONE_OFFSET) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, timeZone);
  let a11 = getLunarMonth11(yy, timeZone), b11 = a11, lunarYear;
  if (a11 >= monthStart) { lunarYear = yy; a11 = getLunarMonth11(yy - 1, timeZone); }
  else { lunarYear = yy + 1; b11 = getLunarMonth11(yy + 1, timeZone); }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29.53 + 0.5);
  let lunarLeap = 0, lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapOff) { lunarMonth = diff + 10; if (diff == leapOff) lunarLeap = 1; }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return [lunarDay, lunarMonth, lunarYear, lunarLeap];
}

function convertLunar2Solar(ld, lm, ly, isLeap, timeZone = TIMEZONE_OFFSET) {
  let a11, b11;
  if (lm < 11) { a11 = getLunarMonth11(ly - 1, timeZone); b11 = getLunarMonth11(ly, timeZone); }
  else { a11 = getLunarMonth11(ly, timeZone); b11 = getLunarMonth11(ly + 1, timeZone); }
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = (lm - 11 < 0) ? (lm + 1) : (lm - 11);
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    if (isLeap != 0 && lm + 1 != leapOff) return [0, 0, 0];
    if (isLeap != 0 || off >= leapOff) off += 1;
  }
  return jdToDate(getNewMoonDay(k + off, timeZone) + ld - 1);
}

function getYearCanChi(y) { return CAN[(y + 6) % 10] + ' ' + CHI[(y + 8) % 12]; }
function getMonthCanChi(m, y) { return CAN[(y * 12 + m + 3) % 10] + ' ' + CHI[(m + 1) % 12]; }
function getDayCanChi(d, m, y) { const jd = jdFromDate(d, m, y); return CAN[(jd + 9) % 10] + ' ' + CHI[(jd + 1) % 12]; }
function getZodiacAnimal(y) { return ZODIAC_ANIMALS[(y + 8) % 12]; }
function getGoodHours(jd) {
  const chi = (jd + 1) % 12;
  const map = { 0: [0, 1, 3, 6, 8, 9], 1: [2, 3, 5, 8, 10, 11], 2: [0, 1, 4, 5, 7, 10], 3: [0, 2, 3, 6, 7, 9], 4: [2, 4, 5, 8, 9, 11], 5: [1, 4, 6, 7, 10, 11], 6: [0, 1, 3, 6, 8, 9], 7: [2, 3, 5, 8, 10, 11], 8: [0, 1, 4, 5, 7, 10], 9: [0, 2, 3, 6, 7, 9], 10: [2, 4, 5, 8, 9, 11], 11: [1, 4, 6, 7, 10, 11] };
  return map[chi] || [];
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    jdFromDate, jdToDate, convertSolar2Lunar, convertLunar2Solar,
    getYearCanChi, getMonthCanChi, getDayCanChi, getZodiacAnimal, getGoodHours
  };
}
