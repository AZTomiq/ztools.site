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

  // --- PIT Logic ---
  window.calculatePITMaster = () => {
    const grossVal = parseVND(document.getElementById('incomeInput').value);
    const dependents = parseInt(document.getElementById('dependents').value) || 0;
    const region = parseInt(document.getElementById('region').value) || 1;

    if (!grossVal) return;

    if (typeof TaxLogic !== 'undefined' && TaxLogic.calculatePIT) {
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
    }
  };

  // --- CIT Logic ---
  window.calculateCITDetailed = () => {
    const rev = parseVND(document.getElementById('cit-revenue').value);
    const exp = parseVND(document.getElementById('cit-expenses').value);
    if (!rev) return;

    if (typeof calculateDetailedTaxLogic === 'function') {
      const res = calculateDetailedTaxLogic({
        revenue: rev,
        expenses: exp,
        otherIncome: 0,
        exemptIncome: 0,
        previousLosses: 0,
        businessType: 'general',
        rdFundPercent: 0
      });
      const body = document.getElementById('cit-result-body');
      body.innerHTML = `
        <tr><td>Lợi nhuận trước thuế</td><td>${formatVND(res.taxableIncome)}</td></tr>
        <tr><td>Thuế suất</td><td>20%</td></tr>
        <tr class="highlight-row"><td>Thuế TNDN phải nộp</td><td>${formatVND(res.totalTax)}</td></tr>
      `;
      document.getElementById('cit-result-section').classList.add('show');
    }
  };

  // --- Freelancer ---
  window.calculateFreelancerMaster = () => {
    const amt = parseVND(document.getElementById('free-amount').value);
    if (!amt) return;

    if (typeof calculateFreelancerTax === 'function') {
      const res = calculateFreelancerTax(amt, 'withholding', 'other');
      document.getElementById('free-result-body').innerHTML = `
          <div class="result-main">
             <p>Thuế vãng lai (10%): <strong>${formatVND(res.totalTax)}</strong></p>
             <p>Thực nhận: <strong>${formatVND(res.net)}</strong></p>
          </div>
       `;
      document.getElementById('free-result-section').classList.add('show');
    }
  };

  // --- SI ---
  window.calculateSICall = () => {
    const sal = parseVND(document.getElementById('si-salary').value);
    if (!sal) return;

    if (typeof calculateInsuranceContribution === 'function') {
      const res = calculateInsuranceContribution(sal, 1); // Default region 1
      const total = res.employee.total;
      document.getElementById('si-result-body').innerHTML = `
          <div class="result-card">
             <p>BHXH (8%): ${formatVND(res.employee.bhxh)}</p>
             <p>BHYT (1.5%): ${formatVND(res.employee.bhyt)}</p>
             <p>BHTN (1%): ${formatVND(res.employee.bhtn)}</p>
             <p class="total">Tổng khấu trừ: <strong>${formatVND(total)}</strong></p>
          </div>
       `;
      document.getElementById('si-result-section').classList.add('show');
    }
  };

  // --- OT ---
  window.calculateOTMaster = () => {
    const sal = parseVND(document.getElementById('ot-base-salary').value);
    if (!sal) return;

    if (typeof calculateOTLogic === 'function') {
      const res = calculateOTLogic(sal, 26, 8, { weekdayDay: 1 }); // Assume 1 hour OT weekday
      document.getElementById('ot-result-body').innerHTML = `
        <div class="result-card">
           <p>Lương giờ cơ bản: <strong>${formatVND(res.hourlyRate)}</strong></p>
           <p>Giả định 1h OT ngày thường (150%): ${formatVND(res.breakdown[0].pay)}</p>
        </div>
      `;
      document.getElementById('ot-result-section').classList.add('show');
    }
  };

  // --- Sharing & URL State ---
  window.shareResult = () => {
    const params = new URLSearchParams();
    const activeBtn = document.querySelector('.sidebar-btn.active');
    if (!activeBtn) return;
    const activeSection = activeBtn.dataset.section;
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
      const incInput = document.getElementById('incomeInput');
      if (incInput) {
        incInput.value = parseInt(params.get('income')).toLocaleString('vi-VN');
        if (params.get('dep')) document.getElementById('dependents').value = params.get('dep');
        calculatePITMaster();
      }
    }
  };

  loadFromUrl();
});
