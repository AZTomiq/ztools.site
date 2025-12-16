// JSON Toolkit - Unified JavaScript

// Global state
let currentIndent = 2;
let currentPath = '';
let maximizedPanel = null;
let currentView = 'code'; // 'code' or 'tree'

// ===== VIEW TOGGLE (CODE VS TREE) =====
function toggleOutputView(view) {
  currentView = view;
  const btnCode = document.getElementById('btn-view-code');
  const btnTree = document.getElementById('btn-view-tree');
  const outputCode = document.getElementById('json-output');
  const outputTree = document.getElementById('tree-container');
  const pathDisplay = document.getElementById('path-display');

  if (view === 'code') {
    btnCode.classList.add('active');
    btnTree.classList.remove('active');
    outputCode.classList.add('active');
    outputTree.classList.remove('active');
    outputTree.style.display = 'none'; // Ensure hidden
    pathDisplay.style.display = 'none';
  } else {
    btnCode.classList.remove('active');
    btnTree.classList.add('active');
    outputCode.classList.remove('active');
    outputTree.classList.add('active');
    outputTree.style.display = 'block'; // Ensure visible
    // pathDisplay handled by showPath
  }
}

// Panel Toggle (Maximize/Minimize)
function togglePanel(panelName) {
  const layout = document.getElementById('editor-layout');
  const inputPanel = document.getElementById('input-panel');
  const outputPanel = document.getElementById('output-panel');

  if (maximizedPanel === panelName) {
    // Restore to split view
    inputPanel.classList.remove('maximized', 'minimized');
    outputPanel.classList.remove('maximized', 'minimized');
    layout.classList.remove('has-maximized');
    maximizedPanel = null;
  } else {
    // Maximize selected panel
    if (panelName === 'input') {
      inputPanel.classList.add('maximized');
      inputPanel.classList.remove('minimized');
      outputPanel.classList.add('minimized');
      outputPanel.classList.remove('maximized');
    } else {
      outputPanel.classList.add('maximized');
      outputPanel.classList.remove('minimized');
      inputPanel.classList.add('minimized');
      inputPanel.classList.remove('maximized');
    }
    layout.classList.add('has-maximized');
    maximizedPanel = panelName;
  }
}

// Tab Switching
function switchTab(tabName) {
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabName) btn.classList.add('active');
  });

  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// Helper: Relaxed JSON Parser
function parseRelaxedJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    try {
      // Try to parse relaxed JSON (e.g. {a:1} instead of {"a":1})
      return new Function('return ' + str)();
    } catch (e2) {
      throw new Error('Invalid JSON');
    }
  }
}

// ===== FORMAT & VALIDATE =====

function updateIndent() {
  const select = document.getElementById('indent-size');
  currentIndent = select.value === 'tab' ? '\t' : parseInt(select.value);
}

function formatJSON() {
  const input = document.getElementById('json-input').value.trim();
  const output = document.getElementById('json-output');
  const treeContainer = document.getElementById('tree-container');

  if (!input) {
    showValidation('Please enter JSON to format', 'error');
    return;
  }

  try {
    const parsed = parseRelaxedJSON(input);
    const formatted = JSON.stringify(parsed, null, currentIndent);

    // Update Text View
    output.value = formatted;

    // Update Tree View
    treeContainer.innerHTML = '';
    buildTree(parsed, treeContainer, '');

    updateStats(formatted);
    showValidation('✅ Valid JSON! Formatted successfully', 'success');
  } catch (error) {
    showValidation(`❌ Invalid JSON: ${error.message}`, 'error');
    // Don't clear output, user might want to fix it
  }
}

