/**
 * OT Calculation Logic
 * Pure functions only - No DOM interaction
 */

const MULTIPLIERS = {
  WEEKDAY_DAY: 1.5,
  WEEKDAY_NIGHT: 2.1, // 150% + 30% + (20% * 150%)
  WEEKEND_DAY: 2.0,
  WEEKEND_NIGHT: 2.7, // 200% + 30% + (20% * 200%)
  HOLIDAY_DAY: 3.0,
  HOLIDAY_NIGHT: 3.9  // 300% + 30% + (20% * 300%)
};

/**
 * Calculates OT details
 * @param {number} salary - Base salary
 * @param {number} workingDays - Days per month
 * @param {number} workingHours - Hours per day
 * @param {object} otHours - Object containing hours for each category
 * @returns {object} Breakdown and totals
 */
function calculateOTLogic(salary, workingDays, workingHours, otHours) {
  const hourlyRate = salary / (workingDays * workingHours);
  let totalOTPay = 0;
  const breakdown = [];

  const categories = [
    { key: 'weekdayDay', labelKey: 'weekday_day', mult: MULTIPLIERS.WEEKDAY_DAY },
    { key: 'weekdayNight', labelKey: 'weekday_night', mult: MULTIPLIERS.WEEKDAY_NIGHT },
    { key: 'weekendDay', labelKey: 'weekend_day', mult: MULTIPLIERS.WEEKEND_DAY },
    { key: 'weekendNight', labelKey: 'weekend_night', mult: MULTIPLIERS.WEEKEND_NIGHT },
    { key: 'holidayDay', labelKey: 'holiday_day', mult: MULTIPLIERS.HOLIDAY_DAY },
    { key: 'holidayNight', labelKey: 'holiday_night', mult: MULTIPLIERS.HOLIDAY_NIGHT }
  ];

  categories.forEach(cat => {
    const hours = otHours[cat.key] || 0;
    if (hours > 0) {
      const pay = hours * hourlyRate * cat.mult;
      totalOTPay += pay;
      breakdown.push({
        label: cat.labelKey,
        hours,
        mult: cat.mult,
        pay: Math.round(pay)
      });
    }
  });

  return {
    hourlyRate: Math.round(hourlyRate),
    totalOTPay: Math.round(totalOTPay),
    finalTotal: Math.round(salary + totalOTPay),
    breakdown
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateOTLogic, MULTIPLIERS };
}
