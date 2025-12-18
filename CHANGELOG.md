# Changelog

Tất cả các thay đổi quan trọng đối với dự án **ZTools** sẽ được ghi lại trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
và dự án này tuân thủ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-18

### Added
- **Text Formatter**: Thiết kế lại hoàn toàn giao diện theo phong cách Modern Side-by-Side (2 cột).
- **Text Formatter**: Bổ sung tính năng tự động định dạng (auto-format) khi thay đổi tùy chọn hoặc dán văn bản.
- **Text Formatter**: Hiển thị thống kê ký tự thời gian thực (stats) và hiệu quả giảm dung lượng.
- **Lunar Calendar**: Tích hợp thuật toán Hồ Ngọc Đức chuẩn xác cho Lịch Việt Nam.
- **UI/UX**: Tự động đồng bộ Sub-logo (tên danh mục) trên header cho tất cả các công cụ.

### Fixed
- **Build System**: Sửa lỗi "Unexpected token <" do cơ chế fallback của server trả về HTML thay vì JS.
- **PWA**: Sửa lỗi cú pháp trong `manifest.json` và `sw.js` (xử lý xuống dòng và mã hóa SVG).
- **Service Worker**: Nâng cấp lên v7 để ép buộc làm mới bộ nhớ đệm (cache), khắc phục các file hỏng.
- **Sunday Coloring**: Sửa lỗi màu đỏ cho Chủ Nhật trong Lịch Âm Dương.

### Changed
- Cải thiện hiệu suất build khi xử lý các file assets lớn.
- Tối ưu hóa giao diện Dark Mode cho các công cụ mới.

---

## [1.0.0] - 2025-12-12

### Added
- Khởi tạo dự án ZTools với các công cụ cơ bản: Tính thuế TNCN, BMI, JSON Toolkit, Loan Calculator.
- Hệ thống đa ngôn ngữ (i18n) Việt/Anh.
- Hỗ trợ PWA (Progressive Web App).
- Hệ thống build SSG (Static Site Generation) tùy chỉnh.
