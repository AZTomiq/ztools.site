/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const compound = require('../../src/features/compound-interest/script.js');

describe('Compound Interest Logic', () => {
  it('should calculate compound interest correctly (no contribution, annual)', () => {
    // 10,000,000 at 10% for 2 years, compounded annually
    // Yr 1: 10M * 1.1 = 11M
    // Yr 2: 11M * 1.1 = 12.1M
    const result = compound.calculateCompoundInterest(10000000, 10, 2, 0, 1);
    expect(result.currentBalance).toBe(12100000);
    expect(result.totalInterest).toBe(2100000);
  });

  it('should calculate compound interest correctly (with monthly contribution and compounding)', () => {
    // 0 initial, 1,000,000 monthly contribution, 12% annual rate, 1 month
    // Month 1: 0 + 1M = 1M. Interest: 1M * (12/100/12) = 1M * 0.01 = 10k
    // Total after 1 month: 1,010,000
    // Actually our function returns breakdown monthly ONLY IF m%12 === 0.
    // So let's test for 1 year.
    const result = compound.calculateCompoundInterest(0, 12, 1, 1000000, 12);
    // Rough check: 12M principal + interest
    expect(result.totalContributed).toBe(12000000);
    expect(result.currentBalance).toBeGreaterThan(12000000);
    // Year 1 breakdown check
    expect(result.breakdownData[0].year).toBe(1);
    expect(result.breakdownData[0].contributed).toBe(12000000);
  });
});
