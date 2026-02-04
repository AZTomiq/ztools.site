/**
 * Freelancer Tax UI Controller
 */

let currentMode = 'withholding';

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(amount));
}

function parseInputCurrency(val) {
  return parseFloat(val.toString().replace(/[^\d]/g, '')) || 0;
}

document.addEventListener('DOMContentLoaded', () => {
  const amountInput = document.getElementById('tax-amount');
  if (!amountInput) return;

  amountInput.addEventListener('input', (e) => {
    let value = parseInputCurrency(e.target.value);
    if (value === 0) e.target.value = '';
    else e.target.value = value.toLocaleString('vi-VN');
  });

  const btnCalc = document.getElementById('btn-calculate');
  if (btnCalc) {
    btnCalc.addEventListener('click', calculateTax);
  }

  updateNote();
});

// Exposed to inline onclick in index.ejs if any, or called from UI
window.switchMode = function (mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  const sectorGroup = document.getElementById('sector-group');
  const vatRow = document.getElementById('vat-row');

  if (sectorGroup) sectorGroup.style.display = (mode === 'household') ? 'block' : 'none';
  if (vatRow) vatRow.style.display = (mode === 'household') ? 'flex' : 'none';

  updateNote();
  if (document.getElementById('result-box').style.display !== 'none') {
    calculateTax();
  }
};

function updateNote() {
  const isVi = document.documentElement.lang === 'vi';
  const noteEl = document.getElementById('mode-note');
  if (!noteEl) return;

  if (currentMode === 'withholding') {
    noteEl.innerHTML = isVi
      ? "<strong>Khấu trừ 10%:</strong> Áp dụng cho các hợp đồng dịch vụ cá nhân (Freelance, vãng lai) có thu nhập từ 2.000.000đ/lần trở lên. Bạn có thể làm cam kết 08 để tạm thời chưa khấu trừ nếu ước tính tổng thu nhập năm dưới mức chịu thuế."
      : "<strong>Withholding 10%:</strong> Applied to individual service contracts (Freelance) with income from 2,000,000 VND/time. You can submit Form 08 commitment if your total annual income is below taxable threshold.";
  } else {
    noteEl.innerHTML = isVi
      ? "<strong>Hộ kinh doanh (HKD):</strong> Áp dụng cho cá nhân kinh doanh có doanh thu trên 100 triệu/năm. Thuế bao gồm Thuế GTGT và Thuế TNCN tính trên doanh thu tùy theo ngành nghề."
      : "<strong>Business Household (HKD):</strong> Applied to individuals with revenue over 100M VND/year. Tax includes VAT and PIT calculated based on revenue and sector.";
  }
}

function calculateTax() {
  const amount = parseInputCurrency(document.getElementById('tax-amount').value);
  if (amount <= 0) {
    alert("Vui lòng nhập số tiền!");
    return;
  }

  const sector = document.getElementById('tax-sector') ? document.getElementById('tax-sector').value : 'other';

  if (typeof calculateFreelancerTax === 'function') {
    const res = calculateFreelancerTax(amount, currentMode, sector);

    document.getElementById('net-amount').textContent = formatVND(res.net);
    document.getElementById('tax-total').textContent = formatVND(res.totalTax);
    document.getElementById('tax-pit').textContent = formatVND(res.pit);
    document.getElementById('tax-vat').textContent = formatVND(res.vat);

    document.getElementById('result-box').style.display = 'block';
  } else {
    console.error('calculateFreelancerTax function not found.');
  }
}

// Ensure global access for ejs onclick
window.calculateTax = calculateTax;
