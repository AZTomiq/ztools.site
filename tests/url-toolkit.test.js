/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const url = require('../src/features/url-toolkit/script.js');

describe('URL Toolkit Logic', () => {
  describe('Base64', () => {
    it('should encode/decode Base64 correctly (including UTF-8)', () => {
      const original = 'Hello Tiếng Việt 🇻🇳';
      const encoded = url.encodeBase64(original);
      const decoded = url.decodeBase64(encoded);
      expect(decoded).toBe(original);
    });
  });

  describe('URL Parser', () => {
    it('should parse a complete URL correctly', () => {
      const input = 'https://ztools.site/features/tax?q=test#top';
      const res = url.parseURLLogic(input);
      expect(res.protocol).toBe('https:');
      expect(res.host).toBe('ztools.site');
      expect(res.path).toBe('/features/tax');
      expect(res.query).toBe('?q=test');
      expect(res.hash).toBe('#top');
    });

    it('should handle URL without protocol by defaulting to http', () => {
      const input = 'ztools.site/test';
      const res = url.parseURLLogic(input);
      expect(res.protocol).toBe('http:');
      expect(res.host).toBe('ztools.site');
    });
  });
});
