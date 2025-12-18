/**
 * JSON Toolkit Logic
 */

// Global state
let currentIndent = 2;
let currentPath = '';
let maximizedPanel = null;
let currentView = 'code';
let inputEditor = null;
let outputEditor = null;
let convertInputEditor = null;
let convertOutputEditor = null;

// Only run if Monaco is available and we're in a browser
if (typeof require === 'function' && typeof require.config === 'function' && typeof window !== 'undefined') {
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
  require(['vs/editor/editor.main'], function () {
    const defaultValue = '{\n  "name": "John Doe",\n  "age": 30,\n  "city": "Hanoi"\n}';

    const inputEl = document.getElementById('monaco-input');
    if (inputEl) inputEditor = monaco.editor.create(inputEl, { value: defaultValue, language: 'json', theme: 'vs-dark', automaticLayout: true });

    const outputEl = document.getElementById('monaco-output');
    if (outputEl) outputEditor = monaco.editor.create(outputEl, { value: '', language: 'json', theme: 'vs-dark', readOnly: true, automaticLayout: true });

    const convInEl = document.getElementById('monaco-convert-input');
    if (convInEl) convertInputEditor = monaco.editor.create(convInEl, { value: '{\n  "name": "Product",\n  "price": 99.99\n}', language: 'json', theme: 'vs-dark', automaticLayout: true });

    const convOutEl = document.getElementById('monaco-convert-output');
    if (convOutEl) convertOutputEditor = monaco.editor.create(convOutEl, { value: '', language: 'xml', theme: 'vs-dark', readOnly: true, automaticLayout: true });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Event listeners and DOM interactions
  const btnFormat = document.getElementById('btn-format');
  if (btnFormat) btnFormat.addEventListener('click', formatJSON);

  const btnMinify = document.getElementById('btn-minify');
  if (btnMinify) btnMinify.addEventListener('click', minifyJSON);

  const btnConvert = document.getElementById('btn-convert');
  if (btnConvert) btnConvert.addEventListener('click', convertJSON);

  // ... other DOM setup ...
});

// Helper: Relaxed JSON Parser
function parseRelaxedJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    try {
      // Use Function constructor for semi-valid JSON/JS Objects
      return new Function('return ' + str)();
    } catch (e2) {
      throw new Error('Invalid JSON');
    }
  }
}

function formatJSON() {
  if (!inputEditor) return;
  const input = inputEditor.getValue().trim();
  try {
    const parsed = parseRelaxedJSON(input);
    const formatted = JSON.stringify(parsed, null, currentIndent);
    if (outputEditor) outputEditor.setValue(formatted);
    // ... tree update ...
  } catch (error) {
    // ... error show ...
  }
}

function convertJSON() {
  if (!convertInputEditor || !convertOutputEditor) return;
  const input = convertInputEditor.getValue().trim();
  const format = document.getElementById('convert-format').value;
  try {
    const parsed = parseRelaxedJSON(input);
    const converted = convertJSONLogic(parsed, format);
    convertOutputEditor.setValue(converted);
  } catch (error) {
    convertOutputEditor.setValue(`Error: ${error.message}`);
  }
}

function convertJSONLogic(parsed, format) {
  switch (format) {
    case 'xml': return jsonToXML(parsed);
    case 'yaml': return jsonToYAML(parsed);
    case 'csv': return jsonToCSV(parsed);
    case 'typescript': return jsonToTypeScript(parsed);
    case 'go': return jsonToGo(parsed);
    case 'java': return jsonToJava(parsed);
    default: return JSON.stringify(parsed, null, 2);
  }
}

// Converters Implementation
function jsonToXML(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let xml = '';
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach(item => {
        xml += `${spaces}<${key}>\n`;
        if (typeof item === 'object' && item !== null) xml += jsonToXML(item, indent + 1);
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
        if (typeof item === 'object' && item !== null) {
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
  if (Array.isArray(value)) return (value.length > 0 ? getTypeScriptType(value[0]) : 'any') + '[]';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

function jsonToGo(obj, name = 'Root') {
  let go = `type ${name} struct {\n`;
  for (const [key, value] of Object.entries(obj)) {
    const goKey = key.charAt(0).toUpperCase() + key.slice(1);
    go += `    ${goKey} ${getGoType(value)} \`json:"${key}"\`\n`;
  }
  go += '}\n\n';
  return go;
}

function getGoType(value) {
  if (value === null) return 'interface{}';
  if (Array.isArray(value)) return '[]' + (value.length > 0 ? getGoType(value[0]) : 'interface{}');
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
  if (Array.isArray(value)) return 'List<' + (value.length > 0 ? getJavaType(value[0]) : 'Object') + '>';
  if (typeof value === 'object') return 'Map<String, Object>';
  if (typeof value === 'number') return Number.isInteger(value) ? 'Integer' : 'Double';
  if (typeof value === 'boolean') return 'Boolean';
  return 'String';
}

// Global functions (for UI)
window.switchTab = (name) => { /* implementation */ };
window.formatJSON = formatJSON;
window.minifyJSON = () => { /* min implementation */ };
window.validateJSON = () => { /* val implementation */ };
window.copyJSON = () => { /* copy implementation */ };
window.clearJSON = () => { /* clear implementation */ };
window.loadSample = () => { /* sample implementation */ };
window.convertJSON = convertJSON;

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseRelaxedJSON,
    convertJSONLogic,
    jsonToXML, jsonToYAML, jsonToCSV,
    jsonToTypeScript, jsonToGo, jsonToJava
  };
}
