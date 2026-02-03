/**
 * Percentage Calculation Logic
 * Pure functions only - No DOM interaction
 */

/**
 * Calculates X percent of Y
 * @param {number} percent - X (%)
 * @param {number} number - Y
 * @returns {number} Result
 */
function calculateBasicPercentage(percent, number) {
  return (percent / 100) * number;
}

/**
 * Calculates percentage change from A to B
 * @param {number} from - A
 * @param {number} to - B
 * @returns {number} Percentage change (%)
 */
function calculatePercentageChange(from, to) {
  if (from === 0) return to > 0 ? Infinity : (to < 0 ? -Infinity : 0);
  return ((to - from) / from) * 100;
}

/**
 * Calculates what percentage X is of Y
 * @param {number} x - X
 * @param {number} y - Y
 * @returns {number} Result (%)
 */
function calculateWhatPercentage(x, y) {
  if (y === 0) return x > 0 ? Infinity : (x < 0 ? -Infinity : 0);
  return (x / y) * 100;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateBasicPercentage,
    calculatePercentageChange,
    calculateWhatPercentage
  };
}
