/**
 * Compound Interest Calculation Logic
 * Pure functions only - No DOM interaction
 */

/**
 * Calculates compound interest with periodic contributions
 * 
 * @param {number} initial - Initial investment amount
 * @param {number} rate - Annual interest rate (percentage, e.g., 8 for 8%)
 * @param {number} years - Duration in years
 * @param {number} contribution - Monthly contribution amount
 * @param {number} frequency - Compounding frequency per year (12 = monthly, 1 = yearly)
 * @returns {object} Result object with balance, total contributed, total interest, and annual breakdown
 */
function calculateCompoundInterest(initial, rate, years, contribution, frequency) {
  let currentBalance = initial;
  let totalContributed = initial;
  let totalInterest = 0;

  const totalMonths = years * 12;
  const monthsPerCompound = 12 / frequency;
  const breakdownData = [];

  for (let m = 1; m <= totalMonths; m++) {
    // We assume contribution happens at the START of the month
    currentBalance += contribution;
    totalContributed += contribution;

    // Compounding check
    if (m % monthsPerCompound === 0) {
      const periodicRate = (rate / 100) / frequency;
      const interest = currentBalance * periodicRate;
      currentBalance += interest;
      totalInterest += interest;
    }

    // Annual breakdown
    if (m % 12 === 0) {
      breakdownData.push({
        year: m / 12,
        balance: Math.round(currentBalance),
        interest: Math.round(totalInterest),
        contributed: Math.round(totalContributed)
      });
    }
  }

  return {
    currentBalance: Math.round(currentBalance),
    totalContributed: Math.round(totalContributed),
    totalInterest: Math.round(totalInterest),
    breakdownData
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateCompoundInterest };
}
