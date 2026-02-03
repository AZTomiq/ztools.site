/**
 * Password Generator Logic
 */

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

const AMBIGUOUS = ['l', 'I', '1', 'O', '0', 'o'];

document.addEventListener('DOMContentLoaded', () => {
  const lengthInput = document.getElementById('length');
  if (!lengthInput) return;

  const updateAll = () => {
    const options = {
      length: parseInt(lengthInput.value),
      quantity: parseInt(document.getElementById('quantity').value) || 1,
      useUpper: document.getElementById('uppercase')?.checked ?? false,
      useLower: document.getElementById('lowercase')?.checked ?? false,
      useNumbers: document.getElementById('numbers')?.checked ?? false,
      useSymbols: document.getElementById('symbols')?.checked ?? false,
      excludeAmbiguous: document.getElementById('exclude_ambiguous')?.checked ?? false,
      easySay: document.getElementById('easy_say')?.checked ?? false
    };

    const results = generatePasswordsLogic(options);
    const output = document.getElementById('password-output');
    if (output) {
      // FIX: Use double newline for clearer separation
      output.value = results.join('\n\n');
      output.rows = Math.min(Math.max(options.quantity * 2, 2), 15);
    }

    if (results.length > 0) {
      const strength = calculateStrength(results[0]);
      updateStrengthDisplay(strength);
    }

    const lengthVal = document.getElementById('length-val');
    if (lengthVal) lengthVal.textContent = options.length;
  };

  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => input.addEventListener('change', updateAll));
  lengthInput.addEventListener('input', updateAll);

  const easySay = document.getElementById('easy_say');
  if (easySay) {
    easySay.addEventListener('change', (e) => {
      const nums = document.getElementById('numbers');
      const syms = document.getElementById('symbols');
      if (e.target.checked) {
        if (nums) { nums.checked = false; nums.disabled = true; }
        if (syms) { syms.checked = false; syms.disabled = true; }
      } else {
        if (nums) nums.disabled = false;
        if (syms) syms.disabled = false;
      }
      updateAll();
    });
  }

  updateAll();

  window.copyPassword = () => {
    const output = document.getElementById('password-output');
    if (!output || !output.value) return;
    output.select();
    navigator.clipboard.writeText(output.value).then(() => alert('Copied to clipboard!'));
  };

  window.generatePassword = updateAll;
});

function generatePasswordsLogic(options) {
  const { length, quantity, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous, easySay } = options;

  // FIX: Force numbers and symbols OFF when easySay is enabled
  const includeNumbers = easySay ? false : useNumbers;
  const includeSymbols = easySay ? false : useSymbols;

  let validChars = '';
  let mustInclude = [];

  const addSet = (set) => {
    let s = set;
    if (excludeAmbiguous) s = s.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
    validChars += s;
    if (s.length > 0) mustInclude.push(s[Math.floor(Math.random() * s.length)]);
  };

  if (useUpper) addSet(CHARS.upper);
  if (useLower) addSet(CHARS.lower);
  if (includeNumbers) addSet(CHARS.numbers);
  if (includeSymbols) addSet(CHARS.symbols);

  if (validChars.length === 0) return [];

  const generatedList = [];
  for (let q = 0; q < quantity; q++) {
    let password = [];
    // Ensure one char from each selected set
    mustInclude.forEach(c => password.push(c));

    while (password.length < length) {
      password.push(validChars[Math.floor(Math.random() * validChars.length)]);
    }

    // Shuffle
    const shuffled = password.sort(() => 0.5 - Math.random()).join('');
    generatedList.push(shuffled);
  }
  return generatedList;
}

function calculateStrength(password) {
  let score = 0;
  if (password.length > 8) score += 1;
  if (password.length > 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const percentage = Math.min((score / 7) * 100, 100);
  let label = 'Weak';
  let className = 'weak';

  if (percentage < 30) { label = 'Weak'; className = 'weak'; }
  else if (percentage < 60) { label = 'Medium'; className = 'medium'; }
  else if (percentage < 80) { label = 'Strong'; className = 'strong'; }
  else { label = 'Very Strong'; className = 'very-strong'; }

  return { percentage, label, className };
}

function updateStrengthDisplay(strength) {
  const bar = document.getElementById('strength-bar');
  const text = document.getElementById('strength-text');
  if (bar) {
    bar.className = 'strength-bar ' + strength.className;
    bar.style.width = strength.percentage + '%';
  }
  if (text) text.textContent = `Strength: ${strength.label}`;
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generatePasswordsLogic, calculateStrength };
}
