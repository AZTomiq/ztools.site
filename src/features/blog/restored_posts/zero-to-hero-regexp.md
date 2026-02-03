---
title: "Zero to Hero: Regexp"
date: 2025-06-26T08:59:43.000Z
tags: [Pattern Matching, Regexp, Regular Expressions, String Processing, Validation]
---

# Zero to Hero: Regular Expressions - Nghệ thuật tìm kiếm pattern

> _“Regular Expressions giống như một ngôn ngữ bí mật để giao tiếp với máy tính. Một khi bạn hiểu được nó, bạn sẽ thấy mình có thể làm được những điều mà trước đây tưởng như không thể.”_

Bạn có bao giờ tự hỏi làm sao để:

*   Tìm tất cả email trong một file text dài hàng nghìn dòng?
*   Kiểm tra xem một chuỗi có phải là số điện thoại hợp lệ không?
*   Trích xuất thông tin từ log files một cách tự động?
*   Làm sạch dữ liệu từ CSV files?

Câu trả lời chính là **Regular Expressions** - công cụ mạnh mẽ nhất cho text processing mà mọi developer cần biết.

## Mục lục

*   [Giới thiệu](#gi%E1%BB%9Bi-thi%E1%BB%87u)
*   [Cú pháp cơ bản](#c%C3%BA-ph%C3%A1p-c%C6%A1-b%E1%BA%A3n)
*   [Character Classes](#character-classes)
*   [Quantifiers](#quantifiers)
*   [Anchors](#anchors)
*   [Groups và Capturing](#groups-v%C3%A0-capturing)
*   [Flags](#flags)
*   [Common Patterns](#common-patterns)
*   [JavaScript Regex](#javascript-regex)
*   [Python Regex](#python-regex)
*   [Node.js Regex](#nodejs-regex)
*   [Best Practices](#best-practices)
*   [Ví dụ thực tế](#v%C3%AD-d%E1%BB%A5-th%E1%BB%B1c-t%E1%BA%BF)

## Giới thiệu

### Regex là gì và tại sao nó quan trọng?

Regular Expressions (Regex) không chỉ là một công cụ - nó là một **nghệ thuật**. Nghệ thuật của việc mô tả pattern trong text một cách chính xác và hiệu quả.

Hãy tưởng tượng bạn đang tìm kiếm một cuốn sách trong thư viện. Thay vì phải đọc từng trang để tìm thông tin, bạn có một “công thức” để máy tính tự động tìm kiếm. Đó chính là regex.

### Những gì bạn có thể làm với Regex:

**🎯 Validation (Xác thực)**

*   Kiểm tra email có đúng format không
*   Xác nhận password đủ mạnh
*   Validate số điện thoại theo chuẩn quốc tế

**🔍 Search & Replace (Tìm kiếm & Thay thế)**

*   Tìm tất cả URL trong một document
*   Thay thế format date từ MM/DD/YYYY sang YYYY-MM-DD
*   Loại bỏ các ký tự không mong muốn

**📊 Data Extraction (Trích xuất dữ liệu)**

*   Lấy thông tin từ log files
*   Parse CSV data
*   Extract metadata từ text

**🛠️ Text Processing (Xử lý văn bản)**

*   Format phone numbers
*   Clean user input
*   Normalize data

### Real-world Use Cases:

```javascript
// Ví dụ thực tế: Tìm tất cả email trong text
const text = `
Contact us at support@company.com or sales@company.com
For urgent matters: emergency@company.com
`;

const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const emails = text.match(emailPattern);
console.log(emails); 
// ['support@company.com', 'sales@company.com', 'emergency@company.com']
```

## Cú pháp cơ bản

### Bắt đầu với những điều đơn giản nhất

Regex có thể trông phức tạp, nhưng hãy bắt đầu từ những điều cơ bản nhất. Giống như học ngôn ngữ, bạn cần biết từ vựng trước khi viết văn.

#### Literal Characters - Tìm kiếm chính xác

Đôi khi bạn chỉ muốn tìm một chuỗi cụ thể. Đây là cách đơn giản nhất:

```javascript
// Tìm chính xác chuỗi "hello"
const pattern = /hello/;
const text = "hello world";
console.log(pattern.test(text)); // true

// Tìm "cat" trong câu
const catPattern = /cat/;
const sentence = "The cat is sleeping on the mat";
console.log(catPattern.test(sentence)); // true
```

**💡 Tip:** Đây là cách regex hoạt động cơ bản nhất - nó tìm kiếm chính xác những gì bạn viết.

#### Metacharacters - Những ký tự đặc biệt

Một số ký tự có ý nghĩa đặc biệt trong regex. Chúng giống như “từ khóa” trong ngôn ngữ lập trình:

```javascript
// Các ký tự đặc biệt cần escape
const specialChars = /[.*+?^${}()|[\]\\]/g;

// Escape metacharacters để tìm chúng
const dotPattern = /\./; // Tìm dấu chấm (không phải bất kỳ ký tự nào)
const starPattern = /\*/; // Tìm dấu sao
const plusPattern = /\+/; // Tìm dấu cộng

// Ví dụ thực tế: Tìm domain trong URL
const url = "https://example.com/path";
const domainPattern = /https?:\/\/([^\/]+)/;
const match = url.match(domainPattern);
console.log(match[1]); // "example.com"
```

**🎯 Lưu ý quan trọng:** Khi bạn muốn tìm chính xác các ký tự đặc biệt này, bạn phải “escape” chúng bằng dấu `\`.

## Character Classes

### Tìm kiếm theo nhóm ký tự

Thay vì tìm một ký tự cụ thể, bạn có thể tìm một trong nhiều ký tự. Đây là nơi regex trở nên mạnh mẽ.

#### Basic Character Classes - Những nhóm cơ bản

```javascript
// Tìm nguyên âm trong tiếng Anh
const vowelPattern = /[aeiou]/;
console.log(vowelPattern.test("hello")); // true (có 'e' và 'o')

// Tìm số từ 0-9
const digitPattern = /[0-9]/;
console.log(digitPattern.test("abc123")); // true (có '1', '2', '3')

// Tìm chữ cái (cả hoa và thường)
const letterPattern = /[a-zA-Z]/;
console.log(letterPattern.test("123abc")); // true

// Negated character class - tìm những gì KHÔNG phải
const nonDigitPattern = /[^0-9]/; // Không phải số
const nonVowelPattern = /[^aeiou]/; // Không phải nguyên âm
```

**🔍 Ví dụ thực tế:** Tìm tất cả số trong một chuỗi

```javascript
const text = "Order #12345, Price: $99.99, Quantity: 5";
const numberPattern = /[0-9]+/g;
const numbers = text.match(numberPattern);
console.log(numbers); // ['12345', '99', '99', '5']
```

#### Predefined Character Classes - Những nhóm có sẵn

Regex cung cấp những “shortcut” để viết nhanh hơn:

```javascript
// JavaScript shortcuts
const patterns = {
    digit: /\d/,        // [0-9] - Tìm số
    nonDigit: /\D/,     // [^0-9] - Không phải số
    word: /\w/,         // [a-zA-Z0-9_] - Chữ, số, underscore
    nonWord: /\W/,      // [^a-zA-Z0-9_] - Không phải word character
    whitespace: /\s/,   // [ \t\n\r\f] - Khoảng trắng
    nonWhitespace: /\S/ // [^ \t\n\r\f] - Không phải khoảng trắng
};

// Ví dụ thực tế: Tách từ trong câu
const sentence = "Hello, world! How are you?";
const wordPattern = /\w+/g;
const words = sentence.match(wordPattern);
console.log(words); // ['Hello', 'world', 'How', 'are', 'you']
```

#### Custom Character Classes - Tạo nhóm riêng

Bạn có thể tạo những nhóm ký tự phù hợp với nhu cầu cụ thể:

```javascript
// Tìm chữ cái và số (alphanumeric)
const alphanumeric = /[a-zA-Z0-9]/;

// Tìm ký tự đặc biệt thường dùng
const specialChars = /[!@#$%^&*()]/;

// Tìm hex color characters
const hexPattern = /[0-9a-fA-F]/;

// Tìm phone number characters (số, dấu gạch, dấu ngoặc, khoảng trắng)
const phoneChars = /[0-9\-\+\(\)\s]/;

// Ví dụ thực tế: Validate hex color
const hexColor = "#FF5733";
const hexColorPattern = /^#[0-9a-fA-F]{6}$/;
console.log(hexColorPattern.test(hexColor)); // true
```

## Quantifiers

### Định lượng - Bao nhiêu lần?

Quantifiers cho bạn biết một pattern xuất hiện bao nhiêu lần. Đây là nơi regex trở nên linh hoạt.

#### Basic Quantifiers - Những định lượng cơ bản

```javascript
// ? - 0 hoặc 1 lần (optional)
const optionalPattern = /colou?r/; // color hoặc colour
console.log(optionalPattern.test("color")); // true
console.log(optionalPattern.test("colour")); // true

// * - 0 hoặc nhiều lần
const zeroOrMore = /a*/; // "", "a", "aa", "aaa", ...
console.log("banana".match(/a*/g)); // ['', 'a', '', 'a', '', 'a', '']

// + - 1 hoặc nhiều lần
const oneOrMore = /a+/; // "a", "aa", "aaa", ...
console.log("banana".match(/a+/g)); // ['a', 'a', 'a']

// {n} - chính xác n lần
const exactThree = /a{3}/; // "aaa"
console.log(exactThree.test("aaa")); // true
console.log(exactThree.test("aa")); // false

// {n,} - ít nhất n lần
const atLeastTwo = /a{2,}/; // "aa", "aaa", "aaaa", ...
console.log(atLeastTwo.test("aaa")); // true
console.log(atLeastTwo.test("a")); // false

// {n,m} - từ n đến m lần
const twoToFour = /a{2,4}/; // "aa", "aaa", "aaaa"
console.log(twoToFour.test("aaa")); // true
console.log(twoToFour.test("aaaaa")); // false (quá 4)
```

**🎯 Ví dụ thực tế:** Validate password strength

```javascript
function validatePassword(password) {
    const patterns = {
        length: /.{8,}/,           // Ít nhất 8 ký tự
        lowercase: /[a-z]/,        // Có chữ thường
        uppercase: /[A-Z]/,        // Có chữ hoa
        digit: /\d/,               // Có số
        special: /[!@#$%^&*]/,     // Có ký tự đặc biệt
        noSpaces: /^\S*$/          // Không có khoảng trắng
    };
    
    const results = {};
    for (const [rule, pattern] of Object.entries(patterns)) {
        results[rule] = pattern.test(password);
    }
    
    return results;
}

console.log(validatePassword("MyPass123!"));
// { length: true, lowercase: true, uppercase: true, digit: true, special: true, noSpaces: true }
```

#### Greedy vs Lazy - Tham lam hay nhút nhát?

Đây là một khái niệm quan trọng trong regex:

```javascript
// Greedy (mặc định) - lấy nhiều nhất có thể
const greedyPattern = /a.*b/;
console.log("aabab".match(greedyPattern)); // "aabab"

// Lazy - lấy ít nhất có thể
const lazyPattern = /a.*?b/;
console.log("aabab".match(lazyPattern)); // "aab"

// Ví dụ thực tế: Extract content trong HTML tags
const html = "<div>Hello</div><span>World</span>";
const greedyTag = /<.*>/g;
const lazyTag = /<.*?>/g;

console.log(html.match(greedyTag)); // ['<div>Hello</div><span>World</span>']
console.log(html.match(lazyTag));   // ['<div>', '</div>', '<span>', '</span>']
```

## Anchors

### Neo - Định vị chính xác

Anchors giúp bạn định vị pattern ở vị trí cụ thể trong chuỗi. Giống như “neo” giữ thuyền ở một chỗ.

#### Line Anchors - Neo đầu và cuối dòng

```javascript
// ^ - bắt đầu chuỗi
const startPattern = /^hello/;
console.log("hello world".match(startPattern)); // "hello"
console.log("world hello".match(startPattern)); // null

// $ - kết thúc chuỗi
const endPattern = /world$/;
console.log("hello world".match(endPattern)); // "world"
console.log("world hello".match(endPattern)); // null

// ^ và $ - toàn bộ chuỗi (exact match)
const exactPattern = /^hello world$/;
console.log("hello world".match(exactPattern)); // "hello world"
console.log("hello world!".match(exactPattern)); // null
```

**💡 Tip:** `^` và `$` rất hữu ích cho validation - đảm bảo toàn bộ chuỗi khớp với pattern.

#### Word Boundaries - Ranh giới từ

```javascript
// \b - word boundary (ranh giới từ)
const wordBoundary = /\bcat\b/;
console.log("cat".match(wordBoundary)); // "cat"
console.log("category".match(wordBoundary)); // null
console.log("scatter".match(wordBoundary)); // null

// \B - non-word boundary (không phải ranh giới từ)
const nonWordBoundary = /\Bcat\B/;
console.log("category".match(nonWordBoundary)); // "cat"
console.log("cat".match(nonWordBoundary)); // null

// Ví dụ thực tế: Tìm từ "the" nhưng không phải trong "there", "then"
const text = "The cat is there, then the dog comes";
const thePattern = /\bthe\b/gi;
const matches = text.match(thePattern);
console.log(matches); // ['The', 'the']
```

## Groups và Capturing

### Nhóm và bắt giữ - Sức mạnh thực sự của regex

Groups cho phép bạn nhóm các pattern lại và “bắt giữ” kết quả để sử dụng sau.

#### Capturing Groups - Nhóm bắt giữ

```javascript
// Capturing group - lưu kết quả
const phonePattern = /(\d{3})-(\d{3})-(\d{4})/;
const phone = "123-456-7890";
const match = phone.match(phonePattern);

console.log(match[0]); // "123-456-7890" (toàn bộ match)
console.log(match[1]); // "123" (area code)
console.log(match[2]); // "456" (prefix)
console.log(match[3]); // "7890" (line number)

// Ví dụ thực tế: Parse URL
const url = "https://www.example.com/path?param=value";
const urlPattern = /(https?):\/\/([^\/]+)(\/.*)/;
const urlMatch = url.match(urlPattern);

if (urlMatch) {
    const [, protocol, domain, path] = urlMatch;
    console.log({ protocol, domain, path });
    // { protocol: 'https', domain: 'www.example.com', path: '/path?param=value' }
}
```

#### Non-Capturing Groups - Nhóm không bắt giữ

Khi bạn chỉ muốn nhóm pattern mà không cần lưu kết quả:

```javascript
// Non-capturing group - không lưu kết quả
const nonCapturing = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+)\.com/;
const url = "https://www.example.com";
const match = url.match(nonCapturing);

console.log(match[1]); // "example" (chỉ group được capture)
console.log(match[0]); // "https://www.example.com" (toàn bộ match)
```

#### Named Groups - Nhóm có tên

Đặt tên cho groups để dễ sử dụng:

```javascript
// Named capturing groups
const namedPattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const date = "2023-12-25";
const match = date.match(namedPattern);

console.log(match.groups.year); // "2023"
console.log(match.groups.month); // "12"
console.log(match.groups.day); // "25"

// Ví dụ thực tế: Parse log entry
const logEntry = "2023-12-25 10:30:45 [ERROR] Database connection failed";
const logPattern = /(?<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[(?<level>\w+)\] (?<message>.*)/;
const logMatch = logEntry.match(logPattern);

if (logMatch) {
    const { timestamp, level, message } = logMatch.groups;
    console.log({ timestamp, level, message });
    // { timestamp: '2023-12-25 10:30:45', level: 'ERROR', message: 'Database connection failed' }
}
```

#### Backreferences - Tham chiếu ngược

Sử dụng kết quả đã bắt giữ trong cùng một pattern:

```javascript
// Backreference - tham chiếu đến group trước đó
const backrefPattern = /(\w+)\s+\1/; // Từ lặp lại
console.log("hello hello".match(backrefPattern)); // "hello hello"
console.log("hello world".match(backrefPattern)); // null

// Named backreference
const namedBackref = /(?<word>\w+)\s+\k<word>/;
console.log("test test".match(namedBackref)); // "test test"

// Ví dụ thực tế: Tìm HTML tags đóng mở không khớp
const html = "<div>Hello</span><p>World</p>";
const mismatchedTag = /<(\w+)>.*?<\/\1>/g;
const matches = html.match(mismatchedTag);
console.log(matches); // ['<p>World</p>'] (chỉ tag p khớp)
```

## Flags

### Cờ - Điều chỉnh hành vi

Flags cho phép bạn thay đổi cách regex hoạt động. Giống như “cài đặt” cho công cụ.

#### Common Flags - Những cờ thường dùng

```javascript
// i - case insensitive (không phân biệt hoa thường)
const caseInsensitive = /hello/i;
console.log("Hello".match(caseInsensitive)); // "Hello"
console.log("HELLO".match(caseInsensitive)); // "HELLO"
console.log("hElLo".match(caseInsensitive)); // "hElLo"

// g - global search (tìm tất cả, không chỉ cái đầu tiên)
const globalPattern = /a/g;
console.log("banana".match(globalPattern)); // ["a", "a", "a"]

// m - multiline (xử lý nhiều dòng)
const multilinePattern = /^hello/m;
const text = "world\nhello\nhello world";
console.log(text.match(multilinePattern)); // "hello"

// s - dotall (dot matches newline)
const dotallPattern = /a.b/s;
console.log("a\nb".match(dotallPattern)); // "a\nb"

// u - unicode
const unicodePattern = /\u{1F600}/u;
console.log("😀".match(unicodePattern)); // "😀"

// y - sticky (bắt đầu từ vị trí cụ thể)
const stickyPattern = /a/y;
stickyPattern.lastIndex = 1;
console.log("banana".match(stickyPattern)); // null
```

**🎯 Ví dụ thực tế:** Xử lý text với nhiều dòng

```javascript
const logText = `
[INFO] User login: john@example.com
[ERROR] Database connection failed
[INFO] User logout: jane@example.com
[WARN] High memory usage
`;

// Tìm tất cả log entries với level
const logPattern = /^\[(\w+)\]\s+(.+)$/gm;
const matches = logText.matchAll(logPattern);

for (const match of matches) {
    const [, level, message] = match;
    console.log(`${level}: ${message}`);
}
```

## Common Patterns

### Những pattern thường gặp trong thực tế

Đây là những pattern bạn sẽ sử dụng hàng ngày. Hãy học thuộc chúng!

#### Email Validation - Kiểm tra email

```javascript
// Basic email pattern
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Test emails
const emails = [
    "user@example.com",
    "user.name@domain.co.uk",
    "invalid-email",
    "user@.com",
    "user@domain",
    "user+tag@example.com"
];

emails.forEach(email => {
    const isValid = emailPattern.test(email);
    console.log(`${email}: ${isValid ? '✅' : '❌'}`);
});

// Kết quả:
// user@example.com: ✅
// user.name@domain.co.uk: ✅
// invalid-email: ❌
// user@.com: ❌
// user@domain: ❌
// user+tag@example.com: ✅
```

**💡 Tip:** Pattern này cover hầu hết các trường hợp thực tế, nhưng vẫn có thể cần điều chỉnh theo yêu cầu cụ thể.

#### Phone Number - Số điện thoại

```javascript
// US phone number pattern
const phonePattern = /^(\+1\s?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

// Test phone numbers
const phones = [
    "123-456-7890",
    "(123) 456-7890",
    "123.456.7890",
    "+1 123-456-7890",
    "1234567890",
    "123 456 7890",
    "invalid-phone"
];

phones.forEach(phone => {
    const isValid = phonePattern.test(phone);
    console.log(`${phone}: ${isValid ? '✅' : '❌'}`);
});
```

#### URL Validation - Kiểm tra URL

```javascript
// URL pattern
const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Test URLs
const urls = [
    "https://www.example.com",
    "http://example.com/path",
    "https://example.com/path?param=value#section",
    "ftp://example.com",
    "invalid-url",
    "example.com"
];

urls.forEach(url => {
    const isValid = urlPattern.test(url);
    console.log(`${url}: ${isValid ? '✅' : '❌'}`);
});
```

#### Password Validation - Kiểm tra mật khẩu

```javascript
// Password requirements: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Test passwords
const passwords = [
    "StrongPass1!",
    "weakpass",
    "NoSpecialChar1",
    "nouppercase1!",
    "NOLOWERCASE1!",
    "NoNumbers!",
    "Short1!"
];

passwords.forEach(password => {
    const isValid = passwordPattern.test(password);
    console.log(`${password}: ${isValid ? '✅' : '❌'}`);
});
```

## JavaScript Regex

### Sử dụng regex trong JavaScript

JavaScript cung cấp nhiều cách để làm việc với regex. Hãy khám phá chúng!

#### String Methods - Các phương thức của String

```javascript
// test() - kiểm tra có match không
const pattern = /hello/;
console.log(pattern.test("hello world")); // true

// exec() - tìm match đầu tiên với thông tin chi tiết
const execResult = pattern.exec("hello world hello");
console.log(execResult[0]); // "hello"
console.log(execResult.index); // 0 (vị trí bắt đầu)

// match() - tìm tất cả matches
const text = "hello world hello";
console.log(text.match(/hello/g)); // ["hello", "hello"]

// search() - tìm index của match đầu tiên
console.log(text.search(/world/)); // 6

// replace() - thay thế
console.log(text.replace(/hello/g, "hi")); // "hi world hi"

// split() - tách chuỗi
console.log(text.split(/\s+/)); // ["hello", "world", "hello"]
```

**🎯 Ví dụ thực tế:** Clean và format user input

```javascript
function cleanUserInput(input) {
    return input
        .trim()                           // Loại bỏ khoảng trắng đầu cuối
        .replace(/\s+/g, ' ')             // Thay nhiều khoảng trắng thành 1
        .replace(/[^\w\s\-.,!?]/g, '')    // Loại bỏ ký tự đặc biệt không mong muốn
        .toLowerCase();                   // Chuyển thành chữ thường
}

console.log(cleanUserInput("  Hello   World!!!  ")); // "hello world"
```

#### RegExp Constructor - Tạo regex động

```javascript
// Tạo regex từ string
const pattern = new RegExp("hello", "gi");

// Dynamic patterns - tạo pattern từ biến
const word = "hello";
const dynamicPattern = new RegExp(word, "i");
console.log(dynamicPattern.test("Hello World")); // true

// Escape special characters
const specialWord = "hello.world";
const escapedPattern = new RegExp(specialWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
console.log(escapedPattern.test("hello.world")); // true

// Ví dụ thực tế: Search với user input
function searchInText(text, searchTerm, caseSensitive = false) {
    const flags = caseSensitive ? 'g' : 'gi';
    const pattern = new RegExp(searchTerm, flags);
    return text.match(pattern) || [];
}

const content = "Hello world, hello universe, HELLO galaxy";
console.log(searchInText(content, "hello")); // ['Hello', 'hello', 'HELLO']
console.log(searchInText(content, "hello", true)); // ['hello']
```

## Python Regex

### Regex trong Python với re module

Python có module `re` mạnh mẽ cho regex. Hãy xem cách sử dụng!

#### re Module - Các hàm cơ bản

```python
import re

# Basic functions
text = "hello world hello"

# search() - tìm match đầu tiên
match = re.search(r'hello', text)
if match:
    print(f"Found: {match.group()} at position {match.start()}")
    # Found: hello at position 0

# findall() - tìm tất cả matches
matches = re.findall(r'hello', text)
print(matches)  # ['hello', 'hello']

# sub() - thay thế
new_text = re.sub(r'hello', 'hi', text)
print(new_text)  # "hi world hi"

# split() - tách chuỗi
parts = re.split(r'\s+', text)
print(parts)  # ['hello', 'world', 'hello']
```

#### Compiled Patterns - Tối ưu hiệu suất

```python
import re

# Compile pattern for better performance
pattern = re.compile(r'hello', re.IGNORECASE)

# Use compiled pattern
text = "Hello World HELLO"
matches = pattern.findall(text)
print(matches)  # ['Hello', 'HELLO']

# Multiple flags
pattern = re.compile(r'^hello', re.MULTILINE | re.IGNORECASE)
text = "world\nhello\nHELLO"
matches = pattern.findall(text)
print(matches)  # ['hello', 'HELLO']

# Ví dụ thực tế: Parse CSV-like data
csv_data = "name,age,city\nJohn,25,NYC\nJane,30,LA"
pattern = re.compile(r'^([^,]+),(\d+),([^,\n]+)', re.MULTILINE)

matches = pattern.findall(csv_data)
for name, age, city in matches:
    print(f"{name} is {age} years old from {city}")
```

## Node.js Regex

### Regex trong Node.js environment

Node.js có tất cả tính năng regex của JavaScript, cộng thêm một số tiện ích.

#### Built-in Methods - Các phương thức có sẵn

```javascript
// String methods
const text = "hello world hello";

// match()
const matches = text.match(/hello/g);
console.log(matches); // ["hello", "hello"]

// replace()
const replaced = text.replace(/hello/g, "hi");
console.log(replaced); // "hi world hi"

// split()
const parts = text.split(/\s+/);
console.log(parts); // ["hello", "world", "hello"]
```

#### Validation Functions - Hàm xác thực

```javascript
// Email validation
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phonePattern = /^(\+1\s?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phonePattern.test(phone);
}

// Password validation
function isValidPassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
}

// Test functions
console.log(isValidEmail("user@example.com")); // true
console.log(isValidPhone("123-456-7890")); // true
console.log(isValidPassword("StrongPass1!")); // true
```

## Best Practices

### Những điều cần nhớ khi sử dụng regex

Regex mạnh mẽ nhưng cũng có thể trở nên phức tạp. Hãy làm theo những best practices này.

#### Performance - Tối ưu hiệu suất

```javascript
// Compile patterns for reuse
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Avoid catastrophic backtracking
// Bad: /(a+)+b/ - có thể gây chậm với input lớn
// Good: /a+b/ - hiệu quả hơn

// Use non-capturing groups when possible
// Bad: /(https?:\/\/)/
// Good: /(?:https?:\/\/)/

// Ví dụ thực tế: Optimize pattern
const slowPattern = /(a+)+b/;
const fastPattern = /a+b/;

const testString = "a".repeat(1000) + "b";
console.time('slow');
slowPattern.test(testString);
console.timeEnd('slow');

console.time('fast');
fastPattern.test(testString);
console.timeEnd('fast');
```

#### Readability - Dễ đọc và bảo trì

```javascript
// Use verbose mode (x flag) for complex patterns
const complexPattern = /x^
    (?=.*[a-z])     # At least one lowercase letter
    (?=.*[A-Z])     # At least one uppercase letter
    (?=.*\d)        # At least one digit
    (?=.*[@$!%*?&]) # At least one special character
    [A-Za-z\d@$!%*?&]{8,}  # At least 8 characters
$/x;

// Add comments
const phonePattern = /^
    (\+1\s?)?       # Optional +1 country code
    \(?([0-9]{3})\)? # Area code (optional parentheses)
    [-.\s]?         # Optional separator
    ([0-9]{3})      # First 3 digits
    [-.\s]?         # Optional separator
    ([0-9]{4})      # Last 4 digits
$/;
```

#### Error Handling - Xử lý lỗi

```javascript
function safeRegex(pattern, flags = '') {
    try {
        return new RegExp(pattern, flags);
    } catch (error) {
        console.error('Invalid regex pattern:', error.message);
        return null;
    }
}

// Usage
const pattern = safeRegex('[invalid', 'i');
if (pattern) {
    console.log(pattern.test('test'));
} else {
    console.log('Invalid pattern');
}

// Ví dụ thực tế: Validate user-provided regex
function validateUserRegex(userPattern) {
    try {
        new RegExp(userPattern);
        return { valid: true, error: null };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

console.log(validateUserRegex('[a-z')); // { valid: false, error: "Unterminated character class" }
console.log(validateUserRegex('[a-z]')); // { valid: true, error: null }
```

## Ví dụ thực tế

### Những ứng dụng thực tế của regex

Đây là những ví dụ bạn sẽ gặp trong công việc hàng ngày.

#### Data Extraction - Trích xuất dữ liệu

```javascript
// Extract information from log lines
const logLine = "2023-12-25 10:30:45 [INFO] User login: john.doe@example.com";

const logPattern = /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+\[(\w+)\]\s+(.+)$/;
const match = logLine.match(logPattern);

if (match) {
    const [, date, time, level, message] = match;
    console.log({
        date,
        time,
        level,
        message
    });
    // { date: '2023-12-25', time: '10:30:45', level: 'INFO', message: 'User login: john.doe@example.com' }
}

// Extract URLs from text
const text = "Visit https://example.com or http://test.com for more info";
const urlPattern = /https?:\/\/[^\s]+/g;
const urls = text.match(urlPattern);
console.log(urls); // ["https://example.com", "http://test.com"]
```

#### Text Processing - Xử lý văn bản

```javascript
// Clean phone numbers
function cleanPhoneNumber(phone) {
    return phone.replace(/[^\d]/g, '');
}

// Format phone numbers
function formatPhoneNumber(phone) {
    const cleaned = cleanPhoneNumber(phone);
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// Test
console.log(formatPhoneNumber("123-456-7890")); // "(123) 456-7890"
console.log(formatPhoneNumber("123.456.7890")); // "(123) 456-7890"
console.log(formatPhoneNumber("1234567890")); // "(123) 456-7890"
```

#### Validation System - Hệ thống xác thực

```javascript
class Validator {
    constructor() {
        this.patterns = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            phone: /^(\+1\s?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
            date: /^\d{4}-\d{2}-\d{2}$/
        };
    }

    validate(type, value) {
        const pattern = this.patterns[type];
        if (!pattern) {
            throw new Error(`Unknown validation type: ${type}`);
        }
        return pattern.test(value);
    }

    validateAll(data) {
        const results = {};
        for (const [field, value] of Object.entries(data)) {
            if (this.patterns[field]) {
                results[field] = this.validate(field, value);
            }
        }
        return results;
    }
}

// Usage
const validator = new Validator();

const userData = {
    email: "user@example.com",
    phone: "123-456-7890",
    password: "StrongPass1!"
};

const results = validator.validateAll(userData);
console.log(results);
// { email: true, phone: true, password: true }
```

## Kết luận

### Regex - Công cụ không thể thiếu

Regular Expressions có thể trông đáng sợ lúc đầu, nhưng một khi bạn hiểu được logic đằng sau, nó sẽ trở thành công cụ mạnh mẽ nhất trong toolkit của bạn.

**🎯 Những điều quan trọng cần nhớ:**

1.  **Bắt đầu từ đơn giản** - Đừng cố viết pattern phức tạp ngay từ đầu
2.  **Test thường xuyên** - Sử dụng tools như regex101.com để test pattern
3.  **Performance matters** - Tránh catastrophic backtracking
4.  **Documentation** - Comment pattern phức tạp
5.  **Practice** - Càng dùng nhiều càng quen

**🚀 Next Steps:**

*   Thực hành với real-world data
*   Học thêm về advanced features
*   Tạo library patterns cho project
*   Share patterns với team

**💡 Pro Tips:**

*   Luôn có regex101.com mở khi viết pattern phức tạp
*   Tạo test cases cho mọi pattern
*   Sử dụng named groups cho pattern phức tạp
*   Compile pattern nếu dùng nhiều lần

Regex không phải là ma thuật - nó chỉ là một ngôn ngữ để mô tả pattern. Với practice và patience, bạn sẽ master nó!

**Tài liệu tham khảo:**

*   [MDN Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
*   [Python re Module](https://docs.python.org/3/library/re.html)
*   [Regex101](https://regex101.com/)
*   [Regular Expressions Info](https://www.regular-expressions.info/)