import { describe, it, expect } from 'vitest';
const { getTextStats, toTitleCase, toSentenceCase } = require('./logic.js');

describe('Word Counter Logic', () => {

  it('should count words and characters correctly', () => {
    const text = "Hello world! This is a test.";
    const stats = getTextStats(text);
    expect(stats.wordCount).toBe(6);
    expect(stats.charCount).toBe(28);
    expect(stats.sentences).toBe(2);
  });

  it('should identify longest word', () => {
    const text = "I love programming in Javascript";
    const stats = getTextStats(text);
    expect(stats.longest).toBe("programming");
  });

  describe('Case Transformations', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });
    it('should convert to sentence case', () => {
      expect(toSentenceCase('HELLO WORLD. how ARE you?')).toBe('Hello world. How are you?');
    });
  });

});
