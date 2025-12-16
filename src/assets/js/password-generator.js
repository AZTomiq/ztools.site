const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

const AMBIGUOUS = ['l', 'I', '1', 'O', '0', 'o'];

function updateLength(val) {
  document.getElementById('length-val').textContent = val;
  generatePassword();
}

function generatePassword() {
  const length = parseInt(document.getElementById('length').value);
  const quantity = parseInt(document.getElementById('quantity').value) || 1;

  const useUpper = document.getElementById('uppercase').checked;
  const useLower = document.getElementById('lowercase').checked;
  const useNumbers = document.getElementById('numbers').checked;
  const useSymbols = document.getElementById('symbols').checked;
  const excludeAmbiguous = document.getElementById('exclude-ambiguous').checked;
  const easySay = document.getElementById('easy-say').checked;

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

  if (validChars.length === 0) {
    output.value = '';
    strengthBar.style.width = '0%';
    strengthText.textContent = 'Strength: ...';
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
  output.select();
  output.setSelectionRange(0, 99999);

  if (navigator.clipboard) {
    navigator.clipboard.writeText(output.value).then(() => {
      const btn = document.querySelector('.display-actions .btn-icon');
      // Visual feedback
      output.classList.add('copied'); // Assuming css handles this or just ignore
      alert('Copied to clipboard!'); // Simple fallback or use toast if available
    });
  }
}

// Event Listeners
document.querySelectorAll('input[type="checkbox"]').forEach(el => {
  el.addEventListener('change', generatePassword);
});

// Quantity listener
document.getElementById('quantity').addEventListener('change', generatePassword);
document.getElementById('quantity').addEventListener('input', generatePassword);

document.getElementById('easy-say').addEventListener('change', (e) => {
  const nums = document.getElementById('numbers');
  const syms = document.getElementById('symbols');
  if (e.target.checked) {
    nums.checked = false;
    syms.checked = false;
    nums.disabled = true;
    syms.disabled = true;
  } else {
    nums.disabled = false;
    syms.disabled = false;
    // Don't auto check, let user decide
  }
  generatePassword();
});

// Init
generatePassword();
