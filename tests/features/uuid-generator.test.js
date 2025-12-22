/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const uuid = require('../../src/features/uuid-generator/script.js');

describe('UUID Generator Logic', () => {
  it('should generate valid v4 UUIDs', () => {
    const res = uuid.generateUUIDsLogic({
      version: 'v4', count: 5, uppercase: false, hyphens: true, braces: false
    });
    expect(res).toHaveLength(5);
    res.forEach(u => {
      expect(u).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });
  });

  it('should generate valid v7 UUIDs', () => {
    const res = uuid.generateUUIDsLogic({
      version: 'v7', count: 1, uppercase: false, hyphens: true, braces: false
    });
    expect(res[0]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('should respect formatting options', () => {
    const res = uuid.generateUUIDsLogic({
      version: 'v4', count: 1, uppercase: true, hyphens: false, braces: true
    });
    expect(res[0].startsWith('{')).toBe(true);
    expect(res[0].endsWith('}')).toBe(true);
    expect(res[0]).not.toContain('-');
    expect(res[0]).toBe(res[0].toUpperCase());
  });
});
