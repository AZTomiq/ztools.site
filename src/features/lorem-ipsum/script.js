/**
 * Lorem Ipsum Generator Logic
 */

const DICTIONARY = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
  "sed", "ut", "perspiciatis", "unde", "omnis", "iste", "natus", "error", "sit", "voluptatem", "accusantium", "doloremque", "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis", "et", "quasi", "architecto", "beatae", "vitae", "dicta", "sunt", "explicabo", "nemo", "enim", "ipsam", "voluptatem", "quia", "voluptas", "sit", "aspernatur", "aut", "odit", "aut", "fugit", "sed", "quia", "consequuntur", "magni", "dolores", "eos", "qui", "ratione", "voluptatem", "sequi", "nesciunt", "neque", "porro", "quisquam", "est", "qui", "dolorem", "ipsum", "quia", "dolor", "sit", "amet", "consectetur", "adipisci", "velit", "sed", "quia", "non", "numquam", "eius", "modi", "tempora", "incidunt", "ut", "labore", "et", "dolore", "magnam", "aliquam", "quaerat", "voluptatem"
];

let currentOutput = { text: '', html: '' };
let currentView = 'text';

document.addEventListener('DOMContentLoaded', () => {
  const btnGen = document.querySelector('button[onclick="generateLorem()"]');
  if (btnGen) {
    btnGen.onclick = null; // Remove inline
    btnGen.addEventListener('click', handleGenerate);
  }

  const btnText = document.getElementById('btn-text');
  const btnHtml = document.getElementById('btn-html');
  if (btnText) btnText.addEventListener('click', () => setView('text'));
  if (btnHtml) btnHtml.addEventListener('click', () => setView('html'));

  handleGenerate();
});

function handleGenerate() {
  const count = parseInt(document.getElementById('count').value) || 5;
  const type = document.getElementById('type').value;
  const startLorem = document.getElementById('start-lorem').checked;

  currentOutput = generateLoremLogic(count, type, startLorem);
  updateOutput();
}

function setView(view) {
  currentView = view;
  const btnText = document.getElementById('btn-text');
  const btnHtml = document.getElementById('btn-html');
  if (btnText) btnText.classList.toggle('active', view === 'text');
  if (btnHtml) btnHtml.classList.toggle('active', view === 'html');
  updateOutput();
}

function updateOutput() {
  const out = document.getElementById('output');
  if (out) out.value = currentView === 'text' ? currentOutput.text : currentOutput.html;
}

function generateLoremLogic(count, type, startLorem) {
  let resultPlain = [];
  let resultHtml = [];

  const getSentence = (minWords = 8, maxWords = 15) => {
    const len = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = [];
    for (let i = 0; i < len; i++) words.push(DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)]);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
  };

  const getParagraph = (minSentences = 3, maxSentences = 6) => {
    const len = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    const sentences = [];
    for (let i = 0; i < len; i++) sentences.push(getSentence());
    return sentences.join(' ');
  };

  if (type === 'paragraphs') {
    for (let i = 0; i < count; i++) {
      let t = getParagraph();
      if (i === 0 && startLorem) t = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + t.charAt(0).toLowerCase() + t.slice(1);
      resultPlain.push(t);
      resultHtml.push(`<p>${t}</p>`);
    }
  } else if (type === 'sentences') {
    for (let i = 0; i < count; i++) {
      let t = getSentence();
      if (i === 0 && startLorem) t = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + t;
      resultPlain.push(t);
      resultHtml.push(t);
    }
  } else if (type === 'words') {
    let w = [];
    for (let i = 0; i < count; i++) w.push(DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)]);
    if (startLorem) {
      w.unshift("lorem", "ipsum", "dolor", "sit", "amet");
      if (w.length > count) w = w.slice(0, count);
    }
    const t = w.join(' ');
    resultPlain.push(t);
    resultHtml.push(t);
  } else if (type === 'lists') {
    resultHtml.push('<ul>');
    for (let i = 0; i < count; i++) {
      let t = getSentence(5, 10).slice(0, -1);
      if (i === 0 && startLorem) t = "Lorem ipsum dolor sit amet";
      resultHtml.push(`  <li>${t}</li>`);
      resultPlain.push(`* ${t}`);
    }
    resultHtml.push('</ul>');
  }

  return {
    text: resultPlain.join(type === 'paragraphs' ? '\n\n' : (type === 'lists' ? '\n' : ' ')),
    html: resultHtml.join('\n')
  };
}

window.generateLorem = handleGenerate;
window.copyLorem = () => {
  const out = document.getElementById('output');
  if (!out) return;
  out.select();
  navigator.clipboard.writeText(out.value).then(() => alert('Copied!'));
};

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateLoremLogic };
}
