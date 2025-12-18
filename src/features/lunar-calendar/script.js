/**
 * Lunar Calendar Converter
 * Based on Vietnamese Lunar Calendar algorithms
 */

// Constants
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const ZODIAC_ANIMALS = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];

// Timezone offset for Vietnam (UTC+7)
const TIMEZONE_OFFSET = 7;

/**
 * Calculate Julian Day Number from date
 */
function jdFromDate(dd, mm, yy) {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

/**
 * Calculate date from Julian Day Number
 */
function jdToDate(jd) {
  let a, b, c, d, e, m, day, month, year;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  d = Math.floor((4 * c + 3) / 1461);
  e = c - Math.floor((1461 * d) / 4);
  m = Math.floor((5 * e + 2) / 153);
  day = e - Math.floor((153 * m + 2) / 5) + 1;
  month = m + 3 - 12 * Math.floor(m / 10);
  year = b * 100 + d - 4800 + Math.floor(m / 10);
  return [day, month, year];
}

/**
 * Calculate new moon day
 */
function getNewMoonDay(k, timeZone) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  const JdNew = Jd1 + C1 - deltat;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}

/**
 * Get sun longitude
 */
function getSunLongitude(jdn, timeZone) {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - Math.PI * 2 * (Math.floor(L / (Math.PI * 2)));
  return Math.floor(L / Math.PI * 6 + 1e-9);
}

/**
 * Get lunar month 11
 */
function getLunarMonth11(yy, timeZone) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/**
 * Get leap month offset
 */
function getLeapMonthOffset(a11, timeZone) {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc != last && i < 14);
  return i - 1;
}

/**
 * Convert solar date to lunar date
 */
function convertSolar2Lunar(dd, mm, yy, timeZone = TIMEZONE_OFFSET) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29.53 + 0.5);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff == leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return [lunarDay, lunarMonth, lunarYear, lunarLeap];
}

/**
 * Convert lunar date to solar date
 */
function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone = TIMEZONE_OFFSET) {
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    if (lunarLeap != 0 && lunarMonth + 1 != leapOff) {
      return [0, 0, 0];
    }
    if (lunarLeap != 0 || off >= leapOff) {
      off += 1;
    }
  }
  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

/**
 * Get Can Chi for year
 */
function getYearCanChi(year) {
  const can = CAN[(year + 6) % 10];
  const chi = CHI[(year + 8) % 12];
  return `${can} ${chi}`;
}

/**
 * Get Can Chi for month
 */
function getMonthCanChi(month, year) {
  const can = CAN[(year * 12 + month + 3) % 10];
  const chi = CHI[(month + 1) % 12];
  return `${can} ${chi}`;
}

/**
 * Get Can Chi for day
 */
function getDayCanChi(dd, mm, yy) {
  const jd = jdFromDate(dd, mm, yy);
  const can = CAN[(jd + 9) % 10];
  const chi = CHI[(jd + 1) % 12];
  return `${can} ${chi}`;
}

/**
 * Get zodiac animal
 */
function getZodiacAnimal(year) {
  return ZODIAC_ANIMALS[(year + 8) % 12];
}

/**
 * Get good hours (Giờ Hoàng Đạo) for a day
 */
function getGoodHours(jd) {
  const chiOfDay = (jd + 1) % 12;

  // Traditional Good Hours table (Giờ Hoàng Đạo)
  // Index: 0:Tý, 1:Sửu, 2:Dần, 3:Mão, 4:Thìn, 5:Tị, 6:Ngọ, 7:Mùi, 8:Thân, 9:Dậu, 10:Tuất, 11:Hợi
  const goodHoursMap = {
    0: [0, 1, 3, 6, 8, 9],    // Tý: Tý, Sửu, Mão, Ngọ, Thân, Dậu
    1: [2, 3, 5, 8, 10, 11],  // Sửu: Dần, Mão, Tỵ, Thân, Tuất, Hợi
    2: [0, 1, 4, 5, 7, 10],   // Dần: Tý, Sửu, Thìn, Tỵ, Mùi, Tuất
    3: [0, 2, 3, 6, 7, 9],    // Mão: Tý, Dần, Mão, Ngọ, Mùi, Dậu
    4: [2, 4, 5, 8, 9, 11],   // Thìn: Dần, Thìn, Tỵ, Thân, Dậu, Hợi
    5: [1, 4, 6, 7, 10, 11],  // Tị: Sửu, Thìn, Ngọ, Mùi, Tuất, Hợi
    6: [0, 1, 3, 6, 8, 9],    // Ngọ: Tý, Sửu, Mão, Ngọ, Thân, Dậu
    7: [2, 3, 5, 8, 10, 11],  // Mùi: Dần, Mão, Tỵ, Thân, Tuất, Hợi
    8: [0, 1, 4, 5, 7, 10],   // Thân: Tý, Sửu, Thìn, Tỵ, Mùi, Tuất
    9: [0, 2, 3, 6, 7, 9],    // Dậu: Tý, Dần, Mão, Ngọ, Mùi, Dậu
    10: [2, 4, 5, 8, 9, 11],  // Tuất: Dần, Thìn, Tỵ, Thân, Dậu, Hợi
    11: [1, 4, 6, 7, 10, 11]   // Hợi: Sửu, Thìn, Ngọ, Mùi, Tuất, Hợi
  };

  return goodHoursMap[chiOfDay] || [];
}

