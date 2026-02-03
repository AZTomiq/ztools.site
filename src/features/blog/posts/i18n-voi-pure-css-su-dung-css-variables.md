---
title: "I18n Với Pure CSS (Sử Dụng CSS Variables)"
date: 2018-05-09T03:52:19.000Z
tags: [css]
categories: [css]
playground_slug: css-i18n
---

## Bối cảnh

1.  CSS hiện tại đã hỗ trợ variables (custom properties)
2.  I18N ở client side khá phức tạp, nhưng ai bảo không thử được? 😄

## Ý tưởng

1.  Sử dụng CSS custom properties (variables) + CSS Pseudo-elements `:before`, `:after`
2.  Thay đổi attribute `html lang` để chuyển ngôn ngữ

## Code Implementation

### 1\. HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>CSS I18n Demo</title>
  </head>
  <body>
    <button id="change_lang"></button>
    <div class="wrapper">
      <form action="" id="login">
        <div class="form-group">
          <label for="username"></label>
          <input type="text" id="username" />
        </div>
        <div class="form-group">
          <label for="password"></label>
          <input type="password" id="password" />
        </div>
        <div class="form-group">
          <button type="submit"></button>
        </div>
      </form>
    </div>
  </body>
</html>
```

### 2\. JavaScript

```javascript
document.addEventListener("click", function () {
  if (document.documentElement.lang === "en") {
    document.documentElement.lang = "vi";
  } else {
    document.documentElement.lang = "en";
  }
});
```

### 3\. CSS - Phần quan trọng nhất

```css
/* Định nghĩa variables cho từng ngôn ngữ */
:lang(en) {
  --username: "Username ";
  --password: "Password ";
  --login: "Login";
  --lang: "Tiếng Việt";
}

:lang(vi) {
  --username: "Tên đăng nhập ";
  --password: "Mật khẩu ";
  --login: "Đăng nhập";
  --lang: "English";
}

/* Styling cơ bản */
* {
  font-family: monospace;
}
body {
  background: #444;
}

#change_lang {
  margin: 0 0 5vh 12%;
  height: 25px;
  border-radius: 5px;
  display: inline-block;
  color: #fff;
  background: #333;
}

.form-group {
  width: 100%;
  padding: 3px;
  display: inline-block;
}

.form-group > label {
  width: 100px;
  display: inline-block;
  color: #fff;
}

.form-group > input {
  width: 150px;
  display: inline-block;
  height: 25px;
  border-radius: 5px;
  box-shadow: none;
  border: 1px solid #c1c1c1;
}

.form-group > button {
  margin: 0 100px;
  height: 25px;
  border-radius: 5px;
  display: inline-block;
  color: #fff;
  background: #333;
}

/* Magic happens here - Sử dụng variables trong content */
#change_lang:after {
  content: var(--lang);
}
[for="username"]:after {
  content: var(--username);
}
[for="password"]:after {
  content: var(--password);
}
[type="submit"]:after {
  content: var(--login);
}
```

## Cách hoạt động

1.  **CSS Variables**: Định nghĩa text cho từng ngôn ngữ trong `:lang()` selector
2.  **Pseudo-elements**: Sử dụng `:after` để hiển thị content từ variables
3.  **Language switching**: JavaScript đơn giản thay đổi `lang` attribute

## Demo

**Xem demo tại đây**: [i18n with pure CSS](http://jsbin.com/qamojam/2)

## Ưu điểm & Nhược điểm

### ✅ Ưu điểm:

- Không cần JavaScript framework
- Performance tốt
- Cách tiếp cận sáng tạo

### ❌ Nhược điểm:

- Chỉ work với pseudo-elements
- Khó maintain khi có nhiều ngôn ngữ
- Không phù hợp với dự án lớn

---

_Trick hay ho nhưng đừng dùng trong production nhé! 😄_  
_Chống chỉ định với team có đồng bọn khó chịu_

ph4n4n
