/**
 * Savings Interest Calculation Logic
 * Pure functions only - No DOM interaction
 */

/**
 * Calculates simple savings interest
 * 
 * @param {number} amount - Principal amount
 * @param {number} rate - Annual interest rate (%)
 * @param {number} months - Term in months
 * @returns {object} Interest and total amount
 */
function calculateSavingsInterest(amount, rate, months) {
  const interest = amount * (rate / 100) * (months / 12);
  const total = amount + interest;
  return {
    interest: Math.round(interest),
    total: Math.round(total)
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateSavingsInterest };
}
