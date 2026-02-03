/**
 * Business Tax Calculation Logic
 * Pure functions only - No DOM interaction
 */

const TAX_RATES = {
  general: 0.20,
  small: 0.20,
  'oil-gas-min': 0.32,
  'oil-gas-max': 0.50,
  'rare-resources': 0.40
};

const SIMPLE_RATES = {
  goods: 0.01,
  services: 0.05,
  other: 0.02
};

/**
 * Calculates detailed business income tax (CIT)
 * @param {object} inputs - Revenue, expenses, other income, etc.
 * @returns {object} Calculated figures and final tax
 */
function calculateDetailedTaxLogic(inputs) {
  const taxableIncome = inputs.revenue - inputs.expenses + inputs.otherIncome;
  let incomeForTax = Math.max(0, taxableIncome - inputs.exemptIncome - inputs.previousLosses);
  const rdFund = incomeForTax * Math.min(inputs.rdFundPercent || 0, 0.10);
  const finalIncomeForTax = incomeForTax - rdFund;

  let taxRate = TAX_RATES.general;
  if (inputs.businessType === 'small') taxRate = TAX_RATES.small;
  else if (inputs.businessType === 'oil-gas') taxRate = TAX_RATES['oil-gas-min'];
  else if (inputs.businessType === 'rare-resources') taxRate = TAX_RATES['rare-resources'];

  return {
    ...inputs,
    taxableIncome: Math.round(taxableIncome),
    incomeForTax: Math.round(incomeForTax),
    rdFund: Math.round(rdFund),
    taxRate,
    totalTax: Math.round(finalIncomeForTax * taxRate)
  };
}

/**
 * Calculates simple business tax based on revenue
 * @param {number} revenue
 * @param {string} sector
 * @returns {object} Rate and final tax
 */
function calculateSimpleTaxLogic(revenue, sector) {
  const rate = SIMPLE_RATES[sector] || 0.01;
  return {
    revenue,
    rate,
    totalTax: Math.round(revenue * rate)
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateDetailedTaxLogic,
    calculateSimpleTaxLogic,
    TAX_RATES,
    SIMPLE_RATES
  };
}
