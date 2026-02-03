/**
 * Social Insurance Calculation Logic
 * Pure functions only - No DOM interaction
 */

const INSURANCE_RATES = {
  employee: {
    bhxh: 0.08,
    bhyt: 0.015,
    bhtn: 0.01
  },
  employer: {
    bhxh: 0.175,
    bhyt: 0.03,
    bhtn: 0.01
  }
};

const CAPS = {
  bhxh_bhyt: 46800000,
  bhtn_multiplier: 20
};

const MIN_WAGES = {
  1: 4960000,
  2: 4410000,
  3: 3860000,
  4: 3450000
};

function calculateInsuranceContribution(salary, region) {
  const bhxhBhytCap = CAPS.bhxh_bhyt;
  const bhtnCap = (MIN_WAGES[region] || MIN_WAGES[1]) * CAPS.bhtn_multiplier;

  const salaryForBhxhBhyt = Math.min(salary, bhxhBhytCap);
  const salaryForBhtn = Math.min(salary, bhtnCap);

  const employee = {
    bhxh: Math.round(salaryForBhxhBhyt * INSURANCE_RATES.employee.bhxh),
    bhyt: Math.round(salaryForBhxhBhyt * INSURANCE_RATES.employee.bhyt),
    bhtn: Math.round(salaryForBhtn * INSURANCE_RATES.employee.bhtn)
  };
  employee.total = employee.bhxh + employee.bhyt + employee.bhtn;

  const employer = {
    bhxh: Math.round(salaryForBhxhBhyt * INSURANCE_RATES.employer.bhxh),
    bhyt: Math.round(salaryForBhxhBhyt * INSURANCE_RATES.employer.bhyt),
    bhtn: Math.round(salaryForBhtn * INSURANCE_RATES.employer.bhtn)
  };
  employer.total = employer.bhxh + employer.bhyt + employer.bhtn;

  return { employee, employer };
}

function calculatePensionAmount(avgSalary, years, gender) {
  const baseYears = gender === 'female' ? 15 : 20;
  let rate = 0.45;
  if (years > baseYears) {
    rate += (years - baseYears) * 0.02;
  }
  rate = Math.min(rate, 0.75);
  const monthly = Math.round(avgSalary * rate);
  return { rate, monthly, yearly: monthly * 12 };
}

function calculateOneTimeBHXH(avgSalary, yearsPre, yearsPost) {
  const coeff = (yearsPre * 1.5) + (yearsPost * 2.0);
  return { coeff, amount: Math.round(avgSalary * coeff) };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateInsuranceContribution,
    calculatePensionAmount,
    calculateOneTimeBHXH,
    INSURANCE_RATES,
    CAPS,
    MIN_WAGES
  };
}
