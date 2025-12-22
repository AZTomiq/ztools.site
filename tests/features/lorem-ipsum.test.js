/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const lorem = require('../../src/features/lorem-ipsum/script.js');

describe('Lorem Ipsum Generator Logic', () => {
  it('should generate requested number of words', () => {
    const res = lorem.generateLoremLogic(10, 'words', false);
    const words = res.text.split(' ');
    expect(words).toHaveLength(10);
  });

  it('should start with Lorem Ipsum when requested', () => {
    const res = lorem.generateLoremLogic(5, 'words', true);
    expect(res.text.toLowerCase().startsWith('lorem ipsum')).toBe(true);
  });

  it('should generate paragraphs with HTML tags', () => {
    const res = lorem.generateLoremLogic(2, 'paragraphs', false);
    expect(res.html).toContain('<p>');
    expect(res.text.split('\n\n')).toHaveLength(2);
  });

  it('should generate lists correctly', () => {
    const res = lorem.generateLoremLogic(3, 'lists', false);
    expect(res.html).toContain('<ul>');
    expect(res.html).toContain('<li>');
    expect(res.text).toContain('*');
  });
});