/**
 * Format date for display
 */
function formatDate(day, month, year) {
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

/**
 * Format lunar date for display
 */
function formatLunarDate(day, month, year, isLeap = false) {
  const leapText = isLeap ? ' (nhuận)' : '';
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}${leapText}/${year}`;
}

/**
 * Handle date conversion from solar input
 */
function handleDateConversion() {
  const datePicker = document.getElementById('solar-date-input');
  if (!datePicker || !datePicker.value) return;

  const [yy, mm, dd] = datePicker.value.split('-').map(Number);
  const selectedDate = new Date(yy, mm - 1, dd);

  updateMainCalendar(selectedDate);
}

/**
 * Handle date conversion from lunar input
 */
function handleLunarConversion() {
  const ld = parseInt(document.getElementById('lunar-day-input').value);
  const lm = parseInt(document.getElementById('lunar-month-input').value);
  const ly = parseInt(document.getElementById('lunar-year-input').value);
  const isLeap = document.getElementById('lunar-leap-input').checked ? 1 : 0;

  if (!ld || !lm || !ly) return;

  const [sd, sm, sy] = convertLunar2Solar(ld, lm, ly, isLeap);
  if (sd > 0) {
    updateMainCalendar(new Date(sy, sm - 1, sd));
  }
}

/**
 * Toggle between solar and lunar input modes
 */
function toggleInputMode() {
  const solarContainer = document.getElementById('solar-input-container');
  const lunarContainer = document.getElementById('lunar-input-container');
  const modeLabel = document.getElementById('current-mode-label');
  const isSolar = solarContainer.style.display !== 'none';

  if (isSolar) {
    solarContainer.style.display = 'none';
    lunarContainer.style.display = 'flex';
    if (modeLabel) modeLabel.textContent = 'Âm lịch';

    // Sync lunar inputs with current date
    const [ld, lm, ly, isLeap] = convertSolar2Lunar(
      currentSelectedDate.getDate(),
      currentSelectedDate.getMonth() + 1,
      currentSelectedDate.getFullYear()
    );
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

/**
 * Populate lunar select options
 */
function initLunarInputs() {
  const daySelect = document.getElementById('lunar-day-input');
  const monthSelect = document.getElementById('lunar-month-input');

  if (daySelect) {
    for (let i = 1; i <= 30; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      daySelect.appendChild(opt);
    }
  }

  if (monthSelect) {
    for (let i = 1; i <= 12; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      monthSelect.appendChild(opt);
    }
  }
}

// Track the currently selected date for the wall calendar
let currentSelectedDate = new Date();

/**
 * Update the main wall calendar and date picker
 */
function updateMainCalendar(date) {
  currentSelectedDate = new Date(date);
  const dd = currentSelectedDate.getDate();
  const mm = currentSelectedDate.getMonth() + 1;
  const yy = currentSelectedDate.getFullYear();

  // Update wall calendar display
  displayTodayLunar(dd, mm, yy);

  // Sync date picker
  const datePicker = document.getElementById('solar-date-input');
  if (datePicker) {
    datePicker.value = `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  }

  // Sync Month View state if month changed
  const oldMonth = currentViewMonth;
  const oldYear = currentViewYear;
  currentViewMonth = mm;
  currentViewYear = yy;

  // Re-render month view if state changed or just to refresh selection
  if (oldMonth !== mm || oldYear !== yy) {
    renderMonthView(currentViewMonth, currentViewYear);
  } else {
    // Just refresh selection without full re-render if possible? 
    // For simplicity, let's just re-render or find the cell.
    renderMonthView(currentViewMonth, currentViewYear);
  }
}

/**
 * Display selected solar date's lunar information on wall calendar
 */
