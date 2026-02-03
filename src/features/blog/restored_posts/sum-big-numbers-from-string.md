---
title: "Sum Big Numbers From String"
date: 2019-03-14T06:48:10.000Z
tags: [javascript]
categories: [javascript]
---

## Vấn đề

Khi cần cộng 2 số quá lớn (big number) mà JavaScript không thể xử lý chính xác do giới hạn của `Number.MAX_SAFE_INTEGER` (2^53 - 1).

Ví dụ:

```javascript
console.log(9007199254740991 + 2); // 9007199254740992 (sai!)
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
```

## Giải pháp

### Cách 1: Manual String Addition

```javascript
const sumBigNumbers = (a, b) => {
  // Chuyển thành mảng và reverse để dễ xử lý từ phải sang trái
  const aDigits = a.split('').reverse();
  const bDigits = b.split('').reverse();
  
  const maxLength = Math.max(a.length, b.length);
  const result = [];
  let carry = 0;
  
  for (let i = 0; i < maxLength || carry > 0; i++) {
    const digitA = parseInt(aDigits[i] || '0');
    const digitB = parseInt(bDigits[i] || '0');
    
    const sum = digitA + digitB + carry;
    result.push(sum % 10);
    carry = Math.floor(sum / 10);
  }
  
  return result.reverse().join('');
};

// Hàm loại bỏ số 0 đầu (nếu cần)
const removeLeadingZeros = (str) => {
  return str.replace(/^0+/, '') || '0';
};
```

### Cách 2: ES6 Version (Optimized)

```javascript
const sumBigNumbers = (a, b) => {
  const normalize = (str) => str.split('').reverse();
  const [aDigits, bDigits] = [normalize(a), normalize(b)];
  
  let carry = 0;
  const result = [];
  const maxLength = Math.max(aDigits.length, bDigits.length);
  
  for (let i = 0; i < maxLength || carry; i++) {
    const sum = (parseInt(aDigits[i]) || 0) + 
                 (parseInt(bDigits[i]) || 0) + 
                 carry;
    
    result.push(sum % 10);
    carry = Math.floor(sum / 10);
  }
  
  return result.reverse().join('').replace(/^0+/, '') || '0';
};
```

### Cách 3: Sử dụng BigInt (ES2020)

```javascript
// Cách đơn giản nhất với BigInt
const sumBigNumbers = (a, b) => {
  return (BigInt(a) + BigInt(b)).toString();
};

// Hoặc với validation
const sumBigNumbersSafe = (a, b) => {
  try {
    return (BigInt(a) + BigInt(b)).toString();
  } catch (error) {
    throw new Error('Invalid number format');
  }
};
```

## Ví dụ sử dụng

```javascript
// Test cases
console.log(sumBigNumbers('123', '321')); // "444"
console.log(sumBigNumbers('8797927323', '3232321')); // "8801159644"
console.log(sumBigNumbers('999999999999999999', '1')); // "1000000000000000000"
console.log(sumBigNumbers('123456789012345678901234567890', '987654321098765432109876543210')); 
// "1111111110111111111011111111100"

// So sánh với BigInt
console.log((BigInt('123') + BigInt('321')).toString()); // "444"
```

## Comparison và Performance

```javascript
// Benchmark
function benchmark() {
  const num1 = '12345678901234567890123456789012345678901234567890';
  const num2 = '98765432109876543210987654321098765432109876543210';
  
  console.time('Manual Addition');
  for (let i = 0; i < 10000; i++) {
    sumBigNumbers(num1, num2);
  }
  console.timeEnd('Manual Addition');
  
  console.time('BigInt Addition');
  for (let i = 0; i < 10000; i++) {
    (BigInt(num1) + BigInt(num2)).toString();
  }
  console.timeEnd('BigInt Addition');
}

// benchmark(); // BigInt thường nhanh hơn
```

## Các operations khác

### Subtraction (Trừ)

```javascript
const subtractBigNumbers = (a, b) => {
  // Đảm bảo a >= b
  if (a.length < b.length || (a.length === b.length && a < b)) {
    return '-' + subtractBigNumbers(b, a);
  }
  
  const aDigits = a.split('').reverse();
  const bDigits = b.split('').reverse();
  const result = [];
  let borrow = 0;
  
  for (let i = 0; i < aDigits.length; i++) {
    let diff = parseInt(aDigits[i]) - (parseInt(bDigits[i]) || 0) - borrow;
    
    if (diff < 0) {
      diff += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    
    result.push(diff);
  }
  
  return result.reverse().join('').replace(/^0+/, '') || '0';
};
```

### Multiplication (Nhân)

```javascript
const multiplyBigNumbers = (a, b) => {
  if (a === '0' || b === '0') return '0';
  
  const result = Array(a.length + b.length).fill(0);
  const aDigits = a.split('').reverse();
  const bDigits = b.split('').reverse();
  
  for (let i = 0; i < aDigits.length; i++) {
    for (let j = 0; j < bDigits.length; j++) {
      const product = parseInt(aDigits[i]) * parseInt(bDigits[j]);
      const pos1 = i + j;
      const pos2 = i + j + 1;
      
      const sum = product + result[pos1];
      result[pos1] = sum % 10;
      result[pos2] += Math.floor(sum / 10);
    }
  }
  
  return result.reverse().join('').replace(/^0+/, '') || '0';
};
```

## Browser Support

*   **Manual Implementation:** Tất cả browsers
*   **BigInt:** Chrome 67+, Firefox 68+, Safari 14+, Node.js 12+

## Kết luận

*   **Sử dụng BigInt** nếu môi trường hỗ trợ (modern browsers/Node.js)
*   **Manual implementation** cho legacy support hoặc học thuật toán
*   **Performance:** BigInt thường nhanh hơn và đáng tin cậy hơn