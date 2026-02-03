---
title: "MySQL Utility Functions - Hướng Dẫn Sử Dụng Các Hàm Tiện Ích"
date: 2025-06-26T08:22:51.000Z
tags: [Data Processing, Database, Functions, MySQL, Performance, SQL, Utility]
categories: [Database, MySQL]
---

# MySQL Utility Functions - Hướng dẫn sử dụng các hàm tiện ích

MySQL cung cấp nhiều hàm tiện ích mạnh mẽ giúp xử lý dữ liệu hiệu quả. Dưới đây là các hàm quan trọng nhất với ví dụ thực tế.

## 1\. CONCAT() - Nối chuỗi

```sql
-- Nối tên và họ
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM users;

-- Nối với điều kiện
SELECT CONCAT(
    first_name, 
    IF(middle_name IS NOT NULL, CONCAT(' ', middle_name), ''), 
    ' ', 
    last_name
) AS full_name
FROM users;

-- Nối với separator
SELECT CONCAT_WS(' - ', product_name, category, price) AS product_info
FROM products;
```

## 2\. GROUP\_CONCAT() - Gộp nhiều dòng thành một

```sql
-- Lấy danh sách tags của mỗi bài viết
SELECT 
    post_id,
    post_title,
    GROUP_CONCAT(tag_name ORDER BY tag_name SEPARATOR ', ') AS tags
FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id;

-- Giới hạn số lượng kết quả
SELECT 
    category_id,
    GROUP_CONCAT(product_name ORDER BY price DESC SEPARATOR ' | ' LIMIT 5) AS top_products
FROM products
GROUP BY category_id;
```

## 3\. IF() - Điều kiện đơn giản

```sql
-- Phân loại khách hàng theo điểm
SELECT 
    customer_name,
    points,
    IF(points >= 1000, 'VIP', 'Regular') AS customer_type
FROM customers;

-- Tính phí vận chuyển
SELECT 
    order_id,
    total_amount,
    IF(total_amount >= 500000, 0, 30000) AS shipping_fee
FROM orders;

-- Kiểm tra trạng thái
SELECT 
    product_name,
    stock_quantity,
    IF(stock_quantity > 0, 'In Stock', 'Out of Stock') AS availability
FROM products;
```

## 4\. IFNULL() - Xử lý giá trị NULL

```sql
-- Thay thế NULL bằng giá trị mặc định
SELECT 
    user_id,
    IFNULL(avatar_url, '/images/default-avatar.png') AS avatar,
    IFNULL(bio, 'No bio available') AS user_bio
FROM users;

-- Tính toán với NULL
SELECT 
    product_id,
    price,
    discount,
    price - IFNULL(discount, 0) AS final_price
FROM products;

-- Hiển thị thông tin liên hệ
SELECT 
    customer_name,
    IFNULL(phone, 'No phone') AS contact_phone,
    IFNULL(email, 'No email') AS contact_email
FROM customers;
```

## 5\. NULLIF() - So sánh và trả về NULL

```sql
-- Tránh chia cho 0
SELECT 
    product_id,
    sales_count,
    total_revenue,
    total_revenue / NULLIF(sales_count, 0) AS avg_revenue_per_sale
FROM sales_summary;

-- Kiểm tra thay đổi giá
SELECT 
    product_id,
    old_price,
    new_price,
    NULLIF(old_price, new_price) AS price_changed
FROM price_history;

-- So sánh chuỗi
SELECT 
    user_id,
    username,
    display_name,
    NULLIF(username, display_name) AS name_different
FROM users;
```

## 6\. CASE WHEN - Điều kiện phức tạp

```sql
-- Phân loại đơn hàng
SELECT 
    order_id,
    total_amount,
    CASE 
        WHEN total_amount >= 1000000 THEN 'Premium'
        WHEN total_amount >= 500000 THEN 'Standard'
        WHEN total_amount >= 100000 THEN 'Basic'
        ELSE 'Small'
    END AS order_category
FROM orders;

-- Tính hoa hồng theo cấp độ
SELECT 
    salesperson_id,
    sales_amount,
    CASE 
        WHEN sales_amount >= 10000000 THEN sales_amount * 0.15
        WHEN sales_amount >= 5000000 THEN sales_amount * 0.10
        WHEN sales_amount >= 1000000 THEN sales_amount * 0.05
        ELSE 0
    END AS commission
FROM sales;
```