function displayTodayLunar(dd, mm, yy) {
  const [lunarDay, lunarMonth, lunarYear, lunarLeap] = convertSolar2Lunar(dd, mm, yy);

  // Get locale
  const lang = document.documentElement.lang || 'vi';
  const isVietnamese = lang === 'vi';

  // Date constants based on locale
  const weekdays = isVietnamese
    ? ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const monthNames = isVietnamese
    ? ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
    : ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

  // Create date object to get weekday
  const date = new Date(yy, mm - 1, dd);
  const weekDayText = weekdays[date.getDay()];
  const monthText = monthNames[mm - 1];

  // Update wall calendar elements
  const solarDayEl = document.getElementById('today-solar-day');
  const solarMonthEl = document.getElementById('today-solar-month');
  const solarYearEl = document.getElementById('today-solar-year');
  const solarWeekdayEl = document.getElementById('today-solar-weekday');

  const lunarDateLargeEl = document.getElementById('today-lunar-day-month');

  const yearCanChiEl = document.getElementById('today-year-canchi');
  const monthCanChiEl = document.getElementById('today-month-canchi');
  const dayCanChiEl = document.getElementById('today-day-canchi');
  const zodiacEl = document.getElementById('today-zodiac');

  if (solarDayEl) {
    solarDayEl.textContent = dd;
    // Highlight Sunday in red
    if (date.getDay() === 0) {
      solarDayEl.classList.add('is-sunday');
    } else {
      solarDayEl.classList.remove('is-sunday');
    }
  }
  if (solarMonthEl) solarMonthEl.textContent = monthText;
  if (solarYearEl) solarYearEl.textContent = yy;
  if (solarWeekdayEl) solarWeekdayEl.textContent = weekDayText;

  if (lunarDateLargeEl) {
    const leapText = lunarLeap ? (isVietnamese ? ' (Nhuận)' : ' (Leap)') : '';
    lunarDateLargeEl.textContent = `${String(lunarDay).padStart(2, '0')}/${String(lunarMonth).padStart(2, '0')}${leapText}`;
  }

  if (yearCanChiEl) yearCanChiEl.textContent = getYearCanChi(lunarYear);
  if (monthCanChiEl) monthCanChiEl.textContent = getMonthCanChi(lunarMonth, lunarYear);
  if (dayCanChiEl) dayCanChiEl.textContent = getDayCanChi(dd, mm, yy);
  if (zodiacEl) zodiacEl.textContent = getZodiacAnimal(lunarYear);

  // Display good hours
  displayGoodHours(dd, mm, yy);
}

/**
 * Display good hours list
 */
function displayGoodHours(dd, mm, yy) {
  const jd = jdFromDate(dd, mm, yy);
  const goodHours = getGoodHours(jd);
  const hoursContainer = document.getElementById('good-hours-list');

  if (!hoursContainer) return;
  hoursContainer.innerHTML = '';

  for (let i = 0; i < 12; i++) {
    const isGood = goodHours.includes(i);
    const hourDiv = document.createElement('div');
    hourDiv.className = `hour-item ${isGood ? 'good' : 'bad'}`;
    hourDiv.innerHTML = `
      <span class="hour-chi">${CHI[i]}</span>
      <span class="hour-status">${isGood ? '✓' : '✗'}</span>
    `;
    hoursContainer.appendChild(hourDiv);
  }
}

/**
 * Handle day navigation
 */
function goToPrevDay() {
  const prevDate = new Date(currentSelectedDate);
  prevDate.setDate(prevDate.getDate() - 1);
  updateMainCalendar(prevDate);
}

function goToNextDay() {
  const nextDate = new Date(currentSelectedDate);
  nextDate.setDate(nextDate.getDate() + 1);
  updateMainCalendar(nextDate);
}

/**
 * Handle date conversion from input
 */
function handleDateConversion() {
  const datePicker = document.getElementById('solar-date-input');
  if (!datePicker || !datePicker.value) return;

  const [yy, mm, dd] = datePicker.value.split('-').map(Number);
  const selectedDate = new Date(yy, mm - 1, dd);

  // Directly update main calendar without infinite loop
  currentSelectedDate = selectedDate;
  displayTodayLunar(dd, mm, yy);
}

