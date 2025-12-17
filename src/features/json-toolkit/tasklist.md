# 📋 Task List - JSON Formatter & Validator

## ✅ Completed
### v1.0 - Core Features
- [ ] Parse & Validate JSON
- [ ] Format/Prettify (Indent 2/4 spaces, Tab)
- [ ] Minify JSON (Remove whitespace)
- [ ] Error highlighting (Line & Column)

## 🚀 Planned Enhancements

### High Priority
- [ ] **Collapsible Tree View** - Xem JSON dạng cây, đóng mở node
- [ ] **Copy to Clipboard** - Nút copy nhanh kết quả
- [ ] **Load from URL** - Fetch JSON từ link external
- [ ] **Upload File** - Upload file .json từ máy

### Medium Priority
- [ ] **Json Path** - Query JSON data
- [ ] **Dark Mode** - Giao diện tối/sáng
- [ ] **Download File** - Tải về kết quả .json
- [ ] **Auto-fix** - Tự động sửa lỗi dấu phẩy thừa/thiếu (simple cases)

### Low Priority
- [ ] **Convert to XML/YAML** - Chuyển đổi format
- [ ] **Diff Viewer** - So sánh sự khác nhau giữa 2 JSON
- [ ] **Share Link** - Lưu JSON vào DB ngắn hạn và tạo link chia sẻ

## 💬 Issues & Feedback
> Góp ý và báo lỗi: [GitHub Issues](link-repo)

## 📝 Notes
- **Performance**: Cần handle file lớn (>10MB) bằng Web Worker để không đơ UI.
- **Library**: Cân nhắc dùng `monaco-editor` (nặng) hoặc `CodeMirror` / `Ace` cho editor visualization.
- **Privacy**: Xử lý hoàn toàn tại Client-side (Browser), không gửi data về server.
