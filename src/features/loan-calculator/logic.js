/**
 * Loan Calculator Logic
 * Pure functions only - No DOM interaction
 */

/**
 * Calculates loan schedule and totals
 * 
 * @param {number} principal - Loan amount
 * @param {number} termMonths - Loan term in months
 * @param {number} yearlyRate - Annual interest rate (%)
 * @param {string} method - 'reducing' (Dư nợ giảm dần) or 'flat' (Gói cố định)
 * @param {string} startDateStr - YYYY-MM-DD start date
 * @returns {object} Results including schedule, total interest, total payment, and first month payment
 */
function calculateLoanDetails(principal, termMonths, yearlyRate, method, startDateStr) {
  const monthlyRate = yearlyRate / 100 / 12;
  let schedule = [];
  let totalInterest = 0;
  let totalPayment = 0;
  let firstMonthPayment = 0;

  let currentPrincipal = principal;
  const startDate = startDateStr ? new Date(startDateStr) : new Date();

  if (method === 'reducing') {
    const principalPerMonth = principal / termMonths;
    for (let i = 1; i <= termMonths; i++) {
      const interestPayment = currentPrincipal * monthlyRate;
      const principalPayment = i === termMonths ? currentPrincipal : principalPerMonth;
      const totalMonthPayment = principalPayment + interestPayment;

      totalInterest += interestPayment;
      totalPayment += totalMonthPayment;
      if (i === 1) firstMonthPayment = totalMonthPayment;

      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);

      schedule.push({
        month: i,
        date: date.toLocaleDateString('vi-VN'),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        payment: Math.round(totalMonthPayment),
        remaining: Math.round(currentPrincipal - principalPayment)
      });
      currentPrincipal -= principalPayment;
    }
  } else {
    // Fixed payment (Traditional flat rate on original principal)
    // Note: In some systems, 'fixed' means annuity (equal payments), 
    // but this code implements constant principal + constant interest on TOTAL principal
    const principalPerMonth = principal / termMonths;
    const interestPayment = principal * monthlyRate;
    const totalMonthPayment = principalPerMonth + interestPayment;
    firstMonthPayment = totalMonthPayment;

    for (let i = 1; i <= termMonths; i++) {
      const principalPayment = i === termMonths ? currentPrincipal : principalPerMonth;
      const totalCurrent = principalPayment + interestPayment;

      totalInterest += interestPayment;
      totalPayment += totalCurrent;

      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);

      schedule.push({
        month: i,
        date: date.toLocaleDateString('vi-VN'),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        payment: Math.round(totalCurrent),
        remaining: Math.round(currentPrincipal - principalPayment)
      });
      currentPrincipal -= principalPayment;
    }
  }

  return {
    schedule,
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    firstMonthPayment: Math.round(firstMonthPayment)
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateLoanDetails };
}
