---
title: "Star Rating Với HTML + Pure CSS"
date: 2018-03-26T04:35:05.000Z
tags:
  [CSS, Font Awesome, Frontend, HTML, JavaScript, Pure CSS, Star Rating, UI/UX]
categories: [Frontend, CSS, HTML]
playground_slug: star-rating
---

## Giới thiệu

Hôm nay có task trong dự án liên quan đến đánh giá xếp hạng. Star rating (đánh giá dùng biểu tượng ngôi sao) được sử dụng khá phổ biến, quen thuộc nhất là hệ thống đánh giá nhà hàng và khách sạn với 5 sao là chất lượng cao nhất.

Thay vì sử dụng các plugin/library có sẵn, bài viết này sẽ hướng dẫn tạo star rating thuần bằng **HTML + CSS** với tiêu chí **“HẠN CHẾ TỐI ĐA THƯ VIỆN NGOÀI”**.

## Cấu trúc cơ bản

Để tạo 1 ngôi sao, chúng ta sử dụng 2 thẻ:

- **`input[type="radio"]`**: Chứa value người dùng chọn. Các ngôi sao phải cùng `name` để đảm bảo mỗi lần rating chỉ chọn được 1 giá trị.
- **`label`**: Hiển thị icon star và làm GUI cho input radio.

> **Lưu ý quan trọng**: HTML phải viết theo thứ tự **5→1** thay vì 1→5 do CSS không có selector cho previous siblings.

## HTML Implementation

### Phiên bản 5 mức (1-5 sao)

```html
<div id="rating">
  <input type="radio" id="star5" name="rating" value="5" />
  <label class="full" for="star5" title="Tuyệt vời - 5 sao"></label>

  <input type="radio" id="star4" name="rating" value="4" />
  <label class="full" for="star4" title="Khá tốt - 4 sao"></label>

  <input type="radio" id="star3" name="rating" value="3" />
  <label class="full" for="star3" title="Bình thường - 3 sao"></label>

  <input type="radio" id="star2" name="rating" value="2" />
  <label class="full" for="star2" title="Kém - 2 sao"></label>

  <input type="radio" id="star1" name="rating" value="1" />
  <label class="full" for="star1" title="Rất tệ - 1 sao"></label>
</div>
```

### Phiên bản 10 mức (0.5-5 sao)

Nếu muốn rating chi tiết hơn với 10 mức từ 0.5-5, thêm các group `half` xen kẽ:

```html
<fieldset class="rating">
  <input type="radio" id="star5" name="rating" value="5" />
  <label class="full" for="star5" title="Tuyệt vời - 5 sao"></label>

  <input type="radio" id="star4half" name="rating" value="4.5" />
  <label class="half" for="star4half" title="Khá tốt - 4.5 sao"></label>

  <input type="radio" id="star4" name="rating" value="4" />
  <label class="full" for="star4" title="Khá tốt - 4 sao"></label>

  <input type="radio" id="star3half" name="rating" value="3.5" />
  <label class="half" for="star3half" title="Bình thường - 3.5 sao"></label>

  <input type="radio" id="star3" name="rating" value="3" />
  <label class="full" for="star3" title="Bình thường - 3 sao"></label>

  <input type="radio" id="star2half" name="rating" value="2.5" />
  <label class="half" for="star2half" title="Kém - 2.5 sao"></label>

  <input type="radio" id="star2" name="rating" value="2" />
  <label class="full" for="star2" title="Kém - 2 sao"></label>

  <input type="radio" id="star1half" name="rating" value="1.5" />
  <label class="half" for="star1half" title="Tệ - 1.5 sao"></label>

  <input type="radio" id="star1" name="rating" value="1" />
  <label class="full" for="star1" title="Rất tệ - 1 sao"></label>

  <input type="radio" id="starhalf" name="rating" value="0.5" />
  <label class="half" for="starhalf" title="Rất tệ - 0.5 sao"></label>
</fieldset>
```

## CSS Selectors cần biết

Trước khi đi vào CSS, cần hiểu 2 selector quan trọng:

| Selector              | Ký hiệu | Mô tả                                            |
| --------------------- | ------- | ------------------------------------------------ |
| **Next sibling**      | `+`     | Chọn thẻ tiếp theo ngay sau thẻ được chọn        |
| **All next siblings** | `~`     | Chọn tất cả thẻ cùng cấp tiếp theo thẻ được chọn |

> **Quan trọng**: CSS không có selector cho previous siblings, đây là lý do HTML phải viết ngược từ 5→1.

