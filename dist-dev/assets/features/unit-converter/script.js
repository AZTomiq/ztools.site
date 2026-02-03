const CONVERSIONS = {
  length: {
    base: 'm',
    rates: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      inch: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344
    }
  },
  weight: {
    base: 'kg',
    rates: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.0283495231,
      ton: 1000
    }
  },
  volume: {
    base: 'l',
    rates: {
      l: 1,
      ml: 0.001,
      m3: 1000,
      gal: 3.78541,
      floz: 0.0295735,
      cup: 0.236588,
      pt: 0.473176,
      qt: 0.946353,
      tsp: 0.00492892,
      tbsp: 0.0147868
    }
  },
  area: {
    base: 'm2',
    rates: {
      m2: 1,
      km2: 1000000,
      ha: 10000,
      acre: 4046.856
    }
  },
  speed: {
    base: 'mps',
    rates: {
      mps: 1,
      kph: 1 / 3.6,
      mph: 0.44704,
      knot: 0.514444
    }
  },
  temperature: {
    custom: true,
    toBase: {
      c: v => v,
      f: v => (v - 32) * 5 / 9,
      k: v => v - 273.15
    },
    fromBase: {
      c: v => v,
      f: v => (v * 9 / 5) + 32,
      k: v => v + 273.15
    }
  },
  digital: {
    base: 'byte',
    rates: {
      bit: 0.125,
      byte: 1,
      kb: 1024,
      mb: 1048576,
      gb: 1073741824,
      tb: 1099511627776,
      pb: 1125899906842624
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  let currentCat = 'length';
  const unitsLocales = JSON.parse(document.getElementById('units-locales').textContent);

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

    // Default selection
    if (units.length >= 2) {
      unitToSelect.selectedIndex = 1;
    }
  }

  function setupEventListeners() {
    valFromInput.addEventListener('input', calculate);
    unitFromSelect.addEventListener('change', calculate);
    unitToSelect.addEventListener('change', calculate);

    swapBtn.addEventListener('click', () => {
      const tempUnit = unitFromSelect.value;
      unitFromSelect.value = unitToSelect.value;
      unitToSelect.value = tempUnit;

      const tempVal = valFromInput.value;
      if (valToInput.value && valToInput.value !== '0') {
        // If we have a result, we might want to swap value too, 
        // but usually swapping units for the same input value is what users want
      }
      calculate();
    });
  }

  function calculate() {
    // FIX: Handle numbers with commas (e.g. 1,000)
    const val = parseFloat(valFromInput.value.replace(/,/g, ''));
    if (isNaN(val)) {
      valToInput.value = '';
      formulaBox.textContent = '---';
      renderQuickCompare(0);
      return;
    }

    const from = unitFromSelect.value;
    const to = unitToSelect.value;
    const result = convertUnit(val, from, to, currentCat);
    const catData = CONVERSIONS[currentCat];
    const baseVal = catData.custom ? catData.toBase[from](val) : val * catData.rates[from];

    valToInput.value = formatNumber(result);
    updateFormula(from, to, catData);
    renderQuickCompare(baseVal);
  }

  function updateFormula(from, to, catData) {
    if (from === to) {
      formulaBox.textContent = `1 ${from} = 1 ${to}`;
      return;
    }

    let rate;
    if (catData.custom) {
      // For custom like temp, formula is complex, just show simple example
      const sampleBase = catData.toBase[from](1);
      const sampleResult = catData.fromBase[to](sampleBase);
      formulaBox.textContent = `1 ${from} ≈ ${formatNumber(sampleResult)} ${to}`;
    } else {
      rate = catData.rates[from] / catData.rates[to];
      formulaBox.textContent = `1 ${from} = ${formatNumber(rate)} ${to}`;
    }
  }

  function renderQuickCompare(baseVal) {
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

function convertUnit(value, from, to, category) {
  const catData = CONVERSIONS[category];
  if (!catData) return value;

  if (catData.custom) {
    const baseVal = catData.toBase[from](value);
    return catData.fromBase[to](baseVal);
  } else {
    const baseVal = value * catData.rates[from];
    return baseVal / catData.rates[to];
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONVERSIONS,
    convertUnit
  };
}
