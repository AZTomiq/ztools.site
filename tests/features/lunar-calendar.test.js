/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const lunar = require('../../src/features/lunar-calendar/script.js');

describe('Lunar Calendar Logic', () => {
  describe('Julian Day Conversions', () => {
    it('should convert date to JD correctly', () => {
      // 2024-02-10 is JD 2460351
      expect(lunar.jdFromDate(10, 2, 2024)).toBe(2460351);
    });

    it('should convert JD back to date correctly', () => {
      const date = lunar.jdToDate(2460351);
      expect(date).toEqual([10, 2, 2024]);
    });
  });

  describe('Solar to Lunar Conversion', () => {
    it('should convert 2024-02-10 to 2024-01-01 (Giáp Thìn)', () => {
      const [d, m, y, leap] = lunar.convertSolar2Lunar(10, 2, 2024);
      expect(d).toBe(1);
      expect(m).toBe(1);
      expect(y).toBe(2024);
      expect(leap).toBe(0);
    });

    it('should identify Giáp Thìn year correctly', () => {
      expect(lunar.getYearCanChi(2024)).toBe('Giáp Thìn');
    });
  });

  describe('Lunar to Solar Conversion', () => {
    it('should convert 2024-01-01 (Lunar) to 2024-02-10 (Solar)', () => {
      const [d, m, y] = lunar.convertLunar2Solar(1, 1, 2024, 0);
      expect(d).toBe(10);
      expect(m).toBe(2);
      expect(y).toBe(2024);
    });
  });
});
