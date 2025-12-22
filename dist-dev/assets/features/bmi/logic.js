/**
 * BMI Calculation Logic
 * Supports both Browser (Global) and Node.js (CommonJS)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BMILogic = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  const BMI_STANDARDS = {
    UNDERWEIGHT: 'underweight',
    NORMAL: 'normal',
    OVERWEIGHT: 'overweight',
    OBESE_I: 'obese1',
    OBESE_II: 'obese2'
  };

  /**
   * Calculates BMI index
   * @param {number} heightCm - Height in centimeters
   * @param {number} weightKg - Weight in kilograms
   * @returns {number}
   */
  function calculateBMI(heightCm, weightKg) {
    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return 0;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return parseFloat(bmi.toFixed(1));
  }

  /**
   * Gets BMI Category based on Asian (IDI & WPRO) standard
   * @param {number} bmi 
   * @returns {string} 
   */
  function getBMICategory(bmi) {
    if (bmi < 18.5) return BMI_STANDARDS.UNDERWEIGHT;
    if (bmi < 23) return BMI_STANDARDS.NORMAL;
    if (bmi < 25) return BMI_STANDARDS.OVERWEIGHT;
    if (bmi < 30) return BMI_STANDARDS.OBESE_I;
    return BMI_STANDARDS.OBESE_II;
  }

  return {
    BMI_STANDARDS,
    calculateBMI,
    getBMICategory
  };
}));
