// Basic conversion function (as seen in Blog)
function convertSecNoToHMS(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return {
    h: h < 10 ? '0' + h : h,
    m: m < 10 ? '0' + m : m,
    s: s < 10 ? '0' + s : s
  };
}

let timerInterval = null;
let remainingTime = 3600; // 1 Hour default

const hEl = document.getElementById('hours');
const mEl = document.getElementById('minutes');
const sEl = document.getElementById('seconds');
const startBtn = document.getElementById('btn-start');
const resetBtn = document.getElementById('btn-reset');

function updateDisplay() {
  const parts = convertSecNoToHMS(remainingTime);
  hEl.textContent = parts.h;
  mEl.textContent = parts.m;
  sEl.textContent = parts.s;
}

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    startBtn.textContent = 'Resume Mission';
    startBtn.classList.remove('active');
    return;
  }

  startBtn.textContent = 'Pause Mission';
  startBtn.classList.add('active');

  timerInterval = setInterval(() => {
    remainingTime--;
    updateDisplay();

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      alert('Mission Complete!');
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  remainingTime = 3600;
  startBtn.textContent = 'Start Mission';
  updateDisplay();
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// Initial display
updateDisplay();
