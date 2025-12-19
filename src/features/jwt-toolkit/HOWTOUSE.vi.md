# Hướng dẫn sử dụng Bộ giải mã JWT

JSON Web Token (JWT) là một tiêu chuẩn mở định nghĩa cách truyền tin an toàn giữa các bên dưới dạng đối tượng JSON.

### 1. Dán mã Token
Sao chép mã JWT của bạn và dán vào ô nhập liệu bên trái. Một mã JWT hợp lệ thường gồm 3 phần ngăn cách bởi dấu chấm (`.`).

### 2. Xem kết quả giải mã
Hệ thống sẽ tự động bóc tách và giải mã token thành hai phần chính:
- **Header**: Chứa thông tin về loại token và thuật toán mã hóa (ví dụ: HS256, RS256).
- **Payload**: Chứa nội dung chính (claims) như thông tin người dùng, quyền hạn, thời gian hết hạn.

### 3. Lưu ý an toàn
- **Xử lý tại máy**: Công cụ này hoạt động hoàn toàn trên trình duyệt của bạn. Mã token **không bao giờ** được gửi về máy chủ.
- **Dữ liệu nhạy cảm**: Mặc dù xử lý local, bạn vẫn nên cẩn trọng khi làm việc với các token chứa thông tin quá nhạy cảm trên máy tính công cộng.
