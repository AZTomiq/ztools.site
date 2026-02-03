---
title: "Zero to Hero: Jest - Testing Framework Cho JavaScript"
date: 2025-01-27T03:00:00.000Z
tags: [Coverage, Integration Testing, JavaScript, Jest, Mocking, TDD, Testing, Unit Testing]
categories: [Testing, JavaScript, Jest]
---

# Zero to Hero: Jest - Testing Framework cho JavaScript

> **“Bạn có bao giờ thức dậy lúc 3 giờ sáng vì bug production không? Tôi đã từng, và đó là lý do tôi yêu Jest.”**

Có một thời gian, tôi phải debug một ứng dụng Node.js với hàng trăm function mà không có test nào. Mỗi lần deploy là một cuộc đánh cược với thần may mắn. Cho đến khi tôi gặp Jest - testing framework đã thay đổi hoàn toàn cách tôi viết code.

Jest không chỉ là một testing tool, nó là **philosophy** về cách viết code đáng tin cậy. Với zero-config setup, mocking mạnh mẽ, và coverage tích hợp, Jest giúp bạn xây dựng ứng dụng với sự tự tin tuyệt đối.

## 📋 Mục lục

*   [Tại sao Jest thay đổi cuộc chơi?](#t%E1%BA%A1i-sao-jest-thay-%C4%91%E1%BB%95i-cu%E1%BB%99c-ch%C6%A1i)
*   [Setup và cài đặt](#setup-v%C3%A0-c%C3%A0i-%C4%91%E1%BA%B7t)
*   [Viết test đầu tiên](#vi%E1%BA%BFt-test-%C4%91%E1%BA%A7u-ti%C3%AAn)
*   [Matchers và Assertions](#matchers-v%C3%A0-assertions)
*   [Mocking - Nghệ thuật giả lập](#mocking---ngh%E1%BB%87-thu%E1%BA%ADt-gi%E1%BA%A3-l%E1%BA%ADp)
*   [Snapshot Testing](#snapshot-testing)
*   [Integration Testing](#integration-testing)
*   [Testing Patterns nâng cao](#testing-patterns-n%C3%A2ng-cao)
*   [Performance Testing](#performance-testing)
*   [Thực hành tốt và mẹo](#th%E1%BB%B1c-h%C3%A0nh-t%E1%BB%91t-v%C3%A0-m%E1%BA%B9o)
*   [Xử lý sự cố thường gặp](#x%E1%BB%AD-l%C3%BD-s%E1%BB%B1-c%E1%BB%91-th%C6%B0%E1%BB%9Dng-g%E1%BA%B7p)

## 🎯 Tại sao Jest thay đổi cuộc chơi?

### Vấn đề thực tế

```javascript
// Trước khi có Jest - Code không test
function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
  }
  return total;
}

// Làm sao biết function này đúng?
// Làm sao biết nó xử lý edge cases?
// Làm sao biết nó không break khi refactor?
```

### Giải pháp với Jest

```javascript
// Sau khi có Jest - Code có test
describe('calculateTotal', () => {
  it('should calculate total correctly', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 }
    ];
    expect(calculateTotal(items)).toBe(35);
  });

  it('should handle empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('should handle zero quantity', () => {
    const items = [{ price: 10, quantity: 0 }];
    expect(calculateTotal(items)).toBe(0);
  });
});
```

### Lợi ích vượt trội

*   **🚀 Zero Configuration**: Không cần setup phức tạp
*   **🎭 Built-in Mocking**: Mock mọi thứ một cách dễ dàng
*   **📸 Snapshot Testing**: Visual regression testing
*   **📊 Code Coverage**: Biết chính xác code nào chưa test
*   **⚡ Parallel Execution**: Chạy test nhanh hơn
*   **👀 Watch Mode**: Tự động chạy lại khi code thay đổi
*   **🔍 Interactive Mode**: Debug test dễ dàng
*   **📈 Performance Testing**: Test hiệu suất code

## 🛠️ Setup và cài đặt

### Cài đặt Jest

```bash
# Cài đặt Jest
npm install --save-dev jest

# Hoặc với yarn
yarn add --dev jest

# Cài đặt thêm tools
npm install --save-dev @babel/core @babel/preset-env babel-jest
npm install --save-dev jest-environment-jsdom
```

### Cấu hình cơ bản

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  },
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.test.{js,jsx,ts,tsx}",
      "!src/**/*.spec.{js,jsx,ts,tsx}"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### Jest Config File (jest.config.js)

```javascript
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // File patterns
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  
  // Coverage settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{js,jsx,ts,tsx}'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Transform files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

## 🎬 Viết test đầu tiên

### Tình huống thực tế: E-commerce Cart

```javascript
// src/cart.js
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity = 1) {
    if (!product || !product.id) {
      throw new Error('Invalid product');
    }
    
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity
      });
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clear() {
    this.items = [];
  }

  applyDiscount(discountPercent) {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Invalid discount percentage');
    }
    
    const total = this.getTotal();
    return total * (1 - discountPercent / 100);
  }
}

module.exports = ShoppingCart;
```

### Test Suite hoàn chỉnh

```javascript
// src/cart.test.js
const ShoppingCart = require('./cart');

describe('ShoppingCart', () => {
  let cart;
  let product;

  beforeEach(() => {
    cart = new ShoppingCart();
    product = {
      id: 1,
      name: 'iPhone 15',
      price: 999
    };
  });

  describe('addItem', () => {
    it('should add new item to cart', () => {
      cart.addItem(product);
      
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toEqual({
        id: 1,
        name: 'iPhone 15',
        price: 999,
        quantity: 1
      });
    });

    it('should increase quantity for existing item', () => {
      cart.addItem(product);
      cart.addItem(product);
      
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(2);
    });

    it('should add multiple items with custom quantity', () => {
      cart.addItem(product, 3);
      
      expect(cart.items[0].quantity).toBe(3);
    });

    it('should handle invalid product', () => {
      expect(() => cart.addItem(null)).toThrow('Invalid product');
      expect(() => cart.addItem({})).toThrow('Invalid product');
    });
  });

  describe('removeItem', () => {
    it('should remove item by id', () => {
      cart.addItem(product);
      cart.removeItem(1);
      
      expect(cart.items).toHaveLength(0);
    });

    it('should handle removing non-existent item', () => {
      expect(() => cart.removeItem(999)).not.toThrow();
    });
  });

  describe('getTotal', () => {
    it('should calculate total correctly', () => {
      cart.addItem(product, 2);
      cart.addItem({ id: 2, name: 'AirPods', price: 199 }, 1);
      
      expect(cart.getTotal()).toBe(2197); // (999 * 2) + 199
    });

    it('should return 0 for empty cart', () => {
      expect(cart.getTotal()).toBe(0);
    });
  });

  describe('getItemCount', () => {
    it('should return total item count', () => {
      cart.addItem(product, 2);
      cart.addItem({ id: 2, name: 'AirPods', price: 199 }, 3);
      
      expect(cart.getItemCount()).toBe(5);
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      cart.addItem(product);
      cart.clear();
      
      expect(cart.items).toHaveLength(0);
      expect(cart.getTotal()).toBe(0);
    });
  });

  describe('applyDiscount', () => {
    it('should apply discount correctly', () => {
      cart.addItem(product, 1);
      const discountedTotal = cart.applyDiscount(10);
      
      expect(discountedTotal).toBe(899.1); // 999 * 0.9
    });

    it('should throw error for invalid discount', () => {
      expect(() => cart.applyDiscount(-10)).toThrow('Invalid discount percentage');
      expect(() => cart.applyDiscount(150)).toThrow('Invalid discount percentage');
    });
  });
});
```

Jest cung cấp testing framework mạnh mẽ và dễ sử dụng cho JavaScript.

## 🎭 Matchers và Assertions

### Basic Matchers

```javascript
describe('Basic Matchers', () => {
  it('should use toBe for primitive values', () => {
    expect(2 + 2).toBe(4);
    expect('hello').toBe('hello');
    expect(true).toBe(true);
  });

  it('should use toEqual for objects', () => {
    const user = { name: 'John', age: 30 };
    expect(user).toEqual({ name: 'John', age: 30 });
  });

  it('should use toContain for arrays', () => {
    const fruits = ['apple', 'banana', 'orange'];
    expect(fruits).toContain('banana');
  });

  it('should use toMatch for regex', () => {
    expect('hello world').toMatch(/world/);
  });
});
```

### Advanced Matchers

```javascript
describe('Advanced Matchers', () => {
  it('should use toBeGreaterThan and toBeLessThan', () => {
    expect(10).toBeGreaterThan(5);
    expect(5).toBeLessThan(10);
  });

  it('should use toBeCloseTo for floating point', () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3);
  });

  it('should use toThrow for exceptions', () => {
    const badFunction = () => {
      throw new Error('Something went wrong');
    };
    
    expect(badFunction).toThrow();
    expect(badFunction).toThrow('Something went wrong');
  });

  it('should use toBeNull and toBeUndefined', () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
  });
});
```

## 🎭 Mocking - Nghệ thuật giả lập

### Mocking Functions

```javascript
// src/userService.js
class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getUser(id) {
    const user = await this.apiClient.get(`/users/${id}`);
    return user;
  }

  async createUser(userData) {
    const user = await this.apiClient.post('/users', userData);
    return user;
  }
}

module.exports = UserService;
```

### Test với Mocking

```javascript
// src/userService.test.js
const UserService = require('./userService');

describe('UserService', () => {
  let userService;
  let mockApiClient;

  beforeEach(() => {
    // Tạo mock API client
    mockApiClient = {
      get: jest.fn(),
      post: jest.fn()
    };
    
    userService = new UserService(mockApiClient);
  });

  describe('getUser', () => {
    it('should fetch user by id', async () => {
      const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
      mockApiClient.get.mockResolvedValue(mockUser);

      const result = await userService.getUser(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(mockUser);
    });

    it('should handle API errors', async () => {
      const error = new Error('User not found');
      mockApiClient.get.mockRejectedValue(error);

      await expect(userService.getUser(999)).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create new user', async () => {
      const userData = { name: 'Jane', email: 'jane@example.com' };
      const createdUser = { id: 2, ...userData };
      mockApiClient.post.mockResolvedValue(createdUser);

      const result = await userService.createUser(userData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/users', userData);
      expect(result).toEqual(createdUser);
    });
  });
});
```

### Mocking Modules

```javascript
// src/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, content) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: content
    };

    return await this.transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;
```

### Test với Module Mocking

```javascript
// src/emailService.test.js
const EmailService = require('./emailService');

// Mock nodemailer module
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn()
  }))
}));

