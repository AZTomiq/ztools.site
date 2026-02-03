---
title: "Zero to Hero: HTML - Cấu Trúc Web Cơ Bản"
date: 2025-06-26T08:59:26.000Z
tags: [Accessibility, Forms, Frontend, HTML, SEO, Semantic HTML, Web Development]
categories: [Frontend, HTML, Programming]
---

# Zero to Hero: HTML - Cấu trúc web cơ bản

> **“Bạn có bao giờ tự hỏi tại sao một số website load nhanh và dễ sử dụng, trong khi số khác thì chậm và khó hiểu không? Bí mật nằm ở HTML - nền tảng của mọi trang web.”**

Có một thời gian, tôi phải maintain một website với hàng trăm trang HTML được viết bằng table layout và inline styles. Mỗi lần thay đổi design là phải sửa từng trang một, và website chạy chậm như rùa. Cho đến khi tôi học HTML5 semantic - cách viết HTML có ý nghĩa và cấu trúc rõ ràng.

HTML không chỉ là ngôn ngữ đánh dấu đơn giản, nó là **foundation** của web hiện đại. Với semantic elements, accessibility features, và SEO optimization, HTML giúp bạn tạo ra những trang web nhanh, dễ sử dụng, và thân thiện với search engines.

## 📋 Mục lục

