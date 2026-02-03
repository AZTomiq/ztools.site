---
title: "Javascript ES6 Cheatsheet"
date: 2025-06-26T04:43:51.000Z
tags: [Arrow Functions, Destructuring, ES2015, ES6, JavaScript, Modern JavaScript, Spread Operator, Template Literals]
categories: [JavaScript, Programming, ES6]
---

# JavaScript ES6+ Cheatsheet

ES6 (ECMAScript 2015) đã thay đổi hoàn toàn cách chúng ta viết JavaScript. Đây là bộ tóm tắt các tính năng quan trọng nhất.

## 1\. Arrow Functions

### Cú pháp cơ bản

```javascript
// ES5
function add(a, b) {
  return a + b;
}

// ES6
const add = (a, b) => a + b;

// Với tham số đơn
const double = x => x * 2;

// Với nhiều tham số
const multiply = (a, b, c) => a * b * c;

// Với thân hàm phức tạp
const processData = (data) => {
  const result = data.map(item => item * 2);
  return result.filter(item => item > 10);
};
```

### Sử dụng với Array methods

```javascript
const numbers = [1, 2, 3, 4, 5];

// map
const doubled = numbers.map(n => n * 2);

// filter
const evens = numbers.filter(n => n % 2 === 0);

// reduce
const sum = numbers.reduce((acc, n) => acc + n, 0);

// find
const firstEven = numbers.find(n => n % 2 === 0);
```

## 2\. Destructuring

### Array Destructuring

```javascript
const fruits = ['apple', 'banana', 'orange'];

// Cơ bản
const [first, second, third] = fruits;
console.log(first); // 'apple'

// Bỏ qua phần tử
const [first, , third] = fruits;

// Với rest operator
const [first, ...rest] = fruits;
console.log(rest); // ['banana', 'orange']

// Giá trị mặc định
const [first, second, third, fourth = 'grape'] = fruits;
```

### Object Destructuring

```javascript
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  address: {
    city: 'New York',
    country: 'USA'
  }
};

// Cơ bản
const { name, age, email } = user;

// Đổi tên biến
const { name: userName, age: userAge } = user;

// Nested destructuring
const { address: { city, country } } = user;

// Giá trị mặc định
const { name, age, phone = 'N/A' } = user;

// Với rest operator
const { name, ...otherProps } = user;
```

## 3\. Template Literals

```javascript
const name = 'John';
const age = 30;

// ES5
const message = 'My name is ' + name + ' and I am ' + age + ' years old';

// ES6
const message = `My name is ${name} and I am ${age} years old`;

// Multi-line strings
const html = `
  <div class="user">
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;

// Với expressions
const price = 19.99;
const quantity = 3;
const total = `Total: $${(price * quantity).toFixed(2)}`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
  }, '');
}

const highlighted = highlight`Hello ${name}, you are ${age} years old`;
```

## 4\. Spread & Rest Operators

### Spread Operator (…)

```javascript
// Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Copy array
const copy = [...arr1];

// Objects
const obj1 = { name: 'John' };
const obj2 = { age: 30 };
const merged = { ...obj1, ...obj2 }; // { name: 'John', age: 30 }

// Clone object
const clone = { ...obj1 };

// Với default values
const config = { ...defaultConfig, ...userConfig };
```

### Rest Operator

```javascript
// Trong function parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3, 4, 5); // 15

// Trong destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(rest); // [3, 4, 5]

const { name, ...otherProps } = user;
```

## 5\. Default Parameters

```javascript
// ES5
function greet(name) {
  name = name || 'Guest';
  return 'Hello ' + name;
}

// ES6
function greet(name = 'Guest') {
  return `Hello ${name}`;
}

// Với destructuring
function createUser({ name = 'Anonymous', age = 18, email = '' } = {}) {
  return { name, age, email };
}

// Với expressions
function getRandomId(prefix = 'user', length = 8) {
  return prefix + Math.random().toString(36).substr(2, length);
}
```

## 6\. Classes

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // Instance method
  greet() {
    return `Hello, I'm ${this.name}`;
  }

  // Getter
  get isAdult() {
    return this.age >= 18;
  }

  // Setter
  set age(value) {
    if (value < 0) {
      throw new Error('Age cannot be negative');
    }
    this._age = value;
  }

  // Static method
  static create(name, age) {
    return new Person(name, age);
  }
}

// Inheritance
class Employee extends Person {
  constructor(name, age, salary) {
    super(name, age);
    this.salary = salary;
  }

  getSalary() {
    return this.salary;
  }
}

// Usage
const person = new Person('John', 30);
const employee = Employee.create('Jane', 25, 50000);
```

## 7\. Modules

### Export

```javascript
// Named exports
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}

// Default export
export default class Calculator {
  add(a, b) {
    return a + b;
  }
}

// Export all
export * from './utils';
```

### Import

```javascript
// Named imports
import { PI, add } from './math';

// Default import
import Calculator from './calculator';

// Mixed imports
import Calculator, { PI } from './math';

// Import all as namespace
import * as MathUtils from './math';

// Dynamic import
const module = await import('./dynamic-module');
```

## 8\. Promises & Async/Await

### Promises

```javascript
// Tạo Promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { id: 1, name: 'John' };
      resolve(data);
    }, 1000);
  });
};

// Sử dụng Promise
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Promise.all
const promises = [fetchData(), fetchData(), fetchData()];
Promise.all(promises)
  .then(results => console.log(results));

