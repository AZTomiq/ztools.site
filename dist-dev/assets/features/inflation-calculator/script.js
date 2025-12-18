// Vietnam CPI Data (Average % increase per year)
// Source: World Bank / General Statistics Office of Vietnam
const CPI_DATA = {
  2000: -0.6, 2001: 0.8, 2002: 4.0, 2003: 3.0, 2004: 9.5,
  2005: 8.4, 2006: 7.5, 2007: 8.3, 2008: 19.9, 2009: 6.5,
  2010: 9.2, 2011: 18.2, 2012: 9.2, 2013: 6.6, 2014: 4.1,
  2015: 0.6, 2016: 2.7, 2017: 3.5, 2018: 3.5, 2019: 2.8,
  2020: 3.2, 2021: 1.8, 2022: 3.2, 2023: 3.3, 2024: 4.0 // 2024 is estimate
};

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function parseInputCurrency(val) {
  return parseFloat(val.replace(/[^\d]/g, '')) || 0;
}

document.addEventListener('DOMContentLoaded', () => {
  const fromYearSelect = document.getElementById('from-year');
  const toYearSelect = document.getElementById('to-year');
  const amountInput = document.getElementById('amount');

  const years = Object.keys(CPI_DATA).sort((a, b) => b - a);
  years.forEach(year => {
    const opt1 = new Option(year, year);
    const opt2 = new Option(year, year);
    fromYearSelect.add(opt1);
    toYearSelect.add(opt2);
  });

  // Defaults
  fromYearSelect.value = "2010";
  toYearSelect.value = "2024";

  amountInput.addEventListener('input', (e) => {
    let value = parseInputCurrency(e.target.value);
    if (value === 0) e.target.value = '';
    else e.target.value = value.toLocaleString('vi-VN');
  });
});

function calculateInflation() {
  const amount = parseInputCurrency(document.getElementById('amount').value);
  let fromYear = parseInt(document.getElementById('from-year').value);
  let toYear = parseInt(document.getElementById('to-year').value);

  if (amount <= 0) return;

  // Normalize years
  if (fromYear > toYear) {
    [fromYear, toYear] = [toYear, fromYear];
  }

  let multiplier = 1.0;
  const yearlyBreakdown = [];

  // Calculate cumulative multiplier
  for (let y = fromYear + 1; y <= toYear; y++) {
    const rate = (CPI_DATA[y] || 0) / 100;
    multiplier *= (1 + rate);
    yearlyBreakdown.push({
      year: y,
      rate: CPI_DATA[y],
      cumulative: (multiplier - 1) * 100
    });
  }

  const resultAmount = amount * multiplier;
  const isVi = document.documentElement.lang === 'vi';

  document.getElementById('result-title').textContent = isVi
    ? `Giá trị tương đương năm ${toYear}`
    : `Equivalent Value in ${toYear}`;

  document.getElementById('equivalent-value').textContent = formatVND(resultAmount);

  const diffPercent = ((multiplier - 1) * 100).toFixed(2);
  document.getElementById('result-explanation').textContent = isVi
    ? `Sức mua giảm, ${formatVND(amount)} năm ${fromYear} có giá trị tương đương ${formatVND(resultAmount)} năm ${toYear} (Lạm phát tích lũy ${diffPercent}%)`
    : `Buying power decreased, ${formatVND(amount)} in ${fromYear} is equivalent to ${formatVND(resultAmount)} in ${toYear} (Cumulative Inflation ${diffPercent}%)`;

  // Render Table
  const tbody = document.getElementById('inflation-table-body');
  tbody.innerHTML = '';
  yearlyBreakdown.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${item.year}</td>
            <td style="color: ${item.rate > 5 ? 'var(--danger-color, #dc3545)' : 'inherit'}">${item.rate}%</td>
            <td>${item.cumulative.toFixed(2)}%</td>
        `;
    tbody.appendChild(row);
  });

  document.getElementById('result-box').style.display = 'block';
}