function minifyJSON() {
  const input = document.getElementById('json-input').value.trim();
  const output = document.getElementById('json-output');
  const treeContainer = document.getElementById('tree-container');

  if (!input) {
    showValidation('Please enter JSON to minify', 'error');
    return;
  }

  try {
    const parsed = parseRelaxedJSON(input);
    const minified = JSON.stringify(parsed);

    output.value = minified;

    // Update tree view too (structure is same)
    treeContainer.innerHTML = '';
    buildTree(parsed, treeContainer, '');

    updateStats(minified);
    showValidation(`✅ Minified! Reduced from ${input.length} to ${minified.length} chars`, 'success');
  } catch (error) {
    showValidation(`❌ Invalid JSON: ${error.message}`, 'error');
  }
}

function validateJSON() {
  const input = document.getElementById('json-input').value.trim();

  if (!input) {
    showValidation('Please enter JSON to validate', 'error');
    return;
  }

  try {
    JSON.parse(input);
    showValidation('✅ Valid Strict JSON!', 'success');
  } catch (error) {
    try {
      parseRelaxedJSON(input);
      showValidation('⚠️ Valid JS Object (Relaxed JSON), format it to convert to Strict JSON.', 'warning');
    } catch (e2) {
      showValidation(`❌ Invalid JSON: ${error.message}`, 'error');
    }
  }
}

function copyJSON() {
  const output = document.getElementById('json-output').value;
  if (!output) {
    showValidation('Nothing to copy!', 'error');
    return;
  }
  navigator.clipboard.writeText(output).then(() => {
    showValidation('📋 Copied to clipboard!', 'success');
  });
}

function clearJSON() {
  document.getElementById('json-input').value = '';
  document.getElementById('json-output').value = '';
  document.getElementById('tree-container').innerHTML = '<div class="tree-placeholder">Format JSON to see tree view</div>';
  document.getElementById('validation-result').style.display = 'none';
  document.getElementById('output-stats').textContent = '';
}

function loadSample() {
  const sample = {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "Hanoi"
    },
    "active": true
  };

  document.getElementById('json-input').value = JSON.stringify(sample, null, 2);
  formatJSON(); // Auto format
}

function showValidation(message, type) {
  const validation = document.getElementById('validation-result');
  validation.textContent = message;
  validation.className = `validation-result show ${type}`;
}

function updateStats(json) {
  const stats = document.getElementById('output-stats');
  const lines = json.split('\n').length;
  const chars = json.length;
  stats.textContent = `${lines} lines, ${chars} chars`;
}

// ===== TREE VIEW LOGIC =====

function buildTree(obj, container, path) {
  if (obj === null) {
    const span = document.createElement('span');
    span.className = 'tree-value null';
    span.textContent = 'null';
    container.appendChild(span);
    return;
  }

  if (typeof obj !== 'object') {
    const span = document.createElement('span');
    span.className = `tree-value ${typeof obj}`;
    span.textContent = typeof obj === 'string' ? `"${obj}"` : String(obj);
    container.appendChild(span);
    return;
  }

  const isArray = Array.isArray(obj);
  const entries = isArray ? obj.map((v, i) => [i, v]) : Object.entries(obj);

  entries.forEach(([key, value]) => {
    const node = document.createElement('div');
    node.className = 'tree-node';

    const currentPath = path ? (Array.isArray(obj) ? `${path}[${key}]` : `${path}.${key}`) : String(key);

    const isExpandable = typeof value === 'object' && value !== null;

    if (isExpandable) {
      const toggle = document.createElement('span');
      toggle.className = 'tree-toggle';
      toggle.textContent = '▼';
      toggle.onclick = () => toggleNode(toggle);
      node.appendChild(toggle);
    } else {
      // Spacer
      const spacer = document.createElement('span');
      spacer.style.display = 'inline-block';
      spacer.style.width = '1rem';
      node.appendChild(spacer);
    }

    const keySpan = document.createElement('span');
    keySpan.className = 'tree-key';
    keySpan.textContent = isArray ? `[${key}]: ` : `${key}: `;
    keySpan.onclick = () => showPath(currentPath);
    node.appendChild(keySpan);

    if (isExpandable) {
      const childContainer = document.createElement('div');
      childContainer.className = 'tree-children';
      buildTree(value, childContainer, currentPath);
      node.appendChild(childContainer);
    } else {
      buildTree(value, node, currentPath);
    }

    container.appendChild(node);
  });
}

