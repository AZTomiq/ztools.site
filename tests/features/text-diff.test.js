/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const diff = require('../../src/features/text-diff/script.js');

describe('Text Diff Logic', () => {
  it('should identify equal text', () => {
    const res = diff.computeDiffLogic('hello world', 'hello world');
    expect(res).toHaveLength(3); // 'hello', ' ', 'world' (due to tokenization)
    res.forEach(part => expect(part.type).toBe('equal'));
  });

  it('should identify insertions', () => {
    const res = diff.computeDiffLogic('hello', 'hello world');
    // hello -> equal
    // space -> insert
    // world -> insert
    expect(res.find(p => p.type === 'insert')).toBeTruthy();
    expect(res.map(p => p.value).join('')).toBe('hello world');
  });

  it('should identify deletions', () => {
    const res = diff.computeDiffLogic('hello world', 'hello');
    expect(res.find(p => p.type === 'delete')).toBeTruthy();
  });

  it('should identify changes (delete + insert)', () => {
    const res = diff.computeDiffLogic('hello world', 'hello there');
    // world -> delete
    // there -> insert
    const deletions = res.filter(p => p.type === 'delete');
    const insertions = res.filter(p => p.type === 'insert');
    expect(deletions.length).toBeGreaterThan(0);
    expect(insertions.length).toBeGreaterThan(0);
  });
});
