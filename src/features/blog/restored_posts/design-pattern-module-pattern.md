---
title: "Design Pattern: Module Pattern"
date: 2018-05-08T03:58:17.000Z
tags: [Closures, Design Pattern, ES6, Encapsulation, JavaScript, Module Pattern]
categories: [JavaScript, Design Patterns]
---

## Khái niệm

Module Pattern là một design pattern phổ biến trong JavaScript, cho phép tạo ra encapsulation và data privacy bằng cách sử dụng closures.

## Ưu điểm

*   **Encapsulation:** Ẩn implementation details
*   **Namespace:** Tránh global scope pollution
*   **Privacy:** Tạo private methods và properties

## Code minh họa

```javascript
const anph = (function () {
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

  // Public API - những gì được expose ra ngoài
  return { 
    getph4n4n, 
    getP 
  };
})();

// Testing
console.log(a); // ReferenceError: a is not defined
console.log(anph.getA()); // TypeError: anph.getA is not a function
console.log(anph.getph4n4n()); // "ph4n4n"
console.log(anph.getP()); // "p"
```

## Các biến thể

### 1\. Revealing Module Pattern

```javascript
const myModule = (function() {
  let privateVar = 0;
  
  function privateMethod() {
    console.log('Private method called');
  }
  
  function publicMethod1() {
    privateVar++;
    privateMethod();
  }
  
  function publicMethod2() {
    return privateVar;
  }
  
  // Reveal public methods
  return {
    method1: publicMethod1,
    method2: publicMethod2
  };
})();
```

### 2\. Module với tham số

```javascript
const myModule = (function(window, $) {
  let privateVar = 'Hello World';
  
  function privateMethod() {
    console.log(privateVar);
  }
  
  return {
    publicMethod: function() {
      privateMethod();
    }
  };
})(window, jQuery);
```

## ES6 Modules

Module Pattern trong ES6 đơn giản hơn:

```javascript
// math.js
const PI = 3.14159;

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Export
export { add, multiply };
export default PI;

// main.js
import PI, { add, multiply } from './math.js';

console.log(add(2, 3)); // 5
console.log(PI); // 3.14159
```

## Demo

[Module Pattern Demo](http://jsbin.com/jaxovomehi/edit?js,console,output)