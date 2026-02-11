# 🔥 Immediate Actions - Priority Queue

**Created**: 2025-12-23
**Status**: ACTIVE
**Current Version**: v1.5.0

---

## 🚨 CRITICAL BUGS (Fix Now)

_No critical bugs currently identified._

---

## 🎯 HIGH PRIORITY (This Week)

### 0. **Adaptive Persona Hub & Cache Busting** (NEW)

- [ ] **Cache Busting**: Implement version+hash asset loading in `pages.js`.
- [ ] **Persona System**: Create `persona.js` state management.
- [ ] **UI Switcher**: Add identity selector to Header.
- [ ] **Metadata**: Map all 42 tools to Persona categories.
- [ ] **Smart Sort**: Update homepage to filter by Persona.

### 1. **Testing Infrastructure & DX Core** (Completed)

**Ref**: `bin/iZTools.js`, `DEVELOPMENT.md`
**Priority**: HIGH - Prevent regressions & Speed up scaffolding

- [x] Create `tests/integrity.test.js` (Check if broken logic is fixed)
- [x] Create `tests/locales.test.js` (Verify missing keys again)
- [x] Implement `npm test` command
- [x] **iZTools CLI**: Implement `iZTools status`, `analyze`, `cleanup`, `version`, and `tool:create` scaffolding.
- [x] **Framework Portability**: Standardized `bin/` structure for easier core migration.

### 2. **SEO Enhancements - Schema & Content**

**Ref**: `plans/in-progress/SEO.plan.md`

- [x] Add Schema.org markup (SoftwareApplication) to top 10 tools
- [x] Verify Open Graph images for shared links
- [x] Enrich content for: Tax Calculator, BMI, Loan Calculator

### 3. **User Mode System - Deep Integration**

**Ref**: `plans/intend/STRATEGIC_NOTES.md`

- [x] Mega Menu badges (Beta/Hot) - **Completed v1.5.0**
- [x] UI Standardization (Sparkles Icon, Layouts) - **Completed v1.5.1**
- [x] Bookmark Creator Polish (Masonry, Toggles) - **Completed v1.5.1**
- [x] Add mode toggle logic to individual tools (Standard vs Advanced)
- [x] Implement filtered view in Homepage based on mode

---

## � MEDIUM PRIORITY (Next Sprint)

### 4. **Web Playground Content Expansion**

- [x] IDE Master Toolbar - **Completed v1.5.0**
- [x] Advanced Todo Master - **Completed v1.5.0**
- [x] Add "Mindmap Creator" example (LR Layout + Curly Lines) - **v1.5.1**
- [x] Add "Chart Visualizer" example (Chart.js Integration) - **v1.5.1**

### 5. **Theme System Polish**

- [ ] Refine Dark Mode colors for better contrast
- [ ] Standardize consistent spacing variables
- [ ] **Advanced Theme System**: Detailed plan in `plans/2-STRATEGY/STRATEGIC_NOTES.md#3`

### 6. **User Workspace & Core Features (iZTools v1.6.0)**

- [x] **Favorite Tools**: Add "Star" button to tools. Persisted in `localStorage`.
- [x] **Recently Used**: Track tool usage and display on homepage.
- [x] **Tool Breadcrumbs**: Add "Home > Category > Tool" links inside pages.
- [x] **Blog-Playground Sync**: Linking technical blog posts to interactive demos.
- [x] **Tool Request**: Add "Request a Tool" form to Footer/Header.
- [ ] **Result Sharing**: Create secret link for tool results (JSON/Tax).
- [ ] **PWA Install**: Add "Install App" popup for Mobile browsers.

### 7. **Tool Expansion Roadmap**

- [ ] **Dev Tools**: Add URL Encoder/Decoder, Base64 Converter.
- [ ] **Image Tools**: Add "Convert WebP to PNG/JPG" simple tool.
- [ ] **PDF Tools**: Basic PDF Split/Merge tool intro.

---

## 🔄 CONTINUOUS TASKS

- [ ] Check new tools against "SEO Checklist" before release
- [ ] Verify translation keys for every new feature

---

## 📊 Success Metrics

### Current Status (2025-12-23)

- **Active Tools**: 42/334 (12%)
- **Lighthouse**: ~95 (Need re-check after UI updates)
- **Framework Health**: 100% (Verfied via `iZTools status`)
- **Test Coverage**: ~35% (Automated integrity & locale checks + 21 feature tests)
- **Translation Coverage**: 100% (Atomic YAML system in place)

### Targets (End of Month)

- **Active Tools**: 45/334
- **Test Coverage**: 30% Automated
- **User Mode**: Fully functional

---

_Last Updated: 2025-12-23_