## 7\. COALESCE() - Lấy giá trị đầu tiên không NULL

```sql
-- Ưu tiên thông tin liên hệ
SELECT 
    customer_id,
    COALESCE(mobile, phone, email, 'No contact') AS primary_contact
FROM customers;

-- Lấy giá trị mới nhất
SELECT 
    product_id,
    COALESCE(new_price, old_price, base_price) AS current_price
FROM products;

-- Xử lý địa chỉ
SELECT 
    user_id,
    COALESCE(
        CONCAT_WS(', ', address_line1, address_line2),
        city,
        'Address not provided'
    ) AS full_address
FROM users;
```

## 8\. DATE\_FORMAT() - Định dạng ngày tháng

```sql
-- Định dạng ngày tháng Việt Nam
SELECT 
    order_id,
    DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS order_date_vn,
    DATE_FORMAT(created_at, '%W, %d %M %Y') AS order_date_full
FROM orders;

-- Phân tích theo thời gian
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    COUNT(*) AS order_count,
    SUM(total_amount) AS total_revenue
FROM orders
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month;
```

## 9\. JSON Functions - Xử lý JSON

```sql
-- Trích xuất dữ liệu JSON
SELECT 
    user_id,
    JSON_EXTRACT(profile_data, '$.age') AS age,
    JSON_EXTRACT(profile_data, '$.interests[0]') AS first_interest
FROM users;

-- Tạo JSON từ dữ liệu
SELECT 
    product_id,
    JSON_OBJECT(
        'name', product_name,
        'price', price,
        'category', category_name
    ) AS product_json
FROM products p
JOIN categories c ON p.category_id = c.id;
```

## 10\. Window Functions - Phân tích dữ liệu

```sql
-- Xếp hạng sản phẩm theo danh mục
SELECT 
    product_name,
    category_name,
    price,
    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) AS rank_in_category,
    RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS price_rank
FROM products p
JOIN categories c ON p.category_id = c.id;

-- Tính tổng tích lũy
SELECT 
    order_date,
    daily_revenue,
    SUM(daily_revenue) OVER (ORDER BY order_date) AS cumulative_revenue
FROM daily_sales;
```

## 11\. String Manipulation Functions - Xử lý chuỗi nâng cao

### SUBSTRING\_INDEX() - Trích xuất theo delimiter

```sql
-- Lấy domain từ email
SELECT 
    email,
    SUBSTRING_INDEX(email, '@', -1) AS domain,
    SUBSTRING_INDEX(email, '@', 1) AS username
FROM users;

-- Phân tích URL
SELECT 
    url,
    SUBSTRING_INDEX(SUBSTRING_INDEX(url, '://', -1), '/', 1) AS domain,
    SUBSTRING_INDEX(url, '?', 1) AS base_url
FROM page_views;
```

### REGEXP\_REPLACE() - Thay thế với regex

```sql
-- Chuẩn hóa số điện thoại
SELECT 
    phone,
    REGEXP_REPLACE(phone, '[^0-9]', '') AS clean_phone,
    REGEXP_REPLACE(phone, '^0', '+84') AS international_phone
FROM customers;

-- Ẩn thông tin nhạy cảm
SELECT 
    credit_card,
    REGEXP_REPLACE(credit_card, '(\\d{4})(\\d{8})(\\d{4})', '$1********$3') AS masked_card
FROM transactions;
```

### FIND\_IN\_SET() - Tìm kiếm trong danh sách

