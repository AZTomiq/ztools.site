const container = document.getElementById('array-container');
const btnStart = document.getElementById('btn-start');
const btnShuffle = document.getElementById('btn-shuffle');
const algoSelect = document.getElementById('algo-select');
const sizeSlider = document.getElementById('size-slider');
const speedSlider = document.getElementById('speed-slider');

const statTime = document.getElementById('stat-time');
const statSwaps = document.getElementById('stat-swaps');
const statCompares = document.getElementById('stat-compares');

let array = [];
let isSorting = false;
let swaps = 0;
let compares = 0;
let startTime = 0;

// Initialize
function init() {
  generateArray();
  updateStats();
}

function generateArray() {
  const size = parseInt(sizeSlider.value);
  array = [];
  container.innerHTML = '';
  for (let i = 0; i < size; i++) {
    const val = Math.floor(Math.random() * 100) + 5;
    array.push(val);
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${val}%`;
    container.appendChild(bar);
  }
  isSorting = false;
  resetStats();
}

function resetStats() {
  swaps = 0;
  compares = 0;
  statTime.textContent = '0.0s';
  updateStats();
}

function updateStats() {
  statSwaps.textContent = swaps;
  statCompares.textContent = compares;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function swapBars(i, j) {
  const bars = container.children;
  const tempHeight = bars[i].style.height;
  bars[i].style.height = bars[j].style.height;
  bars[j].style.height = tempHeight;

  [array[i], array[j]] = [array[j], array[i]];
  swaps++;
  updateStats();
}

async function markActive(indices, className = 'active') {
  const bars = container.children;
  indices.forEach(i => bars[i].classList.add(className));
  await sleep(parseInt(speedSlider.value));
  indices.forEach(i => bars[i].classList.remove(className));
}

// bubble
async function bubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!isSorting) return;
      compares++;
      await markActive([j, j + 1], 'compared');
      if (array[j] > array[j + 1]) {
        await swapBars(j, j + 1);
      }
    }
    container.children[n - i - 1].classList.add('sorted');
  }
  container.children[0].classList.add('sorted');
}

// selection
async function selectionSort() {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (!isSorting) return;
      compares++;
      await markActive([j, minIdx], 'compared');
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      await swapBars(i, minIdx);
    }
    container.children[i].classList.add('sorted');
  }
}

// insertion
async function insertionSort() {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    container.children[i].classList.add('compared');

    while (j >= 0 && array[j] > key) {
      if (!isSorting) return;
      compares++;
      await markActive([j], 'active');

      const bars = container.children;
      bars[j + 1].style.height = bars[j].style.height;
      array[j + 1] = array[j];

      swaps++;
      updateStats();
      j--;
    }
    array[j + 1] = key;
    container.children[j + 1].style.height = `${key}%`;

    for (let k = 0; k <= i; k++) container.children[k].classList.add('sorted');
    await sleep(parseInt(speedSlider.value));
  }
}

// quick
async function quickSort(l = 0, r = array.length - 1) {
  if (l >= r) {
    if (l >= 0 && l < array.length) container.children[l].classList.add('sorted');
    return;
  }

  let pivotIdx = await partition(l, r);
  await quickSort(l, pivotIdx - 1);
  await quickSort(pivotIdx + 1, r);
}

async function partition(l, r) {
  let pivot = array[r];
  let i = l - 1;
  container.children[r].classList.add('active'); // Pivot

  for (let j = l; j < r; j++) {
    if (!isSorting) return;
    compares++;
    await markActive([j], 'compared');
    if (array[j] < pivot) {
      i++;
      await swapBars(i, j);
    }
  }
  await swapBars(i + 1, r);
  container.children[r].classList.remove('active');
  container.children[i + 1].classList.add('sorted');
  return i + 1;
}

async function start() {
  if (isSorting) return;
  isSorting = true;
  resetStats();
  btnStart.disabled = true;
  btnShuffle.disabled = true;

  const timer = setInterval(() => {
    if (!isSorting) {
      clearInterval(timer);
      return;
    }
    statTime.textContent = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
  }, 100);

  startTime = Date.now();
  const algo = algoSelect.value;

  if (algo === 'bubble') await bubbleSort();
  if (algo === 'selection') await selectionSort();
  if (algo === 'insertion') await insertionSort();
  if (algo === 'quick') await quickSort();

  isSorting = false;
  btnStart.disabled = false;
  btnShuffle.disabled = false;
  clearInterval(timer);
}

// Events
btnShuffle.addEventListener('click', generateArray);
btnStart.addEventListener('click', start);
sizeSlider.addEventListener('input', generateArray);

init();
