let currentMode = 'base64';

function switchTab(mode) {
  currentMode = mode;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tab-btn[onclick="switchTab('${mode}')"]`).classList.add('active');

  const base64Controls = document.getElementById('base64-controls');
  const hashControls = document.getElementById('hash-controls');

  if (mode === 'base64') {
    base64Controls.style.display = 'flex';
    hashControls.style.display = 'none';
  } else {
    base64Controls.style.display = 'none';
    hashControls.style.display = 'flex';
  }

  document.getElementById('output-text').value = '';
  document.getElementById('status-msg').textContent = '';
}

function processBase64(action) {
  const input = document.getElementById('input-text').value;
  const outputEl = document.getElementById('output-text');
  const statusEl = document.getElementById('status-msg');
  const isVi = document.documentElement.lang === 'vi';

  statusEl.textContent = '';

  try {
    if (action === 'encode') {
      outputEl.value = btoa(unescape(encodeURIComponent(input)));
    } else {
      outputEl.value = decodeURIComponent(escape(atob(input)));
    }
  } catch (e) {
    statusEl.textContent = isVi ? 'Lỗi: Định dạng Base64 không hợp lệ' : 'Error: Invalid Base64 string';
  }
}

async function generateHash() {
  const input = document.getElementById('input-text').value;
  const outputEl = document.getElementById('output-text');

  if (currentMode === 'sha256') {
    const hash = await sha256(input);
    outputEl.value = hash;
  } else if (currentMode === 'md5') {
    outputEl.value = md5(input);
  }
}

async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simple MD5 Implementation
function md5(string) {
  function k(a, b, c, d, e, f, g) {
    a = a + (b & c | ~b & d) + e + f;
    return (a << g | a >>> 32 - g) + b;
  }
  function l(a, b, c, d, e, f, g) {
    a = a + (b & d | c & ~d) + e + f;
    return (a << g | a >>> 32 - g) + b;
  }
  function m(a, b, c, d, e, f, g) {
    a = a + (b ^ c ^ d) + e + f;
    return (a << g | a >>> 32 - g) + b;
  }
  function n(a, b, c, d, e, f, g) {
    a = a + (c ^ (b | ~d)) + e + f;
    return (a << g | a >>> 32 - g) + b;
  }
  var o = [1732584193, -271733879, -1732584194, 271733878], p, q, r, s, t = function (a) {
    for (var b = "", c = 0; c < 4 * a.length; c++) b += "0123456789abcdef".charAt(a[c >> 2] >> c % 4 * 8 + 4 & 15) + "0123456789abcdef".charAt(a[c >> 2] >> c % 4 * 8 & 15);
    return b;
  };
  string = function (a) {
    a = unescape(encodeURIComponent(a));
    for (var b = (a.length + 8 >> 6) + 1, c = new Array(16 * b), d = 0; d < 16 * b; d++) c[d] = 0;
    for (d = 0; d < a.length; d++) c[d >> 2] |= a.charCodeAt(d) << d % 4 * 8;
    return c[d >> 2] |= 128 << d % 4 * 8, c[16 * b - 2] = 8 * a.length, c;
  }(string);
  for (var u = 0; u < string.length; u += 16) {
    p = o[0], q = o[1], r = o[2], s = o[3];
    p = k(p, q, r, s, string[u + 0], 7, -680876936), s = k(s, p, q, r, string[u + 1], 12, -389564586), r = k(r, s, p, q, string[u + 2], 17, 606105819), q = k(q, r, s, p, string[u + 3], 22, -1044525330);
    p = k(p, q, r, s, string[u + 4], 7, -176418897), s = k(s, p, q, r, string[u + 5], 12, 1200080426), r = k(r, s, p, q, string[u + 6], 17, -1473231341), q = k(q, r, s, p, string[u + 7], 22, -45705983);
    p = k(p, q, r, s, string[u + 8], 7, 1770035416), s = k(s, p, q, r, string[u + 9], 12, -1958414417), r = k(r, s, p, q, string[u + 10], 17, -42063), q = k(q, r, s, p, string[u + 11], 22, -1990404162);
    p = k(p, q, r, s, string[u + 12], 7, 1804603682), s = k(s, p, q, r, string[u + 13], 12, -40341101), r = k(r, s, p, q, string[u + 14], 17, -1502002290), q = k(q, r, s, p, string[u + 15], 22, 1236535329);
    p = l(p, q, r, s, string[u + 1], 5, -165796510), s = l(s, p, q, r, string[u + 6], 9, -1069501632), r = l(r, s, p, q, string[u + 11], 14, 643717713), q = l(q, r, s, p, string[u + 0], 20, -373897302), p = l(p, q, r, s, string[u + 5], 5, -701558691), s = l(s, p, q, r, string[u + 10], 9, 38016083), r = l(r, s, p, q, string[u + 15], 14, -660478335), q = l(q, r, s, p, string[u + 4], 20, -405537848), p = l(p, q, r, s, string[u + 9], 5, 568446438), s = l(s, p, q, r, string[u + 14], 9, -1019803690), r = l(r, s, p, q, string[u + 3], 14, -187363961), q = l(q, r, s, p, string[u + 8], 20, 1163531501), p = l(p, q, r, s, string[u + 13], 5, -1444681467), s = l(s, p, q, r, string[u + 2], 9, -51403784), r = l(r, s, p, q, string[u + 7], 14, 1735328473), q = l(q, r, s, p, string[u + 12], 20, -1926607734);
    p = m(p, q, r, s, string[u + 5], 4, -378558), s = m(s, p, q, r, string[u + 8], 11, -2022574463), r = m(r, s, p, q, string[u + 11], 16, 1839030562), q = m(q, r, s, p, string[u + 14], 23, -35309556), p = m(p, q, r, s, string[u + 1], 4, -1530992060), s = m(s, p, q, r, string[u + 4], 11, 1272893353), r = m(r, s, p, q, string[u + 7], 16, -155497632), q = m(q, r, s, p, string[u + 10], 23, -1094730640), p = m(p, q, r, s, string[u + 13], 4, 681279174), s = m(s, p, q, r, string[u + 0], 11, -358537222), r = m(r, s, p, q, string[u + 3], 16, -722521979), q = m(q, r, s, p, string[u + 6], 23, 76029189), p = m(p, q, r, s, string[u + 9], 4, -640364487), s = m(s, p, q, r, string[u + 12], 11, -421815835), r = m(r, s, p, q, string[u + 15], 16, 530742520), q = m(q, r, s, p, string[u + 2], 23, -995338651);
    p = n(p, q, r, s, string[u + 0], 6, -198630844), s = n(s, p, q, r, string[u + 7], 10, 1126891415), r = n(r, s, p, q, string[u + 14], 15, -1416354905), q = n(q, r, s, p, string[u + 5], 21, -57434055), p = n(p, q, r, s, string[u + 12], 6, 1700485571), s = n(s, p, q, r, string[u + 3], 10, -1894946606), r = n(r, s, p, q, string[u + 10], 15, -1051523), q = n(q, r, s, p, string[u + 1], 21, -2054922799), p = n(p, q, r, s, string[u + 8], 6, 1873313359), s = n(s, p, q, r, string[u + 15], 10, -30611744), r = n(r, s, p, q, string[u + 6], 15, -1560198380), q = n(q, r, s, p, string[u + 13], 21, 1309151649), p = n(p, q, r, s, string[u + 4], 6, -145523070), s = n(s, p, q, r, string[u + 11], 10, -1120210379), r = n(r, s, p, q, string[u + 2], 15, 718787280), q = n(q, r, s, p, string[u + 9], 21, -343485551);
    o[0] = o[0] + p | 0, o[1] = o[1] + q | 0, o[2] = o[2] + r | 0, o[3] = o[3] + s | 0;
  }
  return t(o);
}

function copyResult() {
  const text = document.getElementById('output-text').value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.btn-copy');
    btn.textContent = '✅';
    setTimeout(() => btn.textContent = '📋', 1500);
  });
}
