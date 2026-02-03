---
title: "Design Pattern: Singleton Pattern"
date: 2018-05-08T08:04:57.000Z
tags: [Creational Pattern, Design Pattern, ES6, Global Access, JavaScript, Singleton Pattern]
categories: [JavaScript, Design Patterns]
---

## Khái niệm

Singleton Pattern là một creational design pattern đảm bảo rằng một class chỉ có duy nhất một instance trong toàn bộ ứng dụng và cung cấp một global access point đến instance đó.

**Cải tiến từ:** [Module Pattern](/2018/05/08/design-pattern-module-pattern/)

## Đặc điểm

*   **Duy nhất:** Chỉ có một instance duy nhất
*   **Global Access:** Có thể truy cập từ bất kỳ đâu
*   **Lazy Initialization:** Chỉ tạo instance khi cần thiết
*   **Thread-safe:** An toàn trong môi trường đa luồng

## Code minh họa

```javascript
const anph = (function () {
  let instance; // Private variable để lưu instance

  function init() {
    // Private properties
    const a = 'A';
    const n = 'n';
    const p = 'p';
    const h = 'h';

    // Private methods
    const getA = () => a;
    const getN = () => n;
    const getP = () => p;
    const getH = () => h;
    const getph4n4n = () => getA() + n + p + h;

    // Public API
    return { 
      getph4n4n, 
      getP 
    };
  }

  return {
    getInstance: function () {
      if (!instance) { // Đảm bảo chỉ tạo 1 object duy nhất
        instance = init();
      }
      return instance;
    }
  };
})();

// Testing
// console.log(anph.getInstance().getA()); // TypeError: getA is not a function
console.log(anph.getInstance().getph4n4n()); // "ph4n4n"

// Kiểm tra singleton behavior
const instance1 = anph.getInstance();
const instance2 = anph.getInstance();
console.log(instance1 === instance2); // true - cùng một instance
```

## Ví dụ thực tế

### 1\. Database Connection

```javascript
const DatabaseConnection = (function() {
  let instance;

  function createConnection() {
    return {
      host: 'localhost',
      port: 3306,
      database: 'myapp',
      connect() {
        console.log('Connected to database');
      },
      disconnect() {
        console.log('Disconnected from database');
      }
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createConnection();
      }
      return instance;
    }
  };
})();

// Sử dụng
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true
```

### 2\. Logger System

```javascript
const Logger = (function() {
  let instance;

  function createLogger() {
    const logs = [];

    return {
      log(message) {
        logs.push({
          message,
          timestamp: new Date().toISOString()
        });
        console.log(`[${new Date().toISOString()}] ${message}`);
      },
      
      getLogs() {
        return [...logs]; // Return copy to prevent direct manipulation
      },
      
      clearLogs() {
        logs.length = 0;
      }
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createLogger();
      }
      return instance;
    }
  };
})();

// Sử dụng
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

logger1.log('First message');
logger2.log('Second message');

console.log(logger1.getLogs()); // Có cả 2 messages
console.log(logger1 === logger2); // true
```

## ES6 Class Implementation

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    
    this.data = [];
    Singleton.instance = this;
  }

  addData(item) {
    this.data.push(item);
  }

  getData() {
    return this.data;
  }

  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

// Testing
const s1 = new Singleton();
const s2 = new Singleton();
const s3 = Singleton.getInstance();

s1.addData('item1');
s2.addData('item2');

console.log(s1.getData()); // ['item1', 'item2']
console.log(s1 === s2 === s3); // true
```

## Ưu điểm

*   **Kiểm soát instance:** Đảm bảo chỉ có một instance duy nhất
*   **Tiết kiệm memory:** Không tạo ra nhiều object không cần thiết
*   **Global access:** Dễ dàng truy cập từ mọi nơi
*   **Lazy loading:** Chỉ tạo khi cần thiết

## Nhược điểm

*   **Global state:** Có thể tạo ra coupling cao
*   **Testing khó khăn:** Khó mock và test
*   **Thread safety:** Cần xử lý cẩn thận trong môi trường đa luồng
*   **Violation of Single Responsibility:** Class vừa quản lý business logic vừa quản lý instance

## Khi nào nên sử dụng

*   Database connections
*   Logger systems
*   Configuration objects
*   Cache systems
*   Thread pools

## Demo

[Singleton Pattern Demo](http://jsbin.com/becokebetu/edit?js,console)