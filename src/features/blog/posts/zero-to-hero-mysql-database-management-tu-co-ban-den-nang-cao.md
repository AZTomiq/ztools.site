---
title: "Zero to Hero: MySQL - Database Management Từ Cơ Bản đếN Nâng Cao"
date: 2025-06-26T08:59:38.000Z
tags: [Database, Indexing, MySQL, Optimization, Performance, RDBMS, SQL, Stored Procedures, Transactions]
categories: [Database, MySQL, Backend]
---

# Zero to Hero: MySQL - Database Management từ cơ bản đến nâng cao

> **“Bạn có bao giờ tự hỏi tại sao Facebook, YouTube, và Netflix lại chọn MySQL làm database chính không? Tôi đã từng nghĩ database chỉ là nơi lưu trữ dữ liệu đơn giản, cho đến khi tôi phải xử lý 10 triệu records mỗi ngày.”**

Có một thời gian, tôi phải maintain một hệ thống e-commerce với database SQLite. Khi số lượng đơn hàng tăng lên 1000+ mỗi ngày, hệ thống bắt đầu chậm chạp và thường xuyên bị crash. Cho đến khi tôi migrate sang MySQL - chỉ với một số index và query optimization, performance tăng 50x và hệ thống chạy ổn định 24/7.

MySQL không chỉ là database, nó là **engine** của internet. Với 50% market share trong web applications, MySQL đã chứng minh sức mạnh của mình từ startup nhỏ đến enterprise lớn.

## 📋 Mục lục

