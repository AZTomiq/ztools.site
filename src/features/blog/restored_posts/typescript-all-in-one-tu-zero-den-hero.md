---
title: "TypeScript All in One - Từ Zero đếN Hero"
date: 2025-06-26T04:45:18.000Z
tags: [Beginner, ES6, JavaScript, Node.js, Programming, Tutorial, Type System, TypeScript]
categories: [TypeScript, JavaScript, Programming]
---

# TypeScript All in One - Từ Zero đến Hero

TypeScript là JavaScript với thêm type system. Nó giúp bạn viết code an toàn hơn, dễ bảo trì hơn và ít lỗi runtime hơn.

## 1\. Tại sao cần TypeScript?

### Vấn đề với JavaScript thuần

```javascript
// JavaScript - không có type checking
function add(a, b) {
  return a + b;
}

add(5, 3);        // ✅ 8
add("5", 3);      // ❌ "53" (string concatenation)
add(5, "hello");  // ❌ "5hello"
add();            // ❌ NaN
```

### Giải pháp với TypeScript

```typescript
// TypeScript - có type checking
function add(a: number, b: number): number {
  return a + b;
}

add(5, 3);        // ✅ 8
add("5", 3);      // ❌ Error: Argument of type 'string' not assignable to 'number'
add(5, "hello");  // ❌ Error: Argument of type 'string' not assignable to 'number'
add();            // ❌ Error: Expected 2 arguments, but got 0
```

## 2\. Cài đặt và Setup

### Cài đặt TypeScript

```bash
# Cài đặt globally
npm install -g typescript

# Hoặc trong project
npm install --save-dev typescript

# Khởi tạo tsconfig.json
npx tsc --init
```

### tsconfig.json cơ bản

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 3\. Basic Types

### Primitive Types

```typescript
// String
let name: string = "John";
let message: string = `Hello ${name}`;

// Number
let age: number = 30;
let price: number = 19.99;

// Boolean
let isActive: boolean = true;
let isCompleted: boolean = false;

// Null & Undefined
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// Symbol
let symbol: symbol = Symbol("unique");

// BigInt
let bigNumber: bigint = 100n;
```

### Type Inference

```typescript
// TypeScript tự động đoán type
let name = "John";        // type: string
let age = 30;            // type: number
let isActive = true;     // type: boolean

// Explicit typing
let message: string = "Hello";
let count: number = 42;
```

## 4\. Arrays & Tuples

### Arrays

```typescript
// Array of numbers
let numbers: number[] = [1, 2, 3, 4, 5];
let scores: Array<number> = [95, 87, 92];

// Array of strings
let names: string[] = ["John", "Jane", "Bob"];
let colors: Array<string> = ["red", "green", "blue"];

// Mixed array (union type)
let mixed: (string | number)[] = ["hello", 42, "world", 100];

// Readonly array
let readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers.push(4); // ❌ Error: Property 'push' does not exist
```

### Tuples

```typescript
// Tuple - array với số lượng và type cố định
let person: [string, number] = ["John", 30];
let coordinates: [number, number] = [10, 20];

// Tuple với optional elements
let rgb: [number, number, number, number?] = [255, 0, 0];
let rgba: [number, number, number, number?] = [255, 0, 0, 0.5];

// Tuple với rest elements
let tuple: [string, ...number[]] = ["hello", 1, 2, 3, 4, 5];
```

## 5\. Objects & Interfaces

### Object Types

```typescript
// Object type annotation
let user: {
  name: string;
  age: number;
  email?: string; // optional property
} = {
  name: "John",
  age: 30
};

// Readonly properties
let config: {
  readonly apiUrl: string;
  readonly timeout: number;
} = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};
```

### Interfaces

```typescript
// Basic interface
interface User {
  name: string;
  age: number;
  email?: string;
}

let user: User = {
  name: "John",
  age: 30
};

// Interface với methods
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

let calc: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// Extending interfaces
interface Employee extends User {
  salary: number;
  department: string;
}

let employee: Employee = {
  name: "Jane",
  age: 25,
  salary: 50000,
  department: "Engineering"
};

// Interface với index signatures
interface StringArray {
  [index: number]: string;
}

let colors: StringArray = ["red", "green", "blue"];
```

## 6\. Functions

### Function Types

```typescript
// Function với type annotations
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Function với optional parameters
function greet(name: string, greeting?: string): string {
  return greeting ? `${greeting}, ${name}!` : `Hello, ${name}!`;
}

// Function với default parameters
function createUser(name: string, age: number = 18): User {
  return { name, age };
}

// Function với rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// Function overloads
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value * 2;
  }
}
```

### Function Types

```typescript
// Function type
type MathFunc = (a: number, b: number) => number;

let add: MathFunc = (a, b) => a + b;
let subtract: MathFunc = (a, b) => a - b;

// Callback functions
function processArray(
  arr: number[], 
  callback: (item: number) => number
): number[] {
  return arr.map(callback);
}

let result = processArray([1, 2, 3], (x) => x * 2);
// result: [2, 4, 6]
```

