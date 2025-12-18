# In-Progress: Phase 2 & Deployment Optimization

**Current Status**: 🚀 Phase 2 (Quick Wins) In Progress

## ♿ Next Milestone: Accessibility Refactor
- [x] **Accessibility Score**: Nâng cấp từ 88 lên 95+ (Lighthouse đạt 100 on Home).
- [x] **Fix Aria-labels**: Đảm bảo mọi icon/nút đều có mô tả.
- [x] **Contrast Check**: Tăng độ tương phản cho text muted.

## 🛠️ Phase 2: Quick Wins (Ưu tiên cao - 3 tháng)

**Priority 1 - Text Tools** (20 tools)
- [x] Character Counter, Sentence Counter... (Done via `word-counter`)
- [x] Text Diff Checker (Done via `text-diff`)

**Priority 2 - Conversion Tools** (15 tools)
- [x] Unit Converters (Done)
- [x] Timestamp, URL Encoder/Decoder (Done via `timestamp-converter`, `url-toolkit`)
- [x] Random Number/String (Done via `random-toolkit`)

## 🚀 Deployment & Security (Active)
- [x] **2-Repo Separation**: Source private, Dist public.
- [x] **Robust Deploy Script**: CLI support & URL auto-detection.
- [x] **Automated Testing**:
    - [x] Implement build integrity tests (YAML, build output).
    - [x] Implement unit tests for core logic (75+ tests across 19 core features: Tax, BMI, Loan, Word, Unit, Compound Interest, Savings, Percentage, Social Insurance, Text Formatter, Lunar Calendar, Password Gen, Timestamp, URL, JSON, Lorem Ipsum, Random, UUID, Business Tax).
    - [x] Document testing strategy in `plans/testing.md` and `DEVELOPMENT.md`.

## 🎨 UI/UX Guidelines (Active)
- [ ] Minimalist interfaces
- [ ] WCAG 2.1 AA compliance
- [ ] Load Time < 0.5s
