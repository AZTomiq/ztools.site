/**
 * Unit Converter UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentCat = 'length';
  const unitsLocalesEl = document.getElementById('units-locales');
  if (!unitsLocalesEl) return;

  const unitsLocales = JSON.parse(unitsLocalesEl.textContent);

  const catTabs = document.querySelectorAll('.cat-tab');
  const unitFromSelect = document.getElementById('unit-from');
  const unitToSelect = document.getElementById('unit-to');
  const valFromInput = document.getElementById('val-from');
  const valToInput = document.getElementById('val-to');
  const swapBtn = document.getElementById('swap-btn');
  const formulaBox = document.getElementById('formula-text');
  const quickCompareGrid = document.getElementById('quick-compare');

  function init() {
    setupTabs();
    updateSelectors();
    setupEventListeners();
    calculate();
  }

  function setupTabs() {
    catTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        catTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCat = tab.dataset.cat;
        updateSelectors();
        calculate();
      });
    });
  }

  function updateSelectors() {
    const units = Object.keys(unitsLocales[currentCat]);

    unitFromSelect.innerHTML = '';
    unitToSelect.innerHTML = '';

    units.forEach((unit, idx) => {
      const optFrom = new Option(unitsLocales[currentCat][unit], unit);
      const optTo = new Option(unitsLocales[currentCat][unit], unit);
      unitFromSelect.add(optFrom);
      unitToSelect.add(optTo);
    });

    if (units.length >= 2) {
      unitToSelect.selectedIndex = 1;
    }
  }

  function setupEventListeners() {
    valFromInput.addEventListener('input', calculate);
    unitFromSelect.addEventListener('change', calculate);
    unitToSelect.addEventListener('change', calculate);

    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const tempUnit = unitFromSelect.value;
        unitFromSelect.value = unitToSelect.value;
        unitToSelect.value = tempUnit;
        calculate();
      });
    }
  }

  function calculate() {
    const val = parseFloat(valFromInput.value.replace(/,/g, ''));
    if (isNaN(val)) {
      valToInput.value = '';
      if (formulaBox) formulaBox.textContent = '---';
      if (quickCompareGrid) renderQuickCompare(0);
      return;
    }

    const from = unitFromSelect.value;
    const to = unitToSelect.value;

    if (typeof convertUnit === 'function') {
      const result = convertUnit(val, from, to, currentCat);
      const catData = CONVERSIONS[currentCat];
      const baseVal = catData.custom ? catData.toBase[from](val) : val * catData.rates[from];

      valToInput.value = formatNumber(result);
      updateFormula(from, to, catData);
      renderQuickCompare(baseVal);
    }
  }

  function updateFormula(from, to, catData) {
    if (!formulaBox) return;
    if (from === to) {
      formulaBox.textContent = `1 ${from} = 1 ${to}`;
      return;
    }

    if (catData.custom) {
      const sampleBase = catData.toBase[from](1);
      const sampleResult = catData.fromBase[to](sampleBase);
      formulaBox.textContent = `1 ${from} ≈ ${formatNumber(sampleResult)} ${to}`;
    } else {
      const rate = catData.rates[from] / catData.rates[to];
      formulaBox.textContent = `1 ${from} = ${formatNumber(rate)} ${to}`;
    }
  }

  function renderQuickCompare(baseVal) {
    if (!quickCompareGrid) return;
    const catData = CONVERSIONS[currentCat];
    const units = Object.keys(unitsLocales[currentCat]);
    const currentFrom = unitFromSelect.value;

    quickCompareGrid.innerHTML = '';

    units.forEach(unit => {
      if (unit === currentFrom) return;

      let val;
      if (catData.custom) {
        val = catData.fromBase[unit](baseVal);
      } else {
        val = baseVal / catData.rates[unit];
      }

      const item = document.createElement('div');
      item.className = 'compare-item';
      item.innerHTML = `
        <div class="compare-info">
          <span class="compare-unit">${unitsLocales[currentCat][unit]}</span>
          <span class="compare-val">${formatNumber(val)}</span>
        </div>
        <button class="btn-icon" onclick="useUnit('${unit}')">🎯</button>
      `;
      quickCompareGrid.appendChild(item);
    });
  }

  window.useUnit = (unit) => {
    unitToSelect.value = unit;
    calculate();
  };

  function formatNumber(num) {
    if (Math.abs(num) < 0.000001 && num !== 0) return num.toExponential(4);
    return Number(num.toFixed(6)).toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  init();
});
