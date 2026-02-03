---
title: "ACID"
date: 2025-06-20T08:06:31.000Z
tags: [ACID, Atomicity, Consistency, Database, Durability, Isolation, MySQL, PostgreSQL, Transaction]
categories: [Database, Database Theory]
---

## ACID là gì?

ACID là 4 tính chất cơ bản mà một transaction trong database phải có. Giống như 4 điều kiện để làm boyfriend/girlfriend ấy: **A**uthentic (thật thà), **C**onsistent (nhất quán), **I**solated (riêng tư), **D**urable (bền vững) 😄

## A - Atomicity (Tính nguyên tử)

**Định nghĩa**: Transaction phải hoàn thành toàn bộ hoặc không làm gì cả.

**Ví dụ thực tế**: Chuyển tiền từ tài khoản A sang B

```sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
COMMIT;
```

Nếu bước nào fail → rollback hết. Không có chuyện A mất tiền mà B không nhận được (thảm họa! 💸)

## C - Consistency (Tính nhất quán)

**Định nghĩa**: Database phải luôn ở trạng thái hợp lệ trước và sau transaction.

**Ví dụ**: Tổng tiền trong hệ thống banking phải không đổi

```sql
-- Trước transaction: A có 1000, B có 500 → Tổng = 1500
-- Sau transaction: A có 900, B có 600 → Tổng = 1500 ✅
```

Constraint như `NOT NULL`, `FOREIGN KEY` phải được tôn trọng. Không có chuyện sinh viên không có tên hoặc đăng ký môn học không tồn tại.

## I - Isolation (Tính cô lập)

**Định nghĩa**: Các transaction chạy đồng thời không được ảnh hưởng lẫn nhau.

**Ví dụ**: 2 người cùng lúc mua vé concert

```sql
-- User 1: SELECT seats WHERE available = true; -- Thấy ghế A1 trống
-- User 2: SELECT seats WHERE available = true; -- Cũng thấy ghế A1 trống
-- User 1: UPDATE seats SET available = false WHERE id = 'A1';
-- User 2: UPDATE seats SET available = false WHERE id = 'A1'; -- Fail!
```

Database phải đảm bảo chỉ 1 người mua được ghế A1. Không có chuyện 2 người ngồi chung 1 ghế (trừ khi… 👫)

### Isolation Levels:

*   **READ UNCOMMITTED**: Đọc được data chưa commit (dirty read) - nguy hiểm!
*   **READ COMMITTED**: Chỉ đọc data đã commit
*   **REPEATABLE READ**: Đảm bảo đọc lại cùng 1 kết quả
*   **SERIALIZABLE**: Chạy tuần tự (chậm nhưng an toàn)

## D - Durability (Tính bền vững)

**Định nghĩa**: Khi transaction đã commit, data phải được lưu vĩnh viễn.

**Ví dụ**: Sau khi chuyển tiền thành công

```sql
COMMIT; -- Từ giây này, dù server có nổ tung cũng không mất transaction
```

Ngay cả khi:

*   Server crash 💥
*   Mất điện ⚡
*   Động đất 🌍
*   Sếp bực tức tắt máy 😤

Data vẫn phải còn nguyên trong database.

## Ví dụ tổng hợp: E-commerce Order

```sql
BEGIN TRANSACTION;

-- 1. Giảm số lượng sản phẩm
UPDATE products SET quantity = quantity - 1 WHERE id = 123;

-- 2. Tạo đơn hàng
INSERT INTO orders (user_id, product_id, amount) VALUES (456, 123, 99000);

-- 3. Trừ tiền tài khoản
UPDATE wallets SET balance = balance - 99000 WHERE user_id = 456;

-- 4. Tạo lịch sử giao dịch
INSERT INTO transactions (user_id, type, amount) VALUES (456, 'purchase', 99000);

COMMIT;
```

**ACID đảm bảo:**

*   **A**: Tất cả 4 bước thành công hoặc không làm gì
*   **C**: Tổng tiền trong hệ thống không đổi, quantity >= 0
*   **I**: 2 người không thể mua cùng 1 sản phẩm cuối cùng
*   **D**: Đơn hàng không bị mất sau khi thanh toán

## Khi nào cần ACID?

### ✅ Cần ACID:

*   Banking, Payment
*   E-commerce checkout
*   Inventory management
*   User registration

### ❌ Không cần ACID nghiêm ngặt:

*   Logging, Analytics
*   Social media posts
*   Search indexing
*   Cache updates

## Lưu ý thực tế

**NoSQL vs SQL:**

*   **SQL databases**: ACID by default (MySQL, PostgreSQL)
*   **NoSQL**: Thường ưu tiên performance hơn ACID (MongoDB, Cassandra)

**Trade-offs:**

*   ACID mạnh → Performance chậm
*   Performance cao → ACID yếu

Chọn theo use case, đừng có “vì ACID mà chậm như rùa” hay “vì nhanh mà mất data” 😅

* * *

_Remember: ACID không phải là chất ăn da, mà là chất bảo vệ data! 🛡️_

**Have a nice day!**

ph4n4n