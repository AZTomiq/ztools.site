import { describe, it, expect } from 'vitest';
const fs = require('fs');
const path = require('path');

/**
 * Integration Test for OT Calculator
 */
describe('OT Calculator Integration', () => {
  const distPathVi = path.join(__dirname, '../dist-dev/vi/ot-calculator/index.html');
  const distPathEn = path.join(__dirname, '../dist-dev/en/ot-calculator/index.html');

  const checkFile = (filePath, lang) => {
    it(`should have valid structure for [${lang}]`, () => {
      if (!fs.existsSync(filePath)) {
        throw new Error(`OT Calculator page not found at ${filePath}`);
      }

      const content = fs.readFileSync(filePath, 'utf8');

      // Check for critical UI elements
      const expectations = [
        '<title>',
        'ot-calculator/style.css',
        'ot-calculator/script.js',
        'id="base-salary"',
        'id="weekday-day"',
        'id="total-ot-pay"',
        lang === 'vi' ? 'Hướng dẫn tính lương tăng ca' : 'How to use'
      ];

      expectations.forEach(exp => {
        expect(content).toContain(exp);
      });
    });
  };

  if (fs.existsSync(path.join(__dirname, '../dist-dev'))) {
    checkFile(distPathVi, 'vi');
    checkFile(distPathEn, 'en');
  } else {
    it.skip('Skipping integration tests (dist-dev not found)', () => { });
  }
});
