# 📋 Task List - Social Insurance & Pension (BHXH)

## ✅ Completed

### v1.0 - Core Features
- [x] Tính đóng BHXH (Employer & Employee)
- [x] Tính lương hưu dự tính
- [x] Tính BHXH một lần
- [x] Cập nhật mức lương tối thiểu vùng (7/2024)
- [x] Cập nhật mức lương cơ sở (2.34M)

### v1.1 - Logic Fixes (Dec 2024)
- [x] **Fix Pension Logic**: Tách biệt tỷ lệ hưởng cho Nam (20 năm = 45%) và Nữ (15 năm = 45%).
- [x] **Fix One-time BHXH**: Cập nhật công thức phân tách giai đoạn trước 2014 (1.5 tháng) và từ 2014 (2.0 tháng).
- [x] **UI Update**: Thêm input tách năm cho BHXH 1 lần.
- [x] **Fix Number Parsing**: Xử lý đúng định dạng 50.000.000.

---

## 🚀 Planned Enhancements

### High Priority
- [ ] **Share Result**: Lưu params trên URL để chia sẻ
- [ ] **Chi tiết lương hưu**: Bảng dòng tiền dự kiến nhận được theo tuổi thọ

### Medium Priority
- [ ] **Support Salary Change**: Cho phép nhập quá trình đóng với mức lương thay đổi (hiện tại tính trên bình quân nhập tay)
- [ ] **Lạm phát**: Tính trượt giá cho lương hưu

---

## 🐛 Known Issues
- [ ] Chưa hỗ trợ tính trượt giá tự động cho quá trình đóng (hệ số trượt giá hàng năm) - Người dùng phải tự nhập Lương Bình Quân đã trượt giá.

## 📝 Notes
- Lương hưu: Nam 60t, Nữ 55t (lộ trình tăng tuổi nghỉ hưu chưa apply triệt để trong tool này, chỉ reference basic)
- BHXH 1 lần: 1.5 tháng (trước 2014), 2 tháng (từ 2014)
