let currentMode = 'withholding';

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function parseInputCurrency(val) {
  return parseFloat(val.replace(/[^\d]/g, '')) || 0;
}

document.addEventListener('DOMContentLoaded', () => {
  const amountInput = document.getElementById('tax-amount');

  amountInput.addEventListener('input', (e) => {
    let value = parseInputCurrency(e.target.value);
    if (value === 0) e.target.value = '';
    else e.target.value = value.toLocaleString('vi-VN');
  });

  updateNote();
});

function switchMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  document.getElementById('sector-group').style.display = (mode === 'household') ? 'block' : 'none';
  document.getElementById('vat-row').style.display = (mode === 'household') ? 'flex' : 'none';

  updateNote();
  if (document.getElementById('result-box').style.display !== 'none') {
    calculateTax();
  }
}

function updateNote() {
  const isVi = document.documentElement.lang === 'vi';
  const noteEl = document.getElementById('mode-note');

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
  if (amount <= 0) return;

  let pit = 0;
  let vat = 0;

  if (currentMode === 'withholding') {
    // Simple 10% for individual services > 2m
    if (amount >= 2000000) {
      pit = amount * 0.1;
    }
  } else {
    // Business Household logic
    const sector = document.getElementById('tax-sector').value;
    let pitRate = 0;
    let vatRate = 0;

    switch (sector) {
      case 'dist': // Phân phối hàng hóa
        vatRate = 0.01;
        pitRate = 0.005;
        break;
      case 'service': // Dịch vụ, tư vấn
        vatRate = 0.05;
        pitRate = 0.02;
        break;
      case 'comm': // Đại lý, hoa hồng
        vatRate = 0.05;
        pitRate = 0.02;
        break;
      case 'other': // Xây dựng, sản xuất
        vatRate = 0.03;
        pitRate = 0.015;
        break;
    }

    // Only pay tax if revenue > 100M/year. 
    // Here we assume per-contract or user knows they are over threshold
    vat = amount * vatRate;
    pit = amount * pitRate;
  }

  const totalTax = pit + vat;
  const net = amount - totalTax;

  document.getElementById('net-amount').textContent = formatVND(net);
  document.getElementById('tax-total').textContent = formatVND(totalTax);
  document.getElementById('tax-pit').textContent = formatVND(pit);
  document.getElementById('tax-vat').textContent = formatVND(vat);

  document.getElementById('result-box').style.display = 'block';
}
