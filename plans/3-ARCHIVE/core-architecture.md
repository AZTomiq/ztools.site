# Philosophy & Architecture (Core)

## 🎯 Triết lý & Mục tiêu (Core Philosophy)

*   **Vision**: "Your Digital Toolbox, Simplified" - Bộ công cụ số hoàn chỉnh nhất cho người Việt
*   **Mục tiêu**: Xây dựng bộ công cụ **Best-in-class**, tối ưu SEO và UX/UI (Web Vitals xanh lè)
*   **Chiến lược**: **Build-time Assembly** (Ghép HTML lúc build) để đảm bảo SEO & Performance
*   **Core Values**:
    *   **Minimal Cost**: Vận hành 0đ
    *   **Privacy First**: Xử lý 100% Client-side
    *   **Polish UI**: Giao diện sạch, đẹp, không quảng cáo rác
    *   **Comprehensive**: Đầy đủ công cụ từ A-Z

## 🏗️ Kiến trúc Kỹ thuật (Technical Architecture)

*   **Mô hình**: Custom SSG (Static Site Generator) siêu nhẹ
*   **Tech Stack**: Node.js Script + EJS Template + Vanilla JS/CSS3
*   **Cấu trúc thư mục**:
    ```text
    /src
    ├── /includes      # Components (Header, Footer, Head)
    ├── /pages         # Nội dung từng trang (index.ejs)
    ├── /assets        # JS, CSS, Images
    └── /locales       # i18n (vi.json, en.json)
    ```
*   **Build Process**: `npm run build` → Ghép template → Output `/dist` (HTML tĩnh)
*   **Deployment**: **Source-Dist Separation** (2-Repo)
    *   Repo Source (Private): Chứa toàn bộ logic build, source code, data.
    *   Repo Dist (Public): Chỉ chứa thành phẩm đã minify/obfuscate trong `/dist`.
    *   Automation: `deploy.js` tự động hóa việc đẩy code sang repo public.

## 🌐 Chiến lược Domain & SEO

*   **Domain**: 1 Domain chính (Authority Brand)
*   **URL Structure**: Clean URLs `/vi/tool-slug/` và `/en/tool-slug/`
*   **SEO**: Auto-gen Sitemap, Canonical tags, Structured Data (JSON-LD)
*   **Default Language**: Vietnamese (vi) - Phục vụ thị trường Việt Nam
