---
title: "JavaScript: Horror Things"
date: 2018-06-21T08:20:21.000Z
tags: [javascript]
categories: [javascript]
---

## So sánh với `==` - những điều kinh hoàng

```javascript
1 == String(1); // true
new String(1) == new String(1); // false

0 == []; // true
0 == false; // true
[] == false; // true
[] == true; // false

console.log(0 ? "0 is true" : "0 is false"); // 0 is false
console.log([] ? "[] is true" : "[] is false"); // [] is true

0 == undefined; // false
0 == !!undefined; // true
```

**Bảng truthy/falsy values:**

| Type | Giá trị falsy |
| :-- | :-- |
| String | `''` (chuỗi rỗng) |
| Number | `0` hoặc `NaN` |
| Boolean | `false` |
| null | luôn falsy |
| undefined | luôn falsy |

## So sánh với `===` - vẫn có bẫy

```javascript
new String(1) === new String(1); // false

NaN === NaN; // false
```

## Array - những điều kỳ lạ

```javascript
var a = [1, 2, 3];
console.log(a, 'length:', a.length); // [1, 2, 3] "length:" 3

a[-1] = -1;
console.log(a, 'length:', a.length); // [1, 2, 3, -1: -1] "length:" 3

a[-2] = -2;
console.log(a, 'length:', a.length); // [1, 2, 3, -1: -1, -2: -2] "length:" 3

console.log(a[-2]); // -2
```