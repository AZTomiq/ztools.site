---
title: "Python Operators Precedence"
date: 2019-03-26T09:54:45.000Z
tags: [python]
categories: [python]
---

## Python Operators Precedence

Bảng sau liệt kê tất cả các operators từ **độ ưu tiên cao nhất** đến **thấp nhất**.

### Bảng Precedence

| No | Operator | Description | Example |
| --- | --- | --- | --- |
| 1 | `()` | **(Highest)** Parentheses (grouping) | `(2 + 3) * 4 = 20` |
| 2 | `f(args…)` | Function call | `len([1,2,3])` |
| 3 | `(…), […], {…}, {…}` | Binding/tuple, list, dict, set display | `[1,2], {'a':1}` |
| 4 | `x[index], x[index:index]`  
`x(arguments), x.attribute` | Subscription, slicing,  
call, attribute reference | `arr[0], obj.attr` |
| 5 | `await x` | Await expression | `await fetch()` |
| 6 | `**` | Exponentiation | `2 ** 3 = 8` |
| 7 | `+x, -x, ~x` | Unary positive, negative, bitwise NOT | `-5, ~10` |
| 8 | `*, @, /, //, %` | Multiplication, matrix multiply,  
division, floor division, modulo | `5 * 2, 7 // 3` |
| 9 | `+, -` | Addition, subtraction | `5 + 3, 8 - 2` |
| 10 | `<<, >>` | Bitwise left/right shifts | `8 << 2 = 32` |
| 11 | `&` | Bitwise AND | `5 & 3 = 1` |
| 12 | `^` | Bitwise XOR | `5 ^ 3 = 6` |
| 13 | `|` | Bitwise OR | `5 | 3 = 7` |
| 14 | `in, not in, is, is not`  
`<, <=, >, >=, !=, ==` | Comparisons, membership,  
identity operators | `x in list, a == b` |
| 15 | `not x` | Boolean NOT | `not True = False` |
| 16 | `and` | Boolean AND | `True and False = False` |
| 17 | `or` | Boolean OR | `True or False = True` |
| 18 | `if-else` | Conditional expression (ternary) | `x if x > 0 else -x` |
| 19 | `lambda` | **(Lowest)** Lambda expression | `lambda x: x * 2` |

### Ví dụ thực tế

#### 1\. Arithmetic Precedence

```python
# Precedence: ** > */ > +-
result = 2 + 3 * 4 ** 2    # 2 + 3 * 16 = 2 + 48 = 50
print(result)              # 50

# Với parentheses
result = (2 + 3) * 4 ** 2  # 5 * 16 = 80
print(result)              # 80
```

#### 2\. Comparison vs Logical

```python
# Comparison có precedence cao hơn logical
x = 5
result = x > 3 and x < 10  # (x > 3) and (x < 10) = True and True = True
print(result)              # True

# Tương đương với:
result = (x > 3) and (x < 10)
```

#### 3\. Bitwise Operations

```python
# Bitwise precedence: << >> > & > ^ > |
a = 8
b = 2
c = 3

result = a | b & c << 1    # a | (b & (c << 1)) = 8 | (2 & 6) = 8 | 2 = 10
print(result)              # 10

# Breakdown:
# c << 1  →  3 << 1 = 6
# b & 6   →  2 & 6 = 2  
# a | 2   →  8 | 2 = 10
```

#### 4\. Assignment vs Comparison

```python
# = có precedence thấp nhất (không trong bảng trên)
x = y = 5 > 3    # x = (y = (5 > 3)) = x = (y = True) 
print(x, y)      # True True

# Walrus operator := có precedence cao hơn
while (n := input("Enter: ")) != "quit":
    print(f"You entered: {n}")
```

### Common Mistakes & Solutions

#### 1\. Boolean Logic

```python
# ❌ Sai hiểu precedence
if not x == y:          # not (x == y)
    pass

# ✅ Đúng ý định  
if not (x == y):        # Same as above, but clearer
    pass

if x != y:              # More pythonic
    pass
```

#### 2\. Arithmetic với Boolean

```python
# Boolean được treated as 0/1
result = True + False * 2   # True + (False * 2) = 1 + 0 = 1
print(result)               # 1

# Có thể gây confusion:
result = 5 > 3 + 1          # 5 > (3 + 1) = 5 > 4 = True
print(result)               # True
```

#### 3\. String Operations

```python
# String multiplication vs addition
result = "Hello" + "World" * 3   # "Hello" + ("World" * 3)
print(result)                    # "HelloWorldWorldWorld"

# Nếu muốn khác:
result = ("Hello" + "World") * 3
print(result)                    # "HelloWorldHelloWorldHelloWorld"
```

### Memory Tips

#### **PEMDAS** cho Python:

1.  **P**arentheses - `()`
2.  **E**xponents - `**`
3.  **M**ultiplication/Division - `* / // %`
4.  **A**ddition/Subtraction - `+ -`
5.  **S**hifts, Bitwise, Comparison, Logical

#### **Mnemonic cho Bitwise:**

*   **S**hifts first - `<< >>`
*   **A**nd next - `&`
*   **X**or then - `^`
*   **O**r last - `|`

### Best Practices

1.  **Sử dụng parentheses** khi không chắc chắn:

```python
# Thay vì dựa vào precedence
result = a + b * c ** d

# Hãy explicit
result = a + (b * (c ** d))
```

2.  **Chia nhỏ biểu thức phức tạp:**

```python
# Khó đọc
if x > 0 and y < 10 or z == 5 and not w:
    pass

# Dễ hiểu hơn
positive_x = x > 0
small_y = y < 10  
z_is_five = z == 5
not_w = not w

if (positive_x and small_y) or (z_is_five and not_w):
    pass
```

3.  **Sử dụng comparison chaining:**

```python
# Python specific - very readable
if 0 < x < 10:
    pass

# Tương đương nhưng dài hơn
if x > 0 and x < 10:
    pass
```