## CSS Implementation

Để đơn giản nhất, mình dùng icon star của Font Awesome. À mà khoan, import cả 1 library chỉ để lấy icon star có vẻ hơi “overkill” nhỉ? 😅 Nhưng thực tế trong project đã có sẵn Font Awesome rồi nên cũng không sao.

```css
@import url(//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css);

/* Reset styles */
fieldset,
label {
  margin: 0;
  padding: 0;
}
body {
  margin: 20px;
}
h1 {
  font-size: 1.5em;
  margin: 10px;
}

/* Star Rating Widget Styles */
.rating {
  border: none;
  float: left;
}

.rating > input {
  display: none;
}

.rating > label:before {
  margin: 5px;
  font-size: 1.25em;
  font-family: FontAwesome;
  display: inline-block;
  content: "\f005"; /* Full star icon */
}

.rating > .half:before {
  content: "\f089"; /* Half star icon */
  position: absolute;
}

.rating > label {
  color: #ddd;
  float: right;
}

/* CSS Magic để highlight stars khi hover */
.rating > input:checked ~ label, /* Hiển thị sao vàng khi được chọn */
.rating:not(:checked) > label:hover, /* Hover sao hiện tại */
.rating:not(:checked) > label:hover ~ label {
  /* Hover các sao trước đó */
  color: #ffd700;
}

/* Hover các sao trước đó trong danh sách */
.rating > input:checked + label:hover, /* Hover sao hiện tại khi thay đổi rating */
.rating > input:checked ~ label:hover,
.rating > label:hover ~ input:checked ~ label, /* Làm sáng lựa chọn hiện tại */
.rating > input:checked ~ label:hover ~ label {
  color: #ffed85;
}
```

## JavaScript để hiển thị kết quả

### Hiển thị rating mode (Read-only)

Để hiển thị kết quả rating, thêm attribute `disabled` cho tất cả `input[type="radio"]` và chạy JavaScript:

```javascript
function calcRate(rating) {
  const targetStar =
    rating === 5
      ? "star5"
      : rating >= 4.5
      ? "star4half"
      : rating >= 4
      ? "star4"
      : rating >= 3.5
      ? "star3half"
      : rating >= 3
      ? "star3"
      : rating >= 2.5
      ? "star2half"
      : rating >= 2
      ? "star2"
      : rating >= 1.5
      ? "star1half"
      : rating >= 1
      ? "star1"
      : rating >= 0.5
      ? "starhalf"
      : null;

  if (targetStar) {
    document.getElementById(targetStar).checked = true;
  }
}

// Sử dụng
calcRate(4.5); // Hiển thị 4.5 sao
```

### Phiên bản tối ưu (ES6+)

Code ngắn gọn hơn, dễ đọc hơn (và ít khiến đồng nghiệp phải google “ternary operator” hơn 😄):

```javascript
function calcRateV2(rating) {
  const fullStars = Math.floor(rating); // Số sao đầy
  const hasHalfStar = rating % 1 !== 0; // Có nửa sao không
  const starId = `star${fullStars}${hasHalfStar ? "half" : ""}`;

  const starElement = document.getElementById(starId);
  if (starElement) {
    starElement.checked = true;
  }
}
```

## Tính năng nâng cao

### 1\. Lấy giá trị rating

```javascript
function getCurrentRating() {
  const checkedStar = document.querySelector('input[name="rating"]:checked');
  return checkedStar ? parseFloat(checkedStar.value) : 0;
}
```

### 2\. Reset rating

```javascript
function resetRating() {
  const stars = document.querySelectorAll('input[name="rating"]');
  stars.forEach((star) => (star.checked = false));
}
```

### 3\. Disable/Enable rating

```javascript
function toggleRating(enable = true) {
  const stars = document.querySelectorAll('input[name="rating"]');
  stars.forEach((star) => (star.disabled = !enable));
}
```

## Demo và kết luận

**Demo**: [Pure CSS Star Rating Widget](http://output.jsbin.com/dojovax/2)

### Ưu điểm của phương pháp này:

- ✅ Không phụ thuộc JavaScript framework
- ✅ Lightweight, performance cao
- ✅ Responsive và accessible
- ✅ Dễ customize và mở rộng
- ✅ SEO friendly với semantic HTML

### Use cases thực tế:

- Rating sản phẩm e-commerce
- Đánh giá bài viết/video
- Feedback form
- Review system

---

_Chúc các bạn thành công trong việc implement star rating cho dự án!_

**Have a nice day! 🌟**

ph4n4n