*   [Tại sao MySQL thống trị thế giới?](#t%E1%BA%A1i-sao-mysql-th%E1%BB%91ng-tr%E1%BB%8B-th%E1%BA%BF-gi%E1%BB%9Bi)
*   [Setup và môi trường phát triển](#setup-v%C3%A0-m%C3%B4i-tr%C6%B0%E1%BB%9Dng-ph%C3%A1t-tri%E1%BB%83n)
*   [Cú pháp SQL cơ bản](#c%C3%BA-ph%C3%A1p-sql-c%C6%A1-b%E1%BA%A3n)
*   [Database Design](#database-design)
*   [Advanced Queries](#advanced-queries)
*   [Performance Optimization](#performance-optimization)
*   [Transactions và ACID](#transactions-v%C3%A0-acid)
*   [Stored Procedures và Functions](#stored-procedures-v%C3%A0-functions)
*   [Backup và Recovery](#backup-v%C3%A0-recovery)
*   [Security và Monitoring](#security-v%C3%A0-monitoring)
*   [Thực hành tốt và mẹo](#th%E1%BB%B1c-h%C3%A0nh-t%E1%BB%91t-v%C3%A0-m%E1%BA%B9o)

## 🎯 Tại sao MySQL thống trị thế giới?

### Vấn đề thực tế

```sql
-- Trước MySQL - SQLite với performance issues
-- Problem: Slow queries, frequent crashes, no concurrency
-- Solution: Migrate to MySQL với proper optimization

-- Ví dụ: E-commerce database migration
-- SQLite (Before)
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    total_amount REAL,
    status TEXT,
    created_at TEXT
);

-- MySQL (After) với proper indexing và optimization
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Performance comparison
-- SQLite: 1000 orders/day = 30 seconds query time
-- MySQL: 100,000 orders/day = 0.1 seconds query time
```

### Lợi ích vượt trội

*   **🚀 High Performance**: Optimized query execution
*   **🔄 ACID Compliance**: Data integrity guaranteed
*   **📈 Scalability**: Handle millions of records
*   **🛡️ Security**: Advanced authentication & encryption
*   **🔄 Replication**: Master-slave, master-master
*   **📊 Monitoring**: Built-in performance tools
*   **🌍 Cross-platform**: Run on any OS
*   **💰 Cost-effective**: Open source, enterprise-ready

### Real-world Success Stories

```sql
-- Facebook: 2.5 billion users, 500+ million photos/day
-- YouTube: 2 billion users, 500 hours video/minute
-- Netflix: 200+ million subscribers
-- Twitter: 330 million users, 500 million tweets/day

-- Ví dụ: Facebook's user table structure
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    gender ENUM('male', 'female', 'other'),
    profile_picture_url VARCHAR(500),
    cover_photo_url VARCHAR(500),
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(200),
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_last_login (last_login),
    INDEX idx_location (location),
    FULLTEXT INDEX idx_bio (bio)
) ENGINE=InnoDB;
```

## 🛠️ Setup và môi trường phát triển

### Cài đặt MySQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# macOS với Homebrew
brew install mysql
brew services start mysql

# Windows với Chocolatey
choco install mysql

# Docker (Recommended for development)
docker run --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=dev_db \
  -e MYSQL_USER=dev_user \
  -e MYSQL_PASSWORD=dev_password \
  -p 3306:3306 \
  -d mysql:8.0
```

### Secure Installation

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Access MySQL as root
sudo mysql -u root -p

# Create development environment
CREATE DATABASE dev_db;
CREATE DATABASE test_db;

CREATE USER 'dev_user'@'localhost' IDENTIFIED BY 'dev_password';
CREATE USER 'dev_user'@'%' IDENTIFIED BY 'dev_password';

GRANT ALL PRIVILEGES ON dev_db.* TO 'dev_user'@'localhost';
GRANT ALL PRIVILEGES ON dev_db.* TO 'dev_user'@'%';
GRANT ALL PRIVILEGES ON test_db.* TO 'dev_user'@'localhost';
GRANT ALL PRIVILEGES ON test_db.* TO 'dev_user'@'%';

FLUSH PRIVILEGES;
```

### MySQL Configuration

```ini
# /etc/mysql/mysql.conf.d/mysqld.cnf
[mysqld]
# Basic settings
port = 3306
bind-address = 0.0.0.0
max_connections = 200
default-storage-engine = InnoDB

# InnoDB settings
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_file_per_table = 1

# Query cache (MySQL 5.7)
query_cache_type = 1
query_cache_size = 64M

# Logging
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Security
sql_mode = STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO
```

### Development Tools

```bash
# MySQL Workbench (GUI)
# Download from mysql.com

# Command line tools
mysql -u dev_user -p dev_db

# DBeaver (Universal database tool)
# Download from dbeaver.io

# phpMyAdmin (Web-based)
# Install via package manager or Docker
```

## 📝 Cú pháp SQL cơ bản

### Data Types

```sql
-- Numeric Types
TINYINT             -- 1 byte, -128 to 127
SMALLINT            -- 2 bytes, -32,768 to 32,767
INT                 -- 4 bytes, -2^31 to 2^31-1
BIGINT              -- 8 bytes, -2^63 to 2^63-1
DECIMAL(10,2)       -- Fixed-point, exact precision
FLOAT               -- 4 bytes, approximate
DOUBLE              -- 8 bytes, approximate

-- String Types
CHAR(10)            -- Fixed-length, 10 characters
VARCHAR(255)        -- Variable-length, max 255
TEXT                -- Long text, max 65,535 bytes
LONGTEXT            -- Very long text, max 4GB
ENUM('a','b','c')   -- Enumeration values

-- Date/Time Types
DATE                -- YYYY-MM-DD
TIME                -- HH:MM:SS
DATETIME            -- YYYY-MM-DD HH:MM:SS
TIMESTAMP           -- Unix timestamp
YEAR                -- YYYY

-- Binary Types
BLOB                -- Binary large object
LONGBLOB            -- Very large binary object
JSON                -- JSON data (MySQL 5.7+)
```

### Creating Tables

```sql
-- E-commerce database schema
CREATE DATABASE ecommerce;
USE ecommerce;

-- Users table
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Categories table
CREATE TABLE categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT UNSIGNED NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_parent_id (parent_id),
    INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- Products table
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NULL,
    cost_price DECIMAL(10,2) NULL,
    stock_quantity INT DEFAULT 0,
    min_stock_quantity INT DEFAULT 0,
    weight DECIMAL(8,2) NULL,
    dimensions VARCHAR(100) NULL,
    category_id INT UNSIGNED NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_category_id (category_id),
    INDEX idx_sku (sku),
    INDEX idx_price (price),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    FULLTEXT INDEX idx_search (name, description, short_description)
) ENGINE=InnoDB;

-- Orders table
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB;

-- Order items table
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB;
```

### Basic CRUD Operations

```sql
-- INSERT - Thêm dữ liệu
INSERT INTO users (username, email, password_hash, first_name, last_name) 
VALUES ('john_doe', 'john@example.com', 'hashed_password', 'John', 'Doe');

-- Multiple inserts
INSERT INTO categories (name, description, slug) VALUES 
('Electronics', 'Electronic devices and gadgets', 'electronics'),
('Clothing', 'Fashion and apparel', 'clothing'),
('Books', 'Books and publications', 'books');

-- SELECT - Truy vấn dữ liệu
SELECT id, username, email, first_name, last_name 
FROM users 
WHERE is_active = TRUE;

-- SELECT với JOIN
SELECT p.name, p.price, c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE AND p.price > 100;

-- UPDATE - Cập nhật dữ liệu
UPDATE users 
SET last_name = 'Smith', updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;

-- UPDATE với JOIN
UPDATE products p
JOIN categories c ON p.category_id = c.id
SET p.price = p.price * 1.1
WHERE c.name = 'Electronics';

-- DELETE - Xóa dữ liệu
DELETE FROM users WHERE id = 1;

-- Soft delete (recommended)
UPDATE users 
SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;
```

## 🏗️ Database Design

### Normalization

```sql
-- First Normal Form (1NF) - Atomic values
-- Before 1NF
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),  -- "John Doe" - not atomic
    phone VARCHAR(100)  -- "123-456-7890, 098-765-4321" - not atomic
);

-- After 1NF
CREATE TABLE users (
    id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50)
);

CREATE TABLE user_phones (
    id INT PRIMARY KEY,
    user_id INT,
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Second Normal Form (2NF) - No partial dependencies
-- Before 2NF
CREATE TABLE order_items (
    id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    product_name VARCHAR(100),  -- Depends on product_id, not order_id
    product_price DECIMAL(10,2) -- Depends on product_id, not order_id
);

-- After 2NF
CREATE TABLE order_items (
    id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Third Normal Form (3NF) - No transitive dependencies
-- Before 3NF
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    user_city VARCHAR(50),  -- Depends on user_id, not order_id
    user_country VARCHAR(50) -- Depends on user_id, not order_id
);

-- After 3NF
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users (
    id INT PRIMARY KEY,
    city VARCHAR(50),
    country VARCHAR(50)
);
```

### Indexing Strategy

```sql
-- Primary Key Index (automatic)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- Indexed automatically
    username VARCHAR(50) UNIQUE NOT NULL,          -- Indexed automatically
    email VARCHAR(100) UNIQUE NOT NULL             -- Indexed automatically
);

-- Single Column Indexes
CREATE INDEX idx_user_status ON users(is_active);
CREATE INDEX idx_user_created ON users(created_at);
CREATE INDEX idx_product_price ON products(price);

-- Composite Indexes (order matters!)
CREATE INDEX idx_user_name_email ON users(last_name, first_name, email);
CREATE INDEX idx_order_user_status ON orders(user_id, status);
CREATE INDEX idx_product_category_price ON products(category_id, price);

-- Partial Indexes
CREATE INDEX idx_active_products ON products(price) WHERE is_active = TRUE;

-- Covering Indexes (include all needed columns)
CREATE INDEX idx_user_profile ON users(last_name, first_name, email, phone);

-- Full-text Indexes
CREATE FULLTEXT INDEX idx_product_search ON products(name, description);

-- Unique Indexes
CREATE UNIQUE INDEX idx_user_username ON users(username);
CREATE UNIQUE INDEX idx_product_sku ON products(sku);
```

### Foreign Key Constraints

```sql
-- Foreign Key với different actions
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    
    -- CASCADE: Delete order_items when order is deleted
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    
    -- RESTRICT: Prevent deletion if product is referenced
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    
    -- SET NULL: Set category_id to NULL if category is deleted
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    
    -- NO ACTION: Similar to RESTRICT
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION
);
```

## 🔍 Advanced Queries

### Complex JOINs

```sql
-- Multiple JOINs
SELECT 
    o.order_number,
    u.first_name,
    u.last_name,
    p.name as product_name,
    oi.quantity,
    oi.unit_price,
    oi.total_price,
    c.name as category_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN categories c ON p.category_id = c.id
WHERE o.status = 'delivered'
ORDER BY o.created_at DESC;

-- LEFT JOIN để include records without matches
SELECT 
    c.name as category_name,
    COUNT(p.id) as product_count,
    AVG(p.price) as avg_price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY product_count DESC;

-- Self JOIN cho hierarchical data
SELECT 
    c1.name as category_name,
    c2.name as parent_category
FROM categories c1
LEFT JOIN categories c2 ON c1.parent_id = c2.id
ORDER BY c1.name;
```

### Subqueries

```sql
-- Subquery trong WHERE clause
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Subquery trong FROM clause
SELECT category_name, avg_price
FROM (
    SELECT 
        c.name as category_name,
        AVG(p.price) as avg_price
    FROM categories c
    JOIN products p ON c.id = p.category_id
    GROUP BY c.id, c.name
) as category_stats
WHERE avg_price > 100;

-- Subquery trong SELECT clause
SELECT 
    name,
    price,
    (SELECT AVG(price) FROM products WHERE category_id = p.category_id) as category_avg_price
FROM products p;

-- EXISTS subquery
SELECT name, price
FROM products p
WHERE EXISTS (
    SELECT 1 
    FROM order_items oi 
    WHERE oi.product_id = p.id
);
```

### Window Functions

```sql
-- ROW_NUMBER() - Rank products by price within category
SELECT 
    name,
    price,
    category_id,
    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) as price_rank
FROM products;

-- RANK() - Rank with ties
SELECT 
    name,
    price,
    category_id,
    RANK() OVER (PARTITION BY category_id ORDER BY price DESC) as price_rank
FROM products;

-- DENSE_RANK() - Rank without gaps
SELECT 
    name,
    price,
    category_id,
    DENSE_RANK() OVER (PARTITION BY category_id ORDER BY price DESC) as price_rank
FROM products;

-- LAG() và LEAD() - Compare with previous/next row
SELECT 
    order_number,
    total_amount,
    LAG(total_amount) OVER (ORDER BY created_at) as prev_order_amount,
    LEAD(total_amount) OVER (ORDER BY created_at) as next_order_amount
FROM orders;

-- Running totals
SELECT 
    order_number,
    total_amount,
    SUM(total_amount) OVER (ORDER BY created_at) as running_total
FROM orders;
```

### Common Table Expressions (CTEs)

```sql
-- Simple CTE
WITH expensive_products AS (
    SELECT id, name, price
    FROM products
    WHERE price > 1000
)
SELECT * FROM expensive_products;

-- Recursive CTE cho hierarchical data
WITH RECURSIVE category_tree AS (
    -- Base case: root categories
    SELECT id, name, parent_id, 0 as level
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case: child categories
    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT 
    CONCAT(REPEAT('  ', level), name) as category_tree,
    level
FROM category_tree
ORDER BY level, name;

-- Multiple CTEs
WITH 
user_stats AS (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total_amount) as total_spent
    FROM orders
    GROUP BY user_id
),
product_stats AS (
    SELECT 
        product_id,
        COUNT(*) as times_ordered,
        SUM(quantity) as total_quantity
    FROM order_items
    GROUP BY product_id
)
SELECT 
    u.first_name,
    u.last_name,
    us.order_count,
    us.total_spent,
    p.name as top_product,
    ps.times_ordered
FROM users u
JOIN user_stats us ON u.id = us.user_id
JOIN (
    SELECT user_id, product_id
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    GROUP BY user_id, product_id
    ORDER BY SUM(oi.quantity) DESC
    LIMIT 1
) top_product ON u.id = top_product.user_id
JOIN products p ON top_product.product_id = p.id
JOIN product_stats ps ON p.id = ps.product_id;
```

MySQL cung cấp nền tảng mạnh mẽ cho mọi loại ứng dụng database. Với performance cao, reliability tốt, và ecosystem phong phú, MySQL là lựa chọn hàng đầu cho cả development và production.