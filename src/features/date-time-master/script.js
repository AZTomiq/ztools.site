document.addEventListener('DOMContentLoaded', () => {
  // --- Tab Logic ---
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      contents.forEach(c => {
        c.classList.toggle('hidden', c.id !== `tab-${target}`);
        c.classList.toggle('active', c.id === `tab-${target}`);
      });
    });
  });

  // Default dates
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const formatNow = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + 'T' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');

  document.getElementById('diff-start').value = today;
  document.getElementById('diff-end').value = today;
  document.getElementById('calc-base').value = today;
  document.getElementById('date-input').value = formatNow;

  // --- Logic: Difference ---
  const diffStart = document.getElementById('diff-start');
  const diffEnd = document.getElementById('diff-end');
  const includeEnd = document.getElementById('include-end');
  const diffResultArea = document.getElementById('diff-result-area');
  const diffDaysText = document.getElementById('diff-days-text');
  const diffDetailText = document.getElementById('diff-detail-text');

  function calculateDiff() {
    const d1 = new Date(diffStart.value);
    const d2 = new Date(diffEnd.value);
    if (isNaN(d1) || isNaN(d2)) return;

    let diffTime = Math.abs(d2 - d1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (includeEnd.checked) diffDays += 1;

    diffResultArea.classList.remove('hidden');
    const isVi = document.documentElement.lang === 'vi';
    diffDaysText.innerText = (isVi ? 'Khoảng cách là: {d} ngày' : 'Difference: {d} days').replace('{d}', diffDays);

    const startDate = d1 < d2 ? d1 : d2;
    const endDate = d1 < d2 ? d2 : d1;
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const detailTpl = isVi ? 'Chi tiết: {y} năm, {m} tháng, {d} ngày' : 'Detail: {y} year(s), {m} month(s), {d} day(s)';
    diffDetailText.innerText = detailTpl.replace('{y}', years).replace('{m}', months).replace('{d}', includeEnd.checked ? days + 1 : days);
  }

  [diffStart, diffEnd, includeEnd].forEach(el => el.addEventListener('change', calculateDiff));

  // --- Logic: Add/Sub ---
  const calcBase = document.getElementById('calc-base');
  const calcUnit = document.getElementById('calc-unit');
  const calcAmount = document.getElementById('calc-amount');
  const btnAdd = document.getElementById('btn-add');
  const btnSub = document.getElementById('btn-subtract');
  const calcResultArea = document.getElementById('calc-result-area');
  const calcResultText = document.getElementById('calc-result-text');

  function modifyDate(isAdd) {
    const base = new Date(calcBase.value);
    const amount = parseInt(calcAmount.value) * (isAdd ? 1 : -1);
    if (isNaN(base) || isNaN(amount)) return;

    const res = new Date(base);
    const unit = calcUnit.value;
    if (unit === 'days') res.setDate(res.getDate() + amount);
    if (unit === 'weeks') res.setDate(res.getDate() + (amount * 7));
    if (unit === 'months') res.setMonth(res.getMonth() + amount);
    if (unit === 'years') res.setFullYear(res.getFullYear() + amount);

    calcResultArea.classList.remove('hidden');
    calcResultText.innerText = res.toLocaleDateString(document.documentElement.lang === 'vi' ? 'vi-VN' : 'en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  btnAdd.addEventListener('click', () => modifyDate(true));
  btnSub.addEventListener('click', () => modifyDate(false));
  [calcBase, calcUnit, calcAmount].forEach(el => el.addEventListener('change', () => modifyDate(true)));

  // --- Logic: Unix ---
  const nowUnix = document.getElementById('now-unix');
  const nowDate = document.getElementById('now-date');
  const unixInput = document.getElementById('unix-input');
  const btnUnixConv = document.getElementById('btn-unix-convert');
  const btnDateConv = document.getElementById('btn-date-convert');
  const dateInput = document.getElementById('date-input');

  function updateClock() {
    const n = new Date();
    if (nowUnix) nowUnix.innerText = Math.floor(n.getTime() / 1000);
    if (nowDate) nowDate.innerText = n.toLocaleTimeString();
  }
  setInterval(updateClock, 1000);
  updateClock();

  btnUnixConv.addEventListener('click', () => {
    let val = parseInt(cronInput.value); // Wait, variable name copy error
    val = parseInt(unixInput.value);
    if (isNaN(val)) return;

    const unit = document.querySelector('input[name="unix-unit"]:checked').value;
    const d = new Date(unit === 's' ? val * 1000 : val);

    document.getElementById('unix-res-area').classList.remove('hidden');
    document.getElementById('unix-res-local').innerText = d.toLocaleString();
    document.getElementById('unix-res-utc').innerText = d.toUTCString();
  });

  btnDateConv.addEventListener('click', () => {
    const d = new Date(dateInput.value);
    if (isNaN(d)) return;
    document.getElementById('date-res-area').classList.remove('hidden');
    document.getElementById('date-res-unix').innerText = Math.floor(d.getTime() / 1000);
    document.getElementById('date-res-ms').innerText = d.getTime();
  });

  // Initial
  calculateDiff();
});
