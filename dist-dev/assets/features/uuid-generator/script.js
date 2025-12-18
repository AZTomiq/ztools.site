/**
 * UUID Generator Logic
 */

// Node.js crypto polyfill for testing
let cryptoObj = typeof crypto !== 'undefined' ? crypto : null;
if (!cryptoObj && typeof require === 'function') {
  try {
    cryptoObj = require('node:crypto').webcrypto;
  } catch (e) {
    // Fallback if node:crypto fails
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnGen = document.querySelector('button[onclick="generateUUIDs()"]');
  if (btnGen) {
    btnGen.onclick = null;
    btnGen.addEventListener('click', handleGenerate);
  }

  const btnCopy = document.querySelector('button[onclick="copyUUIDs()"]');
  if (btnCopy) {
    btnCopy.onclick = null;
    btnCopy.addEventListener('click', copyUUIDs);
  }

  const inputs = document.querySelectorAll('input, select');
  inputs.forEach(input => input.addEventListener('change', handleGenerate));

  handleGenerate();
});

function handleGenerate() {
  const options = {
    version: document.getElementById('uuid-version').value,
    count: parseInt(document.getElementById('uuid-quantity').value) || 1,
    uppercase: document.getElementById('uppercase').checked,
    hyphens: document.getElementById('hyphens').checked,
    braces: document.getElementById('braces').checked
  };

  if (options.count > 1000) options.count = 1000;

  const results = generateUUIDsLogic(options);
  const output = document.getElementById('uuid-output');
  if (output) output.value = results.join('\n');

  const stats = document.getElementById('output-stats');
  if (stats) stats.textContent = `Generated ${results.length} UUID${results.length > 1 ? 's' : ''}`;
}

function copyUUIDs() {
  const output = document.getElementById('uuid-output');
  if (!output) return;
  output.select();
  navigator.clipboard.writeText(output.value).then(() => {
    const btn = document.querySelector('.btn-copy');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = '✅ Copied!';
      setTimeout(() => btn.textContent = original, 2000);
    }
  });
}

function generateUUIDsLogic(options) {
  const list = [];
  for (let i = 0; i < options.count; i++) {
    let uuid = '';
    if (options.version === 'v4' || options.version === 'guid') uuid = generateV4();
    else if (options.version === 'v1') uuid = generateV1();
    else if (options.version === 'v7') uuid = generateV7();

    if (options.uppercase) uuid = uuid.toUpperCase();
    if (!options.hyphens) uuid = uuid.replace(/-/g, '');
    if (options.braces) uuid = `{${uuid}}`;
    list.push(uuid);
  }
  return list;
}

function generateV4() {
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ cryptoObj.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

let _clockSeq = null, _nodeId = null;
function generateV1() {
  const msecs = Date.now();
  const dt = (msecs - 0xb1d069b5400) * 10000;
  const time_low = ((dt & 0xffffffff) >>> 0).toString(16).padStart(8, '0');
  const time_mid = ((dt / 0x100000000 & 0xffff) >>> 0).toString(16).padStart(4, '0');
  const time_hi = ((dt / 0x1000000000000 & 0xfff) | 0x1000).toString(16).padStart(4, '0');
  if (!_clockSeq) _clockSeq = (Math.random() * 0x3fff) | 0;
  const clock_seq = (_clockSeq | 0x8000).toString(16).padStart(4, '0');
  if (!_nodeId) {
    const rnd = cryptoObj.getRandomValues(new Uint8Array(6));
    rnd[0] |= 0x01;
    _nodeId = Array.from(rnd).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return `${time_low}-${time_mid}-${time_hi}-${clock_seq}-${_nodeId}`;
}

function generateV7() {
  const msecs = Date.now();
  const hexTs = msecs.toString(16).padStart(12, '0');
  const r = cryptoObj.getRandomValues(new Uint16Array(5));
  const ver_part = (0x7000 | (r[0] & 0x0FFF)).toString(16).padStart(4, '0');
  const var_part = (0x8000 | (r[1] & 0x3FFF)).toString(16).padStart(4, '0');
  const rest = Array.from(r.slice(2)).map(x => x.toString(16).padStart(4, '0')).join('');
  return `${hexTs.substring(0, 8)}-${hexTs.substring(8, 12)}-${ver_part}-${var_part}-${rest}`;
}

window.generateUUIDs = handleGenerate;
window.copyUUIDs = copyUUIDs;

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateUUIDsLogic };
}
