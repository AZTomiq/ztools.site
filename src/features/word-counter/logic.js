/**
 * Word Counter & Text Analysis Logic
 * Pure functions only - No DOM interaction
 */

/**
 * Calculates various text statistics
 * @param {string} text
 * @returns {object} Statistics
 */
function getTextStats(text) {
  if (!text) return {
    charCount: 0, charCountNoSpace: 0, wordCount: 0, words: [], sentences: 0, lines: 0, paragraphs: 0,
    timeRead: 0, timeSpeak: 0, longest: '', shortest: '', avgLen: 0, avgSenLen: 0
  };

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

/**
 * Analyzes keyword frequency
 * @param {string[]} words
 * @param {number} limit
 * @returns {Array} Top keywords
 */
function getTopKeywords(words, limit = 5) {
  const frequency = {};
  const lowerWords = words.map(w => w.toLowerCase());
  const stopWords = new Set(['the', 'and', 'is', 'in', 'it', 'of', 'to', 'a', 'la', 'va', 'cua', 'trong', 'nhung', 'cho', 'voi']);

  lowerWords.forEach(word => {
    if (word.length > 2 && !stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

// Case transformations
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTextStats, getTopKeywords, toTitleCase, toSentenceCase, toCamelCase, toKebabCase, toSnakeCase
  };
}
