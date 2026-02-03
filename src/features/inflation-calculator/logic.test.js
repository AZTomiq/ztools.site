import { describe, it, expect } from 'vitest';
const { calculateInflationLogic } = require('./logic.js');

describe('Inflation Calculator Logic', () => {

  it('should calculate cumulative inflation for 2021-2023', () => {
    // 2022: 3.2%, 2023: 3.3%
    // Mult = 1.032 * 1.033 = 1.066056
    const res = calculateInflationLogic(1000000, 2021, 2023);
    expect(res.resultAmount).toBe(1066056);
    expect(res.cumulativePercent).toBeCloseTo(6.6056, 4);
  });

  it('should handle single year inflation', () => {
    // 2024: 4.0%
    const res = calculateInflationLogic(100, 2023, 2024);
    expect(res.resultAmount).toBe(104);
  });

});
