const DICTIONARY = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
  "sed", "ut", "perspiciatis", "unde", "omnis", "iste", "natus", "error", "sit", "voluptatem", "accusantium", "doloremque", "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis", "et", "quasi", "architecto", "beatae", "vitae", "dicta", "sunt", "explicabo", "nemo", "enim", "ipsam", "voluptatem", "quia", "voluptas", "sit", "aspernatur", "aut", "odit", "aut", "fugit", "sed", "quia", "consequuntur", "magni", "dolores", "eos", "qui", "ratione", "voluptatem", "sequi", "nesciunt", "neque", "porro", "quisquam", "est", "qui", "dolorem", "ipsum", "quia", "dolor", "sit", "amet", "consectetur", "adipisci", "velit", "sed", "quia", "non", "numquam", "eius", "modi", "tempora", "incidunt", "ut", "labore", "et", "dolore", "magnam", "aliquam", "quaerat", "voluptatem"
];

let currentOutput = { text: '', html: '' };
let currentView = 'text';

function generateLorem() {
  const count = parseInt(document.getElementById('count').value) || 5;
  const type = document.getElementById('type').value;
  const startLorem = document.getElementById('start-lorem').checked;
  const output = document.getElementById('output');

  let resultPlain = [];
  let resultHtml = [];

  // Helper to get random sentence
  const getSentence = (minWords = 8, maxWords = 15) => {
    const len = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = [];
    for (let i = 0; i < len; i++) {
      words.push(DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)]);
    }
    // Capitalize first
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
      let text = getParagraph();
      if (i === 0 && startLorem) {
        // Replace start with standard text
        const standard = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        text = standard + text.charAt(0).toLowerCase() + text.slice(1);
      }
      resultPlain.push(text);
      resultHtml.push(`<p>${text}</p>`);
    }
  } else if (type === 'sentences') {
    for (let i = 0; i < count; i++) {
      let text = getSentence();
      if (i === 0 && startLorem) {
        const standard = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        text = standard; // Just use standard for first single sentence or append?
        // Let's replace the first sentence entirely or prefix
        // If single sentence requested, use standard. If multiple, prefix first.
        if (count > 0) text = standard + " " + text; // Append random
      }
      resultPlain.push(text);
      resultHtml.push(text); // Sentences usually don't have tags unless wrapper requested?
      // Let's just output raw list
    }
  } else if (type === 'words') {
    // Generate words
    let w = [];
    for (let i = 0; i < count; i++) w.push(DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)]);
    if (startLorem) {
      w.unshift("lorem", "ipsum", "dolor", "sit", "amet");
      if (w.length > count) w = w.slice(0, count);
    }
    const text = w.join(' ');
    resultPlain.push(text);
    resultHtml.push(text);
  } else if (type === 'lists') {
    resultHtml.push('<ul>');
    for (let i = 0; i < count; i++) {
      let text = getSentence(5, 10).slice(0, -1); // Remove dot
      if (i === 0 && startLorem) text = "Lorem ipsum dolor sit amet";
      resultHtml.push(`  <li>${text}</li>`);
      resultPlain.push(`* ${text}`);
    }
    resultHtml.push('</ul>');
  }

  currentOutput.text = resultPlain.join(type === 'paragraphs' ? '\n\n' : (type === 'lists' ? '\n' : ' '));
  currentOutput.html = resultHtml.join('\n');

  updateOutput();
}

function setView(view) {
  currentView = view;
  document.getElementById('btn-text').classList.toggle('active', view === 'text');
  document.getElementById('btn-html').classList.toggle('active', view === 'html');
  updateOutput();
}

function updateOutput() {
  document.getElementById('output').value = currentView === 'text' ? currentOutput.text : currentOutput.html;
}

function copyLorem() {
  const output = document.getElementById('output');
  output.select();
  document.execCommand('copy'); // Fallback
  // Modern
  if (navigator.clipboard) {
    navigator.clipboard.writeText(output.value).then(() => {
      // Could show toast
      const btn = document.querySelector('.btn-sm');
      const original = btn.textContent;
      btn.textContent = '✅ Copied!';
      setTimeout(() => btn.textContent = original, 2000);
    });
  }
}

// Init
generateLorem();