describe('EmailService', () => {
  let emailService;
  let mockTransporter;

  beforeEach(() => {
    const nodemailer = require('nodemailer');
    mockTransporter = {
      sendMail: jest.fn()
    };
    nodemailer.createTransporter.mockReturnValue(mockTransporter);
    
    emailService = new EmailService();
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const mockResult = { messageId: 'test-id' };
      mockTransporter.sendMail.mockResolvedValue(mockResult);

      const result = await emailService.sendEmail(
        'test@example.com',
        'Test Subject',
        '<h1>Test Content</h1>'
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER,
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<h1>Test Content</h1>'
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle email sending errors', async () => {
      const error = new Error('SMTP connection failed');
      mockTransporter.sendMail.mockRejectedValue(error);

      await expect(
        emailService.sendEmail('test@example.com', 'Subject', 'Content')
      ).rejects.toThrow('SMTP connection failed');
    });
  });
});
```

## 🧪 Integration Testing

### API Testing

```javascript
// src/api.test.js
const request = require('supertest');
const app = require('./app');
const { connectDB, disconnectDB } = require('./database');

describe('API Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });
});
```

## 🚀 Performance Testing

### Benchmark Testing

```javascript
// src/performance.test.js
describe('Performance Tests', () => {
  it('should process data within time limit', () => {
    const startTime = Date.now();
    
    // Simulate heavy computation
    const result = Array.from({ length: 10000 }, (_, i) => i * 2);
    
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    expect(executionTime).toBeLessThan(100); // Should complete within 100ms
    expect(result).toHaveLength(10000);
  });

  it('should handle large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 100000 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`
    }));

    const startTime = Date.now();
    
    // Process large dataset
    const processed = largeDataset.map(user => ({
      ...user,
      processed: true
    }));
    
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    expect(executionTime).toBeLessThan(500); // Should complete within 500ms
    expect(processed).toHaveLength(100000);
    expect(processed[0]).toHaveProperty('processed', true);
  });
});
```

## 🔧 Configuration và Setup

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Transform files
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Test timeout
  testTimeout: 10000
};
```

