/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const wordCounter = require('../../src/features/word-counter/logic.js');

describe('Word Counter & Case Conversion Logic', () => {
  describe('Text Analysis (getTextStats)', () => {
    it('should count words and characters correctly', () => {
      const text = 'Hello world, this is a test.';
      const stats = wordCounter.getTextStats(text);

      expect(stats.charCount).toBe(28);
      expect(stats.wordCount).toBe(6);
      expect(stats.sentences).toBe(1);
    });

    it('should count paragraphs correctly', () => {
      const text = 'Para 1\n\nPara 2';
      const stats = wordCounter.getTextStats(text);
      expect(stats.paragraphs).toBe(2);
    });

    it('should identify longest and shortest words', () => {
      const text = 'Big small astronomical';
      const stats = wordCounter.getTextStats(text);
      expect(stats.longest).toBe('astronomical');
      expect(stats.shortest).toBe('Big');
    });
  });

  describe('Case Conversions', () => {
    const input = 'hello WORLD';

    it('should convert to Title Case', () => {
      expect(wordCounter.toTitleCase(input)).toBe('Hello World');
    });

    it('should convert to Sentence Case', () => {
      expect(wordCounter.toSentenceCase('hello. world? yes!')).toBe('Hello. World? Yes!');
    });

    it('should convert to camelCase', () => {
      expect(wordCounter.toCamelCase('hello world test')).toBe('helloWorldTest');
    });

    it('should convert to kebab-case', () => {
      expect(wordCounter.toKebabCase('Hello World Test')).toBe('hello-world-test');
    });

    it('should convert to snake_case', () => {
      expect(wordCounter.toSnakeCase('Hello World Test')).toBe('hello_world_test');
    });
  });
});
