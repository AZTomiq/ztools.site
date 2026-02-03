---
title: "Circuit Breaker Pattern Cho Tui"
date: 2025-06-20T10:28:09.000Z
tags: [design-pattern, javascript, microservices, nodejs]
categories: [javascript]
---

# Circuit Breaker Pattern - “Cầu dao tự động” cho hệ thống! ⚡

## Circuit Breaker là cái gì?

**Circuit Breaker** là một design pattern giống như **cầu dao điện** trong nhà bạn. Khi có chập điện (service lỗi), nó sẽ tự động **ngắt** để bảo vệ toàn bộ hệ thống khỏi bị cháy! 🔥

> **Ví dụ đời thường**: Khi tủ lạnh chập điện, cầu dao tự ngắt để không làm cháy cả nhà. Sau một lúc, bạn thử bật lại xem đã ổn chưa.

## Tại sao cần Circuit Breaker?

### 🔥 **Vấn đề khi không có Circuit Breaker:**

```javascript
// Service A gọi Service B
async function getUserData(userId) {
    try {
        // Service B đang down, mỗi request đều timeout sau 30s
        const response = await fetch(`http://service-b/users/${userId}`, {
            timeout: 30000
        });
        return response.json();
    } catch (error) {
        // Cứ 30s mới biết lỗi, tốn tài nguyên vô ích!
        console.log('Service B is down!');
        throw error;
    }
}

// Kết quả: 1000 requests = 1000 x 30s = 8.3 giờ chờ đợi vô nghĩa! 😱
```

### ✅ **Với Circuit Breaker:**

```javascript
// Sau 3 lần fail, ngắt luôn trong 60s
const circuitBreaker = new CircuitBreaker(getUserData, {
    failureThreshold: 3,    // 3 lần fail thì ngắt
    timeout: 5000,          // Timeout 5s thay vì 30s
    resetTimeout: 60000     // Thử lại sau 60s
});

// Kết quả: Fail nhanh, tiết kiệm tài nguyên, user experience tốt hơn!
```

## 3 trạng thái của Circuit Breaker

### 🟢 **CLOSED (Đóng) - Hoạt động bình thường**

*   Requests được chuyển tiếp bình thường
*   Đếm số lần fail
*   Khi fail đạt threshold → chuyển sang OPEN

### 🔴 **OPEN (Mở) - Ngắt hoàn toàn**

*   Tất cả requests bị reject ngay lập tức
*   Không gọi service nữa (fast fail)
*   Sau một khoảng thời gian → chuyển sang HALF-OPEN

### 🟡 **HALF-OPEN (Nửa mở) - Thử nghiệm**

*   Cho phép một số requests thử nghiệm
*   Nếu thành công → về CLOSED
*   Nếu fail → về OPEN

## Implement Circuit Breaker bằng JavaScript

### Phiên bản đơn giản:

```javascript
class SimpleCircuitBreaker {
    constructor(fn, options = {}) {
        this.fn = fn;
        this.failureThreshold = options.failureThreshold || 3;
        this.resetTimeout = options.resetTimeout || 60000;
        this.timeout = options.timeout || 5000;
        
        // State
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.lastFailureTime = null;
    }
    
    async call(...args) {
        // Kiểm tra state hiện tại
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime < this.resetTimeout) {
                throw new Error('Circuit breaker is OPEN');
            }
            // Chuyển sang HALF-OPEN để thử
            this.state = 'HALF-OPEN';
        }
        
        try {
            // Thực hiện request với timeout
            const result = await Promise.race([
                this.fn(...args),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), this.timeout)
                )
            ]);
            
            // Thành công → reset về CLOSED
            this.reset();
            return result;
            
        } catch (error) {
            // Fail → tăng counter
            this.recordFailure();
            throw error;
        }
    }
    
    recordFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
    
    reset() {
        this.failureCount = 0;
        this.state = 'CLOSED';
        this.lastFailureTime = null;
    }
}
```

### Sử dụng thực tế:

```javascript
// Tạo circuit breaker cho API call
const apiCall = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
};

const protectedApiCall = new SimpleCircuitBreaker(apiCall, {
    failureThreshold: 3,
    resetTimeout: 30000,  // 30s
    timeout: 5000         // 5s
});

