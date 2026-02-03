---
title: "30 Regex Patterns Hữu Ích"
date: 2018-07-21T03:07:26.000Z
tags: [regex]
categories: [regex]
---

## 1\. Password Strength (Mật khẩu mạnh)

```plaintext
^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$
```

**Yêu cầu:** Ít nhất 2 chữ hoa, 1 ký tự đặc biệt, 2 số, 3 chữ thường, tổng cộng 8 ký tự.

## 2\. Hexadecimal Color (Màu Hex)

```plaintext
\#([a-fA-F]|[0-9]){3,6}
```

**Ví dụ:** `#FF0000`, `#abc`, `#123456`

## 3\. Validate E-mail Address

```plaintext
/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm
```

**Cải tiến hơn:**

```plaintext
/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
```

## 4\. IPv4 Address

```plaintext
/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/
```

**Ví dụ:** `192.168.1.1`, `10.0.0.1`

## 5\. IPv6 Address

```plaintext
(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))
```

## 6\. Thousands Separator (Phân cách hàng nghìn)

```plaintext
/\d{1,3}(?=(\d{3})+(?!\d))/g
```

**Sử dụng:** `"1234567".replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, '$&,')` => `"1,234,567"`

## 7\. Prepend HTTP to Hyperlink

```javascript
if (!s.match(/^[a-zA-Z]+:\/\//)) {
    s = 'http://' + s;
}
```

## 8\. Pull Domain from URL

```plaintext
/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i
```

**Ví dụ:** Từ `https://www.google.com/search` => `google`

## 9\. Sort Keywords by Word Count

```plaintext
^[^\s]*$                    # Chính xác 1 từ
^[^\s]*\s[^\s]*$           # Chính xác 2 từ  
^[^\s]*\s[^\s]*            # Ít nhất 2 từ
^([^\s]*\s){2}[^\s]*$      # Chính xác 3 từ
^([^\s]*\s){4}[^\s]*$      # 5 từ trở lên (longtail)
```

## 10\. Find Base64 String in PHP

```plaintext
\?php[ \t]eval\(base64_decode\(\'(([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?){1}\'\)\)\;
```

## 11\. Valid Phone Number

```plaintext
^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$
```

**Ví dụ:** `+1 (555) 123-4567`, `0123 456 789`

## 12\. Leading & Trailing Whitespace

```plaintext
^[ \s]+|[ \s]+$
```

**Sử dụng:** Loại bỏ khoảng trắng đầu và cuối chuỗi.

## 13\. Pull Image Source

```plaintext
\< *[img][^\>]*[src] *= *[\"\']{0,1}([^\"\'\ >]*)
```

**Sử dụng:** Tìm `src` attribute trong thẻ `<img>`

## 14\. Validate Date DD/MM/YYYY

```plaintext
^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$
```

## 15\. YouTube Video ID

```plaintext
/http:\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#\!)v=)([\w-]{11}).*/gi
```

**Cập nhật cho HTTPS:**

```plaintext
/https?:\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#\!)v=)([\w-]{11}).*/gi
```

## 16\. Valid ISBN

```plaintext
/\b(?:ISBN(?:: ?| ))?((?:97[89])?\d{9}[\dx])\b/i
```

## 17\. Check Zip Code (US)

```plaintext
^\d{5}(?:[-\s]\d{4})?$
```

**Ví dụ:** `12345`, `12345-6789`

## 18\. Valid Twitter Username

```plaintext
/@([A-Za-z0-9_]{1,15})/
```

## 19\. Credit Card Numbers

```plaintext
^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$
```

**Hỗ trợ:** Visa, MasterCard, American Express, Diners Club, Discover, JCB

## 20\. Find CSS Attributes

```plaintext
^\s*[a-zA-Z\-]+\s*[:]{1}\s[a-zA-Z0-9\s.#]+[;]{1}
```

## 21\. Strip HTML Comments

```plaintext
<!--(.*?)-->
```

## 22\. Facebook Profile URL

```plaintext
/(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/
```

## 23\. Check Internet Explorer Version

```plaintext
^.*MSIE [5-8](?:\.[0-9]+)?(?!.*Trident\/[5-9]\.0).*$
```

## 24\. Extract Price

```plaintext
/(\$[0-9,]+(\.[0-9]{2})?)/
```

**Ví dụ:** `$1,234.56`

## 25\. Parse E-mail Header

```plaintext
/\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}\b/i
```

## 26\. Match Particular Filetype

```plaintext
/^(.*\.(?!(htm|html|class|js)$))?[^.]*$/i
```

**Sử dụng:** Loại trừ các file có extension htm, html, class, js

## 27\. Match URL String

```plaintext
/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
```

## 28\. Append rel=”nofollow” to Links

```plaintext
(<a\s*(?!.*\brel=)[^>]*)(href="https?://)((?!(?:(?:www\.)?'.implode('|(?:www\.)?', $follow_list).'))[^"]+)"((?!.*\brel=)[^>]*)(?:[^>]*)>
```

## 29\. Media Query Match

```plaintext
/@media([^{]+)\{([\s\S]+?})\s*}/g
```

## 30\. Google Search Syntax

```plaintext
/([+-]?(?:'.+?'|".+?"|[^+\- ]{1}[^ ]*))/g
```

* * *

**Tham khảo:** [Hongkiat - Regex for Web Developers](https://www.hongkiat.com/blog/regex-web-developers/)