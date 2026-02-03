import { describe, it, expect } from 'vitest';
const { calculateCompoundInterest } = require('./logic.js');

describe('Compound Interest Logic', () => {

  it('should return initial amount if years is 0', () => {
    const result = calculateCompoundInterest(1000000, 10, 0, 0, 12);
    expect(result.currentBalance).toBe(1000000);
    expect(result.totalContributed).toBe(1000000);
    expect(result.totalInterest).toBe(0);
  });

  it('should calculate simple yearly compound without contributions', () => {
    // 1,000,000 at 10% for 1 year, compounded yearly
    const result = calculateCompoundInterest(1000000, 10, 1, 0, 1);
    // End of year 1: 1,000,000 * 1.1 = 1,100,000
    expect(result.currentBalance).toBe(1100000);
    expect(result.totalInterest).toBe(100000);
  });

  it('should calculate compound interest over 2 years correctly', () => {
    // 1,000,000 at 10% for 2 years, compounded yearly
    const result = calculateCompoundInterest(1000000, 10, 2, 0, 1);
    // Year 1: 1,100,000
    // Year 2: 1,100,000 * 1.1 = 1,210,000
    expect(result.currentBalance).toBe(1210000);
    expect(result.totalInterest).toBe(210000);
  });

  it('should handle monthly contributions correctly', () => {
    // 0 initial, 1,000,000 monthly, 0% interest, 1 year
    const result = calculateCompoundInterest(0, 0, 1, 1000000, 12);
    expect(result.currentBalance).toBe(12000000);
    expect(result.totalContributed).toBe(12000000);
    expect(result.totalInterest).toBe(0);
  });

  it('should calculate monthly compound with monthly contributions', () => {
    // 10,000,000 initial, 10% rate, 1 year, 1,000,000 contribution, monthly compound
    const result = calculateCompoundInterest(10000000, 10, 1, 1000000, 12);

    // Manual calculation trace:
    // Rate per month = 10% / 12 = 0.008333
    // Month 1: (10M + 1M) * (1 + 0.008333) = 11M * 1.008333 = 11,091,666.6
    // ...
    // This is hard to calc manually accurately, but we can verify consistency
    expect(result.currentBalance).toBeGreaterThan(22000000); // 10M + 12M + interest
    expect(result.totalContributed).toBe(22000000);
    expect(result.breakdownData.length).toBe(1);
  });

  it('should match known benchmark: 100M, 8%, 10 years, 0 contribution, yearly compound', () => {
    const result = calculateCompoundInterest(100000000, 8, 10, 0, 1);
    // Formula: 100,000,000 * (1.08)^10
    const expected = Math.round(100000000 * Math.pow(1.08, 10));
    expect(result.currentBalance).toBe(expected);
  });

});
