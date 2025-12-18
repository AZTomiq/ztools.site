/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const pct = require('../src/features/percentage-calculator/script.js');

describe('Percentage Calculator Logic', () => {
  describe('Basic: X% of Y', () => {
    it('should calculate 20% of 500 correctly', () => {
      expect(pct.calculateBasicPercentage(20, 500)).toBe(100);
    });
  });

  describe('Change: From X to Y', () => {
    it('should calculate increase from 100 to 150 as +50%', () => {
      expect(pct.calculatePercentageChange(100, 150)).toBe(50);
    });
    it('should calculate decrease from 200 to 100 as -50%', () => {
      expect(pct.calculatePercentageChange(200, 100)).toBe(-50);
    });
  });

  describe('Phrase: X is what % of Y', () => {
    it('should calculate 50 is 10% of 500', () => {
      expect(pct.calculateWhatPercentage(50, 500)).toBe(10);
    });
  });
});
