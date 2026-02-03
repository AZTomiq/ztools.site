/**
 * Investment Calculation Logic
 * Pure functions only - No DOM interaction
 */

/**
 * Calculates ROI and Annualized Return (CAGR)
 * @param {number} initial - Initial investment
 * @param {number} final - Final value
 * @param {number} duration - Investment period in years
 * @returns {object} ROI statistics
 */
function calculateInvestmentLogic(initial, final, duration) {
  if (initial <= 0) return null;

  const profit = final - initial;
  const totalROI = (profit / initial) * 100;

  // Annualized Return (CAGR) = [(Final / Initial)^(1 / Years)] - 1
  let annualizedROI = 0;
  if (duration > 0 && final / initial > 0) {
    annualizedROI = (Math.pow(final / initial, 1 / duration) - 1) * 100;
  }

  return {
    profit: Math.round(profit),
    totalROI,
    annualizedROI
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateInvestmentLogic };
}
