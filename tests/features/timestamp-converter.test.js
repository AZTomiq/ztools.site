/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const tc = require('../../src/features/timestamp-converter/script.js');

describe('Timestamp Converter Logic', () => {
  it('should convert Unix seconds to Date correctly', () => {
    // 1700000000 is 2023-11-14T22:13:20.000Z
    const date = tc.unixToDate(1700000000, 's');
    expect(date.toISOString()).toBe('2023-11-14T22:13:20.000Z');
  });

  it('should convert Unix milliseconds to Date correctly', () => {
    const date = tc.unixToDate(1700000000000, 'ms');
    expect(date.toISOString()).toBe('2023-11-14T22:13:20.000Z');
  });

  it('should convert Date string to Unix correctly', () => {
    const res = tc.dateToUnix('2023-11-14T22:13:20.000Z');
    expect(res.s).toBe(1700000000);
    expect(res.ms).toBe(1700000000000);
  });
});
