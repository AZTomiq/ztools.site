# 📝 Verification Checklist - ZTools v1.2.0

Bảng kiểm này dùng để rà soát lại các thay đổi quan trọng về UI/UX và tính nhất quán của hệ thống i18n/Versioning.

## 1. 🚀 Triển khai Version từng Module
- [x] **Hiển thị Badge**: Kiểm tra xem nhãn phiên bản (v1.x.x) có xuất hiện bên cạnh tiêu đề H1 của các công cụ chính không?
    - [x] Text Formatter
    - [x] Lunar Calendar
    - [x] Bookmark Creator
    - [x] UUID Generator
    - [x] Word Counter
    - [x] Savings Interest
    - [x] Social Insurance
    - [x] Tax Calculator
    - [x] BMI Calculator
    - [x] Business Tax Calculator
    - [x] Compound Interest Calculator
    - [x] JSON Toolkit
    - [x] Loan Calculator
    - [x] Lorem Ipsum
    - [x] Password Generator
    - [x] Percentage Calculator

- [x] **Tương tác Modal**: Nhấp vào Badge có mở ra cửa sổ Changelog không?
- [x] **Nội dung Changelog**: Nội dung trong Modal có đúng là lịch sử thay đổi của riêng module đó không (không phải changelog tổng)?
- [x] **Đóng Modal**: Nút `×` (nút close) và khu vực overlay có hoạt động bình thường không?

## 2. 🇻🇳🇬🇧 Kiểm soát Hardcoded (Tiếng Việt/Anh)
Rà soát các đoạn mã mới triển khai xem có bị "viết chết" ngôn ngữ thay vì dùng hệ thống dịch `t()` không:
- [x] **Bookmark Creator**: Các bước hướng dẫn (Step 1, 2, 3) đã chuyển sang dùng hệ thống i18n.
- [x] **Changelog Modal**: Tiêu đề "Nhật ký thay đổi" / "Version History" đã i18n trong `layout.ejs`.
- [x] **Search results**: Thông báo "Không tìm thấy kết quả" đã i18n qua `i18n-data`.
- [x] **Footer**: Đã kiểm tra tính nhất quán.

## 3. 🔍 Lỗi hiển thị Plain Key (Thiếu i18n)
Kiểm tra xem có chỗ nào bị hiện "tên biến" thay vì "nội dung dịch" không:
- [x] **Search Results**: Danh mục (Category) đã hiện đúng tiếng Việt nhờ fix trong `header.ejs`.
- [x] **Header**: Sub-logo dưới chữ ZTools (Category sync) đã hiện đúng tên chuyên mục đã dịch.
- [x] **Footer**: Các link "Giới thiệu", "Chính sách", "Điều khoản" hoạt động bình thường.

---
**Người thực hiện**: Antigravity  
**Ngày xác thực**: 18/12/2024
