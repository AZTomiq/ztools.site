import { describe, it, expect, beforeEach } from 'vitest';
const BMILogic = require('./logic.js');

describe('BMI Logic', () => {
  describe('calculateBMI', () => {
    it('should calculate BMI correctly for typical values', () => {
      // 170cm, 65kg -> 65 / (1.7*1.7) = 22.49... -> 22.5
      expect(BMILogic.calculateBMI(170, 65)).toBe(22.5);
    });

    it('should handle zero or negative input', () => {
      expect(BMILogic.calculateBMI(0, 65)).toBe(0);
      expect(BMILogic.calculateBMI(170, 0)).toBe(0);
      expect(BMILogic.calculateBMI(-170, 65)).toBe(0);
    });

    it('should handle very small values', () => {
      expect(BMILogic.calculateBMI(1, 1)).toBe(10000);
    });
  });

  describe('getBMICategory', () => {
    const { BMI_STANDARDS } = BMILogic;

    it('should identify UNDERWEIGHT', () => {
      expect(BMILogic.getBMICategory(18.4)).toBe(BMI_STANDARDS.UNDERWEIGHT);
    });

    it('should identify NORMAL', () => {
      expect(BMILogic.getBMICategory(18.5)).toBe(BMI_STANDARDS.NORMAL);
      expect(BMILogic.getBMICategory(22.9)).toBe(BMI_STANDARDS.NORMAL);
    });

    it('should identify OVERWEIGHT', () => {
      expect(BMILogic.getBMICategory(23)).toBe(BMI_STANDARDS.OVERWEIGHT);
      expect(BMILogic.getBMICategory(24.9)).toBe(BMI_STANDARDS.OVERWEIGHT);
    });

    it('should identify OBESE_I', () => {
      expect(BMILogic.getBMICategory(25)).toBe(BMI_STANDARDS.OBESE_I);
      expect(BMILogic.getBMICategory(29.9)).toBe(BMI_STANDARDS.OBESE_I);
    });

    it('should identify OBESE_II', () => {
      expect(BMILogic.getBMICategory(30)).toBe(BMI_STANDARDS.OBESE_II);
    });
  });
});
