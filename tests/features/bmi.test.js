/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const bmiLogic = require('../../src/features/bmi/logic.js');

describe('BMI Calculator Logic', () => {
  it('should calculate BMI correctly for 170cm, 65kg', () => {
    // 65 / (1.7 * 1.7) = 22.49... -> 22.5
    const bmi = bmiLogic.calculateBMI(170, 65);
    expect(bmi).toBe(22.5);

    const cat = bmiLogic.getBMICategory(bmi);
    expect(cat).toBe(bmiLogic.BMI_STANDARDS.NORMAL);
  });

  it('should classify Underweight correctly', () => {
    const bmi = bmiLogic.calculateBMI(170, 50);
    expect(bmiLogic.getBMICategory(bmi)).toBe(bmiLogic.BMI_STANDARDS.UNDERWEIGHT);
  });

  it('should classify Overweight correctly (Asian Standard)', () => {
    const bmi = bmiLogic.calculateBMI(170, 70);
    expect(bmiLogic.getBMICategory(bmi)).toBe(bmiLogic.BMI_STANDARDS.OVERWEIGHT);
  });

  it('should classify Obesity correctly', () => {
    const bmi = bmiLogic.calculateBMI(170, 85);
    expect(bmiLogic.getBMICategory(bmi)).toBe(bmiLogic.BMI_STANDARDS.OBESE_I);
  });
});
