const fs = require('fs');
const path = require('path');

/**
 * Integration Test for OT Calculator
 */
const distPathVi = path.join(__dirname, '../dist-dev/vi/ot-calculator/index.html');
const distPathEn = path.join(__dirname, '../dist-dev/en/ot-calculator/index.html');

console.log('🧪 Running OT Calculator Integration Tests...');

function checkFile(filePath, lang) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ [${lang}] OT Calculator page not found at ${filePath}`);
    process.exit(1);
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
    if (!content.includes(exp)) {
      console.error(`❌ [${lang}] Missing expected element: ${exp}`);
      process.exit(1);
    }
  });

  console.log(`✅ [${lang}] Page structure is valid.`);
}

checkFile(distPathVi, 'vi');
checkFile(distPathEn, 'en');

console.log('🎉 All OT Calculator integration tests passed!');
