# 🧪 ZTools Testing Strategy

Tài liệu này phác thảo kế hoạch triển khai hệ thống kiểm thử tự động (Testing) để đảm bảo chất lượng cho ZTools khi số lượng công cụ tăng lên.

## 1. Mục tiêu (Objectives)
- **Độ tin cậy**: Đảm bảo các công thức toán học (Thuế, Chuyển đổi đơn vị, BMI) luôn chính xác.
- **Tính toàn vẹn**: Không có lỗi dịch thuật (Missing keys) hoặc lỗi cú pháp EJS sau khi build.
- **Hiệu suất & A11y**: Duy trì điểm Lighthouse > 95 cho mọi công cụ.
- **Hồi quy (Regression)**: Đảm bảo tính năng mới không làm hỏng tính năng cũ.

---

## 2. Các loại kiểm thử (Testing Types)

### A. Build Integrity Test (Kiểm tra quá trình Build)
- **Công cụ**: Custom scripts (Node.js).
- **Nội dung**:
    - Kiểm tra mọi `tool.yaml` có đầy đủ các key bắt buộc không.
    - Kiểm tra sự tồn tại của các file asset (`style.css`, `script.js`) được khai báo trong config.
    - Đảm bảo build thành công mà không có lỗi EJS.

### B. Logic & Unit Testing (Kiểm tra thuật toán)
- **Công cụ**: `Vitest` hoặc `Node:test`.
- **Nội dung**:
    - Trích xuất logic tính toán từ `script.js` của các tool (e.g., hàm tính Thuế thu nhập, hàm đổi MB sang GB).
    - Chạy bộ dữ liệu mẫu (Test cases) để so sánh kết quả thực tế vs kết quả mong đợi.

### C. Static HTML Validation (Kiểm tra file tĩnh sau build)
- **Công cụ**: `JSDOM` + custom script.
- **Nội dung**:
    - Tìm các chuỗi placeholder chưa được dịch (e.g., `t('missing.key')`).
    - Kiểm tra cấu trúc HTML cơ bản (Có `h1`, có `meta description`, có `canonical link`).
    - Đảm bảo mọi tool đều có `version-badge` và `open-changelog`.

### D. E2E & Visual Testing (Optional - Phase 3)
- **Công cụ**: `Playwright`.
- **Nội dung**: Giả lập người dùng nhập liệu trên trình duyệt và kiểm tra kết quả hiển thị.

---

## 3. Lộ trình triển khai (Roadmap)

### Giai đoạn 1: Quick Wins (Ngay bây giờ)
- [ ] Thiết lập lệnh `npm test` chạy script kiểm tra integrity cơ bản.
- [ ] Viết script quét `dist/` để tìm các từ khóa lỗi EJS hoặc dịch thuật bị thiếu.

### Giai đoạn 2: Deep Logic (Tháng này)
- [ ] Cấu trúc lại code JS của các tool math-heavy để có thể test độc lập (Export logic).
- [ ] Cài đặt `Vitest` và viết test cases cho:
    - Personal Income Tax (Quan trọng nhất).
    - Unit Converter (Nhiều trường hợp biên).
    - Loan Calculator.

### Giai đoạn 3: Automation (Tương lai)
- [ ] Tích hợp vào CI/CD (GitHub Actions): Tự động chặn Deploy nếu Test fail.
- [ ] Tự động chạy Lighthouse audit cho mọi trang mới.

---

## 4. Cấu trúc thư mục Test dự kiến
```
tests/
├── integrity.test.js      # Kiểm tra cấu trúc project & build
├── locales.test.js        # Kiểm tra trùng lặp/thiếu key dịch
└── units/                 # Unit tests cho từng tool
    ├── tax.test.js
    ├── unit-converter.test.js
    └── ...
```
