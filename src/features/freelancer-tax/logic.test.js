import { describe, it, expect } from 'vitest';
const { calculateFreelancerTax } = require('./logic.js');

describe('Freelancer Tax Logic', () => {

  describe('Withholding Mode', () => {
    it('should deduct 10% if amount is >= 2M', () => {
      const res = calculateFreelancerTax(10000000, 'withholding');
      expect(res.pit).toBe(1000000);
      expect(res.net).toBe(9000000);
    });

    it('should NOT deduct tax if amount is < 2M', () => {
      const res = calculateFreelancerTax(1500000, 'withholding');
      expect(res.pit).toBe(0);
      expect(res.net).toBe(1500000);
    });
  });

  describe('Business Household Mode', () => {
    it('should calculate VAT and PIT based on sector (service)', () => {
      // Service: 5% VAT + 2% PIT = 7% total
      const res = calculateFreelancerTax(10000000, 'household', 'service');
      expect(res.vat).toBe(500000);
      expect(res.pit).toBe(200000);
      expect(res.totalTax).toBe(700000);
    });
  });

});
