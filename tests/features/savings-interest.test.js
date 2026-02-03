/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const savings = require('../../src/features/savings-interest/logic.js');

describe('Savings Interest Logic', () => {
  it('should calculate simple interest correctly', () => {
    // 100M at 6% for 12 months (1 year)
    // Interest: 100M * 0.06 = 6M
    const result = savings.calculateSavingsInterest(100000000, 6, 12);
    expect(result.interest).toBe(6000000);
    expect(result.total).toBe(106000000);
  });

  it('should calculate simple interest for 6 months correctly', () => {
    // 100M at 6% for 6 months
    // Interest: 100M * 0.06 * (6/12) = 3M
    const result = savings.calculateSavingsInterest(100000000, 6, 6);
    expect(result.interest).toBe(3000000);
  });
});
