---
title: "Currying Technique"
date: 2018-05-10T07:31:32.000Z
tags: [javascript]
categories: [javascript]
---

## Khái niệm lý thuyết

**English:** Currying is when you break down a function that takes multiple arguments into a series of functions that take part of the arguments.

**Tiếng Việt:** Currying là kỹ thuật phân rã hàm nhiều tham số thành chuỗi các hàm nhận vào một hoặc nhiều tham số từ tập hợp tham số ban đầu.

## Code minh họa khái niệm

### 1\. Cách thông thường

```javascript
// Hàm sum bình thường
function sum(a, b) {
  return a + b;
}

// Hoặc dùng arrow function
const sum = (a, b) => a + b;

// Gọi hàm
sum(1, 2); // 3
```

### 2\. Sử dụng currying

```javascript
// Hàm sum với currying
function sum(a) {
  return function(b) {
    return a + b;
  }
}

// Hoặc dùng arrow function
const sum = a => b => a + b;

// Gọi hàm
sum(1)(2); // 3
```

## Ví dụ thực tế

```javascript
const arr = [
  { key: 1, val: 'a' },
  { key: 2, val: 'b' },
  { key: 3, val: 'c' },
  { key: 4, val: 'd' }
];

// Hàm currying để lấy thuộc tính
const get = attr => item => item[attr];

// Tạo các hàm chuyên biệt
const getKey = get('key');
const getVal = get('val');

// Sử dụng
const keyArray = arr.map(getKey); // [1, 2, 3, 4]
const valArray = arr.map(getVal); // ["a", "b", "c", "d"]
```

## Ưu điểm của currying

*   **Tái sử dụng:** Tạo ra các hàm chuyên biệt từ hàm tổng quát
*   **Functional Programming:** Phù hợp với paradigm lập trình hàm
*   **Partial Application:** Có thể áp dụng từng phần tham số