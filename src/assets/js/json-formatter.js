function formatJSON() {
  const input = document.getElementById('json-input');
  const errDiv = document.getElementById('json-error');
  try {
    const val = input.value;
    if (!val) return;
    const obj = JSON.parse(val);
    input.value = JSON.stringify(obj, null, 2); // Indent 2 spaces
    errDiv.style.display = 'none';
  } catch (e) {
    errDiv.style.display = 'block';
    errDiv.textContent = '❌ Invalid JSON: ' + e.message;
  }
}

function minifyJSON() {
  const input = document.getElementById('json-input');
  const errDiv = document.getElementById('json-error');
  try {
    const val = input.value;
    if (!val) return;
    const obj = JSON.parse(val);
    input.value = JSON.stringify(obj);
    errDiv.style.display = 'none';
  } catch (e) {
    errDiv.style.display = 'block';
    errDiv.textContent = '❌ Invalid JSON: ' + e.message;
  }
}

function copyJSON() {
  const input = document.getElementById('json-input');
  input.select();
  document.execCommand('copy'); // Legacy but works everywhere
  alert('Copied to clipboard!');
}

function clearEditor() {
  document.getElementById('json-input').value = '';
  document.getElementById('json-error').style.display = 'none';
}
