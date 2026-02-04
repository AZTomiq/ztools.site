/**
 * Word Counter & Text Analyzer UI
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
      if (typeof getTextStats === 'function') {
        const stats = getTextStats(text);
        updateDisplay(stats);
      }
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

      if (typeof getTopKeywords === 'function') {
        renderKeywords(getTopKeywords(stats.words), stats.wordCount);
      }
    }
  }

  function renderKeywords(keywords, totalWords) {
    if (!keywordList) return;
    keywordList.innerHTML = '';
    if (keywords.length === 0) {
      keywordList.innerHTML = '<li class="empty">No significant keywords found</li>';
      return;
    }
    keywords.forEach(([word, count]) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="keyword-word">${word}</span>
        <span class="keyword-count">${count} (${Math.round(count / totalWords * 100)}%)</span>
      `;
      keywordList.appendChild(li);
    });
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
    if (typeof getTextStats === 'function') {
      const stats = getTextStats(textInput.value);
      updateDisplay(stats);
    }
  };

  window.convertCase = (type) => {
    const text = textInput.value;
    if (!text) return;
    let result = text;

    if (typeof toTitleCase !== 'function') return;

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
    const stats = getTextStats(result);
    updateDisplay(stats);
    const caseSelect = document.getElementById('case-select');
    if (caseSelect) caseSelect.value = "";
  };
});

function formatTime(minutes) {
  if (minutes < 1) return '< 1m';
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}
