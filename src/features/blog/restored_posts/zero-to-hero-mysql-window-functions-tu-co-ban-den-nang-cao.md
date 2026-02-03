---
title: "Zero to Hero: MySQL Window Functions - Từ Cơ Bản đếN Nâng Cao"
date: 2025-01-27T03:00:00.000Z
tags: [Analytics, Database, MySQL, Partitioning, Ranking, SQL, Window Functions]
categories: [Database, MySQL, SQL]
---

# Zero to Hero: MySQL Window Functions - Từ cơ bản đến nâng cao

> **“Bạn có bao giờ muốn tính toán ranking, running totals, hoặc moving averages mà không làm thay đổi số dòng kết quả không? Tôi đã từng, cho đến khi tôi khám phá Window Functions - cách phân tích dữ liệu mạnh mẽ nhất trong SQL.”**

Có một thời gian, tôi phải tạo báo cáo doanh thu với ranking top customers, running totals theo tháng, và moving averages. Tôi phải viết nhiều subquery phức tạp và UNION để có được kết quả mong muốn. Cho đến khi tôi học Window Functions - cách tiếp cận đã thay đổi hoàn toàn cách tôi phân tích dữ liệu.

Window Functions không chỉ là syntax mới, chúng là **revolution** trong SQL analytics. Với khả năng tính toán trên tập con dữ liệu mà không làm thay đổi số dòng kết quả, Window Functions giúp bạn viết những query phân tích phức tạp một cách đơn giản và hiệu quả.

## 📋 Mục lục

