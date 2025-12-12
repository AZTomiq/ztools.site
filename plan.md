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

## 4. Danh sách Công cụ (Roadmap)
Dựa trên nhu cầu thị trường Việt Nam và cộng đồng Dev.

### Phase 1: The Foundation (Nền móng & Core Tools)
*Mục tiêu: Hoàn thiện kiến trúc SSG và ra mắt 3 tool flagship.*
1.  **System**: Setup SSG script, Global CSS (Dark mode), Header/Footer.
2.  **Tool 1: Tính thuế TNCN Pro 2025** (Tài chính - *High Traffic*)
    *   Gồm: Tính xuôi (Gross->Net), Tính ngược (Net->Gross), Biểu đồ dòng tiền, So sánh lương.
3.  **Tool 2: JSON Kitchen** (Dev Tool - *Sticky*)
    *   Gồm: Format, Validate, **JSON to Types (TS, Go, Java, Dart)**.
4.  **Tool 3: BMI & Calo Tracker** (Sức khỏe - *General User*)
    *   Gồm: Tính BMI chuẩn WHO/IDI, gợi ý cân nặng, BMR/TDEE calculator.

### Phase 2: Expansion (Mở rộng hệ sinh thái)
*Mục tiêu: Đa dạng hóa tool để kéo organic traffic từ nhiều ngách.*
1.  **Nhóm Tài chính**:
    *   **Tính Lãi vay (Mortgage)**: Bảng dòng tiền trả nợ (Dư nợ giảm dần vs Đều hàng tháng).
    *   **Tính BHXH (1 lần & Lương hưu)**: Công cụ dự báo dòng tiền hưu trí.
2.  **Nhóm Dev Utilities**:
    *   **UUID/ObjectId Generator**: Tạo ID số lượng lớn.
    *   **Base64 Encoder/Decoder**: Xử lý file/text.
    *   **Unix Timestamp**: Converter & Countdown.
    *   **SQL Formatter**: Làm đẹp câu lệnh SQL.
    *   **Regex Tester**: Test & giải thích Regex pattern.
3.  **Nhóm Tiện ích**:
    *   **QR Code Generator**: Tạo QR có logo, màu sắc, WiFi QR.
    *   **Đọc số thành chữ**: Hỗ trợ tiền tệ Việt Nam.

### Phase 3: Advanced & Polish (Nâng cao)
*Mục tiêu: Các tool xử lý file nặng hoặc tính năng phức tạp.*
1.  **Image Tools (Client-side WASM)**:
    *   Compress Image (JPG/PNG/WebP).
    *   Resize/Crop Image.
    *   Convert PDF to Image.
2.  **Security Tools**:
    *   **Password Generator**: Tạo pass mạnh.
    *   **Hash Generator**: MD5, SHA-1, SHA-256 (Local only).
3.  **Global Features**:
    *   Đa ngôn ngữ (i18n) cho các tool Dev (English/Vietnamese).
    *   PWA (Installable App).

## 5. Quy trình Triển khai (Action Plan)
1.  **Setup Framework (Ngay bây giờ)**:
    *   `npm init` & cài dependency (`ejs`, `fs-extra`).
    *   Viết `build.js`.
    *   Tạo layout base (`header`, `footer`).
2.  **Migrate "Thuế TNCN"**:
    *   Chuyển code từ `/tax` hiện tại vào cấu trúc `/src/pages/tax`.
    *   Refactor CSS/JS để tách biệt.
3.  **Develop New Tools**:
    *   Code JSON Kitchen & BMI theo tiến độ Phase 1.
4.  **Launch**:
    *   Deploy lên Production.
    *   Test Performance (Lighthouse).

## 6. Cam kết Chất lượng
*   **Performance**: Load < 0.5s.
*   **SEO**: 100 on PageSpeed.
*   **Zero-CLS**: Không nhảy layout.