// Month View Calendar state
let currentViewMonth = new Date().getMonth() + 1;
let currentViewYear = new Date().getFullYear();

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
  const today = new Date();

  // Initial display
  initLunarInputs();
  updateMainCalendar(today);

  // Set up mode toggle
  const modeToggle = document.getElementById('input-mode-toggle');
  if (modeToggle) modeToggle.addEventListener('click', toggleInputMode);

  // Set up date picker (merged)
  const datePicker = document.getElementById('solar-date-input');
  if (datePicker) {
    datePicker.addEventListener('change', handleDateConversion);
    datePicker.addEventListener('input', handleDateConversion);
  }

  // Set up lunar inputs
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

  // Set up day navigation buttons
  const prevDayBtn = document.getElementById('prev-day-btn');
  const nextDayBtn = document.getElementById('next-day-btn');
  if (prevDayBtn) prevDayBtn.addEventListener('click', goToPrevDay);
  if (nextDayBtn) nextDayBtn.addEventListener('click', goToNextDay);

  // Set up month view
  renderMonthView(today.getMonth() + 1, today.getFullYear());

  // Month navigation buttons
  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');
  const todayBtn = document.getElementById('today-btn');

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentViewMonth--;
      if (currentViewMonth < 1) {
        currentViewMonth = 12;
        currentViewYear--;
      }
      renderMonthView(currentViewMonth, currentViewYear);
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentViewMonth++;
      if (currentViewMonth > 12) {
        currentViewMonth = 1;
        currentViewYear++;
      }
      renderMonthView(currentViewMonth, currentViewYear);
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      const now = new Date();
      currentViewMonth = now.getMonth() + 1;
      currentViewYear = now.getFullYear();
      renderMonthView(currentViewMonth, currentViewYear);
    });
  }
});

/**
 * Render month view calendar
 */
function renderMonthView(month, year) {
  const calendarGrid = document.getElementById('calendar-grid');
  const monthYearDisplay = document.getElementById('current-month-year');

  if (!calendarGrid) return;

  // Update month/year display
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  if (monthYearDisplay) {
    monthYearDisplay.textContent = `${monthNames[month - 1]} ${year}`;
  }

  // Clear calendar
  calendarGrid.innerHTML = '';

  // Add day headers
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.textContent = day;
    calendarGrid.appendChild(header);
  });

  // Get first day of month and number of days
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  // Get today's date for highlighting
  const today = new Date();
  const isCurrentMonth = (month === today.getMonth() + 1 && year === today.getFullYear());
  const todayDate = today.getDate();

  // Add previous month's days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    addCalendarDay(calendarGrid, day, prevMonth, prevYear, true);
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = isCurrentMonth && day === todayDate;
    addCalendarDay(calendarGrid, day, month, year, false, isToday);
  }

  // Add next month's days to fill the grid
  const totalCells = calendarGrid.children.length - 7; // Subtract headers
  const remainingCells = (Math.ceil(totalCells / 7) * 7) - totalCells;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  for (let day = 1; day <= remainingCells; day++) {
    addCalendarDay(calendarGrid, day, nextMonth, nextYear, true);
  }
}

/**
 * Add a calendar day cell
 */
function addCalendarDay(container, day, month, year, isOtherMonth = false, isToday = false) {
  const dayCell = document.createElement('div');
  dayCell.className = 'calendar-day';

  if (isOtherMonth) {
    dayCell.classList.add('other-month');
  }

  if (isToday) {
    dayCell.classList.add('today');
  }

  // Get lunar date
  const [lunarDay, lunarMonth, lunarYear, lunarLeap] = convertSolar2Lunar(day, month, year);

  // Create solar date element
  const solarDateEl = document.createElement('div');
  solarDateEl.className = 'solar-date';
  solarDateEl.textContent = day;

  // Create lunar date element
  const lunarDateEl = document.createElement('div');
  lunarDateEl.className = 'lunar-date';
  lunarDateEl.textContent = `${lunarDay}/${lunarMonth}`;

  dayCell.appendChild(solarDateEl);
  dayCell.appendChild(lunarDateEl);

  // Highlight if selected
  const isSelected = !isOtherMonth &&
    day === currentSelectedDate.getDate() &&
    month === currentSelectedDate.getMonth() + 1 &&
    year === currentSelectedDate.getFullYear();

  if (isSelected) {
    dayCell.classList.add('selected');
  }

  // Add click handler
  if (!isOtherMonth) {
    dayCell.addEventListener('click', () => {
      // Update main wall calendar and date picker
      const clickedDate = new Date(year, month - 1, day);
      updateMainCalendar(clickedDate);

      // Re-render month view to update selection highlight
      // (Simplified: clear and re-render)
      renderMonthView(currentViewMonth, currentViewYear);
    });
  }

  container.appendChild(dayCell);
}
