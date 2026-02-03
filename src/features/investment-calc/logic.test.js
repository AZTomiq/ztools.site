import { describe, it, expect } from 'vitest';
const { calculateInvestmentLogic } = require('./logic.js');

describe('Investment Calculator Logic', () => {

  it('should calculate ROI correctly for a simple profit', () => {
    // 100M -> 150M in 1 year
    const res = calculateInvestmentLogic(100000000, 150000000, 1);
    expect(res.profit).toBe(50000000);
    expect(res.totalROI).toBe(50);
    expect(res.annualizedROI).toBe(50);
  });

  it('should calculate CAGR correctly for multiple years', () => {
    // 100M -> 121M in 2 years => 10% annual
    const res = calculateInvestmentLogic(100000000, 121000000, 2);
    expect(res.annualizedROI).toBeCloseTo(10, 2);
  });

  it('should handle losses', () => {
    // 100M -> 80M
    const res = calculateInvestmentLogic(100000000, 80000000, 1);
    expect(res.profit).toBe(-20000000);
    expect(res.totalROI).toBe(-20);
  });

});
