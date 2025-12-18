/**
 * Random Toolkit Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.cat-tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.style.display = 'none');
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.style.display = 'block';
    });
  });

  window.generateRandomNumber = () => {
    const min = parseInt(document.getElementById('num-min').value) || 0;
    const max = parseInt(document.getElementById('num-max').value) || 100;
    const count = parseInt(document.getElementById('num-count').value) || 1;
    const results = generateRandomNumbersLogic(min, max, count);
    const display = document.getElementById('number-result');
    if (display) display.textContent = results.join(', ');
  };

  window.pickFromList = () => {
    const input = document.getElementById('list-input').value;
    const picked = pickFromListLogic(input);
    const display = document.getElementById('list-result');
    if (display) display.textContent = picked || '';
  };

  window.rollDice = () => {
    const dice = document.getElementById('main-dice');
    if (!dice) return;
    dice.classList.add('rolling');
    setTimeout(() => {
      dice.classList.remove('rolling');
      const val = rollDiceLogic();
      const diceIcons = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      dice.textContent = diceIcons[val - 1];
    }, 600);
  };
});

function generateRandomNumbersLogic(min, max, count) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return results;
}

function pickFromListLogic(input) {
  const items = input.split('\n').map(i => i.trim()).filter(i => i !== '');
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

function rollDiceLogic() {
  return Math.floor(Math.random() * 6) + 1;
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateRandomNumbersLogic, pickFromListLogic, rollDiceLogic };
}