## 7\. Union & Intersection Types

### Union Types

```typescript
// Union type - có thể là một trong các type
type Status = "loading" | "success" | "error";
type ID = string | number;

let status: Status = "loading";
let id: ID = "user123";
let numericId: ID = 123;

// Union với functions
function processValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toString();
  }
}

// Union với objects
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}
```

### Intersection Types

```typescript
// Intersection type - kết hợp tất cả properties
type HasName = { name: string };
type HasAge = { age: number };
type Person = HasName & HasAge;

let person: Person = {
  name: "John",
  age: 30
};

// Intersection với interfaces
interface Loggable {
  log(message: string): void;
}

interface Serializable {
  serialize(): string;
}

type Logger = Loggable & Serializable;

let logger: Logger = {
  log: (message) => console.log(message),
  serialize: () => JSON.stringify({})
};
```

## 8\. Generics

### Basic Generics

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

let stringResult = identity<string>("hello");
let numberResult = identity<number>(42);

// Type inference
let inferredString = identity("hello"); // type: string
let inferredNumber = identity(42);      // type: number

// Generic interface
interface Container<T> {
  value: T;
  getValue(): T;
}

let stringContainer: Container<string> = {
  value: "hello",
  getValue: function() { return this.value; }
};
```

### Generic Constraints

```typescript
// Constraint với interface
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello");     // ✅ string có length
logLength([1, 2, 3]);   // ✅ array có length
logLength(42);          // ❌ number không có length

// Multiple constraints
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

function processPerson<T extends HasName & HasAge>(person: T): T {
  console.log(`${person.name} is ${person.age} years old`);
  return person;
}
```

### Generic Classes

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  size(): number {
    return this.items.length;
  }
}

let numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop()); // 2

let stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");
```

## 9\. Enums

### Basic Enums

```typescript
// Numeric enum
enum Direction {
  North = 0,
  East = 1,
  South = 2,
  West = 3
}

let currentDirection = Direction.North;
console.log(currentDirection); // 0

// String enum
enum Status {
  Loading = "LOADING",
  Success = "SUCCESS",
  Error = "ERROR"
}

let currentStatus = Status.Loading;
console.log(currentStatus); // "LOADING"

// Auto-incrementing enum
enum Color {
  Red,    // 0
  Green,  // 1
  Blue    // 2
}
```

### Enum với values

```typescript
enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST"
}

function checkPermission(role: UserRole): boolean {
  switch (role) {
    case UserRole.Admin:
      return true;
    case UserRole.User:
      return true;
    case UserRole.Guest:
      return false;
  }
}
```

## 10\. Type Aliases

### Basic Type Aliases

```typescript
// Simple type alias
type Point = {
  x: number;
  y: number;
};

let point: Point = { x: 10, y: 20 };

// Union type alias
type Status = "idle" | "loading" | "success" | "error";

// Function type alias
type MathOperation = (a: number, b: number) => number;

let add: MathOperation = (a, b) => a + b;
let multiply: MathOperation = (a, b) => a * b;
```

### Complex Type Aliases

```typescript
// Generic type alias
type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

// Conditional type alias
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped type alias
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};
```

## 11\. Advanced Types

### Conditional Types

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;   // true
type B = IsString<number>;   // false

// Conditional type với inference
type ElementType<T> = T extends (infer U)[] ? U : never;

type StringArray = string[];
type ExtractedType = ElementType<StringArray>; // string

// Conditional type với union
type NonNullable<T> = T extends null | undefined ? never : T;

type Result = NonNullable<string | null | undefined>; // string
```

### Mapped Types

```typescript
// Basic mapped type
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type User = {
  name: string;
  age: number;
};

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }

// Mapped type với modifiers
type Optional<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Mapped type với conditional
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

type User = {
  name: string;
  age: number;
  email: string;
};

type StringProps = PickByType<User, string>; // { name: string; email: string; }
```

### Template Literal Types

```typescript
// Basic template literal type
type Greeting = `Hello ${string}`;
type Email = `${string}@${string}.${string}`;

// Template literal với union
type EventName = "click" | "scroll" | "keydown";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onScroll" | "onKeydown"

// Complex template literal
type Path = `/${string}`;
type ApiEndpoint = `/api${Path}`;

let endpoint: ApiEndpoint = "/api/users"; // ✅
let invalid: ApiEndpoint = "/users";      // ❌
```

## 12\. Utility Types

### Built-in Utility Types

```typescript
// Partial - làm tất cả properties optional
type User = {
  name: string;
  age: number;
  email: string;
};

type PartialUser = Partial<User>;
// { name?: string; age?: number; email?: string; }

// Required - làm tất cả properties required
type OptionalUser = {
  name?: string;
  age?: number;
  email?: string;
};

type RequiredUser = Required<OptionalUser>;
// { name: string; age: number; email: string; }

// Pick - chọn một số properties
type UserInfo = Pick<User, "name" | "email">;
// { name: string; email: string; }