*   [Tại sao Window Functions thay đổi cuộc chơi?](#t%E1%BA%A1i-sao-window-functions-thay-%C4%91%E1%BB%95i-cu%E1%BB%99c-ch%C6%A1i)
*   [Cú pháp cơ bản](#c%C3%BA-ph%C3%A1p-c%C6%A1-b%E1%BA%A3n)
*   [Ranking Functions](#ranking-functions)
*   [Aggregate Functions](#aggregate-functions)
*   [Value Functions](#value-functions)
*   [Real-world Examples](#real-world-examples)
*   [Best Practices](#best-practices)
*   [Troubleshooting](#troubleshooting)

## 🎯 Tại sao Window Functions thay đổi cuộc chơi?

### Vấn đề thực tế

```sql
-- Trước Window Functions - Query phức tạp với subquery
SELECT 
    u.name,
    u.email,
    o.total,
    o.created_at,
    (SELECT COUNT(*) FROM orders o2 WHERE o2.total >= o.total) as rank_by_amount,
    (SELECT SUM(o3.total) FROM orders o3 WHERE o3.user_id = o.user_id AND o3.created_at <= o.created_at) as running_total,
    (SELECT AVG(o4.total) FROM orders o4 WHERE o4.created_at BETWEEN DATE_SUB(o.created_at, INTERVAL 30 DAY) AND o.created_at) as moving_avg_30d
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2024-01-01'
ORDER BY o.total DESC;

-- Vấn đề:
-- - Subquery lặp lại nhiều lần
-- - Query chạy rất chậm
-- - Khó đọc và maintain
-- - Không thể tối ưu performance
```

### Giải pháp với Window Functions

```sql
-- Sau Window Functions - Query đơn giản và hiệu quả
SELECT 
    u.name,
    u.email,
    o.total,
    o.created_at,
    RANK() OVER (ORDER BY o.total DESC) as rank_by_amount,
    SUM(o.total) OVER (
        PARTITION BY o.user_id 
        ORDER BY o.created_at 
        ROWS UNBOUNDED PRECEDING
    ) as running_total,
    AVG(o.total) OVER (
        ORDER BY o.created_at 
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) as moving_avg_30d
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2024-01-01'
ORDER BY o.total DESC;

-- Lợi ích:
-- - Code ngắn gọn, dễ đọc
-- - Performance tốt hơn nhiều
-- - Dễ maintain và modify
-- - Có thể tối ưu với indexes
```

## 📝 Cú pháp cơ bản

### Cấu trúc Window Function

```sql
function_name() OVER (
    [PARTITION BY column1, column2, ...]
    [ORDER BY column1 [ASC|DESC], column2 [ASC|DESC], ...]
    [frame_clause]
)
```

### PARTITION BY

```sql
-- Phân chia dữ liệu thành các nhóm
SELECT 
    user_id,
    total,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total DESC) as user_rank
FROM orders
WHERE created_at >= '2024-01-01';
```

### ORDER BY

```sql
-- Sắp xếp dữ liệu trong window
SELECT 
    user_id,
    total,
    created_at,
    SUM(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as running_total
FROM orders
WHERE created_at >= '2024-01-01';
```

### Frame Clause

```sql
-- Định nghĩa phạm vi tính toán
SELECT 
    user_id,
    total,
    created_at,
    AVG(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as moving_avg_3d
FROM orders
WHERE created_at >= '2024-01-01';
```

## 🏆 Ranking Functions

### ROW\_NUMBER()

```sql
-- Đánh số thứ tự duy nhất
SELECT 
    user_id,
    total,
    created_at,
    ROW_NUMBER() OVER (ORDER BY total DESC) as global_rank,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY total DESC) as user_rank
FROM orders
WHERE created_at >= '2024-01-01';
```

### RANK() và DENSE\_RANK()

```sql
-- Ranking với xử lý ties khác nhau
SELECT 
    user_id,
    total,
    created_at,
    ROW_NUMBER() OVER (ORDER BY total DESC) as row_num,
    RANK() OVER (ORDER BY total DESC) as rank_with_gaps,
    DENSE_RANK() OVER (ORDER BY total DESC) as dense_rank_no_gaps
FROM orders
WHERE created_at >= '2024-01-01';

-- Ví dụ kết quả:
-- total | row_num | rank_with_gaps | dense_rank_no_gaps
-- 1000  | 1       | 1              | 1
-- 1000  | 2       | 1              | 1
-- 900   | 3       | 3              | 2
-- 800   | 4       | 4              | 3
```

### NTILE()

```sql
-- Chia dữ liệu thành n nhóm bằng nhau
SELECT 
    user_id,
    total,
    created_at,
    NTILE(4) OVER (ORDER BY total DESC) as quartile,
    NTILE(10) OVER (ORDER BY total DESC) as decile
FROM orders
WHERE created_at >= '2024-01-01';
```

### PERCENT\_RANK()

```sql
-- Tính percentile rank (0-1)
SELECT 
    user_id,
    total,
    created_at,
    PERCENT_RANK() OVER (ORDER BY total DESC) as percentile_rank,
    ROUND(PERCENT_RANK() OVER (ORDER BY total DESC) * 100, 2) as percentile_pct
FROM orders
WHERE created_at >= '2024-01-01';
```

## 📊 Aggregate Functions

### SUM() với Window

```sql
-- Running totals
SELECT 
    user_id,
    total,
    created_at,
    SUM(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as user_running_total,
    SUM(total) OVER (
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as global_running_total
FROM orders
WHERE created_at >= '2024-01-01';
```

### AVG() với Window

```sql
-- Moving averages
SELECT 
    user_id,
    total,
    created_at,
    AVG(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as user_moving_avg_3d,
    AVG(total) OVER (
        ORDER BY created_at 
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) as global_moving_avg_30d
FROM orders
WHERE created_at >= '2024-01-01';
```

### COUNT() với Window

```sql
-- Cumulative counts
SELECT 
    user_id,
    total,
    created_at,
    COUNT(*) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as user_order_count,
    COUNT(*) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as user_orders_last_7d
FROM orders
WHERE created_at >= '2024-01-01';
```

### MAX() và MIN() với Window

```sql
-- Running max/min
SELECT 
    user_id,
    total,
    created_at,
    MAX(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as user_max_order,
    MIN(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as user_min_order
FROM orders
WHERE created_at >= '2024-01-01';
```

## 🔄 Value Functions

### LAG() và LEAD()

```sql
-- Truy cập dữ liệu từ dòng trước/sau
SELECT 
    user_id,
    total,
    created_at,
    LAG(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at
    ) as prev_order_amount,
    LEAD(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at
    ) as next_order_amount,
    total - LAG(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at
    ) as amount_change
FROM orders
WHERE created_at >= '2024-01-01';
```

### FIRST\_VALUE() và LAST\_VALUE()

```sql
-- Giá trị đầu/cuối trong window
SELECT 
    user_id,
    total,
    created_at,
    FIRST_VALUE(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as first_order_amount,
    LAST_VALUE(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as current_order_amount
FROM orders
WHERE created_at >= '2024-01-01';
```

### NTH\_VALUE()

```sql
-- Giá trị thứ n trong window
SELECT 
    user_id,
    total,
    created_at,
    NTH_VALUE(total, 2) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as second_order_amount,
    NTH_VALUE(total, 3) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as third_order_amount
FROM orders
WHERE created_at >= '2024-01-01';
```

## 📈 Real-world Examples

### Customer Analytics Dashboard

```sql
-- Phân tích hành vi khách hàng
WITH customer_metrics AS (
    SELECT 
        u.id as user_id,
        u.name,
        u.email,
        u.created_at as user_created_at,
        COUNT(o.id) as total_orders,
        SUM(o.total) as total_spent,
        AVG(o.total) as avg_order_value,
        MIN(o.created_at) as first_order,
        MAX(o.created_at) as last_order,
        DATEDIFF(MAX(o.created_at), MIN(o.created_at)) as customer_lifetime_days
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    WHERE u.created_at >= '2023-01-01'
    GROUP BY u.id, u.name, u.email, u.created_at
),
customer_ranking AS (
    SELECT 
        *,
        RANK() OVER (ORDER BY total_spent DESC) as spending_rank,
        NTILE(4) OVER (ORDER BY total_spent DESC) as spending_quartile,
        PERCENT_RANK() OVER (ORDER BY total_spent DESC) as spending_percentile,
        CASE 
            WHEN total_spent >= 1000 THEN 'VIP'
            WHEN total_spent >= 500 THEN 'Regular'
            WHEN total_spent >= 100 THEN 'Occasional'
            ELSE 'New'
        END as customer_segment
    FROM customer_metrics
)
SELECT 
    customer_segment,
    COUNT(*) as customer_count,
    AVG(total_spent) as avg_spent,
    AVG(total_orders) as avg_orders,
    AVG(avg_order_value) as avg_order_value,
    AVG(customer_lifetime_days) as avg_lifetime_days
FROM customer_ranking
GROUP BY customer_segment
ORDER BY avg_spent DESC;
```

### Sales Performance Analysis

```sql
-- Phân tích hiệu suất bán hàng
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    SUM(total) as monthly_revenue,
    COUNT(*) as order_count,
    AVG(total) as avg_order_value,
    -- Running totals
    SUM(SUM(total)) OVER (ORDER BY DATE_FORMAT(created_at, '%Y-%m')) as cumulative_revenue,
    SUM(COUNT(*)) OVER (ORDER BY DATE_FORMAT(created_at, '%Y-%m')) as cumulative_orders,
    -- Month-over-month growth
    LAG(SUM(total)) OVER (ORDER BY DATE_FORMAT(created_at, '%Y-%m')) as prev_month_revenue,
    (SUM(total) - LAG(SUM(total)) OVER (ORDER BY DATE_FORMAT(created_at, '%Y-%m'))) / 
    LAG(SUM(total)) OVER (ORDER BY DATE_FORMAT(created_at, '%Y-%m')) * 100 as revenue_growth_pct,
    -- Moving averages
    AVG(SUM(total)) OVER (
        ORDER BY DATE_FORMAT(created_at, '%Y-%m') 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as moving_avg_3m,
    -- Ranking
    RANK() OVER (ORDER BY SUM(total) DESC) as revenue_rank
FROM orders
WHERE created_at >= '2023-01-01'
    AND status = 'completed'
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month;
```

### Product Performance Tracking

```sql
-- Theo dõi hiệu suất sản phẩm
WITH product_sales AS (
    SELECT 
        p.id,
        p.name,
        p.category_id,
        c.name as category_name,
        DATE_FORMAT(o.created_at, '%Y-%m') as month,
        SUM(oi.quantity) as units_sold,
        SUM(oi.quantity * oi.price) as revenue,
        COUNT(DISTINCT o.id) as order_count
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.created_at >= '2024-01-01'
        AND o.status = 'completed'
    GROUP BY p.id, p.name, p.category_id, c.name, DATE_FORMAT(o.created_at, '%Y-%m')
),
product_ranking AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (
            PARTITION BY month 
            ORDER BY revenue DESC
        ) as monthly_rank,
        ROW_NUMBER() OVER (
            PARTITION BY category_id, month 
            ORDER BY revenue DESC
        ) as category_rank,
        SUM(revenue) OVER (
            PARTITION BY id 
            ORDER BY month 
            ROWS UNBOUNDED PRECEDING
        ) as cumulative_revenue,
        AVG(revenue) OVER (
            PARTITION BY id 
            ORDER BY month 
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) as moving_avg_revenue
    FROM product_sales
)
SELECT 
    name,
    category_name,
    month,
    units_sold,
    revenue,
    monthly_rank,
    category_rank,
    cumulative_revenue,
    moving_avg_revenue,
    CASE 
        WHEN monthly_rank <= 10 THEN 'Top 10'
        WHEN monthly_rank <= 50 THEN 'Top 50'
        ELSE 'Others'
    END as performance_tier
FROM product_ranking
WHERE monthly_rank <= 100
ORDER BY month, monthly_rank;
```

### Financial Trend Analysis

```sql
-- Phân tích xu hướng tài chính
WITH daily_revenue AS (
    SELECT 
        DATE(created_at) as sale_date,
        SUM(total) as daily_revenue,
        COUNT(*) as daily_orders,
        AVG(total) as avg_order_value
    FROM orders
    WHERE created_at >= '2024-01-01'
        AND status = 'completed'
    GROUP BY DATE(created_at)
),
revenue_analysis AS (
    SELECT 
        *,
        -- Running totals
        SUM(daily_revenue) OVER (
            ORDER BY sale_date 
            ROWS UNBOUNDED PRECEDING
        ) as cumulative_revenue,
        SUM(daily_orders) OVER (
            ORDER BY sale_date 
            ROWS UNBOUNDED PRECEDING
        ) as cumulative_orders,
        -- Moving averages
        AVG(daily_revenue) OVER (
            ORDER BY sale_date 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as weekly_moving_avg,
        AVG(daily_revenue) OVER (
            ORDER BY sale_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) as monthly_moving_avg,
        -- Day-over-day change
        LAG(daily_revenue) OVER (ORDER BY sale_date) as prev_day_revenue,
        (daily_revenue - LAG(daily_revenue) OVER (ORDER BY sale_date)) / 
        LAG(daily_revenue) OVER (ORDER BY sale_date) * 100 as daily_growth_pct,
        -- Volatility
        STDDEV(daily_revenue) OVER (
            ORDER BY sale_date 
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) as revenue_volatility_30d
    FROM daily_revenue
)
SELECT 
    sale_date,
    daily_revenue,
    daily_orders,
    avg_order_value,
    cumulative_revenue,
    cumulative_orders,
    weekly_moving_avg,
    monthly_moving_avg,
    daily_growth_pct,
    revenue_volatility_30d,
    CASE 
        WHEN daily_revenue > monthly_moving_avg * 1.2 THEN 'Above Average'
        WHEN daily_revenue < monthly_moving_avg * 0.8 THEN 'Below Average'
        ELSE 'Normal'
    END as performance_indicator
FROM revenue_analysis
ORDER BY sale_date;
```

## 🛠️ Best Practices

### Performance Optimization

```sql
-- Use appropriate indexes
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);
CREATE INDEX idx_orders_created_total ON orders(created_at, total);

-- Optimize window function queries
SELECT 
    user_id,
    total,
    created_at,
    ROW_NUMBER() OVER (
        PARTITION BY user_id 
        ORDER BY created_at
    ) as order_sequence
FROM orders
WHERE created_at >= '2024-01-01' -- Early filtering
ORDER BY user_id, created_at; -- Match window function order
```

### Frame Specification

```sql
-- Choose appropriate frame for your use case
SELECT 
    user_id,
    total,
    created_at,
    -- Unbounded preceding (all previous rows)
    SUM(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as cumulative_total,
    -- N preceding rows
    AVG(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as moving_avg_3d,
    -- Range-based frame
    AVG(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        RANGE BETWEEN INTERVAL 7 DAY PRECEDING AND CURRENT ROW
    ) as weekly_avg
FROM orders
WHERE created_at >= '2024-01-01';
```

### Error Handling

```sql
-- Handle NULL values in window functions
SELECT 
    user_id,
    total,
    created_at,
    COALESCE(
        LAG(total) OVER (
            PARTITION BY user_id 
            ORDER BY created_at
        ), 0
    ) as prev_order_amount,
    CASE 
        WHEN LAG(total) OVER (
            PARTITION BY user_id 
            ORDER BY created_at
        ) IS NULL THEN 0
        ELSE total - LAG(total) OVER (
            PARTITION BY user_id 
            ORDER BY created_at
        )
    END as amount_change
FROM orders
WHERE created_at >= '2024-01-01';
```

## 🔧 Troubleshooting

### Common Issues

```sql
-- Issue 1: Missing ORDER BY in window function
-- ❌ Error: Window function requires ORDER BY
SELECT 
    user_id,
    total,
    ROW_NUMBER() OVER (PARTITION BY user_id) as row_num
FROM orders;

-- ✅ Solution: Add ORDER BY
SELECT 
    user_id,
    total,
    ROW_NUMBER() OVER (
        PARTITION BY user_id 
        ORDER BY created_at
    ) as row_num
FROM orders;

-- Issue 2: Incorrect frame specification
-- ❌ Error: Invalid frame specification
SELECT 
    user_id,
    total,
    SUM(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS BETWEEN 5 AND 10
    ) as running_total
FROM orders;

-- ✅ Solution: Use correct frame
SELECT 
    user_id,
    total,
    SUM(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS BETWEEN 5 PRECEDING AND CURRENT ROW
    ) as running_total
FROM orders;
```

### Performance Issues

```sql
-- Slow window function query
-- Problem: No indexes on partition/order columns
SELECT 
    user_id,
    total,
    ROW_NUMBER() OVER (
        PARTITION BY user_id 
        ORDER BY created_at
    ) as row_num
FROM orders
WHERE created_at >= '2024-01-01';

-- Solution: Add appropriate indexes
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);

-- Problem: Large dataset without filtering
SELECT 
    user_id,
    total,
    SUM(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as running_total
FROM orders; -- No WHERE clause

-- Solution: Add filtering
SELECT 
    user_id,
    total,
    SUM(total) OVER (
        PARTITION BY user_id 
        ORDER BY created_at 
        ROWS UNBOUNDED PRECEDING
    ) as running_total
FROM orders
WHERE created_at >= '2024-01-01'; -- Add WHERE clause
```

### Debug Techniques

```sql
-- Debug window function step by step
WITH step1 AS (
    SELECT 
        user_id,
        total,
        created_at
    FROM orders
    WHERE created_at >= '2024-01-01'
),
step2 AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (
            PARTITION BY user_id 
            ORDER BY created_at
        ) as row_num
    FROM step1
)
SELECT * FROM step2 WHERE user_id = 1 ORDER BY created_at;

-- Check window function results
SELECT 
    user_id,
    total,
    created_at,
    ROW_NUMBER() OVER (
        PARTITION BY user_id 
        ORDER BY created_at
    ) as row_num,
    RANK() OVER (
        PARTITION BY user_id 
        ORDER BY total DESC
    ) as rank_by_amount
FROM orders
WHERE user_id = 1
ORDER BY created_at;
```

## �� Tài liệu tham khảo

### Official Documentation

*   [MySQL Window Functions](https://dev.mysql.com/doc/refman/8.0/en/window-functions.html)
*   [MySQL Window Function Syntax](https://dev.mysql.com/doc/refman/8.0/en/window-functions-usage.html)
*   [MySQL Window Function Frame Specification](https://dev.mysql.com/doc/refman/8.0/en/window-functions-frames.html)

### Learning Resources

*   [MySQL Window Functions Tutorial](https://www.mysqltutorial.org/mysql-window-functions/)
*   [SQL Window Functions Guide](https://mode.com/sql-tutorial/sql-window-functions/)
*   [Window Functions Performance](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

### Tools & Extensions

*   [MySQL Workbench](https://www.mysql.com/products/workbench/)
*   [MySQL Performance Schema](https://dev.mysql.com/doc/refman/8.0/en/performance-schema.html)
*   [MySQL Explain](https://dev.mysql.com/doc/refman/8.0/en/explain.html)

* * *

**🎯 Kết quả sau khi học MySQL Window Functions:**

*   ✅ Hiểu sâu về window functions và analytics capabilities
*   ✅ Thành thạo ranking, aggregate, và value functions
*   ✅ Áp dụng window functions cho data analysis và reporting
*   ✅ Optimize performance với proper indexing và frame specification
*   ✅ Build complex analytical queries và business intelligence solutions
*   ✅ Contribute vào SQL analytics và data science workflows