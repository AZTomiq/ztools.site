# 🐛 UI Bugs Tracker

**Created**: 12/19/2025, 3:00:00 PM  
**Total Tools**: 27  
**Status**: Manual Review Phase (Automated Tests 100% Pass)

---

## 📋 HOW TO USE THIS TRACKER

### Step 1: Review Screenshots

```bash
open ui-test-results/screenshots/
```

### Step 2: For Each Tool, Check:

- [ ] **Layout**: Form width, alignment, spacing
- [ ] **Labels**: Visible, clear, properly sized
- [ ] **Inputs**: Border, focus state, sizing
- [ ] **Buttons**: Prominent, well-placed
- [ ] **Results**: Clear display, good formatting
- [ ] **Mobile**: Responsive behavior (check mobile screenshots)
- [ ] **Borders**: All containers have visible borders
- [ ] **Spacing**: Consistent gaps (1.5-2rem)

### Step 3: Log Issues Below

For each bug found, add to the appropriate section.

---

## 🔴 CRITICAL BUGS (Breaks Functionality)

### Issues

<!-- Add critical bugs here -->

---

## 🟡 HIGH PRIORITY (Major UX Issues)

### Issues

<!-- Add high priority bugs here -->

---

## 🟢 MEDIUM PRIORITY (Visual/Polish Issues)

### Issues

<!-- Add medium priority bugs here -->

---

## 🔵 LOW PRIORITY (Minor Issues)

### Issues

<!-- Add low priority bugs here -->

---

## ✅ TOOLS REVIEWED

Track which tools have been reviewed for bugs:

- [ ] **bmi\_** (VI ✓)
- [ ] **bookmark-creator\_** (VI ✓)
- [ ] **compound-interest\_** (VI ✓)
- [ ] **cron-parser\_** (VI ✓)
- [ ] **date-time-master\_** (VI ✓)
- [ ] **dev-toolkit\_** (VI ✓)
- [ ] **hash-toolkit\_** (VI ✓)
- [ ] **homepage** (VI ✓)
- [ ] **inflation-calculator\_** (VI ✓)
- [ ] **investment-calc\_** (VI ✓)
- [ ] **json-toolkit\_** (VI ✓)
- [ ] **jwt-toolkit\_** (VI ✓)
- [ ] **loan-calculator\_** (VI ✓)
- [ ] **lorem-ipsum\_** (VI ✓)
- [ ] **lunar-calendar\_** (VI ✓)
- [ ] **password-generator\_** (VI ✓)
- [ ] **percentage-calculator\_** (VI ✓)
- [ ] **qr-generator\_** (VI ✓)
- [ ] **random-toolkit\_** (VI ✓)
- [ ] **salary-tax-master\_** (VI ✓)
- [ ] **savings-interest\_** (VI ✓)
- [ ] **text-diff\_** (VI ✓)
- [ ] **text-formatter\_** (VI ✓)
- [ ] **unit-converter\_** (VI ✓)
- [ ] **url-toolkit\_** (VI ✓)
- [ ] **uuid-generator\_** (VI ✓)
- [ ] **word-counter\_** (VI ✓)

---

## 📊 BUG STATISTICS

| Priority  | Count | %        |
| --------- | ----- | -------- |
| Critical  | 0     | 0%       |
| High      | 0     | 0%       |
| Medium    | 0     | 0%       |
| Low       | 0     | 0%       |
| **Total** | **0** | **100%** |

---

## 🎯 COMMON PATTERNS

### Form Issues

- [x] Input width too wide (Standardized to 800px)
- [x] Labels too small/muted (Standardized)
- [x] No max-width constraint (Added to global.css)
- [x] Poor spacing (Standardized with margin/padding)

### Layout Issues

- [ ] Content not centered
- [ ] Missing borders
- [ ] Inconsistent spacing
- [ ] Alignment problems

### Mobile Issues

- [ ] Horizontal scroll
- [ ] Text too small
- [ ] Buttons too small
- [ ] Poor touch targets

---

## ✅ COMPLETED FIXES

#### BMI Calculator - Console 404 Errors

**Fixed**: 2025-12-19  
**Solution**: Created `src/features/bmi/style.css` and moved inline styles.  
**Verified**: UI test passed for `/vi/bmi/`.

#### Savings Interest - Missing Translation

**Fixed**: 2025-12-19  
**Solution**: Added `reset` key to `common` translation group in both locales.  
**Verified**: Manual check of generated files.

#### Global Form Layout Standardization

**Fixed**: 12/19/2025  
**Solution**:

1. Enhanced `global.css` with a universal 800px max-width container for all tool cards (`.input-section`, `.calculator-card`, `.tool-card`, etc.).
2. Standardized `.form-group` labels (600 weight, 0.9rem) and inputs (2px borders, focus states) globally.
3. Cleaned up redundant CSS overrides in: `tax`, `compound-interest`, `loan-calculator`, `investment-calc`, `inflation-calculator`, `percentage-calculator`, `random-toolkit`, `social-insurance`, `business-tax`, `freelancer-tax`.
4. Automated UI tests now pass with 100% success rate for Vietnamese locale.
   **Verified**: Running `npm run test:ui -- --lang=vi` resulted in 27/27 pages passing.

#### Light Mode & Premium Aesthetic Polish

**Fixed**: 12/19/2025  
**Solution**:

1. **Dynamic Accents**: Replaced hardcoded cyan rgba values with dynamic `rgba(var(--primary-rgb), 0.1)` across all finance and tax tools for better contrast in Light Mode.
2. **Body Background**: Enhanced the radial gradient in `global.css` using dynamic variables for a more vibrant, premium look in light mode.
3. **Footer Structure**: Updated the footer background to `var(--bg-hover)` (soft gray) in light mode to provide better visual structure and separation.
4. **JSON Toolkit Overflow**: Optimized the tool-container and main-container max-width settings to prevent horizontal scrollbar warnings in 1400px viewports.
5. **Master Tool Translation**: Fixed a missing translation for the "Compare Salary" tab in the Salary & Tax Master tool.
   **Verified**: Running `npm run test:ui -- --lang=en --theme=light` results in 100% pass (27/27 pages).

---

## 📸 SCREENSHOT REFERENCE

All screenshots available in: `ui-test-results/screenshots/` (54 total)

---

**Last Updated**: 12/19/2025, 3:00:00 PM  
**Status**: Ready for final polish review
