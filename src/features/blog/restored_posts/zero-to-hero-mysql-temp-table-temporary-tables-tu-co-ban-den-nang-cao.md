---
title: "Zero to Hero: MySQL Temp Table - Temporary Tables Từ Cơ Bản đếN Nâng Cao"
date: 2025-01-27T03:00:00.000Z
tags: [Data Processing, Database, MySQL, Performance, SQL, Temp Table, Temporary Tables]
categories: [Database, MySQL, SQL]
---

# Zero to Hero: MySQL Temp Table - Temporary Tables từ cơ bản đến nâng cao

> **“Bạn có bao giờ gặp khó khăn khi xử lý dữ liệu phức tạp với nhiều bước tính toán không? Tôi đã từng, cho đến khi tôi khám phá Temp Tables - cách lưu trữ dữ liệu tạm thời hiệu quả.”**

Có một thời gian, tôi phải xử lý báo cáo doanh thu với nhiều bước tính toán phức tạp: lọc dữ liệu, tính toán trung bình, phân tích xu hướng, và tạo báo cáo cuối cùng. Query dài hàng trăm dòng và chạy rất chậm. Cho đến khi tôi học Temp Tables - cách tiếp cận đã thay đổi hoàn toàn hiệu suất xử lý dữ liệu.

Temp Tables không chỉ là lưu trữ tạm thời, chúng là **game-changer** trong data processing. Với khả năng lưu trữ kết quả trung gian, tạo indexes, và tối ưu performance, Temp Tables giúp bạn xử lý dữ liệu phức tạp một cách hiệu quả và có tổ chức.

## 📋 Mục lục

