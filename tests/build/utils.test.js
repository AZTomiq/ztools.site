import { describe, it, expect } from 'vitest';
import { getHash, parseFrontmatter } from '../../scripts/builds/utils';

describe('Build Utils', () => {
  describe('getHash', () => {
    it('should return correct MD5 hash', () => {
      const input = 'hello world';
      // MD5 of "hello world" is "5eb63bbbe01eeed093cb22bb8f5acdc3"
      expect(getHash(input)).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3');
    });

    it('should return different hashes for different inputs', () => {
      expect(getHash('abc')).not.toBe(getHash('def'));
    });
  });

  describe('parseFrontmatter', () => {
    it('should parse frontmatter and body correctly', () => {
      const content = `---
title: My Post
date: 2024-01-01
---
This is the body content.
`;
      const result = parseFrontmatter(content);
      expect(result.attributes).toEqual({
        title: 'My Post',
        date: '2024-01-01'
      });
      expect(result.body).toBe('This is the body content.');
    });

    it('should handle content without frontmatter', () => {
      const content = 'Just some text.';
      const result = parseFrontmatter(content);
      expect(result.attributes).toEqual({});
      expect(result.body).toBe('Just some text.');
    });

    it('should handle empty frontmatter', () => {
      const content = `---
---
Body only.`;
      const result = parseFrontmatter(content);
      expect(result.attributes).toEqual({});
      expect(result.body).toBe('Body only.');
    });
  });
});
