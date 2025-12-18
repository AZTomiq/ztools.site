/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const bmiLogic = require('../src/features/bmi/script.js');

describe('BMI Calculator Logic', () => {
  it('should calculate BMI correctly for 170cm, 65kg', () => {
    // 65 / (1.7 * 1.7) = 22.49... -> 22.5
    const result = bmiLogic.calculateBMI(170, 65);
    expect(result.bmi).toBe('22.5');
    expect(result.category).toBe('Bình thường');
  });

  it('should classify Underweight correctly', () => {
    const result = bmiLogic.calculateBMI(170, 50);
    expect(result.category).toBe('Nhẹ cân (Gầy)');
  });

  it('should classify Overweight correctly (Asian Standard)', () => {
    const result = bmiLogic.calculateBMI(170, 70);
    expect(result.category).toBe('Thừa cân (Tiền béo phì)');
  });

  it('should classify Obesity correctly', () => {
    const result = bmiLogic.calculateBMI(170, 85);
    expect(result.category).toBe('Béo phì độ I');
  });
});