### Setup File

```javascript
// jest.setup.js
// Global test setup
beforeAll(() => {
  // Setup test database
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Cleanup
});

// Global test utilities
global.testUtils = {
  createMockUser: (overrides = {}) => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  }),
  
  createMockProduct: (overrides = {}) => ({
    id: 1,
    name: 'Test Product',
    price: 99.99,
    ...overrides
  })
};
```

## 🛠️ Best Practices

### Test Organization

```javascript
// Organize tests by feature
describe('User Management', () => {
  describe('User Creation', () => {
    it('should create user with valid data', () => {
      // Test implementation
    });
    
    it('should validate email format', () => {
      // Test implementation
    });
  });
  
  describe('User Authentication', () => {
    it('should authenticate with valid credentials', () => {
      // Test implementation
    });
    
    it('should reject invalid credentials', () => {
      // Test implementation
    });
  });
});
```

### Test Data Management

```javascript
// Use factories for test data
class UserFactory {
  static create(overrides = {}) {
    return {
      id: Math.floor(Math.random() * 1000),
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      ...overrides
    };
  }
  
  static createMany(count, overrides = {}) {
    return Array.from({ length: count }, (_, i) => 
      this.create({ id: i + 1, ...overrides })
    );
  }
}

// Usage in tests
describe('UserService', () => {
  it('should create user', () => {
    const userData = UserFactory.create({ name: 'John' });
    // Test implementation
  });
});
```

