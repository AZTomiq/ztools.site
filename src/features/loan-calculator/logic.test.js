import { describe, it, expect } from 'vitest';
const { calculateLoanDetails } = require('./logic.js');

describe('Loan Calculator Logic', () => {

  it('should calculate reducing balance loan correctly', () => {
    // 12M, 12 months, 12% annual rate (1% monthly), reducing
    const result = calculateLoanDetails(12000000, 12, 12, 'reducing', '2025-01-01');

    // Total interest should be Sum(12M, 11M, ..., 1M) * 1% = 78 * 1% * 1M = 780,000
    expect(result.totalInterest).toBe(780000);
    expect(result.totalPayment).toBe(12780000);
    expect(result.firstMonthPayment).toBe(1120000); // 1M principal + 120k interest
    expect(result.schedule.length).toBe(12);
  });

  it('should calculate flat interest loan correctly', () => {
    // 12M, 12 months, 12% annual rate, flat
    const result = calculateLoanDetails(12000000, 12, 12, 'flat', '2025-01-01');

    // Each month: 1M principal + (12M * 1%) interest = 1M + 120k = 1,120,000
    // Total interest: 120k * 12 = 1,440,000
    expect(result.totalInterest).toBe(1440000);
    expect(result.totalPayment).toBe(13440000);
    expect(result.firstMonthPayment).toBe(1120000);
    expect(result.schedule.every(s => s.payment === 1120000)).toBe(true);
  });

  it('should handle small amounts and edge cases', () => {
    const result = calculateLoanDetails(100, 1, 0, 'reducing', '2025-01-01');
    expect(result.totalPayment).toBe(100);
    expect(result.totalInterest).toBe(0);
    expect(result.schedule[0].payment).toBe(100);
  });

});
