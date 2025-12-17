const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

const AMBIGUOUS = ['l', 'I', '1', 'O', '0', 'o'];

function updateLength(val) {
  const el = document.getElementById('length-val');
  if (el) el.textContent = val;
  generatePassword();
}

function generatePassword() {
  const lengthEl = document.getElementById('length');
  const qtyEl = document.getElementById('quantity');

  if (!lengthEl || !qtyEl) return; // Safety check

  const length = parseInt(lengthEl.value);
  const quantity = parseInt(qtyEl.value) || 1;

  const useUpper = document.getElementById('uppercase')?.checked || false;
  const useLower = document.getElementById('lowercase')?.checked || false;
  const useNumbers = document.getElementById('numbers')?.checked || false;
  const useSymbols = document.getElementById('symbols')?.checked || false;
  const excludeAmbiguous = document.getElementById('exclude_ambiguous')?.checked || false;
  const easySay = document.getElementById('easy_say')?.checked || false;

  // If Easy Say, force no numbers/symbols
  const includeNumbers = easySay ? false : useNumbers;
  const includeSymbols = easySay ? false : useSymbols;

  let validChars = '';
  let mustInclude = [];

  const addSet = (set) => {
    let s = set;
    if (excludeAmbiguous) {
      s = s.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
    }
    validChars += s;
    if (s.length > 0) mustInclude.push(s[Math.floor(Math.random() * s.length)]);
  };

  if (useUpper) addSet(CHARS.upper);
  if (useLower) addSet(CHARS.lower);
  if (includeNumbers) addSet(CHARS.numbers);
  if (includeSymbols) addSet(CHARS.symbols);

  const output = document.getElementById('password-output');
  const strengthBar = document.getElementById('strength-bar');
  const strengthText = document.getElementById('strength-text');

  if (!output) return;

  if (validChars.length === 0) {
    output.value = '';
    if (strengthBar) strengthBar.style.width = '0%';
    if (strengthText) strengthText.textContent = 'Strength: ...';
    return;
  }

  const generatedList = [];

  for (let q = 0; q < quantity; q++) {
    let password = mustInclude.join('');
    for (let i = password.length; i < length; i++) {
      password += validChars[Math.floor(Math.random() * validChars.length)];
    }

    // Shuffle
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    generatedList.push(password);
  }

  output.value = generatedList.join('\n');

  // Auto-resize rows (max 10)
  output.rows = Math.min(Math.max(quantity, 1), 10);

  // Calc strength based on first password config
  if (generatedList.length > 0) {
    calculateStrength(generatedList[0]);
  }
}

function calculateStrength(password) {
  let strength = 0;
  if (password.length > 8) strength += 1;
  if (password.length > 12) strength += 1;
  if (password.length >= 16) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  let percentage = Math.min((strength / 7) * 100, 100);

  const bar = document.getElementById('strength-bar');
  const text = document.getElementById('strength-text');

  if (!bar || !text) return;

  bar.className = 'strength-bar';
  let label = 'Weak';

  if (percentage < 30) {
    bar.classList.add('weak');
    label = 'Weak';
  } else if (percentage < 60) {
    bar.classList.add('medium');
    label = 'Medium';
  } else if (percentage < 80) {
    bar.classList.add('strong');
    label = 'Strong';
  } else {
    bar.classList.add('very-strong');
    label = 'Very Strong';
  }

  bar.style.width = percentage + '%';
  text.textContent = `Strength: ${label}`;
}

function copyPassword() {
  const output = document.getElementById('password-output');
  if (!output) return;
  output.select();
  output.setSelectionRange(0, 99999);

  if (navigator.clipboard) {
    navigator.clipboard.writeText(output.value).then(() => {
      alert('Copied to clipboard!');
    });
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(el => {
    el.addEventListener('change', generatePassword);
  });

  // Quantity listener
  const qtyInput = document.getElementById('quantity');
  if (qtyInput) {
    qtyInput.addEventListener('change', generatePassword);
    qtyInput.addEventListener('input', generatePassword);
  }

  // Length listener
  const lengthInput = document.getElementById('length');
  if (lengthInput) {
    lengthInput.addEventListener('input', function () {
      updateLength(this.value);
    });
    lengthInput.addEventListener('change', generatePassword);
  }

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
      generatePassword();
    });
  }

  // Init
  generatePassword();
});
