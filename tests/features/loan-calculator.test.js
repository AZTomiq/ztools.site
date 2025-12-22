/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const loanLogic = require('../../src/features/loan-calculator/script.js');

describe('Loan Calculator Logic', () => {
  const principal = 100000000; // 100M
  const term = 12; // 12 months
  const rate = 12; // 12% yearly = 1% monthly

  describe('Reducing Balance (Fixed Principal)', () => {
    it('should calculate first month payment correctly', () => {
      // Principal per month: 100M / 12 = 8,333,333.33
      // Interest month 1: 100M * 1% = 1,000,000
      // Total month 1: 9,333,333.33
      const result = loanLogic.calculateLoanDetails(principal, term, rate, 'reducing', '2025-01-01');
      expect(Math.round(result.firstMonthPayment)).toBe(9333333);
    });

    it('should calculate total interest correctly', () => {
      // Interest sum: (100 + 91.66 + 83.33 + ... + 8.33) * 1%
      // Average principal: (100 + 8.33) / 2 = 54.16M
      // Approx Interest: 54.16M * 1% * 12 = 6.5M
      const result = loanLogic.calculateLoanDetails(principal, term, rate, 'reducing', '2025-01-01');
      expect(Math.round(result.totalInterest)).toBe(6500000);
    });
  });

  describe('Flat Rate', () => {
    it('should calculate fixed monthly payment correctly', () => {
      // Principal per month: 8,333,333.33
      // Interest per month: 100M * 1% = 1,000,000
      // Total: 9,333,333.33
      const result = loanLogic.calculateLoanDetails(principal, term, rate, 'flat', '2025-01-01');
      expect(Math.round(result.firstMonthPayment)).toBe(9333333);
      expect(result.schedule[5].payment).toBe(result.firstMonthPayment);
    });

    it('should calculate total interest correctly', () => {
      // 1M * 12 = 12M
      const result = loanLogic.calculateLoanDetails(principal, term, rate, 'flat', '2025-01-01');
      expect(result.totalInterest).toBe(12000000);
    });
  });
});