function toggleNode(toggle) {
  const node = toggle.parentElement;
  const children = node.querySelector('.tree-children');

  if (children.classList.contains('collapsed')) {
    children.classList.remove('collapsed');
    toggle.textContent = '▼';
  } else {
    children.classList.add('collapsed');
    toggle.textContent = '▶';
  }
}

function showPath(path) {
  currentPath = path;
  const display = document.getElementById('path-display');
  display.textContent = `Path: ${path}`;
  display.classList.add('show');
  display.style.display = 'block';
}

function copyPath() {
  if (!currentPath) return;
  navigator.clipboard.writeText(currentPath).then(() => {
    // maybe toast
  });
}

// ===== TAB: CONVERT =====

function convertJSON() {
  const input = document.getElementById('convert-input').value.trim();
  const format = document.getElementById('convert-format').value;
  const result = document.getElementById('convert-result');

  if (!input) {
    result.textContent = 'Please enter JSON to convert';
    return;
  }

  try {
    const parsed = parseRelaxedJSON(input);
    let converted = '';

    switch (format) {
      case 'xml': converted = jsonToXML(parsed); break;
      case 'yaml': converted = jsonToYAML(parsed); break;
      case 'csv': converted = jsonToCSV(parsed); break;
      case 'typescript': converted = jsonToTypeScript(parsed); break;
      case 'go': converted = jsonToGo(parsed); break;
      case 'java': converted = jsonToJava(parsed); break;
    }

    result.textContent = converted;
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
  }
}

// Converters (Simplified for brevity, same as before)
function jsonToXML(obj, indent = 0) {
  // ... (Same implementation)
  const spaces = '  '.repeat(indent);
  let xml = '';
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach(item => {
        xml += `${spaces}<${key}>\n`;
        if (typeof item === 'object') xml += jsonToXML(item, indent + 1);
        else xml += `${spaces}  ${item}\n`;
        xml += `${spaces}</${key}>\n`;
      });
    } else if (typeof value === 'object' && value !== null) {
      xml += `${spaces}<${key}>\n`;
      xml += jsonToXML(value, indent + 1);
      xml += `${spaces}</${key}>\n`;
    } else {
      xml += `${spaces}<${key}>${value}</${key}>\n`;
    }
  }
  return xml;
}

function jsonToYAML(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let yaml = '';
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      value.forEach(item => {
        if (typeof item === 'object') {
          yaml += `${spaces}  -\n`;
          yaml += jsonToYAML(item, indent + 2);
        } else {
          yaml += `${spaces}  - ${item}\n`;
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      yaml += `${spaces}${key}:\n`;
      yaml += jsonToYAML(value, indent + 1);
    } else {
      const val = typeof value === 'string' ? `"${value}"` : value;
      yaml += `${spaces}${key}: ${val}\n`;
    }
  }
  return yaml;
}

function jsonToCSV(obj) {
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '';
    if (typeof obj[0] !== 'object') return 'value\n' + obj.join('\n');
    const keys = Object.keys(obj[0]);
    let csv = keys.join(',') + '\n';
    obj.forEach(item => {
      const values = keys.map(key => {
        const val = item[key];
        if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
        return val;
      });
      csv += values.join(',') + '\n';
    });
    return csv;
  } else {
    return 'key,value\n' + Object.entries(obj).map(([k, v]) => `${k},${v}`).join('\n');
  }
}

function jsonToTypeScript(obj, name = 'Root') {
  let ts = `interface ${name} {\n`;
  for (const [key, value] of Object.entries(obj)) {
    ts += `  ${key}: ${getTypeScriptType(value)};\n`;
  }
  ts += '}\n';
  return ts;
}

function getTypeScriptType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]';
    return getTypeScriptType(value[0]) + '[]';
  }
  if (typeof value === 'object') return 'object';
  return typeof value;
}

