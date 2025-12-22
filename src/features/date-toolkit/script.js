document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active', 'border-primary');
        t.classList.add('text-muted', 'border-transparent');
      });
      tab.classList.add('active', 'border-primary');
      tab.classList.remove('text-muted', 'border-transparent');

      contents.forEach(c => {
        if (c.id === `tab-${target}`) {
          c.classList.remove('hidden');
          c.classList.add('active');
        } else {
          c.classList.add('hidden');
          c.classList.remove('active');
        }
      });
    });
  });

  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('diff-start').value = today;
  document.getElementById('diff-end').value = today;
  document.getElementById('calc-base').value = today;

  // --- Logic for Tab: Difference ---
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

    if (includeEnd.checked) {
      diffDays += 1;
    }

    diffResultArea.classList.remove('hidden');

    // Simple days result
    const tDiff = document.title.includes('Vietnam') || document.documentElement.lang === 'vi' ? 'Khoảng cách là: {d} ngày' : 'Difference: {d} days';
    diffDaysText.innerText = tDiff.replace('{d}', diffDays);

    // Full detail (Y/M/D)
    const startDate = d1 < d2 ? d1 : d2;
    const endDate = d1 < d2 ? d2 : d1;

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const tDetail = document.title.includes('Vietnam') || document.documentElement.lang === 'vi'
      ? 'Chi tiết: {y} năm, {m} tháng, {d} ngày'
      : 'Detail: {y} year(s), {m} month(s), {d} day(s)';

    diffDetailText.innerText = tDetail
      .replace('{y}', years)
      .replace('{m}', months)
      .replace('{d}', includeEnd.checked ? days + 1 : days);
  }

  [diffStart, diffEnd, includeEnd].forEach(el => el.addEventListener('change', calculateDiff));

  // --- Logic for Tab: Add/Subtract ---
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
    const unit = calcUnit.value;

    if (isNaN(base) || isNaN(amount)) return;

    const resultDate = new Date(base);
    if (unit === 'days') resultDate.setDate(resultDate.getDate() + amount);
    if (unit === 'weeks') resultDate.setDate(resultDate.getDate() + (amount * 7));
    if (unit === 'months') resultDate.setMonth(resultDate.getMonth() + amount);
    if (unit === 'years') resultDate.setFullYear(resultDate.getFullYear() + amount);

    calcResultArea.classList.remove('hidden');

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const locale = document.documentElement.lang === 'vi' ? 'vi-VN' : 'en-US';
    calcResultText.innerText = resultDate.toLocaleDateString(locale, options);
  }

  btnAdd.addEventListener('click', () => modifyDate(true));
  btnSub.addEventListener('click', () => modifyDate(false));
  [calcBase, calcUnit, calcAmount].forEach(el => el.addEventListener('change', () => modifyDate(btnAdd.classList.contains('active') || true)));

  // Initial calculation
  calculateDiff();
});
