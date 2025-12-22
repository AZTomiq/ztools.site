# Tasklist: Web Code Playground (JSFiddle Clone)

## 📌 Vision
Một môi trường lập trình web frontend nhỏ gọn (HTML/CSS/JS/Output), chạy hoàn toàn client-side trên kiến trúc SSG. Hỗ trợ chia sẻ code thông qua URL encoding (không cần Database).

## 📅 Phases

### Phase 1: Skeleton & Layout (Architecture)
- [x] **Define Tool Metadata**: Tạo `tool.yaml` định nghĩa thông tin tool.
- [x] **Layout Structure**: Tạo `index.ejs` với layout chia màn hình:
    - Khu vực Editor: 3 cột riêng biệt (HTML, CSS, JS).
    - Khu vực Preview: Iframe hiển thị kết quả.
    - Toolbar: Các nút điều khiển (Run, Clear, Share).
- [x] **Styling**: Viết `style.css` sử dụng Flexbox/Grid để chia layout responsive.
    - Desktop: Editors hầng ngang ở trên, Preview ở dưới.
    - Mobile: Stack dọc hoặc Tab view.

### Phase 2: Core Engine (The "Runner")
- [x] **Scripting Logic**: Tạo `script.js`.
- [x] **Input Handling**: Bắt sự kiện nhập liệu từ 3 editors.
- [x] **Compilation Logic**: Hàm `compile()` ghép HTML + CSS + JS thành một blob `srcdoc`.
- [x] **Iframe Security**: Thiết lập `sandbox` attribute cho iframe để an toàn.
- [x] **Console Log Emulation** (Optional): Bắt override `console.log` của iframe để hiện ra UI bên ngoài (Advanced).

### Phase 3: Editor Experience (DX Enhancement)
- [x] **Syntax Highlighting**: Tích hợp Monaco Editor xịn sò (IntelliSense, Dark Theme).
- [-] **Emmet Support**: Cấu hình Emmet (Skipped - Monaco Auto-complete is sufficient).
- [x] **Auto-Run Toggle**: Chế độ tự động chạy khi code thay đổi (debounce).

### Phase 4: Persistence & Sharing (No-DB Strategy)
- [ ] **Compression Library**: Tích hợp `lz-string` (via CDN).
- [ ] **Encode Logic**: Nén state (3 editors) -> Base64 string -> URL Hash.
- [ ] **Decode Logic**: Đọc URL Hash khi load trang -> Giải nén -> Fill vào editors.
- [x] **Share UI**: Nút "Copy Link" tạo URL chia sẻ.
- [x] **Examples Sidebar**: Sidebar chứa các ví dụ mẫu (Glassmorphism, Todo List, JS Clock, Voting, i18n) để user test nhanh.
    - [x] Refactor Examples: Tách code mẫu ra cấu trúc thư mục `src/features/web-playground/examples/`.

### Phase 5: Polish & Integration
- [x] **Homepage Integration**: Thêm vào danh mục "Dev Tools" trên trang chủ (đã highlight).
- [ ] **Third-party Libs**: Dropdown chọn nhanh thư viện phổ biến (Tailwind, Bootstrap, Vue, React CDN).
- [ ] **Layout Resizable**: Cho phép user kéo thả độ rộng các khung (Split.js).

## 📝 Changelog
- **2025-12-22**:
    - Build Core Engine: HTML/CSS/JS Editor + Preview Iframe.
    - Integrate Monaco Editor (Dark Theme, IntelliSense).
    - Implement Auto-Run & Console Emulation.
    - Implement Share URL (LZ-String compression).
    - Add Sidebar with 5 Cool Examples (Glassmorphism, Todo, Clock, Voting, CSS i18n).
    - Refactor Examples into separate directory structure.
    - Rename tool to "zTool Playground" & Highlight on Homepage.

