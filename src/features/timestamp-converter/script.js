/**
 * Timestamp Converter Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const nowUnix = document.getElementById('now-unix');
  const nowDate = document.getElementById('now-date');
  const unixInput = document.getElementById('unix-input');
  const dateInput = document.getElementById('date-input');

  if (!unixInput) return;

  // Set current time into inputs on load
  const now = new Date();
  unixInput.value = Math.floor(now.getTime() / 1000);
  const tzOffset = now.getTimezoneOffset() * 60000;
  dateInput.value = (new Date(now - tzOffset)).toISOString().slice(0, 19);

  const updateClock = () => {
    const d = new Date();
    if (nowUnix) nowUnix.textContent = Math.floor(d.getTime() / 1000);
    if (nowDate) nowDate.textContent = d.toLocaleTimeString();
  };
  setInterval(updateClock, 1000);
  updateClock();

  window.convertUnixToDate = () => {
    const val = parseFloat(unixInput.value);
    const unitEl = document.querySelector('input[name="unix-unit"]:checked');
    const unit = unitEl ? unitEl.value : 's';
    if (isNaN(val)) return;

    const date = unit === 's' ? new Date(val * 1000) : new Date(val);
    const resultBox = document.getElementById('unix-results');
    if (resultBox) {
      document.getElementById('unix-res-local').textContent = date.toLocaleString();
      document.getElementById('unix-res-utc').textContent = date.toUTCString();
      document.getElementById('unix-res-iso').textContent = date.toISOString();
      resultBox.style.display = 'block';
    }
  };

  window.convertDateToUnix = () => {
    const val = dateInput.value;
    if (!val) return;
    const date = new Date(val);
    const resultBox = document.getElementById('date-results');
    if (resultBox) {
      document.getElementById('date-res-unix').textContent = Math.floor(date.getTime() / 1000);
      document.getElementById('date-res-ms').textContent = date.getTime();
      resultBox.style.display = 'block';
    }
  };
});

// Pure logic functions for testing
function unixToDate(val, unit = 's') {
  return unit === 's' ? new Date(val * 1000) : new Date(val);
}

function dateToUnix(dateStr) {
  const d = new Date(dateStr);
  return {
    s: Math.floor(d.getTime() / 1000),
    ms: d.getTime()
  };
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { unixToDate, dateToUnix };
}
