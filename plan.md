# Kế hoạch Phát triển Hệ thống Multi-Tool (ZTools) - Final Version

## 1. Triết lý & Mục tiêu (Core Philosophy)
*   **Mục tiêu**: Xây dựng bộ công cụ **Chất lượng tốt nhất (Best-in-class)**, tối ưu SEO và UX/UI (Web Vitals xanh lè).
*   **Chiến lược**: **Build-time Assembly** (Ghép HTML lúc build) để đảm bảo SEO & Performance.
*   **Core Values**:
    *   **Minimal Cost**: Vận hành 0đ.
    *   **Privacy First**: Xử lý 100% Client-side.
    *   **Polish UI**: Giao diện sạch, đẹp, không quảng cáo rác.

## 2. Kiến trúc Kỹ thuật (Technical Architecture)
*   **Mô hình**: Custom SSG (Static Site Generator) siêu nhẹ.
*   **Tech Stack**: Node.js Script + EJS Template + Vanilla JS/CSS3.
*   **Cấu trúc thư mục (Source)**:
    ```text
    /src
    ├── /includes      # Components (Header, Footer, Head)
    ├── /pages         # Nội dung từng trang (index.ejs)
    └── /assets        # JS, CSS, Images
    ```
*   **Build Process**: `npm run build` -> Ghép template -> Output ra thư mục `/dist` (HTML tĩnh hoàn toàn).

## 3. Chiến lược Domain & SEO
*   **Domain**: 1 Domain chính (Authority Brand). URL dạng sạch `/tool-slug`.
*   **SEO**: Auto-gen Sitemap, Canonical tags, Structured Data (JSON-LD).

## 4. Hệ sinh thái Công cụ (Roadmap)
Chiến lược phát triển theo hướng phục vụ nhu cầu thực tế tại **Việt Nam** và **Cộng đồng Developer**.

### Group 1: Tiền / Thuế / Lương (Job & Income)
*Phục vụ người đi làm, nhân sự, kế toán.*
- [x] **Tính thuế TNCN 2025/2026**:
    - [x] Tính xuôi (Gross → Net) & Tính ngược (Net → Gross).
    - [x] So sánh Luật 2025 vs Nghị quyết 110/2025.
    - [x] Biểu đồ dòng tiền & So sánh lương.
- [ ] **Tính thuế TNDN** (Thu nhập doanh nghiệp).
- [ ] **Tính BHXH & Hưu trí**:
    - [ ] BHXH bắt buộc vs Tự nguyện.
    - [ ] Dự tính lương hưu / BHXH 1 lần.
- [ ] **Tiện ích Lương thưởng**:
    - [ ] Tính tiền tăng ca (OT).
    - [ ] Tính KPI, Thưởng Tết, Lương tháng 13.

### Group 2: Tài chính & Ngân hàng (Finance)
*Evergreen traffic - Luôn có nhu cầu tìm kiếm.*
- [ ] **Tính lãi vay (Mortgage)**: Mua nhà/xe, dư nợ giảm dần vs đều.
- [ ] **Tính lãi kép (Compound Interest)**: Sức mạnh của tích lũy.
- [ ] **Lãi suất tiết kiệm**: So sánh/Tính toán gửi tiết kiệm.
- [ ] **Tỷ giá & Tín dụng**:
    - [ ] Chuyển đổi tiền tệ (Currency Converter).
    - [ ] Tính hạn mức / Trả góp thẻ tín dụng.

### Group 3: Tiện ích đời sống & Media (Daily Utilities)
*Công cụ xử lý nhanh file và dữ liệu thường ngày.*
- [x] **Sức khỏe**: BMI & Calo Tracker (Chuẩn IDI/WPRO cho người Việt).
- [ ] **Xử lý PDF/Văn bản**:
    - [ ] PDF to Word (Client-side/Serverless).
    - [ ] Đọc số thành chữ (Tiền Việt Nam).
- [ ] **Xử lý Ảnh (Client-side WASM)**:
    - [ ] Nén ảnh, Resize, Crop.
    - [ ] Ghép ảnh online.
- [ ] **Mã hóa & QR**:
    - [ ] QR Code Generator (WiFi, Contact, Styled).
    - [ ] AES/Hash (MD5, SHA) Simple Tool.

### Group 4: Dev Tools (For Developers)
*Traffic chất lượng cao, user trung thành.*
- [x] **JSON Toolkit**:
    - [x] Formatter / Validator / Minify.
    - [x] JSON to Types (TypeScript, Go, Java, Dart, Python).
- [ ] **Encoder / Decoder**:
    - [ ] Base64 Support Files/Text.
    - [ ] JWT Debugger / Decode.
- [ ] **Generators**:
    - [ ] UUID / ObjectId / Random String.
    - [ ] CURL to Code (Fetch/Axios/Python).
- [ ] **Testers & Formatters**:
    - [ ] Regex Tester.
    - [ ] SQL Formatter.
    - [ ] Cron Expression Tester.
    - [ ] Unix Timestamp Converter.

### Phase 4: Content & Trust (SEO & AdSense Optimization)
*Mục tiêu: Tối ưu nội dung để được Google Index tốt hơn và duyệt AdSense.*
1.  **Tool Content Enrichment**:
    *   Bổ sung 3 section bắt buộc cho mỗi tool:
        - [ ] **Mô tả (Description)**: Giới thiệu tool là gì, tại sao cần dùng.
        - [ ] **Hướng dẫn sử dụng (How-to)**: Các bước thực hiện.
        - [ ] **FAQ**: Câu hỏi thường gặp.
2.  **Essential Trust Pages**:
    - [ ] **Privacy Policy**: Chính sách bảo mật (Cookie, Local Storage).
    - [ ] **Terms of Service**: Điều khoản sử dụng.
    - [ ] **About / Contact**: Giới thiệu team & liên hệ.

## 5. Quy trình Triển khai (Action Plan)
1.  **Setup Framework (Ngay bây giờ)**:
    - [x] `npm init` & cài dependency (`ejs`, `fs-extra`).
    - [x] Viết `build.js`.
    - [x] Tạo layout base (`header`, `footer`).
2.  **Migrate "Thuế TNCN"**:
    - [x] Chuyển code từ `/tax` hiện tại vào cấu trúc `/src/pages/tax`.
    - [x] Refactor CSS/JS để tách biệt.
3.  **Develop New Tools**:
    - [x] Code JSON Kitchen & BMI theo tiến độ Phase 1.
4.  **Launch**:
    - [ ] Deploy lên Production.
    - [ ] Test Performance (Lighthouse).
5.  **Maintenance & Bug Fixes**:
    - [x] Fix i18n redirect issue (keep relative path).

## 6. Cam kết Chất lượng
*   **Performance**: Load < 0.5s.
*   **SEO**: 100 on PageSpeed.
*   **Zero-CLS**: Không nhảy layout.