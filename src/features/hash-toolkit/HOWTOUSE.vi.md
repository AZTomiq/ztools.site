# Hướng dẫn sử dụng Bộ công cụ Base64 & Hash

Bộ công cụ này cung cấp các tiện ích mã hóa và băm dữ liệu thiết yếu cho lập trình viên.

### 1. Mã hóa/Giải mã Base64
- **Mã hóa (Encode)**: Chuyển văn bản thuần túy sang chuỗi Base64. Thường dùng để nhúng dữ liệu vào URL hoặc headers.
- **Giải mã (Decode)**: Chuyển ngược chuỗi Base64 về văn bản gốc.

### 2. MD5 (Message Digest 5)
- Tạo ra giá trị băm 128-bit.
- Thường dùng để kiểm tra tính toàn vẹn của tệp tin hoặc các hệ thống cũ (không khuyến khích dùng cho mật khẩu quan trọng hiện nay).

### 3. SHA-256 (Secure Hash Algorithm 256-bit)
- Thuộc họ SHA-2, tạo ra mã băm cố định 256-bit (64 ký tự hex).
- Đây là tiêu chuẩn bảo mật hiện đại cho chữ ký số, blockchain và xác thực dữ liệu.

### 4. Bảo mật thông tin
Tất cả các phép tính đều được thực hiện **ngay tại trình duyệt** của bạn thông qua Web Crypto API. Dữ liệu của bạn không bao giờ được gửi lên máy chủ.
