---
title: "Create JSON Data From Form Input"
date: 2018-04-26T02:12:47.000Z
tags: [html, javascript]
categories: [javascript]
---

## Vấn đề

**Question:** How can I create a JavaScript JSON object based on two input fields per row, with 48 rows?

**Câu hỏi:** Làm thế nào để tạo một JSON object từ dữ liệu form có 2 input fields mỗi hàng, với 48 hàng?

## Giải pháp

### Bước 1: Cấu trúc HTML

1.  Đặt tất cả các hàng vào 1 form với `name` unique cho mỗi input
2.  Lấy dữ liệu form qua jQuery
3.  Sử dụng function `formObj2Json()` để convert form data thành JSON

### Bước 2: JavaScript Implementation

```javascript
$(function() {
  $(document).on('click', '#grap', function() {
    var formData = $('#anph').serializeArray();
    var rs = formObj2Json(formData);
    $('#rs').html(JSON.stringify(rs, undefined, 2));
  });
});

// ES5 Version
function formObj2Json(formArray) {
  var returnArray = {};
  for (var i = 0, len = formArray.length; i < len; i++) {
    returnArray[formArray[i].name] = formArray[i].value;
  }
  return returnArray;
}

// ES6 Version - Method 1
const formObj2Json = formArray => {
  return formArray.reduce((obj, item) => {
    obj[item.name] = item.value;
    return obj;
  }, {});
};

// ES6 Version - Method 2 (using Object.fromEntries)
const formObj2Json = formArray => {
  return Object.fromEntries(
    formArray.map(item => [item.name, item.value])
  );
};
```

### Bước 3: Modern JavaScript (Vanilla JS)

```javascript
// Không cần jQuery
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('grap').addEventListener('click', function() {
    const form = document.getElementById('anph');
    const formData = new FormData(form);
    
    // Convert FormData to Object
    const jsonObject = Object.fromEntries(formData.entries());
    
    // Display result
    document.getElementById('rs').textContent = JSON.stringify(jsonObject, null, 2);
  });
});

// Hoặc sử dụng cách ngắn gọn hơn
function getFormJSON(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}
```

## HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Form to JSON Converter</title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <style>
    .group {
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .group label {
      display: inline-block;
      width: 100px;
      font-weight: bold;
    }
    
    .group input {
      padding: 5px;
      margin: 0 5px;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    
    #grap {
      background: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 20px 0;
    }
    
    #grap:hover {
      background: #0056b3;
    }
    
    #rs {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 15px;
      border-radius: 4px;
      white-space: pre-wrap;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h1>Form to JSON Converter</h1>
  
  <button id="grap">Convert to JSON</button>
  
  <form id="anph">
    <div class="group">
      <label>Item 1:</label>
      <input type="text" name="name1" value="John" placeholder="Name">
      <input type="text" name="rating1" value="85" placeholder="Rating">
    </div>
    
    <div class="group">
      <label>Item 2:</label>
      <input type="text" name="name2" value="Jane" placeholder="Name">
      <input type="text" name="rating2" value="92" placeholder="Rating">
    </div>
    
    <div class="group">
      <label>Item 3:</label>
      <input type="text" name="name3" value="Bob" placeholder="Name">
      <input type="text" name="rating3" value="78" placeholder="Rating">
    </div>
    
    <!-- Add more groups as needed -->
    <div class="group">
      <label>Item 4:</label>
      <input type="text" name="name4" value="Alice" placeholder="Name">
      <input type="text" name="rating4" value="96" placeholder="Rating">
    </div>
    
    <div class="group">
      <label>Item 5:</label>
      <input type="text" name="name5" value="Charlie" placeholder="Name">
      <input type="text" name="rating5" value="88" placeholder="Rating">
    </div>
  </form>
  
  <h2>JSON Result:</h2>
  <pre id="rs"></pre>
</body>
</html>
```

## Các cách tiếp cận khác

### 1\. Sử dụng Fetch API để gửi data

```javascript
async function submitFormAsJSON(formId) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const jsonData = Object.fromEntries(formData.entries());
  
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    });
    
    if (response.ok) {
      console.log('Data submitted successfully');
    }
  } catch (error) {
    console.error('Error submitting data:', error);
  }
}
```

### 2\. Xử lý nested objects

```javascript
function formToNestedJSON(form) {
  const formData = new FormData(form);
  const result = {};
  
  for (let [key, value] of formData.entries()) {
    // Xử lý key như "user.name" hoặc "user.address.city"
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }
  
  return result;
}
```

### 3\. Validation trước khi convert

```javascript
function validateAndConvert(form) {
  const requiredFields = ['name1', 'rating1'];
  const formData = new FormData(form);
  
  // Check required fields
  for (const field of requiredFields) {
    if (!formData.get(field)) {
      alert(`Field ${field} is required!`);
      return null;
    }
  }
  
  // Validate ratings are numbers
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('rating') && isNaN(value)) {
      alert(`${key} must be a number!`);
      return null;
    }
  }
  
  return Object.fromEntries(formData.entries());
}
```

## Kết quả mẫu

```json
{
  "name1": "John",
  "rating1": "85",
  "name2": "Jane", 
  "rating2": "92",
  "name3": "Bob",
  "rating3": "78",
  "name4": "Alice",
  "rating4": "96",
  "name5": "Charlie",
  "rating5": "88"
}
```

## Demo Links

*   [Create JSON from Form Input](http://jsbin.com/daraxeqesi/1/edit?html,js,output)
*   [ES6 Version Demo](http://jsbin.com/noxedof/edit?js,console,output)

## Browser Support

*   **FormData:** IE 10+
*   **Object.fromEntries:** Chrome 73+, Firefox 63+, Safari 12.1+
*   **Spread operator:** IE không hỗ trợ, cần transpile với Babel