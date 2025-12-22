/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const bt = require('../../src/features/business-tax/script.js');

describe('Business Tax Logic', () => {
  describe('Detailed Method', () => {
    it('should calculate tax correctly for general business', () => {
      const inputs = {
        revenue: 1000000000,
        expenses: 700000000,
        otherIncome: 100000000,
        exemptIncome: 0,
        previousLosses: 0,
        businessType: 'general',
        rdFundPercent: 0
      };
      // Taxable: 1000 - 700 + 100 = 400M
      // Tax: 400M * 20% = 80M
      const res = bt.calculateDetailedTaxLogic(inputs);
      expect(res.taxableIncome).toBe(400000000);
      expect(res.totalTax).toBe(80000000);
    });

    it('should deduct R&D fund correctly', () => {
      const inputs = {
        revenue: 1000000000,
        expenses: 0,
        otherIncome: 0,
        exemptIncome: 0,
        previousLosses: 0,
        businessType: 'general',
        rdFundPercent: 0.1 // 10%
      };
      // Income: 1B. RD Fund: 100M. Final for tax: 900M
      // Tax: 900M * 20% = 180M
      const res = bt.calculateDetailedTaxLogic(inputs);
      expect(res.rdFund).toBe(100000000);
      expect(res.totalTax).toBe(180000000);
    });
  });

  describe('Simple Method', () => {
    it('should calculate simple tax for goods (1%) correctly', () => {
      const res = bt.calculateSimpleTaxLogic(100000000, 'goods');
      expect(res.totalTax).toBe(1000000);
    });
  });
});