## 🔍 Debugging và Troubleshooting

### Debug Mode

```javascript
// Run tests in debug mode
// jest --detectOpenHandles --forceExit

describe('Debug Tests', () => {
  it('should debug async operations', async () => {
    // Use console.log for debugging
    console.log('Starting test...');
    
    const result = await someAsyncOperation();
    console.log('Result:', result);
    
    expect(result).toBeDefined();
  });
});
```

### Common Issues

```javascript
// 1. Async test not waiting
it('should handle async operations', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});

// 2. Mock not working
jest.mock('./module', () => ({
  function: jest.fn()
}));

// 3. Database connections
beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});
```

## 📚 Tài liệu tham khảo

### Official Resources

*   [Jest Documentation](https://jestjs.io/docs/getting-started)
*   [Jest API Reference](https://jestjs.io/docs/api)
*   [Jest Configuration](https://jestjs.io/docs/configuration)

### Community Resources

*   [Jest GitHub](https://github.com/facebook/jest)
*   [Jest Community](https://jestjs.io/community)
*   [Jest Examples](https://github.com/facebook/jest/tree/main/examples)

### Testing Patterns

*   [Testing Best Practices](https://jestjs.io/docs/best-practices)
*   [Testing Patterns](https://jestjs.io/docs/testing-patterns)
*   [Mock Functions](https://jestjs.io/docs/mock-functions)

* * *

**🎯 Kết quả sau khi học Jest:**

*   ✅ Hiểu sâu về testing fundamentals và Jest framework
    
*   ✅ Thành thạo unit testing, integration testing, và mocking
    
*   ✅ Áp dụng testing best practices và patterns
    
*   ✅ Debug và troubleshoot test issues hiệu quả
    
*   ✅ Build comprehensive test suites cho applications
    
*   ✅ Contribute vào testing culture và quality assurance
    
    async sendWelcomeEmail(user) {  
    const mailOptions = {  
    from: ‘[noreply@example.com](mailto:noreply@example.com)‘,  
    to: user.email,  
    subject: ‘Welcome to our platform!’,  
    html: `<h1>Welcome ${user.name}!</h1>`  
    };
    
    return await this.transporter.sendMail(mailOptions);  
    }
    

}

module.exports = EmailService;

```plaintext

### Test với Module Mocking
```javascript
// src/emailService.test.js
const EmailService = require('./emailService');

// Mock nodemailer module
jest.mock('nodemailer');

describe('EmailService', () => {
  let emailService;
  let mockTransporter;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock transporter
    mockTransporter = {
      sendMail: jest.fn()
    };
    
    // Mock nodemailer.createTransporter
    const nodemailer = require('nodemailer');
    nodemailer.createTransporter.mockReturnValue(mockTransporter);
    
    emailService = new EmailService();
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const user = { name: 'John', email: 'john@example.com' };
      const mockResult = { messageId: '123' };
      mockTransporter.sendMail.mockResolvedValue(mockResult);

      const result = await emailService.sendWelcomeEmail(user);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: 'noreply@example.com',
        to: 'john@example.com',
        subject: 'Welcome to our platform!',
        html: '<h1>Welcome John!</h1>'
      });
      expect(result).toEqual(mockResult);
    });

    it('should handle email sending errors', async () => {
      const user = { name: 'John', email: 'john@example.com' };
      const error = new Error('SMTP connection failed');
      mockTransporter.sendMail.mockRejectedValue(error);

      await expect(emailService.sendWelcomeEmail(user)).rejects.toThrow('SMTP connection failed');
    });
  });
});
```

## 📸 Snapshot Testing

### Component Testing

```javascript
// src/components/UserCard.jsx
import React from 'react';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} className="avatar" />
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <span className="status">{user.status}</span>
      </div>
    </div>
  );
};

