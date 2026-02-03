import { describe, it, expect } from 'vitest';
const { calculateOTLogic } = require('./logic.js');

describe('OT Calculator Logic', () => {

  it('should calculate hourly rate and simple OT correctly', () => {
    // 20.8M salary, 26 days, 8 hours => 100k/hour
    const salary = 20800000;
    const days = 26;
    const hours = 8;
    const otHours = { weekdayDay: 2 }; // 2 hours weekday = 2 * 100k * 1.5 = 300k

    const res = calculateOTLogic(salary, days, hours, otHours);
    expect(res.hourlyRate).toBe(100000);
    expect(res.totalOTPay).toBe(300000);
    expect(res.breakdown[0].pay).toBe(300000);
  });

  it('should handle night multipliers correctly', () => {
    const salary = 20800000;
    const otHours = { weekdayNight: 1 }; // 1 * 100k * 2.1 = 210k
    const res = calculateOTLogic(salary, 26, 8, otHours);
    expect(res.totalOTPay).toBe(210000);
  });

});
