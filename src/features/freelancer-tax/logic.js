/**
 * Freelancer Tax Calculation Logic
 * Pure functions only - No DOM interaction
 */

const HKD_RATES = {
  dist: { vat: 0.01, pit: 0.005 },
  service: { vat: 0.05, pit: 0.02 },
  comm: { vat: 0.05, pit: 0.02 },
  other: { vat: 0.03, pit: 0.015 }
};

/**
 * Calculates freelancer tax
 * @param {number} amount - Gross income
 * @param {string} mode - 'withholding' or 'household'
 * @param {string} sector - HKD sector (only for household mode)
 * @returns {object} Tax breakdown
 */
function calculateFreelancerTax(amount, mode, sector) {
  let pit = 0;
  let vat = 0;

  if (mode === 'withholding') {
    // Withholding 10% for individual services >= 2M
    if (amount >= 2000000) {
      pit = amount * 0.1;
    }
  } else {
    // Business Household (HKD)
    const rates = HKD_RATES[sector] || HKD_RATES.other;
    vat = amount * rates.vat;
    pit = amount * rates.pit;
  }

  const totalTax = pit + vat;
  const net = amount - totalTax;

  return {
    gross: amount,
    vat: Math.round(vat),
    pit: Math.round(pit),
    totalTax: Math.round(totalTax),
    net: Math.round(net)
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateFreelancerTax, HKD_RATES };
}