export default UserCard;
```

### Snapshot Test

```javascript
// src/components/UserCard.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard', () => {
  it('should render user information correctly', () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
      status: 'active'
    };

    const { container } = render(<UserCard user={user} />);
    
    // Snapshot test
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle missing avatar', () => {
    const user = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      status: 'inactive'
    };

    const { container } = render(<UserCard user={user} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

## 🔗 Integration Testing

### API Integration Test

```javascript
// src/integration/userApi.test.js
const request = require('supertest');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/database');

describe('User API Integration', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });
});
```

## ⚡ Performance Testing

### Performance Test với Jest

```javascript
// src/performance/algorithm.test.js
describe('Algorithm Performance', () => {
  it('should process large dataset efficiently', () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);
    
    const startTime = performance.now();
    
    // Test sorting algorithm
    const sorted = largeArray.sort((a, b) => a - b);
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Performance assertion
    expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
    expect(sorted[0]).toBe(0);
    expect(sorted[9999]).toBe(9999);
  });

  it('should handle memory efficiently', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Create large object
    const largeObject = {};
    for (let i = 0; i < 1000; i++) {
      largeObject[`key${i}`] = `value${i}`;
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory usage assertion (less than 1MB)
    expect(memoryIncrease).toBeLessThan(1024 * 1024);
  });
});
```

## 🛠️ Thực hành tốt và mẹo

### Test Organization

```javascript
// Tổ chức test theo cấu trúc
describe('UserService', () => {
  // Setup và teardown
  beforeEach(() => {
    // Setup trước mỗi test
  });

  afterEach(() => {
    // Cleanup sau mỗi test
  });

  // Group tests theo chức năng
  describe('Authentication', () => {
    describe('login', () => {
      it('should login with valid credentials', () => {
        // Test case
      });

      it('should reject invalid credentials', () => {
        // Test case
      });
    });

    describe('logout', () => {
      it('should clear user session', () => {
        // Test case
      });
    });
  });

  describe('User Management', () => {
    // User management tests
  });
});
```

### Test Data Management

```javascript
// src/test/fixtures/users.js
const createTestUser = (overrides = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  status: 'active',
  createdAt: new Date(),
  ...overrides
});

const createTestUsers = (count = 1) => {
  return Array.from({ length: count }, (_, i) => 
    createTestUser({ 
      id: i + 1, 
      name: `Test User ${i + 1}`,
      email: `test${i + 1}@example.com`
    })
  );
};

module.exports = { createTestUser, createTestUsers };
```

### Async Testing Best Practices

```javascript
describe('Async Testing', () => {
  it('should handle async operations correctly', async () => {
    // ✅ Good: Use async/await
    const result = await someAsyncFunction();
    expect(result).toBe(expectedValue);
  });

  it('should handle promises correctly', () => {
    // ✅ Good: Return promise
    return someAsyncFunction().then(result => {
      expect(result).toBe(expectedValue);
    });
  });

  it('should handle errors in async operations', async () => {
    // ✅ Good: Test error cases
    await expect(someAsyncFunction()).rejects.toThrow('Expected error');
  });
});
```

## 🔧 Xử lý sự cố thường gặp

### Common Issues và Solutions

#### 1\. Test Timeout

```javascript
// Tăng timeout cho test chậm
it('should handle slow operation', async () => {
  const result = await slowOperation();
  expect(result).toBe(expectedValue);
}, 10000); // 10 seconds timeout
```

#### 2\. Memory Leaks

```javascript
// Cleanup sau mỗi test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});
```

#### 3\. Environment Variables

```javascript
// Setup environment cho test
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'test-database-url';
});
```

#### 4\. Database Cleanup

```javascript
// Cleanup database sau mỗi test
afterEach(async () => {
  await User.deleteMany({});
  await Order.deleteMany({});
});
```

### Debug Tests

```javascript
// Debug test với console.log
it('should debug this test', () => {
  const data = processData();
  console.log('Processed data:', data);
  expect(data).toBeDefined();
});

// Debug với debugger
it('should debug with breakpoint', () => {
  debugger;
  const result = someFunction();
  expect(result).toBe(expectedValue);
});
```

## 📊 Coverage và Reporting

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/test/**/*',
    '!src/**/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage'
};
```

### Coverage Commands

```bash
# Chạy test với coverage
npm run test:coverage

