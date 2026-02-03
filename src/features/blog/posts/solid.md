---
title: "SOLID"
date: 2025-06-20T08:12:09.000Z
tags:
  [
    Clean Code,
    Dependency Inversion,
    Design Principles,
    Interface Segregation,
    Liskov Substitution,
    OOP,
    Open/Closed,
    SOLID,
    Single Responsibility,
    Software Architecture,
  ]
categories: [Programming, Design Patterns, OOP]
---

## SOLID là gì?

SOLID là 5 nguyên tắc thiết kế code OOP để tránh viết code như… mì tôm (rối rắm, khó sửa, dễ vỡ). Giống như 5 quy tắc sống còn của dev:  
**S**imple (đơn giản)  
**O**pen (mở rộng)  
**L**ogic (hợp lý)  
**I**ndependent (độc lập)  
**D**etachable (tách rời)

## S - Single Responsibility Principle

**Nguyên tắc**: Một class chỉ nên có **1 lý do để thay đổi**.

### ❌ Sai:

```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // Quản lý user data
  save() {
    // Lưu vào database
  }

  // Gửi email (không liên quan đến User!)
  sendWelcomeEmail() {
    // Gửi email chào mừng
  }

  // Validate data (cũng không liên quan!)
  validateEmail() {
    return this.email.includes("@");
  }
}
```

### ✅ Đúng:

```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class UserRepository {
  save(user) {
    // Chỉ lo việc lưu data
  }
}

class EmailService {
  sendWelcomeEmail(user) {
    // Chỉ lo việc gửi email
  }
}

class UserValidator {
  validateEmail(email) {
    return email.includes("@");
  }
}
```

**Nhớ bằng cách**: Mỗi class như 1 nhân viên, mỗi người chỉ làm 1 việc thôi. Đừng bắt thằng bán hàng kiêm luôn kế toán! 🤷‍♂️

## O - Open/Closed Principle

**Nguyên tắc**: Class nên **mở cho mở rộng**, **đóng cho sửa đổi**.

### ❌ Sai:

```javascript
class Calculator {
  calculate(operation, a, b) {
    if (operation === "add") {
      return a + b;
    } else if (operation === "subtract") {
      return a - b;
    }
    // Muốn thêm multiply? Phải sửa class này! 😱
  }
}
```

### ✅ Đúng:

```javascript
class Operation {
  execute(a, b) {
    throw new Error("Must implement execute method");
  }
}

class AddOperation extends Operation {
  execute(a, b) {
    return a + b;
  }
}

class SubtractOperation extends Operation {
  execute(a, b) {
    return a - b;
  }
}

class Calculator {
  calculate(operation, a, b) {
    return operation.execute(a, b);
  }
}

// Muốn thêm multiply? Tạo class mới, không sửa code cũ!
class MultiplyOperation extends Operation {
  execute(a, b) {
    return a * b;
  }
}
```

**Nhớ bằng cách**: Như cửa hàng - mở rộng thêm sản phẩm mới, không sửa lại sản phẩm cũ! 🏪

## L - Liskov Substitution Principle

**Nguyên tắc**: Object của class con phải thay thế được object của class cha mà không làm hỏng chương trình.

### ❌ Sai:

```javascript
class Bird {
  fly() {
    return "Flying high!";
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguins cannot fly!"); // Phá vỡ hành vi của Bird!
  }
}

function makeBirdFly(bird) {
  return bird.fly(); // Boom! Nếu truyền Penguin vào
}
```

### ✅ Đúng:

```javascript
class Bird {
  move() {
    return "Moving...";
  }
}

class FlyingBird extends Bird {
  fly() {
    return "Flying high!";
  }

  move() {
    return this.fly();
  }
}

class SwimmingBird extends Bird {
  swim() {
    return "Swimming gracefully!";
  }

  move() {
    return this.swim();
  }
}

class Eagle extends FlyingBird {}
class Penguin extends SwimmingBird {}
```

**Nhớ bằng cách**: Con phải giống bố/mẹ về tính cách cơ bản. Đừng sinh ra đứa con “nổi loạn” phá hoại gia đình! 👨‍👩‍👧‍👦

## I - Interface Segregation Principle

**Nguyên tắc**: Đừng ép client implement những method không cần thiết.

### ❌ Sai:

```javascript
class AllInOneDevice {
  print() {}
  scan() {}
  fax() {}
  makeCall() {} // Máy in mà gọi điện?! 🤔
}

class SimplePrinter extends AllInOneDevice {
  print() {
    return "Printing...";
  }

  scan() {
    throw new Error("Cannot scan!"); // Bắt buộc phải có nhưng không dùng
  }

  fax() {
    throw new Error("Cannot fax!");
  }

  makeCall() {
    throw new Error("Cannot make call!");
  }
}
```

### ✅ Đúng:

```javascript
class Printer {
  print() {}
}

class Scanner {
  scan() {}
}

class FaxMachine {
  fax() {}
}

class Phone {
  makeCall() {}
}

// Chỉ implement những gì cần thiết
class SimplePrinter extends Printer {
  print() {
    return "Printing...";
  }
}

class AllInOnePrinter extends Printer {
  constructor() {
    super();
    this.scanner = new Scanner();
    this.faxMachine = new FaxMachine();
  }

  print() {
    return "Printing...";
  }

  scan() {
    return this.scanner.scan();
  }

  fax() {
    return this.faxMachine.fax();
  }
}
```

