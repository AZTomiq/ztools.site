const textarea = document.getElementById('map-data');
const view = document.getElementById('map-view');

textarea.addEventListener('input', updateMap);

function parseText(text) {
  const lines = text.split('\n').filter(l => l.trim());
  if (!lines.length) return null;
  
  const root = { name: lines[0].trim(), children: [] };
  const stack = [{ node: root, indent: getIndent(lines[0]) }];
  
  for (let i = 1; i < lines.length; i++) {
    const indent = getIndent(lines[i]);
    const name = lines[i].trim();
    const node = { name, children: [] };
    
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    
    stack[stack.length - 1].node.children.push(node);
    stack.push({ node, indent });
  }
  return root;
}

function getIndent(line) { return line.match(/^\s*/)[0].length; }

function createHTML(node) {
  let html = `<li><div class="node">${node.name}</div>`;
  if (node.children.length) {
    html += `<ul>`;
    node.children.forEach(c => html += createHTML(c));
    html += `</ul>`;
  }
  html += `</li>`;
  return html;
}

function updateMap() {
  const data = parseText(textarea.value);
  if (!data) { view.innerHTML = ''; return; }
  view.innerHTML = `<div class="map-tree-wrapper"><ul>${createHTML(data)}</ul></div>`;
}

updateMap();