# 🔥 Immediate Actions - Priority Queue

**Created**: 2025-12-19  
**Status**: URGENT - Blocking Issues

---

## 🚨 CRITICAL BUGS (Fix Now - Blocking Production)

### 1. **Master Tools Missing Translations** ✅ FIXED
**Severity**: HIGH - Tools are broken in production  
**Affected**: 
- `salary-tax-master` ✅
- `date-time-master` ✅

**Issue**: Both master tools use translation keys (`salaryTaxMaster.*`, `dateTimeMaster.*`) but these keys don't exist in `/src/locales/vi/common.json` or `/src/locales/en/common.json`.

**Status**: ✅ **COMPLETED** - 2025-12-19
- [x] Created translation entries for `salaryTaxMaster` in both `vi` and `en` locales
- [x] Created translation entries for `dateTimeMaster` in both `vi` and `en` locales
- [x] Tested both tools to ensure all text renders correctly
- [x] Verified menu items, tab labels, form labels, and result text

**Report**: See `plans/done/master-tools-translation-fix.md`

**Minor Issues Remaining** (Low priority):
- Tool titles in navigation menu still show English on Vietnamese pages (cosmetic)
- Sidebar menu items use shortened versions (acceptable for space constraints)

---

## 🎯 HIGH PRIORITY (This Week)

### 2. **Complete Phase 2 - Cron Expression Parser**
**Status**: Tool exists but needs verification  
**Action**:
- [ ] Test `cron-parser` functionality
- [ ] Verify translations are complete
- [ ] Check UI/UX quality
- [ ] Mark Phase 2 as complete in `phase-2.md`

**Estimated Time**: 2-3 hours

---

### 3. **Testing Infrastructure Setup**
**Ref**: `plans/in-progress/testing.md`  
**Priority**: HIGH - Prevent future bugs

**Phase 1 Actions**:
- [ ] Create `npm test` command in `package.json`
- [ ] Write script to scan `dist/` for:
  - Missing translation keys (regex: `t\('[\w.]+'\)`)
  - EJS syntax errors
  - Broken links
- [ ] Create `tests/integrity.test.js`
- [ ] Create `tests/locales.test.js` to check for missing keys

**Phase 2 Actions**:
- [ ] Install Vitest: `npm install -D vitest`
- [ ] Extract testable logic from tools:
  - `tax/script.js` → `tax/logic.js` (export functions)
  - `unit-converter/script.js` → `unit-converter/logic.js`
  - `loan-calculator/script.js` → `loan-calculator/logic.js`
- [ ] Write unit tests:
  - `tests/units/tax.test.js`
  - `tests/units/unit-converter.test.js`
  - `tests/units/loan.test.js`

**Estimated Time**: 1 week

---

## 📈 MEDIUM PRIORITY (Next 2 Weeks)

### 4. **SEO Enhancements**
**Ref**: `plans/in-progress/SEO.plan.md`

**Missing Items**:
- [ ] Add Schema.org markup (SoftwareApplication) to all tools
- [ ] Verify Open Graph & Twitter Cards are working
- [ ] Add "Related Tools" section for internal linking
- [ ] Content enrichment for top 10 tools (300-500 words each):
  - Tax Calculator
  - BMI Calculator
  - Loan Calculator
  - JSON Formatter
  - Word Counter
  - UUID Generator
  - Password Generator
  - Unit Converter
  - Lunar Calendar
  - Timestamp Converter

**Estimated Time**: 1-2 weeks

---

### 5. **Strategic Features - User Mode System**
**Ref**: `plans/intend/STRATEGIC_NOTES.md`

**Design Phase**:
- [ ] Create mockup for Normal/Expert mode toggle
- [ ] Design user preference UI (settings panel)
- [ ] Plan routing logic (how to handle mode switching)
- [ ] Document migration strategy for existing users

**Implementation Phase** (After design approval):
- [ ] Add mode toggle to header
- [ ] Implement localStorage persistence
- [ ] Create routing logic
- [ ] Add "Switch mode" banners in tools
- [ ] Update documentation

**Estimated Time**: 2-3 weeks

---

## 📋 BACKLOG (Future Sprints)

### 6. **Theme System Phase 1**
**Ref**: `plans/intend/STRATEGIC_NOTES.md` - Lines 105-191

- [ ] Refactor CSS to use CSS custom properties
- [ ] Create theme configuration system
- [ ] Design 3-5 preset themes
- [ ] Implement theme switcher UI

**Estimated Time**: 3-4 weeks

---

### 7. **Phase 3 - Image & PDF Tools**
**Ref**: `plans/in-progress/phase-2.md` - Lines 43-46

- [ ] Image Compressor (Client-side)
- [ ] Image Resizer / Format Converter
- [ ] PDF Viewer & Basic Metadata Editor

**Estimated Time**: 1-2 months

---

## 🔄 CONTINUOUS TASKS

### 8. **SEO as Continuous Practice**
**Ref**: `plans/intend/STRATEGIC_NOTES.md` - Lines 50-102

For **every new tool or update**:
- [ ] Title tag optimized (50-60 chars)
- [ ] Meta description (150-160 chars)
- [ ] H1 tag present
- [ ] Alt text for images
- [ ] Internal links to related tools
- [ ] Schema.org markup
- [ ] Lighthouse score > 90

---

## 📊 Success Metrics

### Current Status (2025-12-19)
- **Active Tools**: 35/334 (10.5%)
- **Lighthouse**: 99/100/100/100 ✅
- **Test Coverage**: 0% ❌
- **SEO Schema**: 0% ❌
- **Translation Coverage**: ~95% (2 master tools broken)

### Targets (End of Month)
- **Active Tools**: 40/334 (12%)
- **Test Coverage**: 50% for core logic
- **SEO Schema**: 100% for all active tools
- **Translation Coverage**: 100%
- **User Mode System**: Design complete

---

## 🎯 THIS WEEK ACTION PLAN

### Day 1-2 (Today & Tomorrow)
1. ✅ Fix master tools translations (CRITICAL)
2. ✅ Test and verify cron-parser
3. ✅ Update `phase-2.md` to mark Phase 2 complete

### Day 3-4
1. Setup testing infrastructure (Phase 1)
2. Write integrity tests
3. Run tests and fix any issues found

### Day 5-7
1. Add Schema.org markup to all tools
2. Start content enrichment for top 5 tools
3. Begin User Mode System design

---

**Last Updated**: 2025-12-19  
**Next Review**: 2025-12-20
