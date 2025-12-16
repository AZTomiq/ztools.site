// Word Counter & Text Analyzer

// DOM Elements
const textInput = document.getElementById('text-input');
const textOutput = document.getElementById('text-output');

// Stats Elements
const elWords = document.getElementById('stat-words');
const elChars = document.getElementById('stat-chars');
const countWords = document.getElementById('count-words');
const countChars = document.getElementById('count-chars');
const countCharsNoSpace = document.getElementById('count-chars-no-space');
const countSentences = document.getElementById('count-sentences');
const countLines = document.getElementById('count-lines');
const countParagraphs = document.getElementById('count-paragraphs');
const readingTime = document.getElementById('reading-time');
const speakingTime = document.getElementById('speaking-time');

// Details Elements
const detailLongest = document.getElementById('detail-longest');
const detailShortest = document.getElementById('detail-shortest');
const detailAvgWord = document.getElementById('detail-avg-word');
const detailAvgSentence = document.getElementById('detail-avg-sentence');
const keywordList = document.getElementById('keyword-list');

// Event Listener with Debounce
let timeoutId;
textInput.addEventListener('input', function () {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(analyzeText, 200);
});

function analyzeText() {
  const text = textInput.value;

  if (!text) {
    resetStats();
    return;
  }

  // Basic Counts
  const charCount = text.length;
  const charCountNoSpace = text.replace(/\s/g, '').length;
  const words = text.match(/\b[-?(\w+)?]+\b/gi) || [];
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const lines = text.split(/\r\n|\r|\n/).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  // Update Basic Stats Display
  elWords.textContent = `${wordCount.toLocaleString()} words`;
  elChars.textContent = `${charCount.toLocaleString()} chars`;

  countWords.textContent = wordCount.toLocaleString();
  countChars.textContent = charCount.toLocaleString();
  countCharsNoSpace.textContent = charCountNoSpace.toLocaleString();
  countSentences.textContent = sentences.toLocaleString();
  countLines.textContent = lines.toLocaleString();
  countParagraphs.textContent = Math.max(1, paragraphs).toLocaleString(); // At least 1 if text exists

  // Time Estimates
  const timeRead = Math.ceil(wordCount / 200); // 200 wpm
  const timeSpeak = Math.ceil(wordCount / 130); // 130 wpm

  readingTime.textContent = formatTime(timeRead);
  speakingTime.textContent = formatTime(timeSpeak);

  // Detailed Analysis
  if (wordCount > 0) {
    // Word Lengths
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    const longest = sortedWords[0] || '';
    const shortest = sortedWords[sortedWords.length - 1] || '';
    const totalWordLength = words.reduce((acc, word) => acc + word.length, 0);
    const avgLen = totalWordLength / wordCount;

    // Sentence Lengths
    const avgSenLen = sentences > 0 ? wordCount / sentences : 0;

    // Update Details
    detailLongest.textContent = longest.length > 15 ? longest.substring(0, 15) + '...' : longest;
    detailShortest.textContent = shortest;
    detailAvgWord.textContent = avgLen.toFixed(1);
    detailAvgSentence.textContent = avgSenLen.toFixed(1);

    // Keyword Analysis
    analyzeKeywords(words);
  }
}

function analyzeKeywords(words) {
  const frequency = {};
  const lowerWords = words.map(w => w.toLowerCase());
  const stopWords = new Set(['the', 'and', 'is', 'in', 'it', 'of', 'to', 'a', 'la', 'va', 'cua', 'trong', 'nhung', 'cho', 'voi']); // Minimal EN/VI stop words

  lowerWords.forEach(word => {
    if (word.length > 2 && !stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5

  keywordList.innerHTML = '';

  if (sorted.length === 0) {
    keywordList.innerHTML = '<li class="empty">No significant keywords found</li>';
    return;
  }

  sorted.forEach(([word, count]) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="keyword-word">${word}</span>
      <span class="keyword-count">${count} (${Math.round(count / words.length * 100)}%)</span>
    `;
    keywordList.appendChild(li);
  });
}

function resetStats() {
  elWords.textContent = '0 words';
  elChars.textContent = '0 chars';
  countWords.textContent = '0';
  countChars.textContent = '0';
  countCharsNoSpace.textContent = '0';
  countSentences.textContent = '0';
  countLines.textContent = '0';
  countParagraphs.textContent = '0';
  readingTime.textContent = '0s';
  speakingTime.textContent = '0s';
  detailLongest.textContent = '-';
  detailShortest.textContent = '-';
  detailAvgWord.textContent = '-';
  detailAvgSentence.textContent = '-';
  keywordList.innerHTML = '<li class="empty">Type something to see top keywords...</li>';
}

function formatTime(minutes) {
  if (minutes < 1) return '< 1m';
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

// Stats Utilities
function clearText() {
  textInput.value = '';
  textInput.focus();
  analyzeText();
}

function copyText() {
  if (!textInput.value) return;
  textInput.select();
  navigator.clipboard.writeText(textInput.value).then(() => {
    // Could show a toast here
    const originalText = document.querySelector('button[onclick="copyText()"]').textContent;
    document.querySelector('button[onclick="copyText()"]').textContent = '✅ Copied';
    setTimeout(() => {
      document.querySelector('button[onclick="copyText()"]').textContent = originalText;
    }, 1500);
  });
}

function removeExtraSpaces() {
  const text = textInput.value;
  // Replace multiple spaces with single space, and trim lines
  const clean = text.replace(/[ \t]+/g, ' ').replace(/^\s+|\s+$/gm, '');
  textInput.value = clean;
  analyzeText();
}

// Case Conversion
function convertCase(type) {
  const text = textInput.value;
  if (!text) return;

  let result = text;

  switch (type) {
    case 'upper':
      result = text.toUpperCase();
      break;
    case 'lower':
      result = text.toLowerCase();
      break;
    case 'title':
      result = toTitleCase(text);
      break;
    case 'sentence':
      result = toSentenceCase(text);
      break;
    case 'camel':
      result = toCamelCase(text);
      break;
    case 'kebab':
      result = toKebabCase(text);
      break;
    case 'snake':
      result = toSnakeCase(text);
      break;
  }

  textInput.value = result;
  // Reset select
  document.getElementById('case-select').value = "";
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

function toSentenceCase(str) {
  return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
}

function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
}

function toKebabCase(str) {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');
}

function toSnakeCase(str) {
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_');
}

// Make functions global
window.clearText = clearText;
window.copyText = copyText;
window.removeExtraSpaces = removeExtraSpaces;
window.convertCase = convertCase;
