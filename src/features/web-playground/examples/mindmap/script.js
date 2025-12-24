const textarea = document.getElementById('map-data');
const view = document.getElementById('map-view');

textarea.addEventListener('input', updateMap);

function parseText(text) {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  if (!lines.length) return null;

  const rootLine = lines[0];
  const root = { name: rootLine.trim(), children: [] };
  const stack = [{ node: root, indent: getIndent(rootLine) }];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const indent = getIndent(line);
    const name = line.trim();
    const node = { name, children: [] };

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    stack[stack.length - 1].node.children.push(node);
    stack.push({ node, indent });
  }
  return root;
}

function getIndent(line) {
  const match = line.match(/^\s*/);
  return match ? match[0].length : 0;
}

function createHTML(node) {
  let html = `<li><div class="node">${node.name}</div>`;
  if (node.children && node.children.length) {
    html += `<ul>`;
    node.children.forEach(c => html += createHTML(c));
    html += `</ul>`;
  }
  html += `</li>`;
  return html;
}

function updateMap() {
  const data = parseText(textarea.value);
  if (!data) { view.innerHTML = '<div style="opacity:0.5">Please enter some text hierarchical data...</div>'; return; }
  view.innerHTML = `<div class="map-tree-wrapper"><ul>${createHTML(data)}</ul></div>`;
}

// Set better default value if it's the first time
if (textarea.value.trim() === 'Coding') {
  textarea.value = `ZTools Project
  Core Features
    Playground
    Toolbox
    Mega Menu
  Vibe
    Glassmorphism
    Dark Mode
    Speed
  Roadmap
    PWA Support
    New Icons
    Beta Tools`;
}

updateMap();