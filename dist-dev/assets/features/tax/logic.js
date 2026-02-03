/**
 * Tax Calculation Logic
 * Supports both Browser (Global) and Node.js (CommonJS)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TaxLogic = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  const TAX_CONFIG = {
    // Employee insurance rates
    bhxh: { rate: 0.08, cap: 46_800_000 },  // BHXH 8%, cap 20 × 2.34M (từ 7/2024)
    bhyt: { rate: 0.015, cap: 46_800_000 }, // BHYT 1.5%, cap 20 × 2.34M
    bhtn: { rate: 0.01 },                    // BHTN 1%, cap depends on region

    // BHTN caps by region (20 × minimum wage)
    bhtnCaps: {
      1: 99_200_000,  // Vùng I: 20 × 4,960,000
      2: 88_200_000,  // Vùng II: 20 × 4,410,000
      3: 77_200_000,  // Vùng III: 20 × 3,860,000
      4: 69_000_000,  // Vùng IV: 20 × 3,450,000
    },

    // Employer insurance rates
    bhxhCompany: { rate: 0.17, cap: 46_800_000 },  // BHXH 17%
    bhnnCompany: { rate: 0.005, cap: 46_800_000 }, // BH tai nạn LĐ - Bệnh nghề nghiệp 0.5%
    bhytCompany: { rate: 0.03, cap: 46_800_000 },  // BHYT 3%
    bhtnCompany: { rate: 0.01 },  // BHTN 1%, cap depends on region

    personalDeduction: { old: 11_000_000, new: 15_500_000 },
    dependentDeduction: { old: 4_400_000, new: 6_200_000 },
    bracketsOld: [
      [5_000_000, 0.05],
      [10_000_000, 0.10],
      [18_000_000, 0.15],
      [32_000_000, 0.20],
      [52_000_000, 0.25],
      [80_000_000, 0.30],
      [Infinity, 0.35],
    ],
    bracketsNew: [
      [10_000_000, 0.05],
      [30_000_000, 0.10],
      [60_000_000, 0.20],
      [100_000_000, 0.30],
      [Infinity, 0.35],
    ],
  };

  function calculateProgressiveTax(taxableIncome, brackets) {
    if (taxableIncome <= 0) return 0;
    let tax = 0, prev = 0;
    for (const [threshold, rate] of brackets) {
      const taxable = Math.min(taxableIncome, threshold) - prev;
      if (taxable <= 0) break;
      tax += taxable * rate;
      prev = threshold;
    }
    return Math.round(tax);
  }

  function calculateTaxBreakdown(taxableIncome, brackets) {
    const breakdown = [];
    let prev = 0;
    for (const [threshold, rate] of brackets) {
      const taxable = Math.min(taxableIncome, threshold) - prev;
      const tax = taxable > 0 ? taxable * rate : 0;
      breakdown.push({
        from: prev,
        to: threshold === Infinity ? null : threshold,
        rate,
        taxable: Math.max(0, taxable),
        tax: Math.round(tax)
      });
      prev = threshold;
      if (taxableIncome <= threshold) break;
    }
    return breakdown;
  }

  function calcInsurance(income, rate, cap) {
    return Math.min(income, cap) * rate;
  }

  function calculatePIT(grossIncome, dependents, region = 1) {
    const cfg = TAX_CONFIG;
    const bhtnCap = cfg.bhtnCaps[region];

    const bhxh = calcInsurance(grossIncome, cfg.bhxh.rate, cfg.bhxh.cap);
    const bhyt = calcInsurance(grossIncome, cfg.bhyt.rate, cfg.bhyt.cap);
    const bhtn = calcInsurance(grossIncome, cfg.bhtn.rate, bhtnCap);
    const insurance = bhxh + bhyt + bhtn;

    const incomeAfterInsurance = grossIncome - insurance;

    const deductionOld = cfg.personalDeduction.old + cfg.dependentDeduction.old * dependents;
    const deductionNew = cfg.personalDeduction.new + cfg.dependentDeduction.new * dependents;

    const taxableOld = Math.max(0, incomeAfterInsurance - deductionOld);
    const taxableNew = Math.max(0, incomeAfterInsurance - deductionNew);

    const taxOld = calculateProgressiveTax(taxableOld, cfg.bracketsOld);
    const taxNew = calculateProgressiveTax(taxableNew, cfg.bracketsNew);

    const breakdownOld = calculateTaxBreakdown(taxableOld, cfg.bracketsOld);
    const breakdownNew = calculateTaxBreakdown(taxableNew, cfg.bracketsNew);

    const taxSelfOnlyOld = calculateProgressiveTax(Math.max(0, incomeAfterInsurance - cfg.personalDeduction.old), cfg.bracketsOld);
    const taxSelfOnlyNew = calculateProgressiveTax(Math.max(0, incomeAfterInsurance - cfg.personalDeduction.new), cfg.bracketsNew);

    return {
      grossIncome,
      dependents,
      bhxh,
      bhyt,
      bhtn,
      insurance,
      incomeAfterInsurance,
      deductionOld,
      deductionNew,
      taxableOld,
      taxableNew,
      taxOld,
      taxNew,
      taxSelfOnlyOld,
      taxSelfOnlyNew,
      breakdownOld,
      breakdownNew,
      netOld: grossIncome - insurance - taxOld,
      netNew: grossIncome - insurance - taxNew,
    };
  }

  function calculateYearlyPIT(monthlyGross, dependents, bonusMonths, region = 1) {
    const cfg = TAX_CONFIG;
    const monthly = calculatePIT(monthlyGross, dependents, region);

    const bonusGross = monthlyGross * bonusMonths;
    const yearlyGross = monthlyGross * 12 + bonusGross;
    const yearlyInsurance = monthly.insurance * 12; // Assuming bonus has no insurance

    const yearlyDeductionOld = monthly.deductionOld * 12;
    const yearlyDeductionNew = monthly.deductionNew * 12;

    const yearlyTaxableOld = Math.max(0, yearlyGross - yearlyInsurance - yearlyDeductionOld);
    const yearlyTaxableNew = Math.max(0, yearlyGross - yearlyInsurance - yearlyDeductionNew);

    // Yearly brackets are monthly brackets * 12
    const yearlyBracketsOld = cfg.bracketsOld.map(([t, r]) => [t === Infinity ? Infinity : t * 12, r]);
    const yearlyBracketsNew = cfg.bracketsNew.map(([t, r]) => [t === Infinity ? Infinity : t * 12, r]);

    const yearlyTaxOld = calculateProgressiveTax(yearlyTaxableOld, yearlyBracketsOld);
    const yearlyTaxNew = calculateProgressiveTax(yearlyTaxableNew, yearlyBracketsNew);

    return {
      bonusGross,
      yearlyGross,
      yearlyInsurance,
      yearlyDeductionOld,
      yearlyDeductionNew,
      yearlyTaxableOld,
      yearlyTaxableNew,
      yearlyTaxOld,
      yearlyTaxNew,
      yearlyNetOld: yearlyGross - yearlyInsurance - yearlyTaxOld,
      yearlyNetNew: yearlyGross - yearlyInsurance - yearlyTaxNew,
      yearlySaved: yearlyTaxOld - yearlyTaxNew
    };
  }

  function netToGross(targetNet, dependents, region = 1, useNewTax = false) {
    let low = targetNet;
    let high = targetNet * 2;
    const tolerance = 1;

    for (let i = 0; i < 100; i++) {
      const mid = Math.floor((low + high) / 2);
      const result = calculatePIT(mid, dependents, region);
      const net = useNewTax ? result.netNew : result.netOld;

      if (Math.abs(net - targetNet) < tolerance) {
        return mid;
      }

      if (net < targetNet) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return Math.floor((low + high) / 2);
  }

  return {
    TAX_CONFIG,
    calculateProgressiveTax,
    calculateTaxBreakdown,
    calculatePIT,
    calculateYearlyPIT,
    netToGross,
    calcInsurance
  };
}));
