import { describe, it, expect } from 'vitest';
const TaxLogic = require('./logic.js');

describe('Tax Logic', () => {
  const { TAX_CONFIG } = TaxLogic;

  describe('calcInsurance', () => {
    it('should cap insurance based on provided cap', () => {
      // 8% of 10M = 800k
      expect(TaxLogic.calcInsurance(10_000_000, 0.08, 46_800_000)).toBe(800_000);
      // 8% of 100M capped at 46.8M -> 46.8M * 0.08 = 3,744,000
      expect(TaxLogic.calcInsurance(100_000_000, 0.08, 46_800_000)).toBe(3_744_000);
    });
  });

  describe('calculateProgressiveTax', () => {
    it('should calculate 5% for first 5M (Old Brackets)', () => {
      expect(TaxLogic.calculateProgressiveTax(5_000_000, TAX_CONFIG.bracketsOld)).toBe(250_000);
    });

    it('should calculate correctly for higher bracket', () => {
      // 15M:
      // 5M * 5% = 250k
      // 5M * 10% = 500k
      // 5M * 15% = 750k
      // Total = 1.5M
      expect(TaxLogic.calculateProgressiveTax(15_000_000, TAX_CONFIG.bracketsOld)).toBe(1_500_000);
    });
  });

  describe('calculatePIT', () => {
    it('should return 0 tax for low income', () => {
      // 5M gross - 10.5% ins = 4.475M. Below 11M deduction -> 0 tax.
      const result = TaxLogic.calculatePIT(5_000_000, 0);
      expect(result.taxOld).toBe(0);
      expect(result.taxNew).toBe(0);
    });

    it('should calculate correctly for 50M gross, 0 dependents', () => {
      const g = 50_000_000;
      const res = TaxLogic.calculatePIT(g, 0, 1);

      // BHXH (8% of 46.8M) = 3,744,000
      // BHYT (1.5% of 46.8M) = 702,000
      // BHTN (1% of 50M) = 500,000
      // Total Ins = 4,946,000
      expect(res.insurance).toBe(4_946_000);

      // Income after ins = 45,054,000
      // Taxable (Old) = 45,054,000 - 11M = 34,054,000
      // Old PIT (7 brackets):
      // 5M @ 5% = 250k
      // 5M @ 10% = 500k
      // 8M @ 15% = 1.2M
      // 14M @ 20% = 2.8M
      // 2.054M @ 25% = 513,500
      // Total PIT Old = 5,263,500
      expect(res.taxOld).toBe(5_263_500);
    });
  });

  describe('netToGross', () => {
    it('should find gross from net accurately', () => {
      const targetNet = 30_000_000;
      const gross = TaxLogic.netToGross(targetNet, 0, 1, false);
      const verify = TaxLogic.calculatePIT(gross, 0, 1);

      // Should be very close to targetNet
      expect(Math.abs(verify.netOld - targetNet)).toBeLessThan(5);
    });
  });
});