# Chạy test với coverage và watch mode
npm run test:coverage -- --watch

# Chạy test với coverage cho file cụ thể
npm run test:coverage -- --collectCoverageFrom="src/services/**/*.js"
```

## 🎯 Kết quả mong đợi

**🎯 Kết quả sau khi học Jest:**

*   ✅ Hiểu sâu về testing philosophy và best practices
*   ✅ Thành thạo viết unit tests, integration tests
*   ✅ Áp dụng mocking và stubbing hiệu quả
*   ✅ Debug và optimize test performance
*   ✅ Build testable applications
*   ✅ Contribute vào testing culture trong team
*   ✅ Implement TDD và BDD workflows
*   ✅ Setup CI/CD với automated testing

## 📚 Tài liệu tham khảo

### Official Documentation

*   [Jest Official Docs](https://jestjs.io/docs/getting-started)
*   [Jest API Reference](https://jestjs.io/docs/api)
*   [Jest Configuration](https://jestjs.io/docs/configuration)

### Learning Resources

*   [Testing JavaScript Course](https://testingjavascript.com/)
*   [Jest Tutorial for Beginners](https://www.valentinog.com/blog/jest/)
*   [Testing React Applications](https://reactjs.org/docs/testing.html)

### Tools và Frameworks

*   [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
*   [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)
*   [supertest](https://github.com/visionmedia/supertest)
*   [jest-extended](https://github.com/jest-community/jest-extended)

### Community Resources

*   [Jest GitHub Repository](https://github.com/facebook/jest)
*   [Jest Community Discord](https://discord.gg/jest)
*   [Stack Overflow Jest Tag](https://stackoverflow.com/questions/tagged/jest)

* * *

**💡 Tip:** Jest không chỉ là testing tool - nó là mindset về code quality. Hãy viết test trước khi viết code (TDD) để có code tốt hơn!