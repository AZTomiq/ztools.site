import { describe, it, expect } from 'vitest';
const {
  calculateBasicPercentage,
  calculatePercentageChange,
  calculateWhatPercentage
} = require('./logic.js');

describe('Percentage Calculator Logic', () => {

  describe('calculateBasicPercentage', () => {
    it('should calculate 20% of 100 as 20', () => {
      expect(calculateBasicPercentage(20, 100)).toBe(20);
    });
    it('should handle zero', () => {
      expect(calculateBasicPercentage(0, 100)).toBe(0);
      expect(calculateBasicPercentage(50, 0)).toBe(0);
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate 100 to 150 as 50%', () => {
      expect(calculatePercentageChange(100, 150)).toBe(50);
    });
    it('should calculate 100 to 50 as -50%', () => {
      expect(calculatePercentageChange(100, 50)).toBe(-50);
    });
    it('should handle zero gracefully', () => {
      expect(calculatePercentageChange(0, 50)).toBe(Infinity);
      expect(calculatePercentageChange(0, 0)).toBe(0);
    });
  });

  describe('calculateWhatPercentage', () => {
    it('should calculate 25 is what percent of 100 as 25%', () => {
      expect(calculateWhatPercentage(25, 100)).toBe(25);
    });
    it('should calculate 50 is what percent of 200 as 25%', () => {
      expect(calculateWhatPercentage(50, 200)).toBe(25);
    });
  });

});
