# Changelog

Tất cả các thay đổi quan trọng đối với dự án **ZTools** sẽ được ghi lại trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
và dự án này tuân thủ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.1] - 2025-12-22

### Changed 🇻🇳

- **Mega Menu UX**: Chuyển đổi sang layout dạng Masonry (CSS Columns) giúp các nhóm công cụ xếp gọn gàng, loại bỏ khoảng trắng thừa.
- **Brand Identity**: Logo mới thiết kế theo phong cách Minimalism (Rounded Square + Gradient), đồng bộ Favorites Icon và Header.
- **Visual Consistency**: Thay thế badge "HOT" bằng icon **Sparkles** (✨) trên toàn hệ thống (Home, Mega Menu, Categories, Bookmark Creator) để tinh tế hơn.
- **Bookmark Creator**: Cải tiến giao diện chọn công cụ (Masonry Layout), gộp nút chọn/bỏ chọn, và tối ưu hóa toolbar.
- **Sidebar Navigation**: Menu bên trái tự động mở rộng khi hover, tối ưu không gian hiển thị cho màn hình nhỏ.
- **Web Playground**: Cập nhật icon thành `code-2` để phù hợp với ngữ cảnh lập trình.

### Changed 🇺🇸

- **Mega Menu UX**: Switched to Masonry layout (CSS Columns) for better tool grouping and whitespace optimization.
- **Brand Identity**: New Minimalist Logo (Rounded Square + Gradient), unified across Favicon and Header.
- **Visual Consistency**: Replaced "HOT" badge with **Sparkles** icon (✨) systematically across Home, Menu, Categories, and Bookmark Creator.
- **Bookmark Creator**: Enhanced selection UI (Masonry Layout), unified toggle buttons, and optimized bulk action toolbar.
- **Sidebar Navigation**: Left menu auto-expands on hover, optimizing display space for smaller screens.
- **Web Playground**: Updated icon to `code-2` to better reflect coding context.

## [1.5.0] - 2025-12-23

### Added

- **Web Playground IDE Master Toolbar**: Tối ưu hóa không gian hiển thị code với thanh công cụ siêu mỏng (45px), tích hợp menu điều hướng và công cụ tìm kiếm toàn cục.
- **Advanced Todo Master**: Nâng cấp ví dụ Todo List thành ứng dụng quản lý tác vụ chuyên nghiệp với tính năng lọc (Filter), thống kê (Stats) và lưu trữ dữ liệu (Persistence).
- **Changelog Page**: Trang theo dõi lịch sử cập nhật công khai cho người dùng.

### Changed

- **Blog UI**: Nút "More stories" được thiết kế lại với icon và hiệu ứng hover hiện đại.
- **Search Box**: Cải thiện căn chỉnh và hiển thị của ô tìm kiếm trong chế độ Compact (Playground).
- **Header**: Tối ưu hóa việc hiển thị header mặc định (ẩn đi khi vào chế độ Playground IDE).

## [1.4.0] - 2025-12-22

### Added

- **Web Playground IDE**: Nâng cấp toàn diện giao diện Playground thành một IDE thực thụ với chế độ tràn màn hình (Immersive Mode).
- **Resizing system**: Hỗ trợ kéo dãn linh hoạt giữa các cột code (HTML | JS | CSS) và khu vực kết quả (Preview).
- **Modular Examples**: Hệ thống ví dụ code được cấu trúc lại theo từng folder độc lập, tự động đóng gói khi build.
- **Premium Examples**: Bổ sung các ví dụ "vọc" code đỉnh cao: Visualize B-Tree (Cây nhị phân), Mindmap Maker (Sơ đồ tư duy), World Clock và Premium Glassmorphism.
- **Stateful Sharing**: Link chia sẻ (Share URL) giờ đây lưu giữ chính xác trạng thái đóng/mở của từng Pane code.

### Changed

- **UI UX**: Thay thế checkbox Auto-run bằng nút Toggle Switch chuẩn iOS sang trọng.
- **Pane Order**: Sắp xếp lại thứ tự ưu tiên các Pane thành HTML | JS | CSS phù hợp với quy trình làm việc chuẩn.
- **Full-screen Preview**: Nút thu phóng kết quả cho phép xem sản phẩm 100% diện tích màn hình.

## [1.3.0] - 2025-12-22

### Added

- **JSON Toolkit UI Refactor**: Tách tab Thông minh (Format, Convert, Tools dashboard) giúp quản lý hàng chục sub-tools một cách khoa học.
- **JSON Tree View**: Tích hợp trình xem dữ liệu dạng cây (interactive tree) hỗ trợ expand/collapse, tìm đường dẫn (path) và copy nhanh.
- **Advanced Tool Workspace**: Giao diện Dashboard đặc biệt cho Dev Tools, tối ưu cho các thao tác chuyển đổi CSV/SQL/JS Object sang JSON.

### Fixed

- **PWA Dev-Mode**: Vô hiệu hóa Service Worker cache trong môi trường development giúp cập nhật code tức thì không cần hard-refresh.
- **UI Alignment**: Đồng bộ hóa layout các nút hành động (action buttons) căn phải chuẩn Dashboard cho toàn bộ site.
- **Clipboard Polish**: Thay thế các popup alert() bằng phản hồi trạng thái "Copied!" trực quan trên nút bấm.

## [1.2.0] - 2025-12-18

### Added

- **Global Search**: Tính năng tìm kiếm công cụ toàn diện với phím tắt `Ctrl + K`, tự động gợi ý và điều hướng bằng bàn phím.
- **Bookmark Creator**: Công cụ mới cho phép tùy chỉnh và xuất danh sách bookmark cá nhân (.html) để sử dụng trên mọi trình duyệt.

### Fixed

- **EJS Rendering**: Sửa lỗi scope biến `t` (translation function) khi render danh sách JSON trong templates.

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
