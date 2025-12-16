function validateQuantity(input) {
  if (input.value > 1000) input.value = 1000;
  if (input.value < 1) input.value = 1;
}

function generateUUIDs() {
  const version = document.getElementById('uuid-version').value;
  const count = parseInt(document.getElementById('uuid-quantity').value) || 1;
  const uppercase = document.getElementById('uppercase').checked;
  const hyphens = document.getElementById('hyphens').checked;
  const braces = document.getElementById('braces').checked;

  const output = document.getElementById('uuid-output');
  const list = [];

  for (let i = 0; i < count; i++) {
    let uuid = '';
    if (version === 'v4' || version === 'guid') {
      uuid = generateV4();
    } else if (version === 'v1') {
      uuid = generateV1();
    } else if (version === 'v7') {
      uuid = generateV7();
    }

    if (uppercase) uuid = uuid.toUpperCase();
    if (!hyphens) uuid = uuid.replace(/-/g, '');
    if (braces) uuid = `{${uuid}}`;
    list.push(uuid);
  }

  output.value = list.join('\n');
  document.getElementById('output-stats').textContent = `Generated ${count} UUID${count > 1 ? 's' : ''}`;
}

function copyUUIDs() {
  const output = document.getElementById('uuid-output');
  output.select();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(output.value).then(() => {
      const btn = document.querySelector('.btn-sm');
      const original = btn.textContent;
      btn.textContent = '✅ Copied!';
      setTimeout(() => btn.textContent = original, 2000);
    });
  }
}

// UUID V4 (Random)
function generateV4() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  // Fallback
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

// UUID V1 (Timestamp - Simulated Node)
let _nodeId = null;
let _clockSeq = null;
let _lastMsecs = 0;
let _lastNsecs = 0;

function generateV1() {
  const msecs = Date.now();
  const nsecs = 0; // Low precision in JS
  const dt = (msecs - 0xb1d069b5400) * 10000; // Gregorian epoch
  const uuid_time = dt + nsecs;

  const time_low = ((uuid_time & 0xffffffff) >>> 0).toString(16).padStart(8, '0');
  const time_mid = ((uuid_time / 0x100000000 & 0xffff) >>> 0).toString(16).padStart(4, '0');
  const time_hi = ((uuid_time / 0x1000000000000 & 0xfff) | 0x1000).toString(16).padStart(4, '0');

  if (!_clockSeq) _clockSeq = (Math.random() * 0x3fff) | 0;
  const clock_seq = (_clockSeq | 0x8000).toString(16).padStart(4, '0');

  if (!_nodeId) {
    const rnd = crypto.getRandomValues(new Uint8Array(6));
    rnd[0] |= 0x01; // Multicast bit
    _nodeId = Array.from(rnd).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  return `${time_low}-${time_mid}-${time_hi}-${clock_seq}-${_nodeId}`;
}

// UUID V7 (Time-Ordered)
function generateV7() {
  const msecs = Date.now();
  const hexTs = msecs.toString(16).padStart(12, '0');

  const rand = crypto.getRandomValues(new Uint8Array(10));
  const randHex = Array.from(rand).map(b => b.toString(16).padStart(2, '0')).join('');

  // Structure: 8-4-4-4-12
  // 48 bit TS + 4 (ver) + 12 (rand) + 2 (var) + 62 (rand)

  // Part 1: First 8 chars of TS
  const p1 = hexTs.slice(0, 8);
  // Part 2: Last 4 chars of TS
  const p2 = hexTs.slice(8, 12);
  // Part 3: Ver 7 + first 3 hex of rand
  const p3 = '7' + randHex.slice(0, 3);
  // Part 4: Var (8,9,a,b) + next 3 hex
  const r4 = (rand[2] & 0x3f) | 0x80; // Variant 10xxxxxx
  const p4 = r4.toString(16).padStart(2, '0')[0] + randHex.slice(4, 7);
  // Part 5: Remaining 12
  const p5 = randHex.slice(8, 20); // Wait, randHex is 20 chars (10 bytes)
  // Let's rely on simple stitching
  const suffix = randHex.slice(3); // 17 chars
  // Re-do robustly

  // timestamp (48 bits)
  const ts_part = hexTs;

  // random (80 bits)
  // we need to inject version and variant
  const r = crypto.getRandomValues(new Uint16Array(5));

  const ver_part = (0x7000 | (r[0] & 0x0FFF)).toString(16).padStart(4, '0');
  const var_part = (0x8000 | (r[1] & 0x3FFF)).toString(16).padStart(4, '0');

  const rest = Array.from(r.slice(2)).map(x => x.toString(16).padStart(4, '0')).join('');

  return `${ts_part.substring(0, 8)}-${ts_part.substring(8, 12)}-${ver_part}-${var_part}-${rest}`;
}

// Init
generateUUIDs();
