/**
 * Inflation Calculation Logic
 * Pure functions only - No DOM interaction
 */

const CPI_DATA = {
  2000: -0.6, 2001: 0.8, 2002: 4.0, 2003: 3.0, 2004: 9.5,
  2005: 8.4, 2006: 7.5, 2007: 8.3, 2008: 19.9, 2009: 6.5,
  2010: 9.2, 2011: 18.2, 2012: 9.2, 2013: 6.6, 2014: 4.1,
  2015: 0.6, 2016: 2.7, 2017: 3.5, 2018: 3.5, 2019: 2.8,
  2020: 3.2, 2021: 1.8, 2022: 3.2, 2023: 3.3, 2024: 4.0
};

/**
 * Calculates cumulative inflation for a period
 * @param {number} amount
 * @param {number} fromYear
 * @param {number} toYear
 * @returns {object} Final value and breakdown
 */
function calculateInflationLogic(amount, fromYear, toYear) {
  let start = Math.min(fromYear, toYear);
  let end = Math.max(fromYear, toYear);

  let multiplier = 1.0;
  const breakdown = [];

  for (let y = start + 1; y <= end; y++) {
    const rate = (CPI_DATA[y] || 0) / 100;
    multiplier *= (1 + rate);
    breakdown.push({
      year: y,
      rate: CPI_DATA[y],
      cumulative: (multiplier - 1) * 100
    });
  }

  const resultAmount = amount * multiplier;

  return {
    originalAmount: amount,
    resultAmount: Math.round(resultAmount),
    multiplier,
    cumulativePercent: (multiplier - 1) * 100,
    breakdown
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateInflationLogic, CPI_DATA };
}
