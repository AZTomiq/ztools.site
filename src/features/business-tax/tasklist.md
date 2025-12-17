# 📋 Task List - Corporate Income Tax (TNDN)

## ✅ Completed

### v1.0 - Core Features
- [x] Tính thuế theo phương pháp chi tiết (Doanh thu - Chi phí)
- [x] Tính thuế theo phương pháp đơn giản (% Doanh thu)
- [x] Hỗ trợ các loại hình doanh nghiệp (Phổ thông, Dầu khí, Tài nguyên)
- [x] Hỗ trợ các ngành nghề đơn giản (Hàng hóa, Dịch vụ, Khác)
- [x] Tự động tính Quỹ KH&CN (max 10%)
- [x] Xử lý lỗ kết chuyển
- [x] Responsive Design

### v1.1 - Bug Fixes
- [x] **Fix Number Parsing**: Xử lý đúng định dạng dấu chấm phân cách hàng nghìn (VD: 10.000.000.000)

---

## 🚀 Planned Enhancements

### High Priority
- [ ] **Lưu lịch sử tính toán**: LocalStorage
- [ ] **Export Báo cáo**: PDF/Excel cho kế toán

### Medium Priority
- [ ] **Biểu đồ**: So sánh chi phí/lợi nhuận/thuế
- [ ] **Tooltip**: Giải thích các thuật ngữ chuyên ngành (Chi phí được trừ, Thu nhập chịu thuế...)

---

## 🐛 Known Issues
- [ ] Cần kiểm tra kỹ các trường hợp ưu đãi thuế đặc biệt (miễn 2 giảm 4...) - Hiện tại chưa support logic phức tạp này.

## 📝 Notes
- Thuế suất phổ thông: 20%
- Thuế suất dầu khí: 32-50%
- Quỹ KH&CN: tối đa 10% thu nhập tính thuế
