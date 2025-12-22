class BTreeNode {
  constructor(leaf = true) {
    this.leaf = leaf;
    this.keys = [];
    this.children = [];
    this.x = 0; this.y = 0;
  }
}

class BTree {
  constructor(t) {
    this.t = t; // Minimum degree
    this.root = new BTreeNode();
  }

  insert(k) {
    let r = this.root;
    if (r.keys.length === 2 * this.t - 1) {
      let s = new BTreeNode(false);
      this.root = s;
      s.children[0] = r;
      this.splitChild(s, 0, r);
      this.insertNonFull(s, k);
    } else {
      this.insertNonFull(r, k);
    }
  }

  insertNonFull(x, k) {
    let i = x.keys.length - 1;
    if (x.leaf) {
      while (i >= 0 && this.compare(k, x.keys[i]) < 0) {
        x.keys[i + 1] = x.keys[i];
        i--;
      }
      x.keys[i + 1] = k;
    } else {
      while (i >= 0 && this.compare(k, x.keys[i]) < 0) i--;
      i++;
      if (x.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(x, i, x.children[i]);
        if (this.compare(k, x.keys[i]) > 0) i++;
      }
      this.insertNonFull(x.children[i], k);
    }
  }

  splitChild(x, i, y) {
    let z = new BTreeNode(y.leaf);
    z.keys = y.keys.splice(this.t, this.t - 1);
    if (!y.leaf) {
      z.children = y.children.splice(this.t, this.t);
    }
    x.children.splice(i + 1, 0, z);
    x.keys.splice(i, 0, y.keys.pop());
  }

  compare(a, b) {
    const na = parseFloat(a), nb = parseFloat(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return String(a).localeCompare(String(b));
  }
}

let tree = new BTree(2); // Order 4 (2-3-4 tree)
const svg = document.getElementById('tree-svg');
const verticalGap = 70;
const nodePadding = 15;

function addNode() {
  const input = document.getElementById('node-val');
  const val = input.value.trim();
  if (!val) return;
  tree.insert(val);
  input.value = '';
  draw();
  console.log('Inserted B-Tree Key:', val);
}

function resetTree() { tree = new BTree(2); draw(); console.log('B-Tree Reset'); }

function calculatePositions(node, x, y, width) {
  if (!node) return;
  node.x = x;
  node.y = y;
  const childCount = node.children.length;
  if (childCount > 0) {
    const step = width / childCount;
    node.children.forEach((child, i) => {
      calculatePositions(child, x - width / 2 + step * (i + 0.5), y + verticalGap, step);
    });
  }
}

function draw() {
  svg.innerHTML = '';
  if (!tree.root.keys.length && !tree.root.children.length) return;
  const w = svg.clientWidth || 800;
  calculatePositions(tree.root, w / 2, 40, w);
  render(tree.root);
}

function render(node) {
  if (!node) return;
  node.children.forEach(child => {
    line(node.x, node.y, child.x, child.y);
    render(child);
  });

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const text = node.keys.join(' | ');

  // Create auto-sizing box
  const tempText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  tempText.setAttribute("class", "node-text");
  tempText.textContent = text;
  svg.appendChild(tempText);
  const bbox = tempText.getBBox();
  svg.removeChild(tempText);

  const rectW = Math.max(40, bbox.width + nodePadding * 2);
  const rectH = 30;

  const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  r.setAttribute("x", node.x - rectW / 2); r.setAttribute("y", node.y - rectH / 2);
  r.setAttribute("width", rectW); r.setAttribute("height", rectH);
  r.setAttribute("rx", 4); r.setAttribute("class", "node-rect");

  const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
  t.setAttribute("x", node.x); t.setAttribute("y", node.y + 5);
  t.setAttribute("class", "node-text");
  t.textContent = text;

  g.appendChild(r); g.appendChild(t); svg.appendChild(g);
}

function line(x1, y1, x2, y2) {
  const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
  l.setAttribute("x1", x1); l.setAttribute("y1", y1 + 15);
  l.setAttribute("x2", x2); l.setAttribute("y2", y2 - 15);
  l.setAttribute("class", "tree-edge");
  svg.insertBefore(l, svg.firstChild);
}

window.addEventListener('resize', draw);
setTimeout(draw, 100);