```sql
-- Kiểm tra quyền hạn
SELECT 
    user_id,
    permissions,
    FIND_IN_SET('admin', permissions) > 0 AS is_admin,
    FIND_IN_SET('editor', permissions) > 0 AS is_editor
FROM users;

-- Lọc theo nhiều categories
SELECT 
    product_name,
    category_ids
FROM products
WHERE FIND_IN_SET('5', category_ids) > 0 
   OR FIND_IN_SET('10', category_ids) > 0;
```

## 12\. Mathematical Functions - Tính toán nâng cao

### ROUND() với precision

```sql
-- Tính toán tài chính chính xác
SELECT 
    order_id,
    total_amount,
    ROUND(total_amount * 0.1, 2) AS tax_amount,
    ROUND(total_amount * 1.1, 2) AS total_with_tax
FROM orders;

-- Phân tích tỷ lệ
SELECT 
    product_id,
    views,
    purchases,
    ROUND((purchases / views) * 100, 2) AS conversion_rate
FROM product_analytics
WHERE views > 0;
```

### CEIL() và FLOOR() - Làm tròn

```sql
-- Tính phí vận chuyển theo kg
SELECT 
    order_id,
    weight_kg,
    CEIL(weight_kg) AS billing_weight,
    CEIL(weight_kg) * 5000 AS shipping_fee
FROM orders;

-- Phân trang
SELECT 
    COUNT(*) AS total_records,
    CEIL(COUNT(*) / 20) AS total_pages
FROM products;
```

## 13\. Date/Time Functions - Xử lý thời gian nâng cao

### DATEDIFF() và TIMESTAMPDIFF() - Tính khoảng cách

```sql
-- Phân tích thời gian xử lý
SELECT 
    order_id,
    created_at,
    shipped_at,
    DATEDIFF(shipped_at, created_at) AS processing_days,
    TIMESTAMPDIFF(HOUR, created_at, shipped_at) AS processing_hours
FROM orders
WHERE shipped_at IS NOT NULL;

-- Tính tuổi chính xác
SELECT 
    user_id,
    birth_date,
    TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age_years,
    TIMESTAMPDIFF(MONTH, birth_date, CURDATE()) AS age_months
FROM users;
```

### DATE\_ADD() và DATE\_SUB() - Thao tác thời gian

```sql
-- Tìm đơn hàng trong 30 ngày gần đây
SELECT 
    order_id,
    created_at
FROM orders
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);

-- Tính ngày đáo hạn
SELECT 
    loan_id,
    start_date,
    DATE_ADD(start_date, INTERVAL 12 MONTH) AS due_date
FROM loans;
```

## 14\. Aggregation Functions - Tổng hợp dữ liệu nâng cao

### PERCENTILE\_CONT() - Phân vị

```sql
-- Phân tích lương theo percentile
SELECT 
    department,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary,
    PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY salary) AS top_10_percent
FROM employees
GROUP BY department;
```

### STDDEV() và VARIANCE() - Thống kê

```sql
-- Phân tích biến động giá
SELECT 
    product_category,
    AVG(price) AS avg_price,
    STDDEV(price) AS price_stddev,
    VARIANCE(price) AS price_variance
FROM products
GROUP BY product_category;
```

## 15\. Conditional Aggregation - Tổng hợp có điều kiện

### SUM() với CASE

```sql
-- Phân tích doanh thu theo khu vực
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    SUM(CASE WHEN region = 'North' THEN total_amount ELSE 0 END) AS north_revenue,
    SUM(CASE WHEN region = 'South' THEN total_amount ELSE 0 END) AS south_revenue,
    SUM(CASE WHEN region = 'Central' THEN total_amount ELSE 0 END) AS central_revenue
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m');
```

### COUNT() với điều kiện

```sql
-- Phân tích trạng thái đơn hàng
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    COUNT(*) AS total_orders,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_orders,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_orders,
    ROUND(COUNT(CASE WHEN status = 'completed' THEN 1 END) / COUNT(*) * 100, 2) AS completion_rate
FROM orders
GROUP BY DATE_FORMAT(created_at, '%Y-%m');
```

## 16\. Advanced String Functions - Chuỗi nâng cao

### ELT() và FIELD() - Mapping values

