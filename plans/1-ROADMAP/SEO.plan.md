# 📈 iZTools SEO Plan & Strategy

## 🎯 SEO Objectives

- **Primary Goal**: Rank in Top 3 for Vietnamese keywords ("tính thuế tncn", "tính bmi", "format json", "đếm từ", "tạo password").
- **Secondary Goal**: Capture long-tail traffic for technical terms in English ("json formatter", "uuid generator v7").
- **Technical Goal**: Achieve 100/100 Core Web Vitals.

---

## 🔑 Keyword Strategy (Phase 1 & 2 Tools)

### 1. Job & Income

| Tool                 | Primary Keywords (VI)                      | Primary Keywords (EN)                         | Long-tail / Questions                                                    |
| -------------------- | ------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------ |
| **Tax Calculator**   | tính thuế tncn, tính lương net gross       | pit calculator vietnam, net to gross vietnam  | lương 20 triệu đóng thuế bao nhiêu, cách tính thuế thu nhập cá nhân 2024 |
| **Business Tax**     | tính thuế tndn, thuế thu nhập doanh nghiệp | corporate tax calculator vietnam, cit vietnam | mức thuế tndn 2025, cách tính thuế tndn tạm tính                         |
| **Social Insurance** | tính bảo hiểm xã hội, tính lương hưu       | social insurance vietnam, pension calculator  | mức đóng bhxh 2025, cách tính bhxh 1 lần, lương hưu bao nhiêu            |

### 2. Daily Utilities

| Tool                | Primary Keywords (VI)          | Primary Keywords (EN)                | Long-tail / Questions                                         |
| ------------------- | ------------------------------ | ------------------------------------ | ------------------------------------------------------------- |
| **BMI Calculator**  | tính bmi, chỉ số bmi           | bmi calculator, body mass index      | bmi chuẩn cho người việt, bảng chỉ số bmi                     |
| **Loan Calculator** | tính lãi vay, tính lịch trả nợ | loan calculator, mortgage calculator | bảng tính lãi suất vay ngân hàng, vay 1 tỷ lãi suất bao nhiêu |

### 3. Text Tools

| Tool             | Primary Keywords (VI)        | Primary Keywords (EN)             | Long-tail / Questions                      |
| ---------------- | ---------------------------- | --------------------------------- | ------------------------------------------ |
| **Word Counter** | đếm từ, đếm ký tự            | word counter, character count     | kiểm tra độ dài văn bản, đếm số câu online |
| **Lorem Ipsum**  | tạo lorem ipsum, văn bản giả | lorem ipsum generator, dummy text | đoạn văn mẫu lorem ipsum, text demo        |

### 4. Developer Tools

| Tool               | Primary Keywords (VI)              | Primary Keywords (EN)                       | Long-tail / Questions                            |
| ------------------ | ---------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| **JSON Formatter** | format json, xem file json         | json formatter, json validator, json viewer | lỗi syntax error json, làm đẹp code json         |
| **UUID Generator** | tạo uuid, tạo guid                 | uuid generator, guid generator              | uuid v4 vs v7, online uuid tool                  |
| **Password Gen**   | tạo mật khẩu mạnh, random password | password generator, strong password         | tạo pass an toàn, random string generator secure |

---

## ✅ On-Page SEO Checklist (Implementation Status)

- [x] **Dynamic Title Tags:** implemented via `index.ejs` title blocks.
- [x] **Meta Descriptions:** Implemented via locales (`meta.description` or tool descriptions).
- [x] **H1 Hierarchy:** Each tool has exactly one H1 tag.
- [x] **Internal Linking:** Homepage links to all tools; Breadcrumbs or "Related Tools" (TODO).
- [ ] **Schema Markup:** Need to add `SoftwareApplication` or `WebApplication` schema to each tool page.
- [x] **Canonical Tags:** Not explicitly set yet, relying on Clean URLs. **Action Required**: Add `<link rel="canonical">` to `layout.ejs`.
- [ ] **Open Graph / Twitter Cards:** Basic meta tags present? Need verification.

---

## 🛠️ Technical SEO

### 1. URL Structure

- **Format**: `/{locale}/{tool-name}/` (e.g., `/vi/tax/`, `/en/bmi/`)
- **Status**: ✅ Implemented (Clean URLs).
- **Trailing Slash**: Consistent trailing slash recommended.

### 2. Sitemap & Robots

- **Sitemap.xml**: Auto-generated? currently `copyRootFiles` copies a static one?
  - **Action**: Need a dynamic sitemap generator in `build.js` that lists all tool URLs for both locales.
- **Robots.txt**: Standard allow all.

### 3. Performance (Core Web Vitals)

- **CSS**: Minified ✅.
- **JS**: Minified/Obfuscated ✅.
- **Images**: Using SVG/Emoji mostly ✅.
- **CLS**: Static dimensions for calculators to prevent shifts ✅.

---

## 📅 Action Plan (Next Steps)

1.  **Generate Dynamic Sitemap**: Update `build.js` to generate `sitemap.xml` based on active pages.
2.  **Add Canonical Tags**: Update `layout.ejs`.
3.  **Add Schema Markup**: Create a helper `generateSchema(tool)` to inject JSON-LD into `layout.ejs`.
4.  **Content Enrichment**: Add 300-500 words of "Product Description" below each calculator (as done for Business Tax/Social Insurance).
    - Current status: Tax/BMI/Loan/JSON/Word/Lorem/Pass/UUID have basic headers. Need "How to use", "FAQ" sections.

---

**Last Updated**: 2025-12-16
**Version**: 1.0
