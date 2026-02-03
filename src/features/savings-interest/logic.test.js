import { describe, it, expect } from 'vitest';
const { calculateSavingsInterest } = require('./logic.js');

describe('Savings Interest Logic', () => {

  it('should calculate interest correctly for 12 months', () => {
    // 100M at 6% for 12 months
    const result = calculateSavingsInterest(100000000, 6, 12);
    expect(result.interest).toBe(6000000);
    expect(result.total).toBe(106000000);
  });

  it('should calculate interest correctly for 6 months', () => {
    // 100M at 6% for 6 months
    const result = calculateSavingsInterest(100000000, 6, 6);
    expect(result.interest).toBe(3000000);
    expect(result.total).toBe(103000000);
  });

  it('should handle zero rate or months', () => {
    expect(calculateSavingsInterest(100, 0, 12).interest).toBe(0);
    expect(calculateSavingsInterest(100, 10, 0).interest).toBe(0);
  });

});
