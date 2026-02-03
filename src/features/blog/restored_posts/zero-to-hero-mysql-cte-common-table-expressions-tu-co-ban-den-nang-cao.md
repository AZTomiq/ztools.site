---
title: "Zero to Hero: MySQL CTE - Common Table Expressions Từ Cơ Bản đếN Nâng Cao"
date: 2025-01-27T03:00:00.000Z
tags: [CTE, Common Table Expressions, Database, MySQL, Performance, Recursive Queries, SQL]
categories: [Database, MySQL, SQL]
---

# Zero to Hero: MySQL CTE - Common Table Expressions từ cơ bản đến nâng cao

> **“Bạn có bao giờ mệt mỏi vì phải viết những câu query phức tạp với nhiều subquery lồng nhau không? Tôi đã từng, cho đến khi tôi khám phá CTE - cách viết SQL sạch sẽ và dễ đọc hơn.”**

Có một thời gian, tôi phải viết query để phân tích dữ liệu bán hàng theo từng tháng, quý, năm với nhiều subquery lồng nhau. Query dài 50+ dòng và khó maintain. Cho đến khi tôi học CTE - Common Table Expressions đã thay đổi hoàn toàn cách tôi viết SQL.

CTE không chỉ là syntax sugar, nó là **revolution** trong SQL writing. Với khả năng tạo temporary result sets có thể tái sử dụng, CTE giúp bạn viết những query phức tạp một cách rõ ràng, dễ đọc và dễ maintain.

## 📋 Mục lục

