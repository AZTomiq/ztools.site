/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const formatter = require('../src/features/text-formatter/script.js');

describe('Text Formatter Logic', () => {
  const defaultOptions = {
    removeExtraSpaces: true,
    removeLineBreaks: false,
    trimLines: true,
    normalizeQuotes: true,
    caseTransform: 'none'
  };

  it('should remove extra spaces and trim lines', () => {
    const input = '  Hello   World  \n  New   Line  ';
    const result = formatter.formatTextLogic(input, defaultOptions);
    expect(result).toBe('Hello World\nNew Line');
  });

  it('should convert line breaks to spaces when option enabled', () => {
    const input = 'Line 1\nLine 2';
    const result = formatter.formatTextLogic(input, { ...defaultOptions, removeLineBreaks: true });
    expect(result).toBe('Line 1 Line 2');
  });

  it('should normalize smart quotes', () => {
    const input = '“Smart Quotes” and ‘Single’';
    const result = formatter.formatTextLogic(input, defaultOptions);
    expect(result).toBe('"Smart Quotes" and \'Single\'');
  });

  it('should apply case transformations', () => {
    const input = 'hello world';
    expect(formatter.formatTextLogic(input, { ...defaultOptions, caseTransform: 'uppercase' })).toBe('HELLO WORLD');
    expect(formatter.formatTextLogic(input, { ...defaultOptions, caseTransform: 'title' })).toBe('Hello World');
  });
});