**Nhớ bằng cách**: Đừng bắt người bán bánh mì phải biết sửa xe máy! Mỗi người chỉ cần biết skill của mình! 🥖

## D - Dependency Inversion Principle

**Nguyên tắc**: Phụ thuộc vào abstraction, không phụ thuộc vào implementation cụ thể.

### ❌ Sai:

```javascript
class MySQLDatabase {
  save(data) {
    // Lưu vào MySQL
    console.log("Saving to MySQL:", data);
  }
}

class UserService {
  constructor() {
    this.database = new MySQLDatabase(); // Phụ thuộc cứng vào MySQL!
  }

  saveUser(user) {
    this.database.save(user);
  }
}

// Muốn đổi sang PostgreSQL? Phải sửa UserService! 😰
```

### ✅ Đúng:

```javascript
// Abstraction
class Database {
  save(data) {
    throw new Error("Must implement save method");
  }
}

// Implementations
class MySQLDatabase extends Database {
  save(data) {
    console.log("Saving to MySQL:", data);
  }
}

class PostgreSQLDatabase extends Database {
  save(data) {
    console.log("Saving to PostgreSQL:", data);
  }
}

class UserService {
  constructor(database) {
    this.database = database; // Phụ thuộc vào abstraction
  }

  saveUser(user) {
    this.database.save(user);
  }
}

// Sử dụng
const mysqlDb = new MySQLDatabase();
const postgresDb = new PostgreSQLDatabase();

const userService1 = new UserService(mysqlDb);
const userService2 = new UserService(postgresDb);
```

**Nhớ bằng cách**: Đừng yêu con người vì ngoại hình, hãy yêu vì tính cách! Database cũng vậy, yêu interface chứ đừng yêu implementation! 💕

## Ví dụ tổng hợp: E-commerce System

```javascript
// S - Single Responsibility
class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class ProductRepository {
  save(product) {
    /* Chỉ lo lưu data */
  }
  findById(id) {
    /* Chỉ lo tìm data */
  }
}

class ProductValidator {
  validate(product) {
    /* Chỉ lo validate */
  }
}

// O - Open/Closed
class DiscountCalculator {
  calculate(product, discount) {
    return discount.apply(product.price);
  }
}

class PercentageDiscount {
  constructor(percentage) {
    this.percentage = percentage;
  }

  apply(price) {
    return price * (1 - this.percentage / 100);
  }
}

class FixedDiscount {
  constructor(amount) {
    this.amount = amount;
  }

  apply(price) {
    return Math.max(0, price - this.amount);
  }
}

// L - Liskov Substitution
class PaymentProcessor {
  process(amount) {
    return { success: true, amount };
  }
}

class CreditCardProcessor extends PaymentProcessor {
  process(amount) {
    // Xử lý thanh toán credit card
    return { success: true, amount, method: "credit_card" };
  }
}

class PayPalProcessor extends PaymentProcessor {
  process(amount) {
    // Xử lý thanh toán PayPal
    return { success: true, amount, method: "paypal" };
  }
}

// I - Interface Segregation
class OrderPrinter {
  printOrder(order) {
    /* In đơn hàng */
  }
}

class OrderEmailer {
  sendOrderEmail(order) {
    /* Gửi email đơn hàng */
  }
}

class OrderSMSer {
  sendOrderSMS(order) {
    /* Gửi SMS đơn hàng */
  }
}

// D - Dependency Inversion
class OrderService {
  constructor(repository, paymentProcessor, notifier) {
    this.repository = repository;
    this.paymentProcessor = paymentProcessor;
    this.notifier = notifier;
  }

  createOrder(orderData) {
    // Tạo đơn hàng
    const order = new Order(orderData);

    // Thanh toán
    const payment = this.paymentProcessor.process(order.total);

    if (payment.success) {
      // Lưu đơn hàng
      this.repository.save(order);

      // Thông báo
      this.notifier.notify(order);

      return order;
    }

    throw new Error("Payment failed");
  }
}
```

## Tóm tắt cho dev “đầu óc đơn giản”

| Nguyên tắc                | Nhớ bằng                            | Ví dụ                            |
| ------------------------- | ----------------------------------- | -------------------------------- |
| **S**ingle Responsibility | 1 class = 1 việc                    | Thầy giáo không kiêm bán phở     |
| **O**pen/Closed           | Mở rộng, không sửa                  | Thêm món mới, không đổi món cũ   |
| **L**iskov Substitution   | Con phải giống bố/mẹ                | Chim cánh cụt không bay được     |
| **I**nterface Segregation | Đừng ép làm việc không cần          | Thợ may không cần biết lái xe    |
| **D**ependency Inversion  | Yêu tính cách, không yêu ngoại hình | Yêu “Database” không yêu “MySQL” |

## Khi nào áp dụng SOLID?

### ✅ Nên áp dụng:

- Dự án lớn, nhiều người làm
- Code cần maintain lâu dài
- Yêu cầu thay đổi thường xuyên
- Team có kinh nghiệm OOP

### ❌ Không cần quá khắt khe:

- Prototype nhanh
- Script nhỏ, dùng 1 lần
- Deadline gấp (nhưng nhớ refactor sau!)
- Solo project đơn giản

---

_Remember: SOLID giúp code không “solid” như đá mà “flexible” như nước! 🌊_

**Chúc các bạn code không còn “rắc rối” nữa!**

ph4n4n
