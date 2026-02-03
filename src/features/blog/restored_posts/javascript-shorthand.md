---
title: "JavaScript Shorthand"
date: 2018-05-08T06:47:49.000Z
tags: [javascript]
categories: [javascript]
---

## 1\. Sử dụng `.bind()` hiệu quả

```javascript
// document.querySelector
const $ = document.querySelector.bind(document);

// Cách sử dụng
const ele1 = $("#id1");
const ele2 = $(".class2");
const ele3 = $("div.user-panel.main input[name='login']");

// console.log
const log = console.log.bind(console);
log('hello'); // -> hello
```

## 2\. Clone object, array

### a. Object

**Shallow clone:**

```javascript
const newObj = Object.assign({}, obj);
```

**Deep clone:**

```javascript
const newObj = JSON.parse(JSON.stringify(obj));
```

### b. Array

```javascript
const a = [1, 2, 3];
const b = a.slice();
console.log(b);       // -> [1, 2, 3]
console.log(b === a); // -> false
```

## 3\. Swap giá trị

```javascript
let x = 1, y = 2;
console.log(x, y); // 1, 2

[x, y] = [y, x];
console.log(x, y); // 2, 1
```

## 4\. Random số trong khoảng

```javascript
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Cách sử dụng
const a = random(1, 100);
```

## 5\. Tự viết `trim()`

```javascript
function trim(x) {
  return x.replace(/^\s+|\s+$/gm, '');
}

const str = "       Hello World!        ";
console.log(str);        // ->        Hello World!        
console.log(trim(str));  // -> Hello World!
```

## 6\. Chuyển `arguments` thành `Array`

```javascript
// Cách cũ
const args = Array.prototype.slice.call(arguments);
const args = [].slice.call(arguments);

// ES2015
const args = Array.from(arguments);
```

## 7\. Tìm max, min trong array

```javascript
const numbers = [1, 8, 10, -125, 28, 100, 215, -85]; 
const maxInNumbers = Math.max.apply(Math, numbers); 
const minInNumbers = Math.min.apply(Math, numbers);

console.log(maxInNumbers, minInNumbers); // -> 215 -125

// Hoặc sử dụng spread operator (ES6)
const maxInNumbers = Math.max(...numbers);
const minInNumbers = Math.min(...numbers);
```

## 8\. Reset Array

```javascript
const a = [1, 2, 3];
// a = []; // không dùng cách này
a.length = 0; // dùng cách này
console.log(a); // -> []
```

## 9\. Xoá phần tử trong Array

### a. Cách sai

```javascript
const arr = ["a", 1, -5, "cde"];
console.log(arr);        // -> ["a", 1, -5, "cde"]
delete arr[2];
console.log(arr);        // -> ["a", 1, undefined, "cde"]
console.log(arr.length); // -> 4
```

### b. Cách đúng

```javascript
let arr = ["a", 1, -5, "cde"];
console.log(arr);        // -> ["a", 1, -5, "cde"]
arr.splice(2, 1);
console.log(arr);        // -> ["a", 1, "cde"]
console.log(arr.length); // -> 3
```

## 10\. Dùng `&&` hoặc `||` thay cho `if` và `if else`

### a. Thay thế `if`

```javascript
// Cách cũ
let a = 10;
if (a === 10) console.log("a === 10"); // -> a === 10
if (a !== 5) console.log("a !== 5");   // -> a !== 5

// Cách mới
let a = 10;
a === 10 && console.log("a === 10"); // -> a === 10
a === 5 || console.log("a !== 5");   // -> a !== 5
```

### b. Thay thế `if else`

```javascript
// Cách cũ
let a = 10;
if (a === 5) console.log("a === 5");
else console.log("a !== 5");

// Cách mới
let a = 10;
a === 5 && console.log("a === 5") || console.log("a !== 5");
```

## 11\. Loop object

> **Lưu ý:** Cách này thực sự hiệu quả khi object chỉ có 1 level

### 1\. Sử dụng `for..in`

```javascript
const object = {...};
for (let name in object) {  
    if (object.hasOwnProperty(name)) { 
        // xử lý với name                    
    }  
}
```

### 2\. Sử dụng `array prototype function` (map, forEach…)

```javascript
const object = {...};
Object.keys(object).forEach(key => {
    // xử lý với key                    
});
```

## 12\. Clone object và array sử dụng Spread Operator

### a. Clone object:

```javascript
let obj = {a: 1, b: 2};
let obj2 = {...obj};
console.log(obj2); // -> {a: 1, b: 2}
```

### b. Clone array:

```javascript
let arr = [1, 2];
let arr2 = [...arr];
console.log(arr2); // -> [1, 2]
```

## 13\. Nối Array

```javascript
let one = ['a', 'b', 'c'];
let two = ['d', 'e', 'f'];
let three = ['g', 'h', 'i'];

// Cách cũ #1
const result1 = one.concat(two, three);
console.log(result1); // -> ["a", "b", "c", "d", "e", "f", "g", "h", "i"]

// Cách cũ #2
const result2 = [].concat(one, two, three);
console.log(result2); // -> ["a", "b", "c", "d", "e", "f", "g", "h", "i"]

// Cách mới (ES6)
const result3 = [...one, ...two, ...three];
console.log(result3); // -> ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
```

## 14\. Destructuring Assignment

```javascript
// Object destructuring
const person = {name: 'John', age: 30, city: 'New York'};
const {name, age} = person;
console.log(name, age); // -> John 30

// Array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first, second, rest); // -> 1 2 [3, 4, 5]
```

## 15\. Template Literals

```javascript
const name = 'John';
const age = 30;

// Cách cũ
const message1 = 'Hello, my name is ' + name + ' and I am ' + age + ' years old.';

// Cách mới
const message2 = `Hello, my name is ${name} and I am ${age} years old.`;
```

## 16\. Short-circuit Evaluation

```javascript
// Default values
const username = user.name || 'Anonymous';

// Conditional execution
user.isAdmin && showAdminPanel();

// Null/undefined check with optional chaining (ES2020)
const city = user?.address?.city;
```