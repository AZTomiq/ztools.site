import { describe, it, expect } from 'vitest';
const {
  calculateInsuranceContribution,
  calculatePensionAmount,
  calculateOneTimeBHXH
} = require('./logic.js');

describe('Social Insurance Logic', () => {

  describe('calculateInsuranceContribution', () => {
    it('should calculate employee contributions correctly for Vùng 1', () => {
      // 10,000,000 Vùng 1
      // BHXH: 8% of 10M = 800k
      // BHYT: 1.5% of 10M = 150k
      // BHTN: 1% of 10M = 100k
      const res = calculateInsuranceContribution(10000000, 1);
      expect(res.employee.bhxh).toBe(800000);
      expect(res.employee.bhyt).toBe(150000);
      expect(res.employee.bhtn).toBe(100000);
      expect(res.employee.total).toBe(1050000);
    });

    it('should cap contributions at high salaries', () => {
      // 100,000,000 (Above cap of 46.8M for BHXH/BHYT)
      const res = calculateInsuranceContribution(100000000, 1);
      expect(res.employee.bhxh).toBe(Math.round(46800000 * 0.08));
    });
  });

  describe('calculatePensionAmount', () => {
    it('should calculate pension rate for male correctly', () => {
      // Male 35 years: 20 years = 45%, extra 15 years * 2% = 30%. Total 75%
      const res = calculatePensionAmount(10000000, 35, 'male');
      expect(res.rate).toBe(0.75);
      expect(res.monthly).toBe(7500000);
    });

    it('should calculate pension rate for female correctly', () => {
      // Female 30 years: 15 years = 45%, extra 15 years * 2% = 30%. Total 75%
      const res = calculatePensionAmount(10000000, 30, 'female');
      expect(res.rate).toBe(0.75);
    });
  });

});
