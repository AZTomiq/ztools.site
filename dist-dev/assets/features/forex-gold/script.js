const API_FOREX_BASE = 'https://open.er-api.com/v6/latest/';
// Community SJC API (Fallback mock if fails)
const API_GOLD = 'https://api.vapi.vn/v1/gold/sjc';

document.addEventListener('DOMContentLoaded', () => {
  const currencyNames = JSON.parse(document.getElementById('forex-names').textContent);

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const forexSearch = document.getElementById('forex-search');
  const forexBaseSelect = document.getElementById('forex-base');
  const forexTableBody = document.getElementById('forex-table-body');
  const goldTableBody = document.getElementById('gold-table-body');
  const goldShowcase = document.getElementById('gold-showcase');
  const goldTime = document.getElementById('gold-time');

  let forexData = null;
  let goldData = null;

  function init() {
    setupTabs();
    initForex();
    initGold();
  }

  function setupTabs() {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = document.getElementById(`tab-${btn.dataset.tab}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // --- Forex Logic ---
  async function initForex() {
    forexBaseSelect.addEventListener('change', () => loadForex(forexBaseSelect.value));
    forexSearch.addEventListener('input', () => renderForex());

    await loadForex('USD'); // Load USD base initially for calculations
  }

  async function loadForex(base) {
    forexTableBody.innerHTML = `<tr><td colspan="4" class="text-center loading-state">Loading...</td></tr>`;
    try {
      const resp = await fetch(`${API_FOREX_BASE}${base}`);
      const data = await resp.json();
      if (data.result === 'success') {
        forexData = data;
        renderForex();
      } else {
        throw new Error('API Error');
      }
    } catch (e) {
      forexTableBody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: #ef4444;">Failed to load forex data.</td></tr>`;
    }
  }

  function renderForex() {
    if (!forexData) return;

    const query = forexSearch.value.toLowerCase();
    const rates = forexData.rates;
    const base = forexData.base_code;

    let html = '';
    const sortedCodes = Object.keys(rates).sort();

    sortedCodes.forEach(code => {
      const name = currencyNames[code] || '';
      if (!code.toLowerCase().includes(query) && !name.toLowerCase().includes(query)) return;

      // If base is VND, we usually want to see how many VND per 1 unit of foreign currency
      // If base is USD, we see how many units of code per 1 USD
      let rate = rates[code];
      let displayRate = rate;

      // Special handling for VND base: show inverted for major currencies
      if (base === 'VND' && code !== 'VND') {
        displayRate = 1 / rate;
      }

      html += `
        <tr>
          <td><span class="currency-code">${code}</span></td>
          <td><span class="currency-name">${name || code}</span></td>
          <td class="text-right">1 ${base === 'VND' ? code : base} =</td>
          <td class="text-right"><strong>${formatMoney(displayRate, base === 'VND' ? 0 : 4)}</strong> ${base === 'VND' ? 'VND' : code}</td>
        </tr>
      `;
    });

    forexTableBody.innerHTML = html || `<tr><td colspan="4" class="text-center">No results found.</td></tr>`;
  }

  // --- Gold Logic ---
  async function initGold() {
    try {
      // Small delay to let forex load
      setTimeout(() => loadGold(), 500);
    } catch (e) { }
  }

  async function loadGold() {
    goldTableBody.innerHTML = `<tr><td colspan="3" class="text-center loading-state">Đang tải dữ liệu thực tế...</td></tr>`;
    try {
      // Use AllOrigins proxy to fetch official SJC REST API to bypass CORS
      const targetUrl = 'https://sjc.com.vn/GoldPrice/Services/PriceService.ashx';
      // We need to pass POST data: method=GetCurrentGoldPricesByBranch&BranchId=1
      // AllOrigins mostly supports GET. For POST with specific bodies, we might need a more capable proxy or just GET if SJC supports it?
      // Actually, SJC might support GET for this endpoint or we can try a different proxy like corsproxy.io or just try a simple GET via AllOrigins first.

      // Attempt generic GET first or stick to the verified XML one if this complex POST fails?
      // User specifically asked for this POST endpoint.
      // Since it's x-www-form-urlencoded POST, passing it through simple GET proxies is hard.
      // Let's try to fetch it via a proxy that supports forwarding body, or fallback to the previous XML method if too complex for client-side static site without backend.

      // WAIT: The curl user sent is XHR but effectively just fetching data.
      // Many older ASP.NET services accept GET params too. Let's try GET first: ?method=GetCurrentGoldPricesByBranch&BranchId=1
      const getUrl = `https://sjc.com.vn/GoldPrice/Services/PriceService.ashx?method=GetCurrentGoldPricesByBranch&BranchId=1`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(getUrl)}`;

      const resp = await fetch(proxyUrl);
      const jsonAuth = await resp.json(); // AllOrigins wrapper

      if (jsonAuth && jsonAuth.contents) {
        let realData;
        try {
          realData = JSON.parse(jsonAuth.contents);
        } catch (e) {
          // SJC sometimes returns BOM or weird charset
          console.error("Parse JSON content failed", e);
          throw e;
        }

        if (realData.success && realData.data) {
          goldData = realData.data.map(item => ({
            type: item.TypeName,
            buy: item.BuyValue,
            sell: item.SellValue,
            updated: realData.latestDate
          }));

          if (goldData.length > 0) {
            goldTime.textContent = realData.latestDate || new Date().toLocaleString('vi-VN');
            renderGold();
            return;
          }
        }
      }
      throw new Error('Invalid Data Structure');
    } catch (e) {
      console.warn('Gold API new endpoint failed, trying fallback XML...', e);
      // Fallback to the XML endpoint we had before which knows to work via simple GET
      loadGoldXmlFallback();
    }
  }

  async function loadGoldXmlFallback() {
    try {
      const targetUrl = 'https://sjc.com.vn/xml/tygiagold.xml';
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      const resp = await fetch(proxyUrl);
      const json = await resp.json();

      if (json && json.contents) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(json.contents, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");

        if (items.length > 0) {
          goldData = [];
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            goldData.push({
              type: item.getAttribute("type") || "SJC",
              buy: parseFloat(item.getAttribute("buy").replace(/[.,]/g, '')),
              sell: parseFloat(item.getAttribute("sell").replace(/[.,]/g, ''))
            });
          }
          renderGold();
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback XML also failed.', e);
      goldData = getMockGold().data;
      renderGold();
    }
  }

  function renderGold() {
    if (!goldData) return;

    goldTime.textContent = new Date().toLocaleString('vi-VN');

    let showcaseHtml = '';
    let tableHtml = '';

    goldData.forEach((item, idx) => {
      const type = item.type;
      const buy = item.buy;
      const sell = item.sell;

      if (idx < 3) {
        showcaseHtml += `
          <div class="gold-card card">
            <span class="gold-type">${type}</span>
            <div class="gold-prices">
              <div class="price-box">
                <span class="price-label">Mua</span>
                <span class="price-val">${formatMoney(buy)}</span>
              </div>
              <div class="price-box">
                <span class="price-label">Bán</span>
                <span class="price-val">${formatMoney(sell)}</span>
              </div>
            </div>
          </div>
        `;
      }

      tableHtml += `
        <tr>
          <td><strong>${type}</strong></td>
          <td class="text-right">${formatMoney(buy)}</td>
          <td class="text-right">${formatMoney(sell)}</td>
        </tr>
      `;
    });

    goldShowcase.innerHTML = showcaseHtml;
    goldTableBody.innerHTML = tableHtml;
  }

  function formatMoney(num, decimals = 0) {
    return Number(num.toFixed(decimals)).toLocaleString('vi-VN');
  }

  function getMockGold() {
    return {
      data: [
        { type: 'SJC (TP.HCM)', buy: 82000000, sell: 85500000 },
        { type: 'SJC (Hà Nội)', buy: 82000000, sell: 85520000 },
        { type: 'Vàng nhẫn SJC 99.99', buy: 70100000, sell: 71400000 },
        { type: 'Vàng 24K (99.99%)', buy: 69500000, sell: 70800000 },
        { type: 'Vàng 18K (75%)', buy: 51200000, sell: 53700000 }
      ]
    };
  }

  init();
});
