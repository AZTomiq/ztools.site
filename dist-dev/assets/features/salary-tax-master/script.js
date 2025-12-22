document.addEventListener('DOMContentLoaded', () => {
  // --- Master UI Controller ---
  const sidebarBtns = document.querySelectorAll('.sidebar-btn');
  const sections = document.querySelectorAll('.content-section');
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.dataset.section;
      sidebarBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sections.forEach(s => {
        const isActive = s.id === `section-${sectionId}`;
        s.classList.toggle('active', isActive);
      });
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      const parent = tab.closest('.content-section');
      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      parent.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.toggle('active', p.id === `tab-${target}`);
      });
    });
  });

  // --- Utils ---
  window.formatVND = (n) => Math.round(n).toLocaleString('vi-VN') + ' đ';
  window.parseVND = (s) => parseInt(s.replace(/\D/g, '')) || 0;

  document.querySelectorAll('input[inputmode="numeric"]').forEach(input => {
    input.addEventListener('input', (e) => {
      let val = parseVND(e.target.value);
      e.target.value = val > 0 ? val.toLocaleString('vi-VN') : '';
    });
  });

  // --- PIT Logic (Copied from tax/script.js) ---
  // --- PIT Logic (Using Shared TaxLogic) ---
  // Note: TaxLogic is loaded globally via EJS inclusion

  window.calculatePITMaster = () => {
    const grossVal = parseVND(document.getElementById('incomeInput').value);
    const dependents = parseInt(document.getElementById('dependents').value) || 0;
    const region = parseInt(document.getElementById('region').value) || 1;

    if (!grossVal || !window.TaxLogic) return;

    const result = TaxLogic.calculatePIT(grossVal, dependents, region);

    const body = document.getElementById('pit-result-body');
    body.innerHTML = `
      <tr><td>Lương Gross</td><td>${formatVND(result.grossIncome)}</td><td>${formatVND(result.grossIncome)}</td></tr>
      <tr><td>BH bắt buộc</td><td>${formatVND(result.insurance)}</td><td>${formatVND(result.insurance)}</td></tr>
      <tr><td>Giảm trừ gia cảnh</td><td>${formatVND(result.deductionOld)}</td><td>${formatVND(result.deductionNew)}</td></tr>
      <tr><td>Thuế TNCN (Dự kiến)</td><td>${formatVND(result.taxOld)}</td><td>${formatVND(result.taxNew)}</td></tr>
      <tr class="highlight-row"><td>Thu thực nhận (Net)</td><td>${formatVND(result.netOld)}</td><td>${formatVND(result.netNew)}</td></tr>
    `;
    document.getElementById('pit-result-section').classList.add('show');
  };

  // --- CIT Logic ---
  window.calculateCITDetailed = () => {
    const rev = parseVND(document.getElementById('cit-revenue').value);
    const exp = parseVND(document.getElementById('cit-expenses').value);
    if (!rev) return;
    const pretax = rev - exp;
    const tax = Math.max(0, pretax * 0.2);
    const body = document.getElementById('cit-result-body');
    body.innerHTML = `
      <tr><td>Lợi nhuận trước thuế</td><td>${formatVND(pretax)}</td></tr>
      <tr><td>Thuế suất</td><td>20%</td></tr>
      <tr class="highlight-row"><td>Thuế TNDN phải nộp</td><td>${formatVND(tax)}</td></tr>
    `;
    document.getElementById('cit-result-section').classList.add('show');
  };

  // --- Freelancer ---
  window.calculateFreelancerMaster = () => {
    const amt = parseVND(document.getElementById('free-amount').value);
    if (!amt) return;
    const tax = amt * 0.1;
    document.getElementById('free-result-body').innerHTML = `
        <div class="result-main">
           <p>Thuế vãng lai (10%): <strong>${formatVND(tax)}</strong></p>
           <p>Thực nhận: <strong>${formatVND(amt - tax)}</strong></p>
        </div>
     `;
    document.getElementById('free-result-section').classList.add('show');
  };

  // --- SI ---
  window.calculateSICall = () => {
    const sal = parseVND(document.getElementById('si-salary').value);
    if (!sal) return;
    const res_bhxh = Math.min(sal, 46800000) * 0.08;
    const res_bhyt = Math.min(sal, 46800000) * 0.015;
    const res_bhtn = Math.min(sal, 99200000) * 0.01;
    const total = res_bhxh + res_bhyt + res_bhtn;
    document.getElementById('si-result-body').innerHTML = `
        <div class="result-card">
           <p>BHXH: ${formatVND(res_bhxh)}</p>
           <p>BHYT: ${formatVND(res_bhyt)}</p>
           <p>BHTN: ${formatVND(res_bhtn)}</p>
           <p class="total">Tổng khấu trừ: <strong>${formatVND(total)}</strong></p>
        </div>
     `;
    document.getElementById('si-result-section').classList.add('show');
  };

  // --- OT ---
  window.calculateOTMaster = () => {
    const sal = parseVND(document.getElementById('ot-base-salary').value);
    if (!sal) return;
    const hourly = sal / (26 * 8);
    document.getElementById('ot-result-body').innerHTML = `
      <div class="result-card">
         <p>Lương giờ cơ bản: <strong>${formatVND(hourly)}</strong></p>
         <p>Giả định 1h OT ngày thường (150%): ${formatVND(hourly * 1.5)}</p>
      </div>
    `;
    document.getElementById('ot-result-section').classList.add('show');
  };

  // --- Sharing & URL State ---
  window.shareResult = () => {
    const params = new URLSearchParams();
    const activeSection = document.querySelector('.sidebar-btn.active').dataset.section;
    params.set('s', activeSection);

    if (activeSection === 'personal-tax') {
      params.set('income', parseVND(document.getElementById('incomeInput').value));
      params.set('dep', document.getElementById('dependents').value);
    }

    const newUrl = window.location.origin + window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(newUrl).then(() => {
      const btn = document.querySelector('.share-float-btn');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        setTimeout(() => btn.innerHTML = originalText, 2000);
      }
    });
  };

  const loadFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('s');
    if (section) {
      const btn = document.querySelector(`.sidebar-btn[data-section="${section}"]`);
      if (btn) btn.click();
    }

    if (params.get('income')) {
      document.getElementById('incomeInput').value = parseInt(params.get('income')).toLocaleString('vi-VN');
      if (params.get('dep')) document.getElementById('dependents').value = params.get('dep');
      calculatePITMaster();
    }
  };

  loadFromUrl();
});