// Sử dụng
async function fetchUserData(userId) {
    try {
        return await protectedApiCall.call(`/api/users/${userId}`);
    } catch (error) {
        // Fallback strategy
        if (error.message === 'Circuit breaker is OPEN') {
            return { id: userId, name: 'Unknown', cached: true };
        }
        throw error;
    }
}
```

## Với thư viện có sẵn (opossum)

### Cài đặt:

```bash
npm install opossum
```

### Sử dụng:

```javascript
const CircuitBreaker = require('opossum');

// Function cần protect
async function fetchUserProfile(userId) {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    return response.json();
}

// Tạo circuit breaker
const breaker = new CircuitBreaker(fetchUserProfile, {
    timeout: 3000,          // 3s timeout
    errorThresholdPercentage: 50,  // 50% error rate
    resetTimeout: 30000,    // 30s reset time
    rollingCountTimeout: 10000,    // 10s rolling window
    rollingCountBuckets: 10        // 10 buckets
});

// Event listeners
breaker.on('open', () => console.log('Circuit breaker is OPEN'));
breaker.on('halfOpen', () => console.log('Circuit breaker is HALF-OPEN'));
breaker.on('close', () => console.log('Circuit breaker is CLOSED'));

// Fallback khi circuit breaker open
breaker.fallback((userId) => ({ 
    id: userId, 
    name: 'Service Unavailable',
    cached: true 
}));

// Sử dụng
async function getUserProfile(userId) {
    try {
        return await breaker.fire(userId);
    } catch (error) {
        console.error('Failed to get user profile:', error);
        throw error;
    }
}
```

## Ví dụ thực tế với Express.js

```javascript
const express = require('express');
const CircuitBreaker = require('opossum');
const app = express();

// Database connection với circuit breaker
const dbQuery = async (query) => {
    // Giả lập database query
    if (Math.random() < 0.3) { // 30% fail rate
        throw new Error('Database connection failed');
    }
    return { result: 'success', query };
};

const dbCircuitBreaker = new CircuitBreaker(dbQuery, {
    timeout: 2000,
    errorThresholdPercentage: 25,
    resetTimeout: 10000
});

// Fallback cho database
dbCircuitBreaker.fallback(() => ({
    result: 'cached',
    message: 'Database unavailable, serving cached data'
}));

// API endpoint
app.get('/api/data', async (req, res) => {
    try {
        const result = await dbCircuitBreaker.fire('SELECT * FROM users');
        res.json(result);
    } catch (error) {
        res.status(503).json({ 
            error: 'Service temporarily unavailable',
            circuitBreakerState: dbCircuitBreaker.stats
        });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

## Monitoring và Metrics

```javascript
// Theo dõi stats của circuit breaker
setInterval(() => {
    const stats = breaker.stats;
    console.log('Circuit Breaker Stats:', {
        requests: stats.requests,
        successes: stats.successes,
        failures: stats.failures,
        rejects: stats.rejects,
        rate: (stats.successes / stats.requests * 100).toFixed(2) + '%'
    });
}, 5000);

// Health check endpoint
app.get('/health', (req, res) => {
    const stats = breaker.stats;
    res.json({
        circuitBreaker: {
            state: breaker.opened ? 'OPEN' : breaker.halfOpen ? 'HALF-OPEN' : 'CLOSED',
            stats: stats
        }
    });
});
```

## Best Practices

### ✅ **Nên làm:**

*   Đặt timeout hợp lý (không quá ngắn, không quá dài)
*   Implement fallback strategy (cache, default values)
*   Monitor metrics và alerts
*   Test các scenarios: normal, failure, recovery

### ❌ **Không nên:**

*   Dùng circuit breaker cho mọi thứ (overkill)
*   Đặt threshold quá thấp (false positive)
*   Quên implement fallback
*   Hardcode config (nên dùng environment variables)

## Khi nào dùng Circuit Breaker?

### 🎯 **Phù hợp:**

*   Microservices architecture
*   External API calls
*   Database connections
*   Third-party services

### 🚫 **Không cần thiết:**

*   Internal function calls
*   File system operations
*   Simple CRUD operations

## Kết luận

Circuit Breaker Pattern giống như **bảo hiểm cho code** - bạn hy vọng không bao giờ phải dùng, nhưng khi cần thì nó cứu cả hệ thống! 🛡️

**Nhớ công thức:**

*   **CLOSED** = Hoạt động bình thường ✅
*   **OPEN** = Ngắt để bảo vệ 🔴
*   **HALF-OPEN** = Thử nghiệm cẩn thận 🟡

Giờ đi implement thôi! Hệ thống của bạn sẽ resilient hơn nhiều! 🚀

* * *

_“Fail fast, recover faster!”_ ⚡