*   [Tại sao CTE thay đổi cuộc chơi?](#t%E1%BA%A1i-sao-cte-thay-%C4%91%E1%BB%95i-cu%E1%BB%99c-ch%C6%A1i)
*   [Cú pháp cơ bản](#c%C3%BA-ph%C3%A1p-c%C6%A1-b%E1%BA%A3n)
*   [Non-Recursive CTE](#non-recursive-cte)
*   [Recursive CTE](#recursive-cte)
*   [Performance và Optimization](#performance-v%C3%A0-optimization)
*   [Real-world Examples](#real-world-examples)
*   [Best Practices](#best-practices)
*   [Troubleshooting](#troubleshooting)

## 🎯 Tại sao CTE thay đổi cuộc chơi?

### Vấn đề thực tế

```sql
-- Trước CTE - Query phức tạp với subquery
SELECT 
    u.name,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent,
    (SELECT AVG(total) FROM orders WHERE user_id = u.id) as avg_order,
    (SELECT MAX(total) FROM orders WHERE user_id = u.id) as max_order
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC;

-- Vấn đề:
-- - Subquery lặp lại nhiều lần
-- - Query khó đọc và maintain
-- - Performance không tối ưu
-- - Khó debug khi có lỗi
```

### Giải pháp với CTE

```sql
-- Sau CTE - Query sạch sẽ và dễ đọc
WITH user_orders AS (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total) as total_spent,
        AVG(total) as avg_order,
        MAX(total) as max_order
    FROM orders 
    WHERE created_at >= '2024-01-01'
    GROUP BY user_id
    HAVING COUNT(*) > 5
),
user_stats AS (
    SELECT 
        u.name,
        u.email,
        uo.order_count,
        uo.total_spent,
        uo.avg_order,
        uo.max_order
    FROM users u
    INNER JOIN user_orders uo ON u.id = uo.user_id
    WHERE u.created_at >= '2024-01-01'
)
SELECT * FROM user_stats
ORDER BY total_spent DESC;

-- Lợi ích:
-- - Code rõ ràng, dễ đọc
-- - Tái sử dụng logic
-- - Dễ debug và maintain
-- - Performance tốt hơn
```

## 📝 Cú pháp cơ bản

### Cấu trúc CTE

```sql
WITH cte_name AS (
    SELECT column1, column2, ...
    FROM table_name
    WHERE condition
)
SELECT * FROM cte_name;
```

### Multiple CTEs

```sql
WITH 
cte1 AS (
    SELECT * FROM table1 WHERE condition1
),
cte2 AS (
    SELECT * FROM table2 WHERE condition2
),
cte3 AS (
    SELECT c1.*, c2.column
    FROM cte1 c1
    JOIN cte2 c2 ON c1.id = c2.id
)
SELECT * FROM cte3;
```

### CTE với Parameters

```sql
-- Sử dụng CTE với parameters
SET @start_date = '2024-01-01';
SET @end_date = '2024-12-31';

WITH date_range AS (
    SELECT 
        DATE(@start_date) as start_date,
        DATE(@end_date) as end_date
),
filtered_orders AS (
    SELECT *
    FROM orders o, date_range dr
    WHERE o.created_at BETWEEN dr.start_date AND dr.end_date
)
SELECT * FROM filtered_orders;
```

## 🔄 Non-Recursive CTE

### Basic Example

```sql
-- Tạo CTE đơn giản
WITH top_customers AS (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total) as total_spent
    FROM orders
    WHERE created_at >= '2024-01-01'
    GROUP BY user_id
    HAVING COUNT(*) >= 10
)
SELECT 
    u.name,
    u.email,
    tc.order_count,
    tc.total_spent
FROM users u
INNER JOIN top_customers tc ON u.id = tc.user_id
ORDER BY tc.total_spent DESC;
```

### Complex Business Logic

```sql
-- Phân tích doanh thu theo category và tháng
WITH monthly_sales AS (
    SELECT 
        p.category_id,
        DATE_FORMAT(o.created_at, '%Y-%m') as month,
        SUM(oi.quantity * oi.price) as revenue,
        COUNT(DISTINCT o.id) as order_count
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.created_at >= '2024-01-01'
    GROUP BY p.category_id, DATE_FORMAT(o.created_at, '%Y-%m')
),
category_totals AS (
    SELECT 
        category_id,
        SUM(revenue) as total_revenue,
        AVG(revenue) as avg_monthly_revenue,
        COUNT(*) as months_with_sales
    FROM monthly_sales
    GROUP BY category_id
),
category_ranking AS (
    SELECT 
        c.name as category_name,
        ct.total_revenue,
        ct.avg_monthly_revenue,
        ct.months_with_sales,
        RANK() OVER (ORDER BY ct.total_revenue DESC) as revenue_rank
    FROM category_totals ct
    JOIN categories c ON ct.category_id = c.id
)
SELECT * FROM category_ranking
WHERE revenue_rank <= 10;
```

### Data Transformation

```sql
-- Transform dữ liệu từ flat structure sang hierarchical
WITH user_activity AS (
    SELECT 
        user_id,
        DATE(created_at) as activity_date,
        COUNT(*) as daily_actions,
        SUM(CASE WHEN action_type = 'purchase' THEN 1 ELSE 0 END) as purchases,
        SUM(CASE WHEN action_type = 'view' THEN 1 ELSE 0 END) as views
    FROM user_actions
    WHERE created_at >= '2024-01-01'
    GROUP BY user_id, DATE(created_at)
),
user_summary AS (
    SELECT 
        user_id,
        COUNT(*) as active_days,
        SUM(daily_actions) as total_actions,
        SUM(purchases) as total_purchases,
        SUM(views) as total_views,
        AVG(daily_actions) as avg_daily_actions
    FROM user_activity
    GROUP BY user_id
),
user_segments AS (
    SELECT 
        user_id,
        total_actions,
        total_purchases,
        total_views,
        CASE 
            WHEN total_purchases >= 10 THEN 'High Value'
            WHEN total_purchases >= 5 THEN 'Medium Value'
            WHEN total_purchases >= 1 THEN 'Low Value'
            ELSE 'No Purchase'
        END as customer_segment
    FROM user_summary
)
SELECT 
    customer_segment,
    COUNT(*) as customer_count,
    AVG(total_actions) as avg_actions,
    AVG(total_purchases) as avg_purchases
FROM user_segments
GROUP BY customer_segment
ORDER BY avg_purchases DESC;
```

## 🔄 Recursive CTE

### Basic Recursive Example

```sql
-- Tạo sequence numbers
WITH RECURSIVE numbers AS (
    SELECT 1 as n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 100
)
SELECT * FROM numbers;
```

### Hierarchical Data - Employee Tree

```sql
-- Tạo bảng employee hierarchy
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    manager_id INT,
    salary DECIMAL(10,2),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

INSERT INTO employees VALUES
(1, 'CEO', NULL, 100000),
(2, 'CTO', 1, 80000),
(3, 'CFO', 1, 80000),
(4, 'Dev Lead', 2, 60000),
(5, 'Dev 1', 4, 50000),
(6, 'Dev 2', 4, 50000),
(7, 'Accountant', 3, 45000);

-- Query hierarchical structure
WITH RECURSIVE employee_tree AS (
    -- Base case: CEO (root)
    SELECT 
        id, name, manager_id, salary,
        0 as level,
        CAST(name AS CHAR(1000)) as path
    FROM employees 
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: employees with managers
    SELECT 
        e.id, e.name, e.manager_id, e.salary,
        et.level + 1,
        CONCAT(et.path, ' > ', e.name) as path
    FROM employees e
    INNER JOIN employee_tree et ON e.manager_id = et.id
)
SELECT 
    level,
    name,
    salary,
    path
FROM employee_tree
ORDER BY path;
```

### Date Range Generation

```sql
-- Tạo date range cho báo cáo
WITH RECURSIVE date_range AS (
    SELECT '2024-01-01' as date_value
    UNION ALL
    SELECT DATE_ADD(date_value, INTERVAL 1 DAY)
    FROM date_range
    WHERE date_value < '2024-12-31'
)
SELECT 
    date_value,
    DAYNAME(date_value) as day_name,
    MONTH(date_value) as month,
    YEAR(date_value) as year
FROM date_range
WHERE DAYOFWEEK(date_value) NOT IN (1, 7) -- Exclude weekends
ORDER BY date_value;
```

### Product Categories Hierarchy

```sql
-- Tạo bảng categories với parent-child relationship
CREATE TABLE categories (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    parent_id INT,
    level INT DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

INSERT INTO categories VALUES
(1, 'Electronics', NULL, 0),
(2, 'Computers', 1, 1),
(3, 'Laptops', 2, 2),
(4, 'Desktops', 2, 2),
(5, 'Phones', 1, 1),
(6, 'Smartphones', 5, 2),
(7, 'Accessories', 1, 1);

-- Query hierarchical categories
WITH RECURSIVE category_tree AS (
    -- Base case: root categories
    SELECT 
        id, name, parent_id, level,
        CAST(name AS CHAR(1000)) as path,
        0 as depth
    FROM categories 
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case: child categories
    SELECT 
        c.id, c.name, c.parent_id, c.level,
        CONCAT(ct.path, ' > ', c.name) as path,
        ct.depth + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT 
    depth,
    name,
    path,
    level
FROM category_tree
ORDER BY path;
```

## 🚀 Performance và Optimization

### CTE vs Subquery Performance

```sql
-- So sánh performance: CTE vs Subquery
-- Method 1: Subquery (slower)
SELECT 
    u.name,
    (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count,
    (SELECT SUM(total) FROM orders WHERE user_id = u.id) as total_spent
FROM users u
WHERE u.created_at >= '2024-01-01';

-- Method 2: CTE (faster)
WITH user_stats AS (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total) as total_spent
    FROM orders
    WHERE created_at >= '2024-01-01'
    GROUP BY user_id
)
SELECT 
    u.name,
    us.order_count,
    us.total_spent
FROM users u
LEFT JOIN user_stats us ON u.id = us.user_id
WHERE u.created_at >= '2024-01-01';
```

### Indexing Strategy

```sql
-- Tạo indexes cho CTE performance
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);
CREATE INDEX idx_orders_created_total ON orders(created_at, total);
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);

-- CTE với index optimization
WITH optimized_sales AS (
    SELECT 
        user_id,
        DATE(created_at) as sale_date,
        SUM(total) as daily_revenue
    FROM orders
    WHERE created_at >= '2024-01-01'
        AND status = 'completed'
    GROUP BY user_id, DATE(created_at)
    HAVING SUM(total) > 100 -- Filter early
)
SELECT 
    u.name,
    COUNT(*) as active_days,
    SUM(daily_revenue) as total_revenue
FROM users u
INNER JOIN optimized_sales os ON u.id = os.user_id
GROUP BY u.id, u.name
ORDER BY total_revenue DESC;
```

### Memory Optimization

```sql
-- CTE với memory optimization
WITH filtered_data AS (
    SELECT 
        user_id,
        created_at,
        total,
        status
    FROM orders
    WHERE created_at >= '2024-01-01'
        AND total > 50 -- Early filtering
        AND status IN ('completed', 'processing')
),
aggregated_data AS (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total) as total_spent,
        AVG(total) as avg_order
    FROM filtered_data
    GROUP BY user_id
    HAVING COUNT(*) >= 3 -- Additional filtering
)
SELECT * FROM aggregated_data
ORDER BY total_spent DESC
LIMIT 100; -- Limit result set
```

## 📊 Real-world Examples

### E-commerce Analytics

```sql
-- Phân tích hành vi mua hàng
WITH customer_purchase_behavior AS (
    SELECT 
        user_id,
        COUNT(*) as total_orders,
        SUM(total) as total_spent,
        AVG(total) as avg_order_value,
        MIN(created_at) as first_order,
        MAX(created_at) as last_order,
        DATEDIFF(MAX(created_at), MIN(created_at)) as customer_lifetime_days
    FROM orders
    WHERE status = 'completed'
    GROUP BY user_id
),
customer_segments AS (
    SELECT 
        user_id,
        total_orders,
        total_spent,
        avg_order_value,
        customer_lifetime_days,
        CASE 
            WHEN total_spent >= 1000 THEN 'VIP'
            WHEN total_spent >= 500 THEN 'Regular'
            WHEN total_spent >= 100 THEN 'Occasional'
            ELSE 'New'
        END as segment,
        CASE 
            WHEN customer_lifetime_days > 365 THEN 'Long-term'
            WHEN customer_lifetime_days > 90 THEN 'Medium-term'
            ELSE 'Short-term'
        END as tenure
    FROM customer_purchase_behavior
),
segment_analysis AS (
    SELECT 
        segment,
        tenure,
        COUNT(*) as customer_count,
        AVG(total_spent) as avg_spent,
        AVG(total_orders) as avg_orders,
        AVG(avg_order_value) as avg_order_value
    FROM customer_segments
    GROUP BY segment, tenure
)
SELECT * FROM segment_analysis
ORDER BY segment, tenure;
```

### Inventory Management

```sql
-- Quản lý inventory với CTE
WITH product_sales AS (
    SELECT 
        product_id,
        SUM(quantity) as total_sold,
        COUNT(DISTINCT order_id) as order_count,
        AVG(price) as avg_price
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND o.status = 'completed'
    GROUP BY product_id
),
inventory_status AS (
    SELECT 
        p.id,
        p.name,
        p.stock_quantity,
        p.reorder_level,
        COALESCE(ps.total_sold, 0) as monthly_sales,
        COALESCE(ps.avg_price, p.price) as current_price,
        p.stock_quantity - COALESCE(ps.total_sold, 0) as projected_stock
    FROM products p
    LEFT JOIN product_sales ps ON p.id = ps.product_id
),
inventory_alerts AS (
    SELECT 
        id,
        name,
        stock_quantity,
        monthly_sales,
        projected_stock,
        CASE 
            WHEN projected_stock <= 0 THEN 'Out of Stock'
            WHEN projected_stock <= reorder_level THEN 'Reorder Needed'
            WHEN projected_stock <= reorder_level * 2 THEN 'Low Stock'
            ELSE 'Sufficient'
        END as stock_status
    FROM inventory_status
)
SELECT * FROM inventory_alerts
WHERE stock_status IN ('Out of Stock', 'Reorder Needed')
ORDER BY stock_status, projected_stock;
```

### Financial Reporting

```sql
-- Báo cáo tài chính với CTE
WITH monthly_revenue AS (
    SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(total) as revenue,
        COUNT(*) as order_count,
        AVG(total) as avg_order_value
    FROM orders
    WHERE status = 'completed'
        AND created_at >= '2024-01-01'
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
),
monthly_expenses AS (
    SELECT 
        DATE_FORMAT(expense_date, '%Y-%m') as month,
        SUM(amount) as total_expenses
    FROM expenses
    WHERE expense_date >= '2024-01-01'
    GROUP BY DATE_FORMAT(expense_date, '%Y-%m')
),
monthly_profit AS (
    SELECT 
        mr.month,
        mr.revenue,
        COALESCE(me.total_expenses, 0) as expenses,
        mr.revenue - COALESCE(me.total_expenses, 0) as profit,
        mr.order_count,
        mr.avg_order_value
    FROM monthly_revenue mr
    LEFT JOIN monthly_expenses me ON mr.month = me.month
),
profit_trends AS (
    SELECT 
        month,
        revenue,
        expenses,
        profit,
        order_count,
        avg_order_value,
        LAG(profit) OVER (ORDER BY month) as prev_month_profit,
        (profit - LAG(profit) OVER (ORDER BY month)) / LAG(profit) OVER (ORDER BY month) * 100 as profit_growth_pct
    FROM monthly_profit
)
SELECT 
    month,
    revenue,
    expenses,
    profit,
    profit_growth_pct,
    order_count,
    avg_order_value
FROM profit_trends
ORDER BY month;
```

## 🛠️ Best Practices

### Naming Conventions

```sql
-- Good naming conventions
WITH user_order_summary AS (
    SELECT user_id, COUNT(*) as order_count
    FROM orders GROUP BY user_id
),
user_revenue_analysis AS (
    SELECT user_id, SUM(total) as total_revenue
    FROM orders GROUP BY user_id
)
SELECT * FROM user_order_summary uos
JOIN user_revenue_analysis ura ON uos.user_id = ura.user_id;

-- Avoid: generic names like 'temp', 'data', 'result'
```

### Structure và Readability

```sql
-- Well-structured CTE
WITH 
-- Step 1: Filter relevant data
filtered_orders AS (
    SELECT *
    FROM orders
    WHERE created_at >= '2024-01-01'
        AND status = 'completed'
),

-- Step 2: Calculate user metrics
user_metrics AS (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total) as total_spent,
        AVG(total) as avg_order
    FROM filtered_orders
    GROUP BY user_id
),

-- Step 3: Apply business logic
user_segments AS (
    SELECT 
        user_id,
        order_count,
        total_spent,
        avg_order,
        CASE 
            WHEN total_spent >= 1000 THEN 'VIP'
            WHEN total_spent >= 500 THEN 'Regular'
            ELSE 'Standard'
        END as segment
    FROM user_metrics
)

-- Final result
SELECT * FROM user_segments
ORDER BY total_spent DESC;
```

### Performance Tips

```sql
-- Performance optimization tips
WITH optimized_cte AS (
    SELECT 
        user_id,
        created_at,
        total
    FROM orders
    WHERE created_at >= '2024-01-01' -- Early filtering
        AND total > 0 -- Additional filter
        AND status = 'completed' -- Status filter
    -- Use LIMIT if possible
    LIMIT 10000
),
aggregated_data AS (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total) as total_spent
    FROM optimized_cte
    GROUP BY user_id
    HAVING COUNT(*) >= 2 -- Post-aggregation filter
)
SELECT * FROM aggregated_data
ORDER BY total_spent DESC;
```

## 🔧 Troubleshooting

### Common Issues

```sql
-- Issue 1: Recursive CTE without base case
-- ❌ Wrong
WITH RECURSIVE numbers AS (
    SELECT n + 1 FROM numbers WHERE n < 100
)
SELECT * FROM numbers;

-- ✅ Correct
WITH RECURSIVE numbers AS (
    SELECT 1 as n  -- Base case
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 100
)
SELECT * FROM numbers;

-- Issue 2: Missing UNION ALL in recursive CTE
-- ❌ Wrong
WITH RECURSIVE numbers AS (
    SELECT 1 as n
    SELECT n + 1 FROM numbers WHERE n < 100
)
SELECT * FROM numbers;

-- ✅ Correct
WITH RECURSIVE numbers AS (
    SELECT 1 as n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 100
)
SELECT * FROM numbers;
```

### Debug Techniques

```sql
-- Debug CTE step by step
WITH step1 AS (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    WHERE created_at >= '2024-01-01'
    GROUP BY user_id
),
step2 AS (
    SELECT user_id, order_count
    FROM step1
    WHERE order_count >= 5
)
-- Debug each step
SELECT 'Step 1' as step, COUNT(*) as record_count FROM step1
UNION ALL
SELECT 'Step 2' as step, COUNT(*) as record_count FROM step2;
```

### Error Handling

```sql
-- Handle potential errors in CTE
WITH safe_calculations AS (
    SELECT 
        user_id,
        total,
        CASE 
            WHEN total > 0 THEN total
            ELSE 0
        END as safe_total,
        CASE 
            WHEN total IS NULL THEN 0
            ELSE total
        END as null_safe_total
    FROM orders
    WHERE created_at >= '2024-01-01'
),
user_summary AS (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(safe_total) as total_spent,
        AVG(null_safe_total) as avg_order
    FROM safe_calculations
    GROUP BY user_id
)
SELECT * FROM user_summary
WHERE total_spent > 0;
```

## 📚 Tài liệu tham khảo

### Official Documentation

*   [MySQL CTE Documentation](https://dev.mysql.com/doc/refman/8.0/en/with.html)
*   [MySQL Recursive CTE](https://dev.mysql.com/doc/refman/8.0/en/with.html#common-table-expressions-recursive)
*   [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

### Learning Resources

*   [MySQL CTE Examples](https://www.mysqltutorial.org/mysql-cte/)
*   [Recursive CTE Tutorial](https://www.mysqltutorial.org/mysql-recursive-cte/)
*   [SQL Performance Best Practices](https://use-the-index-luke.com/)

### Tools & Extensions

*   [MySQL Workbench](https://www.mysql.com/products/workbench/)
*   [MySQL Performance Schema](https://dev.mysql.com/doc/refman/8.0/en/performance-schema.html)
*   [MySQL Explain](https://dev.mysql.com/doc/refman/8.0/en/explain.html)

* * *

**🎯 Kết quả sau khi học MySQL CTE:**

*   ✅ Hiểu sâu về Common Table Expressions và recursive queries
*   ✅ Thành thạo viết complex queries sạch sẽ và dễ đọc
*   ✅ Áp dụng CTE cho data analysis và reporting
*   ✅ Optimize performance với proper indexing và structure
*   ✅ Build hierarchical data queries và recursive solutions
*   ✅ Contribute vào SQL best practices và query optimization