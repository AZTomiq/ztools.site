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

  if (validChars.length === 0) {
    output.value = '';
    updateStrength(0);
    return;
  }

  let password = mustInclude.join('');
  for (let i = password.length; i < length; i++) {
    password += validChars[Math.floor(Math.random() * validChars.length)];
  }

  // Shuffle
  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  output.value = password;
  calculateStrength(password);
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

  // Normalize to 0-4
  // Max possible: 3 (len) + 4 (types) = 7
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
      // Toast or visual feedback?
      const prev = output.type;
      output.type = 'text'; // Ensure it's text
      // Maybe quick flash?
      output.classList.add('copied');
      setTimeout(() => output.classList.remove('copied'), 200);
    });
  }
}

// Event Listeners for checkboxes to auto-regenerate
document.querySelectorAll('input[type="checkbox"]').forEach(el => {
  el.addEventListener('change', generatePassword);
});

// UI Logic for "Easy Say"
document.getElementById('easy-say').addEventListener('change', (e) => {
  const nums = document.getElementById('numbers');
  const syms = document.getElementById('symbols');
  if (e.target.checked) {
    nums.disabled = true;
    syms.disabled = true;
  } else {
    nums.disabled = false;
    syms.disabled = false;
  }
  generatePassword();
});

// Init
generatePassword();