*   [Tại sao Temp Tables thay đổi cuộc chơi?](#t%E1%BA%A1i-sao-temp-tables-thay-%C4%91%E1%BB%95i-cu%E1%BB%99c-ch%C6%A1i)
*   [Cú pháp cơ bản](#c%C3%BA-ph%C3%A1p-c%C6%A1-b%E1%BA%A3n)
*   [Types of Temp Tables](#types-of-temp-tables)
*   [Performance và Optimization](#performance-v%C3%A0-optimization)
*   [Real-world Examples](#real-world-examples)
*   [Best Practices](#best-practices)
*   [Troubleshooting](#troubleshooting)

## 🎯 Tại sao Temp Tables thay đổi cuộc chơi?

### Vấn đề thực tế

```sql
-- Trước Temp Tables - Query phức tạp và chậm
SELECT 
    u.name,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent,
    AVG(o.total) as avg_order,
    (SELECT AVG(total) FROM orders WHERE user_id = u.id AND created_at >= '2024-01-01') as recent_avg,
    (SELECT COUNT(*) FROM orders WHERE user_id = u.id AND status = 'cancelled') as cancelled_orders,
    (SELECT SUM(total) FROM orders WHERE user_id = u.id AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as last_30_days
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC;

-- Vấn đề:
-- - Subquery lặp lại nhiều lần
-- - Query chạy rất chậm
-- - Khó debug và maintain
-- - Không thể tạo index cho subquery
```

### Giải pháp với Temp Tables

```sql
-- Sau Temp Tables - Hiệu quả và có tổ chức
-- Step 1: Tạo temp table cho user orders
CREATE TEMPORARY TABLE temp_user_orders AS
SELECT 
    user_id,
    COUNT(*) as order_count,
    SUM(total) as total_spent,
    AVG(total) as avg_order
FROM orders
WHERE created_at >= '2024-01-01'
GROUP BY user_id
HAVING COUNT(*) > 5;

-- Step 2: Tạo temp table cho recent orders
CREATE TEMPORARY TABLE temp_recent_orders AS
SELECT 
    user_id,
    AVG(total) as recent_avg,
    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN total ELSE 0 END) as last_30_days
FROM orders
WHERE created_at >= '2024-01-01'
GROUP BY user_id;

-- Step 3: Tạo temp table cho cancelled orders
CREATE TEMPORARY TABLE temp_cancelled_orders AS
SELECT 
    user_id,
    COUNT(*) as cancelled_count
FROM orders
WHERE status = 'cancelled'
GROUP BY user_id;

-- Step 4: Join tất cả temp tables
SELECT 
    u.name,
    u.email,
    uo.order_count,
    uo.total_spent,
    uo.avg_order,
    ro.recent_avg,
    co.cancelled_count,
    ro.last_30_days
FROM users u
INNER JOIN temp_user_orders uo ON u.id = uo.user_id
LEFT JOIN temp_recent_orders ro ON u.id = ro.user_id
LEFT JOIN temp_cancelled_orders co ON u.id = co.user_id
WHERE u.created_at >= '2024-01-01'
ORDER BY uo.total_spent DESC;

-- Cleanup
DROP TEMPORARY TABLE IF EXISTS temp_user_orders;
DROP TEMPORARY TABLE IF EXISTS temp_recent_orders;
DROP TEMPORARY TABLE IF EXISTS temp_cancelled_orders;

-- Lợi ích:
-- - Performance tốt hơn nhiều
-- - Code rõ ràng, dễ debug
-- - Có thể tạo indexes cho temp tables
-- - Dễ maintain và modify
```

## 📝 Cú pháp cơ bản

### Tạo Temp Table

```sql
-- Method 1: CREATE TEMPORARY TABLE
CREATE TEMPORARY TABLE temp_table_name (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Method 2: CREATE TEMPORARY TABLE AS SELECT
CREATE TEMPORARY TABLE temp_users AS
SELECT id, name, email FROM users WHERE active = 1;

-- Method 3: CREATE TEMPORARY TABLE LIKE
CREATE TEMPORARY TABLE temp_orders LIKE orders;
```

### Insert Data

```sql
-- Insert từ SELECT
INSERT INTO temp_table_name
SELECT column1, column2, column3
FROM source_table
WHERE condition;

-- Insert trực tiếp
INSERT INTO temp_table_name (id, name) VALUES (1, 'John');

-- Insert multiple rows
INSERT INTO temp_table_name (id, name) VALUES 
(1, 'John'),
(2, 'Jane'),
(3, 'Bob');
```

### Drop Temp Table

```sql
-- Drop single temp table
DROP TEMPORARY TABLE IF EXISTS temp_table_name;

-- Drop multiple temp tables
DROP TEMPORARY TABLE IF EXISTS temp_table1, temp_table2, temp_table3;
```

## 🔄 Types of Temp Tables

### Session-based Temp Tables

```sql
-- Temp table chỉ tồn tại trong session hiện tại
CREATE TEMPORARY TABLE session_temp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    data_value VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data
INSERT INTO session_temp (user_id, data_value)
SELECT user_id, CONCAT(name, ' - ', email) as data_value
FROM users
WHERE created_at >= '2024-01-01';

-- Query temp table
SELECT * FROM session_temp WHERE user_id = 1;

-- Temp table tự động xóa khi session kết thúc
-- Hoặc có thể drop manually
DROP TEMPORARY TABLE IF EXISTS session_temp;
```

### Memory-based Temp Tables

```sql
-- Tạo temp table trong memory (nhanh hơn)
CREATE TEMPORARY TABLE memory_temp (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    value DECIMAL(10,2)
) ENGINE=MEMORY;

-- Insert data
INSERT INTO memory_temp
SELECT id, name, price FROM products WHERE category_id = 1;

-- Query memory temp table
SELECT * FROM memory_temp WHERE value > 100;

-- Memory temp table tự động xóa khi session kết thúc
```

### Disk-based Temp Tables

```sql
-- Tạo temp table trên disk (cho dữ liệu lớn)
CREATE TEMPORARY TABLE disk_temp (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Insert large dataset
INSERT INTO disk_temp (user_id, order_data)
SELECT 
    user_id,
    JSON_OBJECT(
        'order_id', id,
        'total', total,
        'status', status
    ) as order_data
FROM orders
WHERE created_at >= '2024-01-01';

-- Query với index
SELECT * FROM disk_temp 
WHERE user_id = 1 
ORDER BY created_at DESC;
```

## 🚀 Performance và Optimization

### Indexing Temp Tables

```sql
-- Tạo temp table với indexes
CREATE TEMPORARY TABLE optimized_temp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_category (user_id, category_id),
    INDEX idx_amount (amount),
    INDEX idx_created_at (created_at)
);

-- Insert data
INSERT INTO optimized_temp (user_id, category_id, amount)
SELECT user_id, category_id, SUM(total) as amount
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.created_at >= '2024-01-01'
GROUP BY user_id, category_id;

-- Query với index optimization
SELECT 
    user_id,
    SUM(amount) as total_amount,
    COUNT(*) as category_count
FROM optimized_temp
WHERE amount > 100
    AND created_at >= '2024-01-01'
GROUP BY user_id
ORDER BY total_amount DESC;
```

### Partitioning Temp Tables

```sql
-- Tạo partitioned temp table
CREATE TEMPORARY TABLE partitioned_temp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10,2),
    created_date DATE
) PARTITION BY RANGE (YEAR(created_date)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026)
);

-- Insert data
INSERT INTO partitioned_temp (user_id, amount, created_date)
SELECT 
    user_id,
    total,
    DATE(created_at) as created_date
FROM orders
WHERE created_at >= '2023-01-01';

-- Query specific partition
SELECT * FROM partitioned_temp 
WHERE created_date >= '2024-01-01';
```

### Memory vs Disk Optimization

```sql
-- Memory temp table cho dữ liệu nhỏ
CREATE TEMPORARY TABLE memory_small (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    value INT
) ENGINE=MEMORY;

-- Disk temp table cho dữ liệu lớn
CREATE TEMPORARY TABLE disk_large (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    data TEXT,
    created_at TIMESTAMP,
    INDEX idx_user_created (user_id, created_at)
) ENGINE=InnoDB;

-- Hybrid approach
-- Step 1: Process small dataset in memory
INSERT INTO memory_small
SELECT id, name, COUNT(*) as value
FROM users
WHERE created_at >= '2024-01-01'
GROUP BY id, name;

-- Step 2: Move to disk for complex operations
INSERT INTO disk_large (user_id, data, created_at)
SELECT 
    u.id,
    JSON_OBJECT(
        'name', u.name,
        'order_count', ms.value
    ) as data,
    u.created_at
FROM users u
JOIN memory_small ms ON u.id = ms.id
WHERE u.created_at >= '2024-01-01';
```

## 📊 Real-world Examples

### E-commerce Analytics Pipeline

```sql
-- Step 1: Extract user data
CREATE TEMPORARY TABLE temp_users AS
SELECT 
    id,
    name,
    email,
    created_at,
    CASE 
        WHEN created_at >= '2024-01-01' THEN 'New'
        WHEN created_at >= '2023-01-01' THEN 'Recent'
        ELSE 'Old'
    END as user_type
FROM users
WHERE active = 1;

-- Step 2: Extract order data
CREATE TEMPORARY TABLE temp_orders AS
SELECT 
    user_id,
    COUNT(*) as order_count,
    SUM(total) as total_spent,
    AVG(total) as avg_order,
    MIN(created_at) as first_order,
    MAX(created_at) as last_order
FROM orders
WHERE status = 'completed'
    AND created_at >= '2023-01-01'
GROUP BY user_id;

-- Step 3: Extract product data
CREATE TEMPORARY TABLE temp_products AS
SELECT 
    p.id,
    p.name,
    p.category_id,
    c.name as category_name,
    COUNT(oi.id) as times_ordered,
    SUM(oi.quantity) as total_quantity,
    AVG(oi.price) as avg_price
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
    AND o.created_at >= '2024-01-01'
GROUP BY p.id, p.name, p.category_id, c.name;

-- Step 4: Create indexes for performance
ALTER TABLE temp_orders ADD INDEX idx_user_id (user_id);
ALTER TABLE temp_products ADD INDEX idx_category (category_id);

-- Step 5: Generate final report
SELECT 
    u.user_type,
    COUNT(DISTINCT u.id) as user_count,
    AVG(o.total_spent) as avg_spent,
    AVG(o.order_count) as avg_orders,
    COUNT(p.id) as product_count
FROM temp_users u
LEFT JOIN temp_orders o ON u.id = o.user_id
LEFT JOIN temp_products p ON 1=1
GROUP BY u.user_type
ORDER BY avg_spent DESC;

-- Cleanup
DROP TEMPORARY TABLE IF EXISTS temp_users, temp_orders, temp_products;
```

### Financial Reporting System

```sql
-- Step 1: Extract transaction data
CREATE TEMPORARY TABLE temp_transactions AS
SELECT 
    DATE(created_at) as transaction_date,
    user_id,
    SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) as credits,
    SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) as debits,
    COUNT(*) as transaction_count
FROM transactions
WHERE created_at >= '2024-01-01'
GROUP BY DATE(created_at), user_id;

-- Step 2: Calculate daily balances
CREATE TEMPORARY TABLE temp_daily_balances AS
SELECT 
    transaction_date,
    user_id,
    credits,
    debits,
    credits - debits as net_amount,
    transaction_count,
    SUM(credits - debits) OVER (
        PARTITION BY user_id 
        ORDER BY transaction_date 
        ROWS UNBOUNDED PRECEDING
    ) as running_balance
FROM temp_transactions;

-- Step 3: Calculate monthly summaries
CREATE TEMPORARY TABLE temp_monthly_summary AS
SELECT 
    DATE_FORMAT(transaction_date, '%Y-%m') as month,
    COUNT(DISTINCT user_id) as active_users,
    SUM(credits) as total_credits,
    SUM(debits) as total_debits,
    SUM(net_amount) as net_flow,
    AVG(transaction_count) as avg_transactions_per_user
FROM temp_daily_balances
GROUP BY DATE_FORMAT(transaction_date, '%Y-%m');

-- Step 4: Generate trend analysis
SELECT 
    month,
    active_users,
    total_credits,
    total_debits,
    net_flow,
    avg_transactions_per_user,
    LAG(net_flow) OVER (ORDER BY month) as prev_month_flow,
    (net_flow - LAG(net_flow) OVER (ORDER BY month)) / LAG(net_flow) OVER (ORDER BY month) * 100 as growth_pct
FROM temp_monthly_summary
ORDER BY month;

-- Cleanup
DROP TEMPORARY TABLE IF EXISTS temp_transactions, temp_daily_balances, temp_monthly_summary;
```

### Inventory Management System

```sql
-- Step 1: Extract inventory movements
CREATE TEMPORARY TABLE temp_inventory_movements AS
SELECT 
    product_id,
    DATE(created_at) as movement_date,
    SUM(CASE WHEN type = 'in' THEN quantity ELSE 0 END) as stock_in,
    SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END) as stock_out,
    SUM(CASE WHEN type = 'adjustment' THEN quantity ELSE 0 END) as adjustments
FROM inventory_movements
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY product_id, DATE(created_at);

-- Step 2: Calculate daily stock levels
CREATE TEMPORARY TABLE temp_daily_stock AS
SELECT 
    product_id,
    movement_date,
    stock_in,
    stock_out,
    adjustments,
    stock_in - stock_out + adjustments as net_movement,
    SUM(stock_in - stock_out + adjustments) OVER (
        PARTITION BY product_id 
        ORDER BY movement_date 
        ROWS UNBOUNDED PRECEDING
    ) as running_stock
FROM temp_inventory_movements;

-- Step 3: Identify stock issues
CREATE TEMPORARY TABLE temp_stock_alerts AS
SELECT 
    p.id,
    p.name,
    p.reorder_level,
    ds.running_stock as current_stock,
    CASE 
        WHEN ds.running_stock <= 0 THEN 'Out of Stock'
        WHEN ds.running_stock <= p.reorder_level THEN 'Reorder Needed'
        WHEN ds.running_stock <= p.reorder_level * 2 THEN 'Low Stock'
        ELSE 'Sufficient'
    END as stock_status,
    ds.movement_date as last_movement
FROM products p
JOIN temp_daily_stock ds ON p.id = ds.product_id
WHERE ds.movement_date = (
    SELECT MAX(movement_date) 
    FROM temp_daily_stock 
    WHERE product_id = p.id
);

-- Step 4: Generate alert report
SELECT 
    stock_status,
    COUNT(*) as product_count,
    AVG(current_stock) as avg_stock_level
FROM temp_stock_alerts
GROUP BY stock_status
ORDER BY 
    CASE stock_status
        WHEN 'Out of Stock' THEN 1
        WHEN 'Reorder Needed' THEN 2
        WHEN 'Low Stock' THEN 3
        ELSE 4
    END;

-- Cleanup
DROP TEMPORARY TABLE IF EXISTS temp_inventory_movements, temp_daily_stock, temp_stock_alerts;
```

## 🛠️ Best Practices

### Naming Conventions

```sql
-- Good naming conventions
CREATE TEMPORARY TABLE temp_user_orders_2024 AS
SELECT * FROM orders WHERE YEAR(created_at) = 2024;

CREATE TEMPORARY TABLE temp_daily_sales_summary AS
SELECT DATE(created_at) as sale_date, SUM(total) as daily_revenue
FROM orders GROUP BY DATE(created_at);

-- Avoid: generic names
-- CREATE TEMPORARY TABLE temp AS SELECT * FROM orders;
-- CREATE TEMPORARY TABLE data AS SELECT * FROM users;
```

### Memory Management

```sql
-- Monitor temp table size
SELECT 
    table_name,
    table_rows,
    data_length,
    index_length,
    (data_length + index_length) as total_size
FROM information_schema.tables 
WHERE table_schema = 'mysql'
    AND table_name LIKE 'tmp%';

-- Clean up temp tables regularly
DROP TEMPORARY TABLE IF EXISTS temp_table1, temp_table2, temp_table3;

-- Use appropriate storage engine
CREATE TEMPORARY TABLE small_data (
    id INT PRIMARY KEY,
    name VARCHAR(50)
) ENGINE=MEMORY; -- For small datasets

CREATE TEMPORARY TABLE large_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data TEXT,
    created_at TIMESTAMP
) ENGINE=InnoDB; -- For large datasets
```

### Error Handling

```sql
-- Safe temp table creation
DROP TEMPORARY TABLE IF EXISTS temp_safe_table;

CREATE TEMPORARY TABLE temp_safe_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    data_value VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);

-- Insert with error handling
INSERT INTO temp_safe_table (user_id, data_value)
SELECT 
    user_id,
    CASE 
        WHEN name IS NULL THEN 'Unknown'
        WHEN LENGTH(name) > 255 THEN LEFT(name, 255)
        ELSE name
    END as data_value
FROM users
WHERE created_at >= '2024-01-01';

-- Verify data integrity
SELECT 
    COUNT(*) as total_rows,
    COUNT(DISTINCT user_id) as unique_users,
    MIN(created_at) as earliest_record,
    MAX(created_at) as latest_record
FROM temp_safe_table;
```

## 🔧 Troubleshooting

### Common Issues

```sql
-- Issue 1: Temp table already exists
-- ❌ Error: Table 'temp_table' already exists
CREATE TEMPORARY TABLE temp_table (id INT);

-- ✅ Solution: Use IF NOT EXISTS or DROP first
DROP TEMPORARY TABLE IF EXISTS temp_table;
CREATE TEMPORARY TABLE temp_table (id INT);

-- Issue 2: Memory exhaustion
-- ❌ Error: The table is full
CREATE TEMPORARY TABLE large_temp ENGINE=MEMORY AS
SELECT * FROM very_large_table;

-- ✅ Solution: Use InnoDB engine
CREATE TEMPORARY TABLE large_temp ENGINE=InnoDB AS
SELECT * FROM very_large_table;

-- Issue 3: Session timeout
-- ❌ Temp table disappears after session timeout
-- ✅ Solution: Check session timeout and recreate if needed
SHOW VARIABLES LIKE 'wait_timeout';
```

### Performance Issues

```sql
-- Slow temp table queries
-- Problem: No indexes on temp table
CREATE TEMPORARY TABLE slow_temp AS
SELECT user_id, COUNT(*) as count FROM orders GROUP BY user_id;

-- Solution: Add indexes
ALTER TABLE slow_temp ADD INDEX idx_user_id (user_id);

-- Problem: Large temp table without partitioning
CREATE TEMPORARY TABLE large_temp AS
SELECT * FROM orders WHERE created_at >= '2020-01-01';

-- Solution: Use partitioning or filtering
CREATE TEMPORARY TABLE large_temp AS
SELECT * FROM orders 
WHERE created_at >= '2024-01-01' -- More recent data
LIMIT 100000; -- Limit size
```

### Debug Techniques

```sql
-- Debug temp table creation
SHOW CREATE TEMPORARY TABLE temp_debug;

-- Check temp table structure
DESCRIBE temp_debug;

-- Check temp table data
SELECT COUNT(*) as row_count FROM temp_debug;
SELECT * FROM temp_debug LIMIT 10;

-- Check temp table size
SELECT 
    table_name,
    table_rows,
    data_length,
    index_length
FROM information_schema.tables 
WHERE table_schema = 'mysql'
    AND table_name LIKE '%temp_debug%';
```

## 📚 Tài liệu tham khảo

### Official Documentation

*   [MySQL Temporary Tables](https://dev.mysql.com/doc/refman/8.0/en/temporary-tables.html)
*   [MySQL Storage Engines](https://dev.mysql.com/doc/refman/8.0/en/storage-engines.html)
*   [MySQL Memory Engine](https://dev.mysql.com/doc/refman/8.0/en/memory-storage-engine.html)

### Learning Resources

*   [MySQL Temp Tables Tutorial](https://www.mysqltutorial.org/mysql-temporary-table/)
*   [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
*   [MySQL Storage Engine Comparison](https://dev.mysql.com/doc/refman/8.0/en/storage-engines.html)

### Tools & Extensions

*   [MySQL Workbench](https://www.mysql.com/products/workbench/)
*   [MySQL Performance Schema](https://dev.mysql.com/doc/refman/8.0/en/performance-schema.html)
*   [MySQL Explain](https://dev.mysql.com/doc/refman/8.0/en/explain.html)

* * *

**🎯 Kết quả sau khi học MySQL Temp Tables:**

*   ✅ Hiểu sâu về temporary tables và storage engines
*   ✅ Thành thạo tạo và quản lý temp tables hiệu quả
*   ✅ Áp dụng temp tables cho data processing pipelines
*   ✅ Optimize performance với proper indexing và partitioning
*   ✅ Build complex data processing workflows
*   ✅ Contribute vào database optimization và best practices