*   [Tại sao HTML thay đổi cuộc chơi?](#t%E1%BA%A1i-sao-html-thay-%C4%91%E1%BB%95i-cu%E1%BB%99c-ch%C6%A1i)
*   [Setup và môi trường phát triển](#setup-v%C3%A0-m%C3%B4i-tr%C6%B0%E1%BB%9Dng-ph%C3%A1t-tri%E1%BB%83n)
*   [Cấu trúc HTML cơ bản](#c%E1%BA%A5u-tr%C3%BAc-html-c%C6%A1-b%E1%BA%A3n)
*   [Semantic HTML - HTML có ý nghĩa](#semantic-html---html-c%C3%B3-%C3%BD-ngh%C4%A9a)
*   [Forms và Input Elements](#forms-v%C3%A0-input-elements)
*   [Multimedia và Media Elements](#multimedia-v%C3%A0-media-elements)
*   [Accessibility và ARIA](#accessibility-v%C3%A0-aria)
*   [SEO và Meta Tags](#seo-v%C3%A0-meta-tags)
*   [Performance Optimization](#performance-optimization)
*   [Modern HTML5 Features](#modern-html5-features)
*   [Thực hành tốt và mẹo](#th%E1%BB%B1c-h%C3%A0nh-t%E1%BB%91t-v%C3%A0-m%E1%BA%B9o)

## 🎯 Tại sao HTML thay đổi cuộc chơi?

### Vấn đề thực tế

```html
<!-- Trước HTML5 - Code không semantic, khó maintain -->
<table width="100%" cellpadding="10" cellspacing="0">
  <tr>
    <td bgcolor="#f0f0f0" align="center">
      <font size="5" color="#333">My Website</font>
    </td>
  </tr>
  <tr>
    <td>
      <table width="100%">
        <tr>
          <td width="200" valign="top">
            <font size="3">Navigation</font><br>
            <a href="home.html">Home</a><br>
            <a href="about.html">About</a>
          </td>
          <td valign="top">
            <font size="4">Content goes here</font>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

### Giải pháp với HTML5 Semantic

```html
<!-- Sau HTML5 - Code semantic, dễ hiểu và maintain -->
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
</head>
<body>
    <header>
        <h1>My Website</h1>
        <nav>
            <ul>
                <li><a href="home.html">Home</a></li>
                <li><a href="about.html">About</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <article>
            <h2>Main Content</h2>
            <p>Content goes here</p>
        </article>
    </main>
    
    <footer>
        <p>&copy; 2024 My Website</p>
    </footer>
</body>
</html>
```

### Lợi ích vượt trội

*   **🎯 Semantic**: Code có ý nghĩa, dễ hiểu
*   **♿ Accessible**: Hỗ trợ screen readers và assistive technologies
*   **🔍 SEO-friendly**: Tối ưu cho search engines
*   **📱 Responsive**: Tương thích với mọi thiết bị
*   **⚡ Performance**: Load nhanh và hiệu quả
*   **🛠️ Maintainable**: Dễ bảo trì và cập nhật
*   **🌐 Standard**: Tuân thủ chuẩn web hiện đại

## 🛠️ Setup và môi trường phát triển

### Development Tools

```bash
# Text Editors
# VS Code (Recommended)
code --install-extension ms-vscode.vscode-html-language-features

# Sublime Text
# Download from sublimetext.com

# Atom
# Download from atom.io

# Browser Developer Tools
# Chrome DevTools (F12)
# Firefox Developer Tools (F12)
# Safari Web Inspector
```

### Project Structure

```plaintext
my-website/
├── index.html
├── about.html
├── contact.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   └── main.js
├── images/
│   ├── logo.png
│   └── hero.jpg
└── assets/
    └── fonts/
```

### Local Development Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000

# Using Live Server (VS Code extension)
# Right-click HTML file -> Open with Live Server
```

### Browser Testing

```html
<!-- Test across different browsers -->
<!-- Chrome, Firefox, Safari, Edge -->
<!-- Mobile browsers: Chrome Mobile, Safari Mobile -->
<!-- Test responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## 📝 Cấu trúc HTML cơ bản

### HTML Document Structure

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tiêu đề trang web</title>
    <meta name="description" content="Mô tả trang web">
    <meta name="keywords" content="từ khóa, tìm kiếm">
    <meta name="author" content="Tên tác giả">
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico">
</head>
<body>
    <!-- Nội dung trang web -->
    <header>
        <h1>Tiêu đề chính</h1>
    </header>
    
    <main>
        <p>Đoạn văn bản</p>
    </main>
    
    <footer>
        <p>&copy; 2024 Website</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>
```

### DOCTYPE Declaration

```html
<!DOCTYPE html> <!-- HTML5 -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"> <!-- HTML4 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> <!-- XHTML -->
```

### HTML Elements và Tags

```html
<!-- Headings -->
<h1>Tiêu đề cấp 1</h1>
<h2>Tiêu đề cấp 2</h2>
<h3>Tiêu đề cấp 3</h3>
<h4>Tiêu đề cấp 4</h4>
<h5>Tiêu đề cấp 5</h5>
<h6>Tiêu đề cấp 6</h6>

<!-- Paragraphs -->
<p>Đây là một đoạn văn bản.</p>
<p>Đây là đoạn văn bản khác.</p>

<!-- Line breaks -->
<p>Dòng đầu tiên<br>Dòng thứ hai</p>

<!-- Horizontal rule -->
<hr>

<!-- Comments -->
<!-- Đây là comment, không hiển thị trên trang -->
```

### Text Formatting

```html
<!-- Bold text -->
<p><strong>Văn bản in đậm</strong></p>
<p><b>Văn bản in đậm (không semantic)</b></p>

<!-- Italic text -->
<p><em>Văn bản in nghiêng</em></p>
<p><i>Văn bản in nghiêng (không semantic)</i></p>

<!-- Underlined text -->
<p><u>Văn bản gạch chân</u></p>

<!-- Strikethrough -->
<p><del>Văn bản gạch ngang</del></p>
<p><s>Văn bản gạch ngang</s></p>

<!-- Subscript và Superscript -->
<p>H<sub>2</sub>O - Nước</p>
<p>X<sup>2</sup> - X bình phương</p>

<!-- Mark text -->
<p>Đây là <mark>văn bản được highlight</mark></p>

<!-- Small text -->
<p><small>Văn bản nhỏ</small></p>
```

### Lists

```html
<!-- Unordered List -->
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

<!-- Ordered List -->
<ol>
    <li>Bước 1</li>
    <li>Bước 2</li>
    <li>Bước 3</li>
</ol>

<!-- Nested Lists -->
<ul>
    <li>Fruits
        <ul>
            <li>Apple</li>
            <li>Banana</li>
            <li>Orange</li>
        </ul>
    </li>
    <li>Vegetables
        <ul>
            <li>Carrot</li>
            <li>Broccoli</li>
        </ul>
    </li>
</ul>

<!-- Definition List -->
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language</dd>
    <dt>CSS</dt>
    <dd>Cascading Style Sheets</dd>
</dl>
```

### Links và Navigation

```html
<!-- Basic Link -->
<a href="https://www.example.com">Visit Example</a>

<!-- Internal Link -->
<a href="about.html">About Us</a>

<!-- Link with target -->
<a href="https://www.example.com" target="_blank">Open in new tab</a>

<!-- Email Link -->
<a href="mailto:contact@example.com">Send Email</a>

<!-- Phone Link -->
<a href="tel:+1234567890">Call Us</a>

<!-- Download Link -->
<a href="document.pdf" download>Download PDF</a>

<!-- Anchor Link -->
<a href="#section1">Go to Section 1</a>
<h2 id="section1">Section 1</h2>
```

### Images

```html
<!-- Basic Image -->
<img src="image.jpg" alt="Mô tả hình ảnh">

<!-- Image with dimensions -->
<img src="image.jpg" alt="Mô tả" width="300" height="200">

<!-- Responsive Image -->
<img src="image.jpg" alt="Mô tả" style="max-width: 100%; height: auto;">

<!-- Image with title -->
<img src="image.jpg" alt="Mô tả" title="Tooltip text">

<!-- Picture Element (Responsive Images) -->
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Responsive image">
</picture>
```

HTML cung cấp nền tảng vững chắc cho mọi trang web hiện đại. Với semantic elements, accessibility features, và SEO optimization, HTML giúp bạn tạo ra những trang web chất lượng cao.

## 🏗️ Semantic HTML

### Document Structure

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog về Công nghệ</title>
    <meta name="description" content="Blog chia sẻ kiến thức về lập trình và công nghệ">
</head>
<body>
    <!-- Header -->
    <header>
        <nav>
            <ul>
                <li><a href="/">Trang chủ</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/about">Về chúng tôi</a></li>
                <li><a href="/contact">Liên hệ</a></li>
            </ul>
        </nav>
    </header>

    <!-- Main content -->
    <main>
        <article>
            <header>
                <h1>Làm thế nào để học HTML hiệu quả?</h1>
                <time datetime="2024-01-15">15 tháng 1, 2024</time>
                <address>Bởi <a href="/author/john">John Doe</a></address>
            </header>
            
            <section>
                <h2>Giới thiệu</h2>
                <p>HTML là nền tảng của mọi website...</p>
            </section>
            
            <section>
                <h2>Bước 1: Hiểu cơ bản</h2>
                <p>Bắt đầu với cấu trúc cơ bản...</p>
            </section>
            
            <footer>
                <p>Tags: <a href="/tag/html">HTML</a>, <a href="/tag/web">Web Development</a></p>
            </footer>
        </article>
        
        <aside>
            <h3>Bài viết liên quan</h3>
            <ul>
                <li><a href="/css-basics">CSS cơ bản</a></li>
                <li><a href="/javascript-intro">JavaScript giới thiệu</a></li>
            </ul>
        </aside>
    </main>

    <!-- Footer -->
    <footer>
        <p>&copy; 2024 Blog Công nghệ. All rights reserved.</p>
    </footer>
</body>
</html>
```

### Semantic Elements

```html
<!-- Header -->
<header>
    <h1>Website Title</h1>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </nav>
</header>

<!-- Navigation -->
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>

<!-- Main content -->
<main>
    <article>
        <h2>Article Title</h2>
        <p>Article content...</p>
    </article>
    
    <section>
        <h2>Section Title</h2>
        <p>Section content...</p>
    </section>
</main>

<!-- Article -->
<article>
    <header>
        <h1>Article Title</h1>
        <time datetime="2024-01-15">January 15, 2024</time>
    </header>
    <p>Article content...</p>
    <footer>
        <p>Author: John Doe</p>
    </footer>
</article>

<!-- Section -->
<section>
    <h2>Section Title</h2>
    <p>Section content...</p>
</section>

<!-- Aside -->
<aside>
    <h3>Related Articles</h3>
    <ul>
        <li><a href="/related1">Related Article 1</a></li>
        <li><a href="/related2">Related Article 2</a></li>
    </ul>
</aside>

<!-- Footer -->
<footer>
    <p>&copy; 2024 Website</p>
</footer>
```

### Lists

```html
<!-- Unordered list -->
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>

<!-- Ordered list -->
<ol>
    <li>First step</li>
    <li>Second step</li>
    <li>Third step</li>
</ol>

<!-- Nested lists -->
<ul>
    <li>Category 1
        <ul>
            <li>Subcategory 1.1</li>
            <li>Subcategory 1.2</li>
        </ul>
    </li>
    <li>Category 2
        <ol>
            <li>Subcategory 2.1</li>
            <li>Subcategory 2.2</li>
        </ol>
    </li>
</ul>

<!-- Definition list -->
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language</dd>
    
    <dt>CSS</dt>
    <dd>Cascading Style Sheets</dd>
    
    <dt>JavaScript</dt>
    <dd>Programming language for web</dd>
</dl>
```

### Links và Navigation

```html
<!-- Basic links -->
<a href="https://example.com">External link</a>
<a href="/about">Internal link</a>
<a href="#section1">Anchor link</a>

<!-- Links with attributes -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
    External link (opens in new tab)
</a>

<a href="mailto:contact@example.com">Send email</a>
<a href="tel:+1234567890">Call us</a>

<!-- Navigation menu -->
<nav>
    <ul>
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>

<!-- Breadcrumb navigation -->
<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/products/electronics">Electronics</a></li>
        <li aria-current="page">Smartphones</li>
    </ol>
</nav>
```

## 📝 Forms và Input Elements

### Basic Form Structure

```html
<form action="/submit" method="POST" novalidate>
    <fieldset>
        <legend>Personal Information</legend>
        
        <div>
            <label for="name">Full Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>
        
        <div>
            <label for="age">Age:</label>
            <input type="number" id="age" name="age" min="18" max="100">
        </div>
    </fieldset>
    
    <fieldset>
        <legend>Preferences</legend>
        
        <div>
            <label for="newsletter">Subscribe to newsletter:</label>
            <input type="checkbox" id="newsletter" name="newsletter">
        </div>
        
        <div>
            <label>Gender:</label>
            <input type="radio" id="male" name="gender" value="male">
            <label for="male">Male</label>
            <input type="radio" id="female" name="gender" value="female">
            <label for="female">Female</label>
        </div>
    </fieldset>
    
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
</form>
```

### Input Types

```html
<!-- Text inputs -->
<input type="text" placeholder="Enter text">
<input type="email" placeholder="Enter email">
<input type="password" placeholder="Enter password">
<input type="tel" placeholder="Enter phone number">
<input type="url" placeholder="Enter URL">

<!-- Numeric inputs -->
<input type="number" min="0" max="100" step="1">
<input type="range" min="0" max="100" value="50">

<!-- Date and time inputs -->
<input type="date">
<input type="time">
<input type="datetime-local">
<input type="month">
<input type="week">

<!-- File input -->
<input type="file" accept="image/*, .pdf">
<input type="file" multiple>

<!-- Color input -->
<input type="color">

<!-- Search input -->
<input type="search" placeholder="Search...">

<!-- Hidden input -->
<input type="hidden" name="token" value="abc123">
```

### Form Validation

```html
<form action="/submit" method="POST">
    <!-- Required field -->
    <div>
        <label for="username">Username *</label>
        <input type="text" id="username" 
               aria-describedby="username-help"
               aria-required="true">
        <div id="username-help">Username must be at least 3 characters</div>
    </div>
    
    <!-- Pattern validation -->
    <div>
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" 
               pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" 
               placeholder="123-456-7890">
    </div>
    
    <!-- Length validation -->
    <div>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" 
               minlength="8" maxlength="20">
    </div>
    
    <!-- Email validation -->
    <div>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
    </div>
    
    <!-- Custom validation message -->
    <div>
        <label for="age">Age</label>
        <input type="number" id="age" name="age" 
               min="18" max="100" 
               oninvalid="this.setCustomValidity('Age must be between 18 and 100')"
               oninput="this.setCustomValidity('')">
    </div>
    
    <button type="submit">Submit</button>
</form>
```

### Advanced Form Elements

```html
<!-- Select dropdown -->
<select name="country" required>
    <option value="">Select a country</option>
    <option value="vn">Vietnam</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
</select>

<!-- Select with groups -->
<select name="category">
    <optgroup label="Electronics">
        <option value="phone">Smartphone</option>
        <option value="laptop">Laptop</option>
    </optgroup>
    <optgroup label="Clothing">
        <option value="shirt">T-Shirt</option>
        <option value="pants">Pants</option>
    </optgroup>
</select>

<!-- Textarea -->
<textarea name="message" rows="5" cols="50" 
          placeholder="Enter your message"></textarea>

<!-- Datalist -->
<input list="browsers" name="browser">
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
</datalist>

<!-- Progress and meter -->
<progress value="70" max="100">70%</progress>
<meter value="0.6" min="0" max="1">60%</meter>
```

## 🎥 Multimedia và Media Elements

### Images

```html
<!-- Basic image -->
<img src="image.jpg" alt="Description of image">

<!-- Image with attributes -->
<img src="image.jpg" 
     alt="Beautiful landscape" 
     width="300" 
     height="200"
     loading="lazy">

<!-- Responsive image -->
<img src="image.jpg" 
     alt="Responsive image"
     srcset="image-small.jpg 300w,
             image-600w.jpg 600w,
             image-900w.jpg 900w"
     sizes="(max-width: 600px) 300px,
            (max-width: 900px) 600px,
            900px">

<!-- Picture element for art direction -->
<picture>
    <source media="(min-width: 800px)" srcset="large.jpg">
    <source media="(min-width: 400px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Responsive image">
</picture>

<!-- Figure with caption -->
<figure>
    <img src="chart.png" alt="Sales chart">
    <figcaption>Monthly sales performance</figcaption>
</figure>
```

### Video

```html
<!-- Basic video -->
<video controls width="320" height="240">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    Your browser does not support the video tag.
</video>

<!-- Video with attributes -->
<video width="320" height="240" 
       controls 
       autoplay 
       muted 
       loop
       poster="thumbnail.jpg">
    <source src="video.mp4" type="video/mp4">
    <track kind="subtitles" src="subtitles.vtt" srclang="en" label="English">
    <track kind="subtitles" src="subtitles-vi.vtt" srclang="vi" label="Vietnamese">
</video>

<!-- Video with fallback -->
<video controls>
    <source src="video.mp4" type="video/mp4">
    <source src="video.ogg" type="video/ogg">
    <p>Your browser doesn't support HTML5 video.</p>
</video>
```

### Audio

```html
<!-- Basic audio -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    Your browser does not support the audio tag.
</audio>

<!-- Audio with attributes -->
<audio controls autoplay muted loop>
    <source src="audio.mp3" type="audio/mpeg">
</audio>
```

### Embedding Content

```html
<!-- YouTube video -->
<iframe width="560" height="315" 
        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
        frameborder="0" 
        allowfullscreen>
</iframe>

<!-- Google Maps -->
<iframe width="600" height="450" 
        src="https://www.google.com/maps/embed?pb=..." 
        frameborder="0" 
        allowfullscreen>
</iframe>

<!-- PDF -->
<embed src="document.pdf" type="application/pdf" width="100%" height="600px">

<!-- Object for various content types -->
<object data="presentation.swf" type="application/x-shockwave-flash" width="400" height="300">
    <param name="movie" value="presentation.swf">
    <p>Your browser does not support Flash.</p>
</object>
```

## ♿ Accessibility

### ARIA Labels và Roles

```html
<!-- Basic ARIA -->
<button aria-label="Close dialog">×</button>
<div role="alert" aria-live="polite">Form submitted successfully!</div>

<!-- Navigation with ARIA -->
<nav role="navigation" aria-label="Main navigation">
    <ul>
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</nav>

<!-- Form with ARIA -->
<form>
    <div>
        <label for="username">Username</label>
        <input type="text" id="username" 
               aria-describedby="username-help"
               aria-required="true">
        <div id="username-help">Username must be at least 3 characters</div>
    </div>
</form>

<!-- Tab interface -->
<div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
    <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
</div>
<div role="tabpanel" id="panel1" aria-labelledby="tab1">Content 1</div>
<div role="tabpanel" id="panel2" aria-labelledby="tab2" hidden>Content 2</div>
```

### Keyboard Navigation

```html
<!-- Skip link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Focusable elements -->
<button tabindex="0">Clickable button</button>
<a href="/link" tabindex="0">Clickable link</a>

<!-- Non-focusable elements -->
<div tabindex="-1">Not focusable</div>

<!-- Custom focus order -->
<button tabindex="1">First</button>
<button tabindex="2">Second</button>
<button tabindex="3">Third</button>
```

### Screen Reader Support

```html
<!-- Hidden content for screen readers -->
<span class="sr-only">This text is only visible to screen readers</span>

<!-- Decorative images -->
<img src="decoration.jpg" alt="" role="presentation">

<!-- Complex content with descriptions -->
<svg aria-labelledby="chart-title chart-desc">
    <title id="chart-title">Sales Chart</title>
    <desc id="chart-desc">Bar chart showing monthly sales from January to December</desc>
    <!-- SVG content -->
</svg>

<!-- Live regions -->
<div aria-live="polite" aria-atomic="true">
    <p>Loading...</p>
</div>
```

## 🔍 SEO và Meta Tags

### Essential Meta Tags

```html
<head>
    <!-- Character encoding -->
    <meta charset="UTF-8">
    
    <!-- Viewport for responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Page title -->
    <title>Page Title - Brand Name</title>
    
    <!-- Meta description -->
    <meta name="description" content="A compelling description of your page content (150-160 characters)">
    
    <!-- Keywords (less important now) -->
    <meta name="keywords" content="keyword1, keyword2, keyword3">
    
    <!-- Author -->
    <meta name="author" content="Your Name">
    
    <!-- Robots -->
    <meta name="robots" content="index, follow">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://example.com/page">
</head>
```

### Social Media Meta Tags

```html
<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Site Name">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://example.com/image.jpg">
<meta name="twitter:site" content="@username">
<meta name="twitter:creator" content="@username">
```

### Structured Data

```html
<!-- JSON-LD structured data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "John Doe"
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-16",
  "publisher": {
    "@type": "Organization",
    "name": "Website Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "description": "Article description",
  "image": "https://example.com/article-image.jpg"
}
</script>

<!-- Organization schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-123-456-7890",
    "contactType": "customer service"
  }
}
</script>
```

## ⚡ Performance Optimization

### Image Optimization

```html
<!-- Lazy loading -->
<img src="image.jpg" alt="Description" loading="lazy">

<!-- Responsive images -->
<img src="image.jpg" 
     alt="Responsive image"
     srcset="image-300w.jpg 300w,
             image-600w.jpg 600w,
             image-900w.jpg 900w"
     sizes="(max-width: 600px) 300px,
            (max-width: 900px) 600px,
            900px">

<!-- WebP with fallback -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Image with WebP fallback">
</picture>
```

### Resource Loading

```html
<!-- Preload critical resources -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="critical.js" as="script">

<!-- Prefetch non-critical resources -->
<link rel="prefetch" href="next-page.html">

<!-- DNS prefetch -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//cdn.example.com">

<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.example.com">
```

### CSS và JavaScript Loading

```html
<!-- Critical CSS inline -->
<style>
    /* Critical CSS here */
</style>

<!-- Non-critical CSS async -->
<link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="non-critical.css"></noscript>

<!-- JavaScript loading -->
<script src="critical.js"></script>
<script src="non-critical.js" defer></script>
<script src="analytics.js" async></script>
```

## 🚀 Modern HTML5 Features

### Semantic Elements

```html
<!-- Article -->
<article>
    <header>
        <h1>Article Title</h1>
        <time datetime="2024-01-15">January 15, 2024</time>
    </header>
    <p>Article content...</p>
    <footer>
        <p>Author: John Doe</p>
    </footer>
</article>

<!-- Section -->
<section>
    <h2>Section Title</h2>
    <p>Section content...</p>
</section>

<!-- Aside -->
<aside>
    <h3>Related Content</h3>
    <ul>
        <li><a href="/related1">Related Article 1</a></li>
        <li><a href="/related2">Related Article 2</a></li>
    </ul>
</aside>

<!-- Figure -->
<figure>
    <img src="image.jpg" alt="Description">
    <figcaption>Image caption</figcaption>
</figure>

<!-- Mark -->
<p>This is <mark>highlighted</mark> text.</p>

<!-- Time -->
<p>The event is on <time datetime="2024-02-15T20:00">February 15th at 8 PM</time>.</p>
```

### Form Enhancements

```html
<!-- New input types -->
<input type="email" placeholder="Enter email">
<input type="url" placeholder="Enter URL">
<input type="tel" placeholder="Enter phone">
<input type="number" min="0" max="100" step="1">
<input type="range" min="0" max="100" value="50">
<input type="date">
<input type="time">
<input type="color">
<input type="search" placeholder="Search...">

<!-- Form validation -->
<input type="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">

<!-- Datalist -->
<input list="browsers" name="browser">
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
</datalist>

<!-- Progress and meter -->
<progress value="70" max="100">70%</progress>
<meter value="0.6" min="0" max="1">60%</meter>
```

### Multimedia

```html
<!-- Video with multiple sources -->
<video controls width="320" height="240">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    <source src="video.ogg" type="video/ogg">
    <p>Your browser doesn't support HTML5 video.</p>
</video>

<!-- Audio -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    <p>Your browser doesn't support HTML5 audio.</p>
</audio>

<!-- Canvas -->
<canvas id="myCanvas" width="200" height="100"></canvas>

<!-- SVG -->
<svg width="100" height="100">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"/>
</svg>
```

## 💡 Thực hành tốt và mẹo

### Code Organization

```html
<!-- Use consistent indentation -->
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Page Title</title>
    </head>
    <body>
        <header>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </nav>
        </header>
        
        <main>
            <article>
                <h1>Main Content</h1>
                <p>Content here...</p>
            </article>
        </main>
        
        <footer>
            <p>&copy; 2024 Website</p>
        </footer>
    </body>
</html>
```

### Validation

```bash
# W3C HTML Validator
# https://validator.w3.org/

# Browser Developer Tools
# Check for errors in Console tab

# Accessibility testing
# Use tools like axe-core, WAVE, or Lighthouse
```

### Performance Tips

```html
<!-- Minimize HTTP requests -->
<!-- Combine CSS and JS files -->

<!-- Use CDN for external resources -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>

<!-- Optimize images -->
<img src="image.jpg" alt="Description" loading="lazy">

<!-- Use semantic HTML for better SEO -->
<article>
    <h1>Article Title</h1>
    <p>Content...</p>
</article>
```

### Security Best Practices

```html
<!-- Use HTTPS -->
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

<!-- Prevent XSS -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">

<!-- Secure forms -->
<form action="https://secure.example.com/submit" method="POST">
    <input type="hidden" name="csrf_token" value="abc123">
</form>

<!-- External links -->
<a href="https://external.com" rel="noopener noreferrer">External Link</a>
```

## 🎯 Kết luận và bước tiếp theo

HTML đã thay đổi hoàn toàn cách tôi xây dựng website. Từ một developer viết HTML tùy tiện, tôi đã trở thành người tạo ra những trang web semantic, accessible, và SEO-friendly.

### Những gì bạn đã học được:

*   ✅ Cấu trúc HTML cơ bản và semantic
*   ✅ Forms và validation
*   ✅ Multimedia và media elements
*   ✅ Accessibility và ARIA
*   ✅ SEO và meta tags
*   ✅ Performance optimization
*   ✅ Modern HTML5 features

### Bước tiếp theo:

1.  **CSS Styling**: Học CSS để tạo giao diện đẹp
2.  **JavaScript Interactivity**: Thêm tính năng tương tác
3.  **Responsive Design**: Tối ưu cho mọi thiết bị
4.  **Progressive Web Apps**: Tạo ứng dụng web tiến bộ
5.  **Web Components**: Xây dựng component tái sử dụng

### Tài liệu tham khảo:

*   [MDN Web Docs - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
*   [W3C HTML Specification](https://www.w3.org/TR/html52/)
*   [HTML Living Standard](https://html.spec.whatwg.org/)
*   [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

* * *

**Bạn đã sẵn sàng tạo ra những trang web semantic và accessible chưa? Hãy bắt đầu với HTML ngay hôm nay!** 🚀