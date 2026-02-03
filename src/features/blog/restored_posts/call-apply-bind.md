---
title: "CALL, APPLY & BIND"
date: 2018-06-01T02:53:32.000Z
tags: [javascript]
categories: [javascript]
---

## CALL

**English:** Call invokes the function and allows you to pass in arguments one by one with comma.

**Tiếng Việt:** Gọi hàm và cho phép bạn truyền vào một object và các đối số phân cách nhau bởi dấu phẩy.

```javascript
const teo = { ten: 'Tèo', nickname: 'Kuteo' };
const ty = { ten: 'Tý', nickname: 'Cún' };

function chaoHoi(greeting, question) {
  console.log(greeting + ' ' + this.ten + ' ' + this.nickname + ', ' + question);
}

chaoHoi.call(teo, 'Chào', 'Năm nay bạn được mấy nồi bánh chưng rồi?'); 
// => Chào Tèo Kuteo, Năm nay bạn được mấy nồi bánh chưng rồi?

chaoHoi.call(ty, 'Hế lô', 'Tết này bạn có ai để dẫn đi chơi chưa?'); 
// => Hế lô Tý Cún, Tết này bạn có ai để dẫn đi chơi chưa?
```

## APPLY

**English:** Apply invokes the function and allows you to pass in arguments as an array.

**Tiếng Việt:** Gọi hàm và cho phép bạn truyền vào một object và các đối số thông qua mảng.

```javascript
const teo = { ten: 'Tèo', nickname: 'Kuteo' };
const ty = { ten: 'Tý', nickname: 'Cún' };

function chaoHoi(greeting, question) {
  console.log(greeting + ' ' + this.ten + ' ' + this.nickname + ', ' + question);
}

chaoHoi.apply(teo, ['Xin Chào', 'Năm nay bạn được mấy nồi bánh chưng rồi?']); 
// => Xin Chào Tèo Kuteo, Năm nay bạn được mấy nồi bánh chưng rồi?

chaoHoi.apply(ty, ['Hế lô', 'Tết này bạn có ai để dẫn đi chơi chưa?']); 
// => Hế lô Tý Cún, Tết này bạn có ai để dẫn đi chơi chưa?
```

## BIND

**English:** Bind returns a new function, allowing you to pass in a this array and any number of arguments.

**Tiếng Việt:** Trả về một hàm số mới, cho phép bạn truyền vào một object và các đối số phân cách nhau bởi dấu phẩy.

```javascript
const teo = { ten: 'Tèo', nickname: 'Kuteo' };
const ty = { ten: 'Tý', nickname: 'Cún' };

function chaoHoi(greeting, question) {
  console.log(greeting + ' ' + this.ten + ' ' + this.nickname + ', ' + question);
}

const chaoTeo = chaoHoi.bind(teo, 'Xin Chào', 'Năm nay bạn được mấy nồi bánh chưng rồi?');
const chaoTy = chaoHoi.bind(ty, 'Hế lô', 'Tết này bạn có ai để dẫn đi chơi chưa?');

chaoTeo(); // => Xin Chào Tèo Kuteo, Năm nay bạn được mấy nồi bánh chưng rồi?
chaoTy(); // => Hế lô Tý Cún, Tết này bạn có ai để dẫn đi chơi chưa?
```

## So sánh

| Method | Execution | Parameters | Return |
| --- | --- | --- | --- |
| `call()` | Ngay lập tức | Từng tham số riêng biệt | Kết quả của function |
| `apply()` | Ngay lập tức | Array các tham số | Kết quả của function |
| `bind()` | Tạo function mới | Từng tham số riêng biệt | Function mới |

## Ví dụ thực tế

```javascript
// Sử dụng Math.max với array
const numbers = [1, 2, 3, 4, 5];

// Cách cũ
const max1 = Math.max.apply(null, numbers);

// ES6 spread operator  
const max2 = Math.max(...numbers);

console.log(max1, max2); // 5 5
```

**Tham khảo:** [JavaScript Apply vs Call vs Bind](https://codeplanet.io/javascript-apply-vs-call-vs-bind/)