// Omit - loại bỏ một số properties
type UserWithoutEmail = Omit<User, "email">;
// { name: string; age: number; }

// Record - tạo object type với key và value types
type UserRoles = Record<string, "admin" | "user" | "guest">;
// { [key: string]: "admin" | "user" | "guest" }

// ReturnType - lấy return type của function
function getUser(): User {
  return { name: "John", age: 30, email: "john@example.com" };
}

type UserReturnType = ReturnType<typeof getUser>; // User

// Parameters - lấy parameter types của function
function createUser(name: string, age: number): User {
  return { name, age, email: "" };
}

type CreateUserParams = Parameters<typeof createUser>; // [string, number]
```

## 13\. Namespaces & Modules

### Namespaces

```typescript
// Basic namespace
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b;
  }

  export function multiply(a: number, b: number): number {
    return a * b;
  }

  export const PI = 3.14159;
}

// Sử dụng namespace
let result = MathUtils.add(5, 3);
let area = MathUtils.multiply(MathUtils.PI, 10);

// Nested namespace
namespace Geometry {
  export namespace Circle {
    export function area(radius: number): number {
      return Math.PI * radius ** 2;
    }
  }

  export namespace Rectangle {
    export function area(width: number, height: number): number {
      return width * height;
    }
  }
}
```

### ES6 Modules

```typescript
// math.ts
export interface Point {
  x: number;
  y: number;
}

export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

// Default export
export default class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// main.ts
import Calculator, { add, PI, Point } from './math';

let calc = new Calculator();
let result = add(5, 3);
let point: Point = { x: 10, y: 20 };
```

## 14\. Decorators

### Class Decorators

```typescript
// Basic class decorator
function log(target: any) {
  console.log(`Class ${target.name} is being defined`);
}

@log
class User {
  constructor(public name: string) {}
}

// Decorator factory
function logWithPrefix(prefix: string) {
  return function(target: any) {
    console.log(`${prefix}: Class ${target.name} is being defined`);
  };
}

@logWithPrefix("DEBUG")
class Product {
  constructor(public name: string, public price: number) {}
}
```

### Method Decorators

```typescript
// Method decorator
function log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyName} with args:`, args);
    const result = method.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}
```

## 15\. Best Practices

### Type Safety

```typescript
// ✅ Good - explicit typing
function processUser(user: User): string {
  return user.name.toUpperCase();
}

// ❌ Bad - any type
function processUser(user: any): any {
  return user.name.toUpperCase();
}

// ✅ Good - strict null checks
function getLength(str: string | null): number {
  return str?.length ?? 0;
}

// ❌ Bad - no null checking
function getLength(str: string): number {
  return str.length; // Could throw if str is null
}
```

### Interface vs Type

```typescript
// ✅ Use interface for object shapes
interface User {
  name: string;
  age: number;
}

// ✅ Use type for unions, primitives, etc.
type Status = "loading" | "success" | "error";
type UserId = string | number;

// ✅ Use type for complex types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### Error Handling

```typescript
// ✅ Good - proper error handling
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// ✅ Good - Result type pattern
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUserSafe(id: string): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return { success: false, error: new Error(`HTTP ${response.status}`) };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

## 16\. Common Patterns

### Builder Pattern

```typescript
class UserBuilder {
  private user: Partial<User> = {};

  setName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  setAge(age: number): UserBuilder {
    this.user.age = age;
    return this;
  }

  setEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  build(): User {
    if (!this.user.name || !this.user.age) {
      throw new Error("Name and age are required");
    }
    return this.user as User;
  }
}

// Usage
const user = new UserBuilder()
  .setName("John")
  .setAge(30)
  .setEmail("john@example.com")
  .build();
```

### Singleton Pattern

```typescript
class Database {
  private static instance: Database;
  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  query(sql: string): any {
    console.log(`Executing: ${sql}`);
    return { result: "data" };
  }
}

// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true
```

## Kết luận

TypeScript mang lại nhiều lợi ích:

### ✅ **Lợi ích chính:**

*   **Type Safety**: Phát hiện lỗi sớm trong quá trình development
*   **Better IDE Support**: Autocomplete, refactoring, navigation
*   **Self-Documenting Code**: Types làm code dễ hiểu hơn
*   **Refactoring Safety**: Thay đổi code an toàn hơn
*   **Team Collaboration**: Code rõ ràng cho team

### 🚀 **Tips sử dụng:**

*   Bắt đầu với `strict: true` trong tsconfig
*   Sử dụng interfaces cho object shapes
*   Tận dụng type inference khi có thể
*   Viết generic functions để tái sử dụng
*   Sử dụng utility types để giảm boilerplate

### 📚 **Học tiếp:**

*   Advanced TypeScript patterns
*   Framework integration (React, Vue, Angular)
*   Performance optimization
*   Testing với TypeScript

TypeScript sẽ giúp bạn viết code JavaScript tốt hơn, an toàn hơn và dễ bảo trì hơn!