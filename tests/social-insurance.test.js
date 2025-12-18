/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const si = require('../src/features/social-insurance/script.js');

describe('Social Insurance Logic', () => {
  describe('Contribution', () => {
    it('should calculate mandatory contributions correctly (within caps)', () => {
      // 10M salary, Region 1
      // BHXH: 10M * 8% = 800k
      // BHYT: 10M * 1.5% = 150k
      // BHTN: 10M * 1% = 100k
      const res = si.calculateInsuranceContribution(10000000, 1);
      expect(res.employee.bhxh).toBe(800000);
      expect(res.employee.bhyt).toBe(150000);
      expect(res.employee.bhtn).toBe(100000);
      expect(res.employee.total).toBe(1050000);
    });

    it('should apply CAPS correctly', () => {
      // 100M salary, Region 1
      // BHXH/BHYT capped at 46.8M
      // BHTN capped at Region 1 * 20 = 4,960,000 * 20 = 99,200,000
      const res = si.calculateInsuranceContribution(100000000, 1);
      expect(res.employee.bhxh).toBe(si.CAPS.bhxh_bhyt * 0.08);
      expect(res.employee.bhtn).toBe(99200000 * 0.01);
    });
  });

  describe('Pension', () => {
    it('should calculate pension rate for male correctly', () => {
      // Male 35 years: 45% (20yrs) + 15*2% = 45% + 30% = 75%
      const res = si.calculatePensionAmount(10000000, 35, 'male');
      expect(res.rate).toBe(0.75);
      expect(res.monthly).toBe(7500000);
    });

    it('should calculate pension rate for female correctly', () => {
      // Female 30 years: 45% (15yrs) + 15*2% = 45% + 30% = 75%
      const res = si.calculatePensionAmount(10000000, 30, 'female');
      expect(res.rate).toBe(0.75);
    });
  });

  describe('One-time BHXH', () => {
    it('should calculate one-time payout correctly', () => {
      // 10M avg salary, 2 years pre-2014, 3 years post-2014
      // Coeff = (2 * 1.5) + (3 * 2.0) = 3 + 6 = 9 months
      const res = si.calculateOneTimeBHXH(10000000, 2, 3);
      expect(res.coeff).toBe(9);
      expect(res.amount).toBe(90000000);
    });
  });
});