```sql
-- Chuyển đổi status code thành text
SELECT 
    order_id,
    status_code,
    ELT(status_code, 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') AS status_text
FROM orders;

-- Sắp xếp theo priority
SELECT 
    task_id,
    priority,
    FIELD(priority, 'Low', 'Medium', 'High', 'Critical') AS priority_order
FROM tasks
ORDER BY FIELD(priority, 'Low', 'Medium', 'High', 'Critical');
```

### REPEAT() và SPACE() - Formatting

```sql
-- Tạo progress bar
SELECT 
    task_name,
    progress_percent,
    CONCAT('[', REPEAT('█', FLOOR(progress_percent/10)), REPEAT('░', 10-FLOOR(progress_percent/10)), ']') AS progress_bar
FROM tasks;
```

## 17\. Bit Functions - Xử lý bit

### BIT\_COUNT() - Đếm bit

```sql
-- Phân tích permissions
SELECT 
    user_id,
    permissions,
    BIT_COUNT(permissions) AS permission_count,
    CASE 
        WHEN BIT_COUNT(permissions & 1) > 0 THEN 'Read'
        WHEN BIT_COUNT(permissions & 2) > 0 THEN 'Write'
        WHEN BIT_COUNT(permissions & 4) > 0 THEN 'Delete'
        ELSE 'None'
    END AS permission_text
FROM user_permissions;
```

## Performance Tips và Best Practices

### 1\. Index Optimization

```sql
-- Sử dụng function-based index cho DATE_FORMAT
CREATE INDEX idx_orders_month ON orders (DATE_FORMAT(created_at, '%Y-%m'));

-- Composite index cho multiple conditions
CREATE INDEX idx_products_category_price ON products (category_id, price DESC);
```

### 2\. Query Optimization

```sql
-- Tránh function trong WHERE clause
-- ❌ Chậm
SELECT * FROM orders WHERE DATE_FORMAT(created_at, '%Y-%m') = '2024-01';

-- ✅ Nhanh hơn
SELECT * FROM orders 
WHERE created_at >= '2024-01-01' 
  AND created_at < '2024-02-01';
```

### 3\. Memory Management

```sql
-- Giới hạn GROUP_CONCAT để tránh memory overflow
SET SESSION group_concat_max_len = 1000000;

-- Sử dụng LIMIT trong subqueries
SELECT 
    category_id,
    (SELECT GROUP_CONCAT(product_name SEPARATOR ', ')
     FROM products p2 
     WHERE p2.category_id = p1.category_id 
     LIMIT 10) AS top_products
FROM products p1
GROUP BY category_id;
```

## Ví dụ thực tế: Báo cáo bán hàng nâng cao

```sql
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    COUNT(*) AS total_orders,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS avg_order_value,
    STDDEV(total_amount) AS revenue_stddev,
    COUNT(DISTINCT customer_id) AS unique_customers,
    ROUND(COUNT(*) / COUNT(DISTINCT customer_id), 2) AS orders_per_customer,
    GROUP_CONCAT(
        DISTINCT customer_name 
        ORDER BY customer_name 
        SEPARATOR ', '
        LIMIT 5
    ) AS top_customers,
    CASE 
        WHEN SUM(total_amount) >= 10000000 THEN 'Excellent'
        WHEN SUM(total_amount) >= 5000000 THEN 'Good'
        WHEN SUM(total_amount) >= 1000000 THEN 'Average'
        ELSE 'Poor'
    END AS performance_rating,
    ROUND(
        (SUM(total_amount) - LAG(SUM(total_amount)) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m'))) / 
        LAG(SUM(total_amount)) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')) * 100, 2
    ) AS growth_percentage
FROM orders o
JOIN customers c ON o.customer_id = c.id
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY month DESC;
```

Các hàm utility này không chỉ giúp viết SQL ngắn gọn mà còn mở ra khả năng phân tích dữ liệu sâu sắc. Việc hiểu và sử dụng đúng cách sẽ giúp bạn tạo ra những query hiệu quả, dễ bảo trì và có khả năng mở rộng cao.