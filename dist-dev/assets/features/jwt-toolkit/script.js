function base64UrlDecode(str) {
  // Replace non-url safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad out with standard base64 required characters
  const pad = str.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
    }
    str += new Array(5 - pad).join('=');
  }
  return atob(str);
}

function decodeJwtPart(part) {
  try {
    const decoded = base64UrlDecode(part);
    const json = JSON.parse(decoded);
    return JSON.stringify(json, null, 2);
  } catch (e) {
    return 'Invalid Part Data';
  }
}

function updateJwt() {
  const input = document.getElementById('jwt-input').value.trim();
  const headerEl = document.getElementById('jwt-header');
  const payloadEl = document.getElementById('jwt-payload');
  const statusEl = document.getElementById('jwt-status');

  if (!input) {
    headerEl.textContent = '';
    payloadEl.textContent = '';
    statusEl.className = 'jwt-status-banner';
    statusEl.textContent = '';
    return;
  }

  const parts = input.split('.');
  const isVi = document.documentElement.lang === 'vi';

  if (parts.length < 2 || parts.length > 3) {
    statusEl.textContent = isVi ? 'Định dạng JWT không hợp lệ' : 'Invalid JWT Format';
    statusEl.className = 'jwt-status-banner status-error';
    headerEl.textContent = '';
    payloadEl.textContent = '';
    return;
  }

  try {
    const header = decodeJwtPart(parts[0]);
    const payload = decodeJwtPart(parts[1]);

    headerEl.textContent = header;
    payloadEl.textContent = payload;

    statusEl.textContent = isVi ? 'Cấu trúc JWT hợp lệ' : 'Valid JWT Structure';
    statusEl.className = 'jwt-status-banner status-valid';
  } catch (e) {
    statusEl.textContent = isVi ? 'Lỗi giải mã token' : 'Token Decode Error';
    statusEl.className = 'jwt-status-banner status-error';
  }
}

function copyText(id) {
  const text = document.getElementById(id).textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(`button[onclick="copyText('${id}')"]`);
    const original = btn.textContent;
    btn.textContent = '✅';
    setTimeout(() => btn.textContent = original, 1500);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('jwt-input');
  input.addEventListener('input', updateJwt);
});
