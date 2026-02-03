# 📋 Task List - Vietnam PIT Calculator

## ✅ Completed

### v1.0 - Core Features

- [x] Tính thuế TNCN từ Gross
- [x] Tính thuế TNCN từ Net (binary search)
- [x] So sánh 2025 vs 2026
- [x] Chi tiết bảo hiểm (BHXH, BHYT, BHTN)
- [x] Hỗ trợ 4 vùng lương (cap BHTN khác nhau)
- [x] Chi tiết thuế lũy tiến từng bậc
- [x] Chi phí doanh nghiệp (employer cost)
- [x] Hoàn thuế nhờ NPT
- [x] Responsive design (mobile-friendly)
- [x] Dark theme UI

### v1.1 - New Features (Dec 2024)

- [x] **URL Params Share** - Chia sẻ kết quả qua link
  - Params: `income`, `type`, `dep`, `region`
  - Auto-fill form và calculate khi mở link
  - Nút "Copy link" trong result header
- [x] **So sánh nhiều mức lương** - Input 2-5 mức lương
  - Bảng so sánh side-by-side
  - Hiển thị chênh lệch NET
- [x] **Bonus/Tháng 13** - Tính thuế theo năm
  - Input số tháng bonus (0-12)
  - Tính progressive tax trên thu nhập cả năm
- [x] **PWA Support** - Cài như app native
  - manifest.json
  - Service worker (offline support)
- [x] **README Update** - Mô tả chi tiết features mới

---

## 🚀 Planned Enhancements

### High Priority

- [ ] **Export PDF/Image** - Xuất kết quả dạng PDF hoặc ảnh để gửi HR
- [ ] **Lịch sử tính toán** - LocalStorage lưu 5-10 lần tính gần nhất
- [ ] **Keyboard shortcuts** - Enter để tính, Ctrl+C copy link

### Medium Priority

- [ ] **Dark/Light theme toggle** - Cho user chọn theme
- [ ] **Tooltip giải thích** - Hover vào các mục để xem giải thích
- [ ] **Biểu đồ so sánh** - Chart.js visualization 2025 vs 2026
- [ ] **Animation khi calculate** - Số chạy từ 0 đến kết quả

### Low Priority

- [ ] **Multi-language** - English version
- [ ] **Print-friendly CSS** - In ra giấy đẹp
- [ ] **Embed mode** - iframe cho các trang khác nhúng

### Future Ideas (Cần thêm research)

- [ ] **Thu nhập vãng lai** - Thuế 10% flat rate (khác logic hoàn toàn)
- [ ] **Nhiều nguồn thu nhập** - Gộp thu nhập từ nhiều công ty
- [ ] **Tính ngược từ budget** - DN có budget X, tính được Gross bao nhiêu
- [ ] **So sánh với các nước** - VN vs Singapore vs Thailand tax

---

## 🐛 Known Issues

- [ ] N→G mode đang bị comment (cần review lại logic)
- [ ] Service worker cần test kỹ trên mobile Safari

---

## 💬 Issues & Feedback

> Góp ý và báo lỗi: [GitHub Issues](https://github.com/AZTomiq/vietnam-PIT/issues/new)

### [#4 Enhancements: URL params, history, export, compare UX](https://github.com/AZTomiq/vietnam-PIT/issues/4)

| #   | Nguồn  | Nội dung                                                    | Status  |
| --- | ------ | ----------------------------------------------------------- | ------- |
| 1   | ph4n4n | param bonus not present on url                              | pending |
| 2   | ph4n4n | Lịch sử tính toán (localStorage) with checkbox allow enable | pending |
| 3   | ph4n4n | Export PDF/Image                                            | pending |
| 4   | ph4n4n | Textbox input compare salary lack of number format          | pending |
| 5   | ph4n4n | Compare salary must be in other tab from main tab           | pending |

---

## 📝 Notes

- Luật thuế 2026: Nghị quyết 110/2025/UBTVQH15 (áp dụng từ 1/1/2026)
- BHTN cap theo vùng: I=99.2M, II=88.2M, III=77.2M, IV=69M
- Trần BHXH/BHYT: 46.8M (20 × 2.34M base salary từ 7/2024)
