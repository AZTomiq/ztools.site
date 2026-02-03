import { describe, it, expect } from 'vitest';
const {
  calculateDetailedTaxLogic,
  calculateSimpleTaxLogic
} = require('./logic.js');

describe('Business Tax Logic', () => {

  describe('Detailed Tax (CIT)', () => {
    it('should calculate tax correctly for basic scenario', () => {
      const inputs = {
        revenue: 1000000000, // 1B
        expenses: 800000000,  // 800M
        otherIncome: 0,
        exemptIncome: 0,
        previousLosses: 0,
        businessType: 'general',
        rdFundPercent: 0
      };

      const res = calculateDetailedTaxLogic(inputs);
      // Taxable income = 200M. Tax = 200M * 20% = 40M
      expect(res.taxableIncome).toBe(200000000);
      expect(res.totalTax).toBe(40000000);
    });

    it('should apply RD Fund cap correctly', () => {
      const inputs = {
        revenue: 1000000000,
        expenses: 800000000,
        otherIncome: 0,
        exemptIncome: 0,
        previousLosses: 0,
        businessType: 'general',
        rdFundPercent: 0.20 // 20% should be capped at 10%
      };
      const res = calculateDetailedTaxLogic(inputs);
      // Taxable = 200M. RD Fund = 20M. CIT Income = 180M. Tax = 36M
      expect(res.rdFund).toBe(20000000);
      expect(res.totalTax).toBe(36000000);
    });
  });

  describe('Simple Tax', () => {
    it('should calculate tax based on revenue and sector', () => {
      // 100M revenue for goods (1%)
      const res = calculateSimpleTaxLogic(100000000, 'goods');
      expect(res.totalTax).toBe(1000000);
    });
  });

});