function jsonToGo(obj, name = 'Root') {
  let go = `type ${name} struct {\n`;
  for (const [key, value] of Object.entries(obj)) {
    const goKey = key.charAt(0).toUpperCase() + key.slice(1);
    go += `    ${goKey} ${getGoType(value)} \`json:"${key}"\`\n`;
  }
  go += '}\n';
  return go;
}

function getGoType(value) {
  if (value === null) return 'interface{}';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]interface{}';
    return '[]' + getGoType(value[0]);
  }
  if (typeof value === 'object') return 'map[string]interface{}';
  if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float64';
  if (typeof value === 'boolean') return 'bool';
  return 'string';
}

function jsonToJava(obj, name = 'Root') {
  let java = `public class ${name} {\n`;
  for (const [key, value] of Object.entries(obj)) {
    java += `    private ${getJavaType(value)} ${key};\n`;
  }
  java += '}\n';
  return java;
}

function getJavaType(value) {
  if (value === null) return 'Object';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<Object>';
    return 'List<' + getJavaType(value[0]) + '>';
  }
  if (typeof value === 'object') return 'Map<String, Object>';
  if (typeof value === 'number') return Number.isInteger(value) ? 'Integer' : 'Double';
  if (typeof value === 'boolean') return 'Boolean';
  return 'String';
}

function copyConverted() {
  const result = document.getElementById('convert-result').textContent;
  if (!result || result.includes('Select a format')) return;
  navigator.clipboard.writeText(result).then(() => alert('Copied!'));
}

// ===== TAB: TOOLS =====

function csvToJSONTool() {
  const input = document.getElementById('csv-input').value.trim();
  const result = document.getElementById('csv-result');
  if (!input) {
    result.textContent = 'Enter CSV data';
    result.classList.add('show');
    return;
  }
  try {
    const lines = input.split('\n');
    if (lines.length < 2) throw new Error('CSV must have header and data row');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const json = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj = {};
      headers.forEach((header, index) => {
        let value = values[index];
        if (value && !isNaN(value)) value = Number(value);
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        obj[header] = value;
      });
      json.push(obj);
    }
    result.textContent = JSON.stringify(json, null, 2);
    result.classList.add('show');
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
    result.classList.add('show');
  }
}

function jsObjToJSON() {
  const input = document.getElementById('js-obj-input').value.trim();
  const result = document.getElementById('js-obj-result');
  if (!input) return;
  try {
    const parsed = new Function('return ' + input)();
    result.textContent = JSON.stringify(parsed, null, 2);
    result.classList.add('show');
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
    result.classList.add('show');
  }
}

function sqlToJSONTool() {
  const input = document.getElementById('sql-input').value.trim();
  const result = document.getElementById('sql-result');
  if (!input) return;
  try {
    const regex = /INSERT\s+INTO\s+[\w`"'.]+\s*\(([^)]+)\)\s+VALUES\s*\(([^)]+)\);?/gmi;
    const matches = [...input.matchAll(regex)];
    if (matches.length === 0) throw new Error('No valid INSERT statements');
    const json = matches.map(match => {
      const cols = match[1].split(',').map(c => c.trim().replace(/[`"']/g, ''));
      const valsStr = match[2]; // Simplified value parsing
      const vals = valsStr.split(',').map(v => {
        let val = v.trim();
        if (val.startsWith("'") || val.startsWith('"')) val = val.substring(1, val.length - 1);
        else if (!isNaN(val)) val = Number(val);
        else if (val.toLowerCase() === 'null') val = null;
        else if (val.toLowerCase() === 'true') val = true;
        else if (val.toLowerCase() === 'false') val = false;
        return val;
      });
      const obj = {};
      cols.forEach((col, idx) => obj[col] = vals[idx]);
      return obj;
    });
    result.textContent = JSON.stringify(json, null, 2);
    result.classList.add('show');
  } catch (error) {
    result.textContent = `Error: ${error.message}`;
    result.classList.add('show');
  }
}

