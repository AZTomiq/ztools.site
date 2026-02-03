---
title: "Imperative Programming Và Declarative Programming Dễ Như ăN Bánh"
date: 2021-01-20T10:19:44.000Z
tags: [Code Style, Declarative, Functional Programming, Imperative, JavaScript, Programming, Programming Paradigms]
categories: [Programming, JavaScript, Programming Concepts]
---

# Imperative vs Declarative Programming - Cuộc chiến của 2 phong cách code! 🥊

> Imperative programming: telling the “machine” **HOW** to do something, and as a result **WHAT** you want to happen will happen.

> Declarative programming: telling the “machine” **WHAT** you would like to happen, and let the computer figure out **HOW** to do it.

## Định nghĩa cho người lười đọc

**Imperative Programming**: Bảo máy tính **LÀM THẾ NÀO** (HOW) để có được **CÁI GÌ** (WHAT) bạn muốn.

**Declarative Programming**: Bảo máy tính **CÁI GÌ** (WHAT) bạn muốn, để máy tự nghĩ ra **LÀM THẾ NÀO** (HOW).

> **Ví dụ đời thường**:
> 
> *   **Imperative**: “Anh taxi ơi, đi thẳng 500m, rẽ phải, qua 2 ngã tư, rẽ trái…”
> *   **Declarative**: “Anh taxi ơi, đi Landmark 81!” 🚗

## So sánh bằng code (JavaScript)

### 🤖 **Imperative Style - “Chỉ đạo từng bước”**

```javascript
// Tìm số chẵn trong array
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenNumbers = [];

// Nói máy tính từng bước một cách chi tiết
for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
        evenNumbers.push(numbers[i]);
    }
}

console.log(evenNumbers); // [2, 4, 6, 8, 10]
```

**Đặc điểm**:

*   Kiểm soát từng bước
*   Nói rõ “làm gì”, “khi nào”, “như thế nào”
*   Giống như hướng dẫn nấu ăn chi tiết: “Bước 1: Thái hành, Bước 2: Đun dầu…”

### 🎯 **Declarative Style - “Nói thẳng mục tiêu”**

```javascript
// Cùng một việc nhưng declarative
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Chỉ nói muốn gì, không nói làm thế nào
const evenNumbers = numbers.filter(num => num % 2 === 0);

console.log(evenNumbers); // [2, 4, 6, 8, 10]
```

**Đặc điểm**:

*   Tập trung vào kết quả
*   Ít code hơn, dễ đọc hơn
*   Giống như gọi món: “Cho tôi một phở bò!” (không cần biết làm thế nào)

## Ví dụ thực tế khác

### 📋 **Tạo danh sách HTML**

#### Imperative - “Làm từng bước”

```javascript
const users = ['Alice', 'Bob', 'Charlie'];
let html = '<ul>';

for (let i = 0; i < users.length; i++) {
    html += '<li>' + users[i] + '</li>';
}
html += '</ul>';

document.body.innerHTML = html;
```

#### Declarative - “Nói thẳng muốn gì”

```javascript
const users = ['Alice', 'Bob', 'Charlie'];

// React style
const UserList = () => (
    <ul>
        {users.map(user => <li key={user}>{user}</li>)}
    </ul>
);

// Hoặc template literal
const html = `
    <ul>
        ${users.map(user => `<li>${user}</li>`).join('')}
    </ul>
`;
```

### 🔍 **Tìm kiếm dữ liệu**

#### Imperative - “Chỉ đạo từng bước”

```javascript
const products = [
    { name: 'iPhone', price: 1000, category: 'phone' },
    { name: 'MacBook', price: 2000, category: 'laptop' },
    { name: 'iPad', price: 800, category: 'tablet' }
];

// Tìm sản phẩm giá > 900
const expensiveProducts = [];
for (let i = 0; i < products.length; i++) {
    if (products[i].price > 900) {
        expensiveProducts.push(products[i]);
    }
}
```

#### Declarative - “Nói thẳng mục tiêu”

```javascript
// Cùng kết quả nhưng ngắn gọn hơn
const expensiveProducts = products.filter(product => product.price > 900);

// Hoặc dùng SQL (declarative thuần túy)
// SELECT * FROM products WHERE price > 900;
```

## Ưu nhược điểm

### 🎯 **Imperative Programming**

**Ưu điểm:**

*   ✅ Kiểm soát hoàn toàn flow
*   ✅ Performance có thể tối ưu tốt hơn
*   ✅ Dễ debug từng bước
*   ✅ Phù hợp với algorithm phức tạp

**Nhược điểm:**

*   ❌ Code dài dòng, khó đọc
*   ❌ Dễ bug (nhiều state để track)
*   ❌ Khó maintain khi logic phức tạp
*   ❌ Tốn thời gian viết

### 🎨 **Declarative Programming**

**Ưu điểm:**

*   ✅ Code ngắn gọn, dễ đọc
*   ✅ Ít bug hơn (ít state)
*   ✅ Dễ test và maintain
*   ✅ Tập trung vào business logic

**Nhược điểm:**

*   ❌ Ít control hơn
*   ❌ Đôi khi performance không tối ưu
*   ❌ Cần hiểu framework/library
*   ❌ Khó debug khi có vấn đề

## Khi nào dùng cái gì?

### 🤖 **Dùng Imperative khi:**

*   Cần performance cao (game, real-time system)
*   Algorithm phức tạp (sorting, graph traversal)
*   Low-level programming
*   Cần kiểm soát từng bước

### 🎯 **Dùng Declarative khi:**

*   UI development (React, Vue)
*   Data processing
*   Business logic
*   Rapid development

## Ví dụ trong các ngôn ngữ/framework

### JavaScript

```javascript
// Imperative
for (let i = 0; i < arr.length; i++) { /* ... */ }

// Declarative
arr.map(item => /* ... */)
arr.filter(item => /* ... */)
arr.reduce((acc, item) => /* ... */)
```

### SQL

```sql
-- Declarative thuần túy
SELECT name, price 
FROM products 
WHERE category = 'phone' 
ORDER BY price DESC;

-- Không cần biết database engine làm thế nào!
```

### CSS

```css
/* Declarative */
.button {
    background: blue;
    color: white;
    border-radius: 5px;
}

/* Nói muốn gì, browser tự render */
```

### React

```jsx
// Declarative
function TodoList({ todos }) {
    return (
        <ul>
            {todos.map(todo => 
                <li key={todo.id}>{todo.text}</li>
            )}
        </ul>
    );
}

// Nói muốn UI như thế nào, React tự update DOM
```

## Kết luận

**Imperative**: Như một ông sếp micromanage - chỉ đạo từng việc nhỏ 👔

**Declarative**: Như một ông sếp thông minh - chỉ nói mục tiêu, để nhân viên tự nghĩ cách 🧠

> **Pro tip**: Trong thực tế, hầu hết app đều mix cả 2 style. Declarative cho UI và business logic, Imperative cho performance-critical parts!

**Nhớ công thức**:

*   **Imperative** = HOW (làm thế nào)
*   **Declarative** = WHAT (muốn gì)

Giờ đi code thôi! Nhớ chọn style phù hợp với từng tình huống nhé! 🚀

* * *

_“Code is poetry, choose your style wisely!”_ 📝✨