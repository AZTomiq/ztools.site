---
title: "Python: Reserved Keywords"
date: 2019-03-28T04:27:17.000Z
tags: [python]
categories: [python]
---

## Python Reserved Keywords

Đây là danh sách **35 từ khóa** trong Python mà bạn **không thể** sử dụng làm tên biến, hàm, hoặc class.

### Danh sách Keywords

| Column 1 | Column 2 | Column 3 | Column 4 | Column 5 |
| --- | --- | --- | --- | --- |
| `and` | `def` | `False` | `import` | `not` |
| `as` | `del` | `finally` | `in` | `or` |
| `assert` | `elif` | `for` | `is` | `pass` |
| `break` | `else` | `from` | `lambda` | `raise` |
| `class` | `except` | `global` | `None` | `return` |
| `continue` | `exec` | `if` | `nonlocal` | `try` |
| `True` | `while` | `with` | `yield` |  |

### Cách kiểm tra Keywords

```python
import keyword

# Xem tất cả keywords
print(keyword.kwlist)

# Kiểm tra một từ có phải keyword không
print(keyword.iskeyword('def'))    # True
print(keyword.iskeyword('hello'))  # False

# Số lượng keywords
print(len(keyword.kwlist))  # 35 (Python 3.9+)
```

### Phân loại Keywords

#### 1\. **Control Flow Keywords**

*   `if`, `elif`, `else` - Điều kiện
*   `for`, `while` - Vòng lặp
*   `break`, `continue` - Điều khiển vòng lặp
*   `pass` - Placeholder

```python
if True:
    pass
elif False:
    break
else:
    continue
```

#### 2\. **Function & Class Keywords**

*   `def` - Định nghĩa function
*   `class` - Định nghĩa class
*   `return` - Trả về giá trị
*   `yield` - Generator function
*   `lambda` - Anonymous function

```python
def my_function():
    return "Hello"

class MyClass:
    pass

# Lambda function
square = lambda x: x ** 2
```

#### 3\. **Exception Handling**

*   `try`, `except`, `finally` - Xử lý exception
*   `raise` - Throw exception
*   `assert` - Debug assertion

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    raise ValueError("Division by zero")
finally:
    print("Cleanup")
```

#### 4\. **Import Keywords**

*   `import` - Import module
*   `from` - Import specific items
*   `as` - Alias

```python
import math
from datetime import datetime as dt
```

#### 5\. **Logical & Comparison**

*   `and`, `or`, `not` - Logical operators
*   `is`, `in` - Identity & membership

```python
if x > 0 and x < 10:
    pass

if item in my_list:
    pass

if obj is None:
    pass
```

#### 6\. **Scope Keywords**

*   `global` - Global variable
*   `nonlocal` - Nonlocal variable
*   `del` - Delete reference

```python
x = 10

def outer():
    x = 20
    
    def inner():
        global x        # Refers to global x
        nonlocal x      # Error: can't use both
        del x           # Delete reference
```

#### 7\. **Boolean & None**

*   `True`, `False` - Boolean values
*   `None` - Null value

### Keywords theo Python version

| Version | Keywords count | New additions |
| --- | --- | --- |
| Python 2.7 | 31 | \- |
| Python 3.0 | 33 | `True`, `False`, `None` |
| Python 3.5 | 33 | \- |
| Python 3.7 | 35 | `async`, `await` |

### Context Managers

*   `with` - Context manager

```python
with open('file.txt', 'r') as f:
    content = f.read()
```

### Async Keywords (Python 3.7+)

*   `async` - Async function/context manager
*   `await` - Await coroutine

```python
async def fetch_data():
    await some_async_operation()
```

### Lưu ý quan trọng

⚠️ **Không được đặt tên biến trùng với keywords:**

```python
# ❌ Sai
def = "hello"      # SyntaxError
class = MyClass    # SyntaxError  
if = True          # SyntaxError

# ✅ Đúng
definition = "hello"
my_class = MyClass
condition = True
```

### Built-in Functions (không phải keywords)

Những từ này **không phải keywords** nhưng nên tránh dùng làm tên biến:

*   `print`, `input`, `len`, `str`, `int`, `list`, `dict`
*   `min`, `max`, `sum`, `all`, `any`
*   `open`, `range`, `enumerate`, `zip`

```python
# Có thể làm nhưng không nên
list = [1, 2, 3]    # Che đi built-in list()
print = "hello"     # Che đi built-in print()

# Khôi phục
del list
del print
```