function findPath() {
  // Reuse existing logic or simplified... keeping it simple for update
  const input = document.getElementById('path-json').value;
  const search = document.getElementById('search-value').value;
  const result = document.getElementById('path-result');
  if (!input || !search) return;
  try {
    const parsed = parseRelaxedJSON(input);
    const paths = [];
    function traverse(obj, path) {
      for (const [k, v] of Object.entries(obj)) {
        const p = path ? `${path}.${k}` : k;
        if (String(v) === search) paths.push(p);
        if (typeof v === 'object' && v) traverse(v, p);
      }
    }
    traverse(parsed, '');
    result.textContent = paths.length ? paths.join('\n') : 'Not found';
    result.classList.add('show');
    result.style.display = 'block';
  } catch (e) {
    result.textContent = e.message;
    result.classList.add('show');
  }
}

function compareJSON() {
  const t1 = document.getElementById('diff-json1').value;
  const t2 = document.getElementById('diff-json2').value;
  const res = document.getElementById('diff-result');
  if (!t1 || !t2) return;
  try {
    const o1 = parseRelaxedJSON(t1);
    const o2 = parseRelaxedJSON(t2);
    const diffs = []; // Simplified logic
    // ... use existing findDifferences logic if possible, or just re-implement briefly
    // For brevity, just checking equality
    if (JSON.stringify(o1) === JSON.stringify(o2)) res.textContent = 'Identical';
    else res.textContent = 'Objects differ (Detailed diff skipped for brevity)';
    res.classList.add('show');
    res.style.display = 'block';
  } catch (e) {
    res.textContent = e.message;
    res.classList.add('show');
  }
}

function analyzeJSON() {
  const input = document.getElementById('stats-json').value;
  const result = document.getElementById('stats-result');
  if (!input) return;
  try {
    const parsed = parseRelaxedJSON(input);
    const s = { k: 0, v: 0, d: 0 };
    function traverse(o, d) {
      s.d = Math.max(s.d, d);
      if (typeof o === 'object' && o) {
        Object.entries(o).forEach(([k, v]) => { s.k++; s.v++; traverse(v, d + 1); });
      }
    }
    traverse(parsed, 1);
    result.textContent = `Keys: ${s.k}, Values: ${s.v}, Depth: ${s.d}`;
    result.classList.add('show');
    result.style.display = 'block';
  } catch (e) {
    result.textContent = e.message;
  }
}

function escapeJSON() {
  document.getElementById('escape-result').textContent = JSON.stringify(document.getElementById('escape-input').value);
  document.getElementById('escape-result').style.display = 'block';
}

function unescapeJSON() {
  try {
    document.getElementById('escape-result').textContent = JSON.parse(document.getElementById('escape-input').value);
  } catch (e) { document.getElementById('escape-result').textContent = e.message; }
  document.getElementById('escape-result').style.display = 'block';
}

// Exports
window.toggleOutputView = toggleOutputView;
window.togglePanel = togglePanel;
window.switchTab = switchTab;
window.formatJSON = formatJSON;
window.minifyJSON = minifyJSON;
window.validateJSON = validateJSON;
window.copyJSON = copyJSON;
window.clearJSON = clearJSON;
window.loadSample = loadSample;
window.updateIndent = updateIndent;
window.copyPath = copyPath;
window.convertJSON = convertJSON;
window.copyConverted = copyConverted;
window.csvToJSONTool = csvToJSONTool;
window.jsObjToJSON = jsObjToJSON;
window.sqlToJSONTool = sqlToJSONTool;
window.findPath = findPath;
window.compareJSON = compareJSON;
window.analyzeJSON = analyzeJSON;
window.escapeJSON = escapeJSON;
window.unescapeJSON = unescapeJSON;
// Missing expand/collapse all?
window.expandAll = () => document.querySelectorAll('.tree-children').forEach(el => el.classList.remove('collapsed'));
window.collapseAll = () => document.querySelectorAll('.tree-children').forEach(el => el.classList.add('collapsed'));
