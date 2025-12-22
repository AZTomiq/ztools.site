/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const taxLogic = require('../../src/features/tax/logic.js');

describe('Tax Calculator Logic', () => {
  it('should calculate PIT correctly for 20M Gross (no dependents)', () => {
    // 20M Gross, 0 dependents
    // BH bắt buộc (10.5%): 2.1M
    // Thu nhập chịu thuế: 17.9M
    // Giảm trừ bản thân (Old): 11M -> Thu nhập tính thuế: 6.9M
    // Thuế (Old): 5M * 5% + 1.9M * 10% = 250k + 190k = 440k

    const result = taxLogic.calculatePIT(20000000, 0);
    expect(result.insurance).toBe(2100000);
    expect(result.taxableOld).toBe(6900000);
    expect(result.taxOld).toBe(440000);
  });

  it('should calculate PIT correctly for 50M Gross (no dependents)', () => {
    const result = taxLogic.calculatePIT(50000000, 0);

    // BHXH Cap (7/2024): 46.8M. BHXH = 46.8M * 8% = 3.744M
    // BHYT Cap: 46.8M * 1.5% = 702k
    // BHTN Cap (Vùng 1): 99.2M. BHTN = 50M * 1% = 500k
    // Total Insurance: 3.744 + 0.702 + 0.5 = 4.946M

    expect(result.bhxh).toBe(3744000);
    expect(result.bhyt).toBe(702000);
    expect(result.bhtn).toBe(500000);
    expect(result.insurance).toBe(4946000);
  });

  it('should calculate Net to Gross correctly', () => {
    // New signature: (targetNet, dependents, region, useNewTax)
    const gross = taxLogic.netToGross(15000000, 0, 1, false);
    const backToNet = taxLogic.calculatePIT(gross, 0, 1).netOld;

    // Difference should be less than 1 VND (due to binary search tolerance)
    expect(Math.abs(backToNet - 15000000)).toBeLessThan(2);
  });
});
