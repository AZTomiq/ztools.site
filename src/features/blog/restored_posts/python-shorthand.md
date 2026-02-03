---
title: "Python Shorthand"
date: 2019-04-09T02:10:17.000Z
tags: [python]
categories: [python]
---

![](/2019/04/09/Python-shorthand/python-tip.png "Python Tips")

## 1\. Reverse string

```python
a = 'string'
print("Reverse is", a[::-1])
# Output: Reverse is gnirts
```

## 2\. Gán giá trị list cho nhiều biến

```python
a = [1, 2, 3]
x, y, z = a
print(x, y, z)
# Output: 1 2 3
```

## 3\. Join list thành string

```python
a = ["Code", "Python", "Developer"]
print(" ".join(a))
# Output: Code Python Developer
```

## 4\. Loop 2 list trong 1 lệnh for

```python
list1 = ['a', 'b', 'c', 'd']
list2 = ['p', 'q', 'r', 's']

for x, y in zip(list1, list2):
    print(x, y)

# Output:
# a p
# b q
# c r
# d s
```

## 5\. Swap variable trong 1 dòng

```python
a = 7
b = 5
b, a = a, b
print(a, b)
# Output: 5 7
```

**JavaScript cũng có thể làm tương tự:**

```javascript
var a = 5, b = 7;
[b, a] = [a, b];
console.log(a, b); // 5 7
```

## 6\. Repeat string

```python
print('code' * 4 + ' ' + 'mentor' * 5)
# Output: codecodecodecode mentormentormentormentormentor
```

## 7\. Chuyển 2D list thành 1D list không dùng loop

```python
a = [[1, 2], [3, 4], [5, 6]]
import itertools
print(list(itertools.chain.from_iterable(a)))
# Output: [1, 2, 3, 4, 5, 6]

# Hoặc sử dụng list comprehension
result = [item for sublist in a for item in sublist]
print(result)
# Output: [1, 2, 3, 4, 5, 6]
```

## 8\. Chuyển input thành list

```python
# Python 2
result = map(lambda x: int(x), raw_input().split())
# Input: 1 2 3 4
# Output: [1, 2, 3, 4]

# Python 3
result = list(map(int, input().split()))
# Input: 1 2 3 4
# Output: [1, 2, 3, 4]
```

## 9\. Chuyển string thành list số dùng `map`

```python
s = '1 2 3 4'
result = list(map(int, s.split()))
print(result)
# Output: [1, 2, 3, 4]
```

## 10\. List Comprehension

```python
# Tạo list bình phương
squares = [x**2 for x in range(10)]
print(squares)
# Output: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Filter với điều kiện
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)
# Output: [0, 4, 16, 36, 64]
```

## 11\. Dictionary Comprehension

```python
# Tạo dictionary từ 2 list
keys = ['a', 'b', 'c']
values = [1, 2, 3]
dict_result = {k: v for k, v in zip(keys, values)}
print(dict_result)
# Output: {'a': 1, 'b': 2, 'c': 3}
```

## 12\. Enumerate trong loop

```python
items = ['apple', 'banana', 'orange']
for index, value in enumerate(items):
    print(f"{index}: {value}")

# Output:
# 0: apple
# 1: banana
# 2: orange
```

## 13\. Multiple assignment

```python
# Gán nhiều giá trị cùng lúc
a, b, c = 1, 2, 3
print(a, b, c)  # Output: 1 2 3

# Swap multiple variables
a, b, c = c, a, b
print(a, b, c)  # Output: 3 1 2
```