// Promise.race
Promise.race(promises)
  .then(firstResult => console.log(firstResult));
```

### Async/Await

```javascript
// Async function
async function getUserData() {
  try {
    const user = await fetchData();
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.error('Error:', error);
  }
}

// Async arrow function
const processData = async () => {
  const data = await fetchData();
  return data.map(item => item * 2);
};

// Parallel execution
const getDataParallel = async () => {
  const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts()
  ]);
  return { users, posts };
};
```

## 9\. Map & Set

### Map

```javascript
const map = new Map();

// Thêm key-value
map.set('name', 'John');
map.set(1, 'one');
map.set({ key: 'obj' }, 'object value');

// Lấy giá trị
console.log(map.get('name')); // 'John'

// Kiểm tra key
console.log(map.has('name')); // true

// Xóa key
map.delete('name');

// Kích thước
console.log(map.size);

// Iterate
map.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// Convert từ Object
const obj = { name: 'John', age: 30 };
const mapFromObj = new Map(Object.entries(obj));
```

### Set

```javascript
const set = new Set();

// Thêm giá trị
set.add(1);
set.add('hello');
set.add({ name: 'John' });

// Kiểm tra giá trị
console.log(set.has(1)); // true

// Xóa giá trị
set.delete(1);

// Kích thước
console.log(set.size);

// Convert từ Array
const uniqueArray = [...new Set([1, 2, 2, 3, 3, 4])];
// [1, 2, 3, 4]
```

## 10\. Optional Chaining & Nullish Coalescing

### Optional Chaining (?.)

```javascript
const user = {
  name: 'John',
  address: {
    street: 'Main St',
    city: 'New York'
  }
};

// Safe property access
console.log(user?.address?.street); // 'Main St'
console.log(user?.contact?.phone); // undefined

// Với function calls
const result = user?.getName?.();

// Với array access
const firstItem = array?.[0];
```

### Nullish Coalescing (??)

```javascript
// Chỉ dùng default khi value là null hoặc undefined
const name = user.name ?? 'Anonymous';
const age = user.age ?? 18;

// So sánh với ||
const count = 0;
console.log(count || 10); // 10 (vì 0 là falsy)
console.log(count ?? 10); // 0 (vì 0 không phải null/undefined)

// Kết hợp với optional chaining
const street = user?.address?.street ?? 'Unknown';
```

## 11\. Array Methods

### find() & findIndex()

```javascript
const users = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'Bob', age: 35 }
];

// find
const user = users.find(u => u.age > 30);
console.log(user); // { id: 3, name: 'Bob', age: 35 }

// findIndex
const index = users.findIndex(u => u.name === 'Jane');
console.log(index); // 1
```

### includes()

```javascript
const numbers = [1, 2, 3, 4, 5];
console.log(numbers.includes(3)); // true
console.log(numbers.includes(6)); // false

// Với strings
const message = 'Hello World';
console.log(message.includes('World')); // true
```

### startsWith() & endsWith()

```javascript
const filename = 'document.pdf';
console.log(filename.endsWith('.pdf')); // true
console.log(filename.startsWith('doc')); // true
```

## 12\. String Methods

### repeat()

```javascript
const separator = '-'.repeat(20);
console.log(separator); // '--------------------'
```

### padStart() & padEnd()

```javascript
const number = '5';
console.log(number.padStart(3, '0')); // '005'
console.log(number.padEnd(3, '0')); // '500'

const text = 'Hello';
console.log(text.padStart(10, ' ')); // '     Hello'
```

## 13\. Object Methods

### Object.assign()

```javascript
const target = { a: 1 };
const source = { b: 2, c: 3 };
const result = Object.assign(target, source);
console.log(result); // { a: 1, b: 2, c: 3 }
```

### Object.entries(), Object.keys(), Object.values()

```javascript
const user = { name: 'John', age: 30 };

// Object.entries()
const entries = Object.entries(user);
// [['name', 'John'], ['age', 30]]

// Object.keys()
const keys = Object.keys(user);
// ['name', 'age']

// Object.values()
const values = Object.values(user);
// ['John', 30]
```

## 14\. Generators

```javascript
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const generator = numberGenerator();
console.log(generator.next().value); // 1
console.log(generator.next().value); // 2
console.log(generator.next().value); // 3

// Với for...of
for (const num of numberGenerator()) {
  console.log(num);
}
```

## 15\. Proxy

```javascript
const user = { name: 'John', age: 30 };

const proxy = new Proxy(user, {
  get(target, property) {
    console.log(`Accessing property: ${property}`);
    return target[property];
  },
  set(target, property, value) {
    console.log(`Setting ${property} to ${value}`);
    target[property] = value;
    return true;
  }
});

proxy.name; // Logs: "Accessing property: name"
proxy.age = 31; // Logs: "Setting age to 31"
```

## Kết luận

ES6+ đã mang lại những cải tiến lớn cho JavaScript, giúp code ngắn gọn, dễ đọc và mạnh mẽ hơn. Việc nắm vững các tính năng này sẽ giúp bạn viết code hiện đại và hiệu quả hơn.

### Tips sử dụng:

*   Sử dụng arrow functions cho callbacks ngắn
*   Destructuring để code sạch hơn
*   Template literals thay vì string concatenation
*   Async/await thay vì Promise chains
*   Optional chaining để tránh lỗi runtime
*   Spread/rest operators để thao tác arrays và objects