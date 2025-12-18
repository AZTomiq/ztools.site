/**
 * Word Counter & Text Analyzer
 */

document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('text-input');
  if (!textInput) return;

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

  const detailLongest = document.getElementById('detail-longest');
  const detailShortest = document.getElementById('detail-shortest');
  const detailAvgWord = document.getElementById('detail-avg-word');
  const detailAvgSentence = document.getElementById('detail-avg-sentence');
  const keywordList = document.getElementById('keyword-list');

  let timeoutId;
  textInput.addEventListener('input', function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const text = textInput.value;
      if (!text) {
        resetStats();
        return;
      }
      const stats = getTextStats(text);
      updateDisplay(stats);
    }, 200);
  });

  function updateDisplay(stats) {
    if (elWords) elWords.textContent = `${stats.wordCount.toLocaleString()} words`;
    if (elChars) elChars.textContent = `${stats.charCount.toLocaleString()} chars`;
    if (countWords) countWords.textContent = stats.wordCount.toLocaleString();
    if (countChars) countChars.textContent = stats.charCount.toLocaleString();
    if (countCharsNoSpace) countCharsNoSpace.textContent = stats.charCountNoSpace.toLocaleString();
    if (countSentences) countSentences.textContent = stats.sentences.toLocaleString();
    if (countLines) countLines.textContent = stats.lines.toLocaleString();
    if (countParagraphs) countParagraphs.textContent = stats.paragraphs.toLocaleString();
    if (readingTime) readingTime.textContent = formatTime(stats.timeRead);
    if (speakingTime) speakingTime.textContent = formatTime(stats.timeSpeak);

    if (stats.wordCount > 0) {
      if (detailLongest) detailLongest.textContent = stats.longest.length > 15 ? stats.longest.substring(0, 15) + '...' : stats.longest;
      if (detailShortest) detailShortest.textContent = stats.shortest;
      if (detailAvgWord) detailAvgWord.textContent = stats.avgLen.toFixed(1);
      if (detailAvgSentence) detailAvgSentence.textContent = stats.avgSenLen.toFixed(1);
      analyzeKeywords(stats.words, keywordList);
    }
  }

  function resetStats() {
    [elWords, elChars, countWords, countChars, countCharsNoSpace, countSentences, countLines, countParagraphs].forEach(el => { if (el) el.textContent = '0'; });
    if (readingTime) readingTime.textContent = '0s';
    if (speakingTime) speakingTime.textContent = '0s';
    [detailLongest, detailShortest, detailAvgWord, detailAvgSentence].forEach(el => { if (el) el.textContent = '-'; });
    if (keywordList) keywordList.innerHTML = '<li class="empty">Type something to see top keywords...</li>';
  }

  window.clearText = () => {
    textInput.value = '';
    textInput.focus();
    resetStats();
  };

  window.copyText = () => {
    if (!textInput.value) return;
    textInput.select();
    navigator.clipboard.writeText(textInput.value).then(() => {
      const btn = document.querySelector('button[onclick="copyText()"]');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied';
        setTimeout(() => { btn.textContent = originalText; }, 1500);
      }
    });
  };

  window.removeExtraSpaces = () => {
    textInput.value = textInput.value.replace(/[ \t]+/g, ' ').replace(/^\s+|\s+$/gm, '');
    const stats = getTextStats(textInput.value);
    updateDisplay(stats);
  };

  window.convertCase = (type) => {
    const text = textInput.value;
    if (!text) return;
    let result = text;
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title': result = toTitleCase(text); break;
      case 'sentence': result = toSentenceCase(text); break;
      case 'camel': result = toCamelCase(text); break;
      case 'kebab': result = toKebabCase(text); break;
      case 'snake': result = toSnakeCase(text); break;
    }
    textInput.value = result;
    const stats = getTextStats(textInput.value);
    updateDisplay(stats);
    const caseSelect = document.getElementById('case-select');
    if (caseSelect) caseSelect.value = "";
  };
});

function getTextStats(text) {
  const charCount = text.length;
  const charCountNoSpace = text.replace(/\s/g, '').length;
  const words = text.match(/\b[-?(\w+)?]+\b/gi) || [];
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const lines = text.split(/\r\n|\r|\n/).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  const timeRead = Math.ceil(wordCount / 200);
  const timeSpeak = Math.ceil(wordCount / 130);

  let longest = '', shortest = '', avgLen = 0, avgSenLen = 0;

  if (wordCount > 0) {
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    longest = sortedWords[0] || '';
    shortest = sortedWords[sortedWords.length - 1] || '';
    avgLen = words.reduce((acc, word) => acc + word.length, 0) / wordCount;
    avgSenLen = sentences > 0 ? wordCount / sentences : 0;
  }

  return {
    charCount, charCountNoSpace, wordCount, words, sentences, lines, paragraphs: Math.max(1, paragraphs),
    timeRead, timeSpeak, longest, shortest, avgLen, avgSenLen
  };
}

function analyzeKeywords(words, targetEl) {
  if (!targetEl) return;
  const frequency = {};
  const lowerWords = words.map(w => w.toLowerCase());
  const stopWords = new Set(['the', 'and', 'is', 'in', 'it', 'of', 'to', 'a', 'la', 'va', 'cua', 'trong', 'nhung', 'cho', 'voi']);

  lowerWords.forEach(word => {
    if (word.length > 2 && !stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  targetEl.innerHTML = '';

  if (sorted.length === 0) {
    targetEl.innerHTML = '<li class="empty">No significant keywords found</li>';
    return;
  }

  sorted.forEach(([word, count]) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="keyword-word">${word}</span>
      <span class="keyword-count">${count} (${Math.round(count / words.length * 100)}%)</span>
    `;
    targetEl.appendChild(li);
  });
}

function formatTime(minutes) {
  if (minutes < 1) return '< 1m';
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substring(1).toLowerCase());
}

function toSentenceCase(str) {
  return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
}

function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '');
}

function toKebabCase(str) {
  const matches = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
  return matches ? matches.map(x => x.toLowerCase()).join('-') : str;
}

function toSnakeCase(str) {
  const matches = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
  return matches ? matches.map(x => x.toLowerCase()).join('_') : str;
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTextStats, toTitleCase, toSentenceCase, toCamelCase, toKebabCase, toSnakeCase
  };
}
