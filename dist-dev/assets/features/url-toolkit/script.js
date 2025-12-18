/**
 * URL Toolkit Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.cat-tab');
  const input = document.getElementById('input-text');
  const output = document.getElementById('output-text');
  const urlActions = document.getElementById('url-actions');
  const base64Actions = document.getElementById('base64-actions');
  const parserActions = document.getElementById('parser-actions');
  const resultGroup = document.getElementById('result-text-group');
  const parserGroup = document.getElementById('parser-results');

  if (!input) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const currentTab = tab.dataset.tab;

      if (urlActions) urlActions.style.display = currentTab === 'url' ? 'flex' : 'none';
      if (base64Actions) base64Actions.style.display = currentTab === 'base64' ? 'flex' : 'none';
      if (parserActions) parserActions.style.display = currentTab === 'parser' ? 'flex' : 'none';

      if (currentTab === 'parser') {
        if (resultGroup) resultGroup.style.display = 'none';
        if (parserGroup) parserGroup.style.display = 'flex';
      } else {
        if (resultGroup) resultGroup.style.display = 'block';
        if (parserGroup) parserGroup.style.display = 'none';
      }
    });
  });

  window.urlAction = (type) => {
    try {
      if (type === 'encode') output.value = encodeURIComponent(input.value);
      else output.value = decodeURIComponent(input.value);
    } catch (e) {
      output.value = 'Error: ' + e.message;
    }
  };

  window.base64Action = (type) => {
    try {
      output.value = type === 'encode' ? encodeBase64(input.value) : decodeBase64(input.value);
    } catch (e) {
      output.value = 'Error: ' + e.message;
    }
  };

  window.parseURL = () => {
    const res = parseURLLogic(input.value);
    if (res.error) {
      parserGroup.innerHTML = `<div style="color:red">Error: ${res.error}</div>`;
      return;
    }
    const isVi = document.documentElement.lang === 'vi';
    parserGroup.innerHTML = `
      <div class="parser-row"><div class="parser-label">${isVi ? 'Giao thức' : 'Protocol'}</div><div class="parser-value">${res.protocol}</div></div>
      <div class="parser-row"><div class="parser-label">Hostname</div><div class="parser-value">${res.host}</div></div>
      <div class="parser-row"><div class="parser-label">${isVi ? 'Đường dẫn' : 'Path'}</div><div class="parser-value">${res.path}</div></div>
      <div class="parser-row"><div class="parser-label">${isVi ? 'Tham số' : 'Query Params'}</div><div class="parser-value">${res.query}</div></div>
      <div class="parser-row"><div class="parser-label">Hash</div><div class="parser-value">${res.hash}</div></div>
    `;
  };

  window.copyResult = () => {
    output.select();
    document.execCommand('copy');
  };
});

// Pure Logic
function encodeBase64(str) {
  if (typeof btoa === 'function') return btoa(unescape(encodeURIComponent(str)));
  return Buffer.from(str, 'utf-8').toString('base64');
}

function decodeBase64(str) {
  if (typeof atob === 'function') return decodeURIComponent(escape(atob(str)));
  return Buffer.from(str, 'base64').toString('utf-8');
}

function parseURLLogic(urlStr) {
  try {
    const s = urlStr.trim();
    if (!s) return { error: 'Empty URL' };
    const url = new URL(s.startsWith('http') ? s : 'http://' + s);
    return {
      protocol: url.protocol,
      host: url.host,
      path: url.pathname,
      query: url.search || '-',
      hash: url.hash || '-'
    };
  } catch (e) {
    return { error: e.message };
  }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { encodeBase64, decodeBase64, parseURLLogic };
}
