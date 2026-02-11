# iZTools.site - Project Master Plan

## 📊 Đánh giá hiện trạng (Audit)

### ✅ Ưu điểm (The Good)

- **Kiến trúc Modular:** Mỗi tool là một feature riêng biệt trong `src/features/`, dễ dàng scale và bảo trì.
- **Hệ thống Subdomain:** Phân tách các tool "Pro" (Playground, Tax, Compound Interest...) vào các chuyên trang giúp SEO tốt và thương hiệu chuyên nghiệp.
- **Build Engine Tinh gọn:** `aztomiq.js` xử lý obfuscate, render EJS và asset build rất nhanh mà không cần framework nặng nề.
- **Cá nhân hóa:** Hỗ trợ Persona, User Mode và Favorites/Recent hoạt động mượt mà ở phía Client.

### ❌ Hạn chế (The Bad)

- **Xung đột Link/Routing:** Logic xử lý link đôi khi bị chồng chéo giữa EJS (Build-time) và JS (Runtime), dễ gây lỗi redirect hoặc domain sai.
- **Cấu hình Manual:** `vercel.json` đang phải cấu hình thủ công từng subdomain, dễ sai sót khi số lượng tool tăng lên.
- **Thiếu Unit Test:** Các tool tính toán tài chính/kỹ thuật chưa có bộ test tự động để đảm bảo tính chính xác của logic.
- **UX Consistency:** Padding và style giữa các tool đôi khi chưa đồng nhất 100%.

---

## 🚀 Lộ trình phát triển (Master Plan)

### Giai đoạn 1: Gia cố & Tự động hóa (Stability) - PASSED ✅

- [x] **Unit Testing (High Priority):** Triển khai hệ thống test cho các tool tính toán (Xem chi tiết tại [ai/UNIT_TEST_PLAN.md](UNIT_TEST_PLAN.md)).
- [x] **Auto-generate Vercel Config:** Viết script tự động tạo `vercel.json` từ `subdomains.yaml`.
- [ ] **Unified Link Resolver:** Xây dựng một hàm xử lý URL duy nhất dùng chung cho cả EJS và JS để triệt tiêu lỗi domain.
- [ ] **Design System:** Chuẩn hóa các component UI (Card, Badge, Button) thành thư viện dùng chung.
- [ ] **Audit & Refactor:** Rà soát lại toàn bộ domain trong codebase để loại bỏ các hard-coded link.

### Giai đoạn 2: Trải nghiệm & Thương hiệu (Apple-style Redesign) - ACTIVE 🔥

- [ ] **Hero Section (Storytelling):** Triển khai giao diện tập trung vào Typography và triết lý tối giản.
- [ ] **Product Narrative Scroll:** Xây dựng các màn hình scroll-driven cho 5 công cụ trọng tâm (Playground, Lãi kép, JSON, Âm lịch, Thuế).
- [ ] **Interactive Mockups:** Code các micro-animations cho từng tool nổi bật trên Home page.
- [ ] **Smart Global Search:** Tích hợp Fuzzy Search mượt mà vào Hero Section.
- [ ] **Sleek Footer & Closing:** Hoàn thiện trải nghiệm "Premium closing" cho trang chủ.

### Giai đoạn 3: Nâng tầm tính năng (Advanced Features)

- [ ] **iZTools API Layer:** Hỗ trợ dữ liệu thời gian thực (tỷ giá, giá vàng, crypto) qua Vercel Functions.
- [ ] **Offline Mode (PWA):** Tối ưu `sw.js` để hỗ trợ sử dụng tool khi không có kết nối mạng.

### Giai đoạn 4: Hệ sinh thái & Cộng đồng (Expansion)

- [ ] **User Auth & Sync:** Cho phép đăng nhập để đồng bộ Favorites/Recent qua các thiết bị.
- [ ] **Contributor Framework:** Tạo tài liệu và template chuẩn để cộng đồng có thể đóng góp tool mới.

---

## 🛠 Active Tasks

- [x] **Unit Testing:** Triển khai hệ thống test cho 15+ tool tính toán trọng điểm.
- [x] **Auto-generate Vercel Config:** Tự động hóa cấu hình deployment.
- [ ] **Home Page Redesign:** Triển khai Apple-style UI Storytelling.
  - [ ] Section 1: Hero & Search (Minimalism)
  - [ ] Section 2: Narrative Scroll (01 - 05)
  - [ ] Section 3: The All-Tools Power Grid
