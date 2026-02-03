---
title: "Zero to Hero: Python"
date: 2025-06-26T09:12:41.000Z
tags: [AI/ML, Automation, Data Science, Programming, Python, Web Development]
---

# Zero to Hero: Python - Ngôn ngữ lập trình của tương lai

> _“Python không chỉ là một ngôn ngữ lập trình - nó là cánh cửa mở ra thế giới của data science, AI, web development, và automation.”_

Bạn có bao giờ tự hỏi:

*   Tại sao Python lại trở thành ngôn ngữ lập trình phổ biến nhất thế giới?
*   Làm sao để bắt đầu học Python từ con số 0?
*   Python có thể làm được những gì trong thực tế?
*   Tại sao các công ty lớn như Google, Netflix, Instagram đều sử dụng Python?

Câu trả lời chính là **Python** - ngôn ngữ lập trình đa năng, dễ học và mạnh mẽ nhất hiện nay.

## Mục lục

*   [Giới thiệu](#gi%E1%BB%9Bi-thi%E1%BB%87u)
*   [Setup và Installation](#setup-v%C3%A0-installation)
*   [Cú pháp cơ bản](#c%C3%BA-ph%C3%A1p-c%C6%A1-b%E1%BA%A3n)
*   [Data Types](#data-types)
*   [Control Flow](#control-flow)
*   [Functions](#functions)
*   [Object-Oriented Programming](#object-oriented-programming)
*   [File Handling](#file-handling)
*   [Error Handling](#error-handling)
*   [Modules và Packages](#modules-v%C3%A0-packages)
*   [Best Practices](#best-practices)
*   [Ví dụ thực tế](#v%C3%AD-d%E1%BB%A5-th%E1%BB%B1c-t%E1%BA%BF)

## Giới thiệu

### Python là gì và tại sao nó quan trọng?

Python là ngôn ngữ lập trình bậc cao, được thiết kế với triết lý “đơn giản là đẹp”. Được tạo ra bởi Guido van Rossum vào năm 1991, Python đã trở thành ngôn ngữ lập trình phổ biến nhất thế giới.

**🎯 Tại sao Python lại thành công?**

```python
# Python - Đơn giản và dễ đọc
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# So sánh với Java
"""
public class Fibonacci {
    public static int calculateFibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return calculateFibonacci(n-1) + calculateFibonacci(n-2);
    }
}
"""
```

### Lợi ích của Python:

**🐍 Đơn giản và dễ học**

*   Cú pháp rõ ràng, gần với ngôn ngữ tự nhiên
*   Ít từ khóa, dễ nhớ
*   Indentation-based syntax

**🚀 Đa năng và mạnh mẽ**

*   Web development (Django, Flask)
*   Data Science (Pandas, NumPy)
*   AI/ML (TensorFlow, PyTorch)
*   Automation và scripting
*   Desktop applications

**🌍 Cộng đồng lớn**

*   Hàng triệu developers
*   Thư viện phong phú (PyPI)
*   Documentation chất lượng cao
*   Hỗ trợ đa nền tảng

**💼 Cơ hội nghề nghiệp**

*   Data Scientist
*   Backend Developer
*   DevOps Engineer
*   AI/ML Engineer
*   Automation Engineer

### Real-world Use Cases:

```python
# Web Development với Flask
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/users')
def get_users():
    users = [
        {'id': 1, 'name': 'John Doe', 'email': 'john@example.com'},
        {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com'}
    ]
    return jsonify(users)

# Data Analysis với Pandas
import pandas as pd

df = pd.read_csv('sales_data.csv')
monthly_sales = df.groupby('month')['revenue'].sum()
print(monthly_sales)

# Machine Learning với scikit-learn
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

## Setup và Installation

### Chuẩn bị môi trường

#### Cài đặt Python

```bash
# Windows - Download từ python.org
# macOS - Sử dụng Homebrew
brew install python

# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# Kiểm tra version
python3 --version
# Python 3.11.0
```

#### Virtual Environment - Môi trường ảo

```bash
# Tạo virtual environment
python3 -m venv myproject

# Kích hoạt virtual environment
# Windows
myproject\Scripts\activate

# macOS/Linux
source myproject/bin/activate

# Cài đặt packages
pip install requests pandas numpy

# Deactivate
deactivate
```

#### IDE và Tools

```bash
# Cài đặt VS Code extensions
# - Python
# - Pylance
# - Python Indent
# - Python Docstring Generator

# Cài đặt Jupyter Notebook
pip install jupyter

# Cài đặt development tools
pip install black flake8 mypy
```

**💡 Best Practices:**

*   Luôn sử dụng virtual environment
*   Cài đặt Python từ python.org
*   Sử dụng IDE có Python support
*   Cài đặt linter và formatter

## Cú pháp cơ bản

### Hello World - Bắt đầu với Python

```python
# Hello World - Đơn giản nhất
print("Hello, World!")

# Variables - Biến
name = "John Doe"
age = 30
height = 1.75
is_student = True

# Comments - Ghi chú
# Đây là comment một dòng
"""
Đây là comment nhiều dòng
Có thể viết nhiều dòng
"""

# String formatting
print(f"Hello, {name}! You are {age} years old.")
print("Hello, {}! You are {} years old.".format(name, age))
```

### Indentation - Thụt đầu dòng

```python
# Python sử dụng indentation để định nghĩa blocks
if age >= 18:
    print("You are an adult")
    print("You can vote")
else:
    print("You are a minor")
    print("You cannot vote")

# Functions cũng sử dụng indentation
def greet(name):
    print(f"Hello, {name}!")
    print("Welcome to Python!")

# Classes cũng vậy
class Person:
    def __init__(self, name):
        self.name = name
    
    def greet(self):
        print(f"Hello, I'm {self.name}")
```

**🎯 Lưu ý quan trọng:**

*   Python sử dụng indentation (4 spaces) thay vì braces {}
*   Indentation phải nhất quán trong toàn bộ file
*   Không trộn lẫn tabs và spaces

## Data Types

### Basic Types - Các kiểu dữ liệu cơ bản

```python
# Numbers - Số
integer_number = 42          # int
float_number = 3.14         # float
complex_number = 1 + 2j     # complex

# Strings - Chuỗi
single_quotes = 'Hello'
double_quotes = "World"
triple_quotes = """Multi-line
string"""

# Boolean - Logic
is_true = True
is_false = False

# None - Giá trị null
empty_value = None

# Type checking
print(type(integer_number))  # <class 'int'>
print(type(float_number))    # <class 'float'>
print(type(single_quotes))   # <class 'str'>
```

### Collections - Cấu trúc dữ liệu

```python
# Lists - Danh sách (mutable)
fruits = ['apple', 'banana', 'orange']
fruits.append('grape')
fruits[0] = 'mango'
print(fruits)  # ['mango', 'banana', 'orange', 'grape']

# Tuples - Tuple (immutable)
coordinates = (10, 20)
# coordinates[0] = 30  # Error!

# Dictionaries - Từ điển
person = {
    'name': 'John Doe',
    'age': 30,
    'city': 'New York'
}
person['email'] = 'john@example.com'
print(person['name'])  # John Doe

# Sets - Tập hợp
unique_numbers = {1, 2, 3, 3, 4, 4, 5}
print(unique_numbers)  # {1, 2, 3, 4, 5}

# Type conversion
number_string = "42"
number = int(number_string)
float_number = float(number_string)
```

### Advanced Data Types - Kiểu dữ liệu nâng cao

```python
# Named Tuples
from collections import namedtuple

Point = namedtuple('Point', ['x', 'y'])
p = Point(10, 20)
print(p.x, p.y)  # 10 20

# DefaultDict
from collections import defaultdict

word_count = defaultdict(int)
words = ['apple', 'banana', 'apple', 'cherry']
for word in words:
    word_count[word] += 1
print(word_count)  # defaultdict(<class 'int'>, {'apple': 2, 'banana': 1, 'cherry': 1})

# Enums
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

print(Color.RED)  # Color.RED
print(Color.RED.value)  # 1
```

## Control Flow

### Conditional Statements - Câu lệnh điều kiện

```python
# If-elif-else
age = 25

if age < 18:
    print("You are a minor")
elif age < 65:
    print("You are an adult")
else:
    print("You are a senior")

# Ternary operator
status = "adult" if age >= 18 else "minor"
print(status)

# Multiple conditions
username = "admin"
password = "123456"

if username == "admin" and password == "123456":
    print("Login successful")
elif username == "admin":
    print("Wrong password")
else:
    print("User not found")

# In operator
fruits = ['apple', 'banana', 'orange']
if 'apple' in fruits:
    print("Apple is in the list")
```

### Loops - Vòng lặp

```python
# For loop
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# For loop với list
fruits = ['apple', 'banana', 'orange']
for fruit in fruits:
    print(fruit)

# For loop với dictionary
person = {'name': 'John', 'age': 30, 'city': 'NYC'}
for key, value in person.items():
    print(f"{key}: {value}")

# While loop
count = 0
while count < 5:
    print(count)
    count += 1

# Break và Continue
for i in range(10):
    if i == 5:
        break  # Thoát khỏi loop
    if i == 2:
        continue  # Bỏ qua iteration này
    print(i)

# List comprehension
squares = [x**2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]

# Dictionary comprehension
square_dict = {x: x**2 for x in range(5)}
print(square_dict)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

## Functions

### Basic Functions - Hàm cơ bản

```python
# Simple function
def greet(name):
    return f"Hello, {name}!"

# Function call
message = greet("John")
print(message)  # Hello, John!

# Function với multiple parameters
def add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)
print(result)  # 8

# Function với default parameters
def greet_with_title(name, title="Mr."):
    return f"Hello, {title} {name}!"

print(greet_with_title("John"))  # Hello, Mr. John!
print(greet_with_title("Jane", "Ms."))  # Hello, Ms. Jane!

# Function với variable arguments
def calculate_sum(*args):
    return sum(args)

print(calculate_sum(1, 2, 3, 4, 5))  # 15

# Function với keyword arguments
def create_person(**kwargs):
    return kwargs

person = create_person(name="John", age=30, city="NYC")
print(person)  # {'name': 'John', 'age': 30, 'city': 'NYC'}
```

### Advanced Functions - Hàm nâng cao

```python
# Lambda functions
square = lambda x: x**2
print(square(5))  # 25

# Map function
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# Filter function
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4]

# Reduce function
from functools import reduce
sum_all = reduce(lambda x, y: x + y, numbers)
print(sum_all)  # 15

# Decorators
def timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)
    return "Done"

# Generator functions
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(10):
    print(num, end=" ")  # 0 1 1 2 3 5 8 13 21 34
```

## Object-Oriented Programming

### Classes và Objects - Lớp và đối tượng

```python
# Basic class
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name} and I'm {self.age} years old"
    
    def have_birthday(self):
        self.age += 1
        return f"Happy birthday! You are now {self.age} years old"

# Creating objects
person1 = Person("John", 30)
person2 = Person("Jane", 25)

print(person1.greet())  # Hello, I'm John and I'm 30 years old
print(person2.have_birthday())  # Happy birthday! You are now 26 years old
```

### Inheritance - Kế thừa

```python
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

# Using inheritance
dog = Dog("Buddy")
cat = Cat("Whiskers")

print(dog.speak())  # Buddy says Woof!
print(cat.speak())  # Whiskers says Meow!
```

### Encapsulation - Đóng gói

```python
class BankAccount:
    def __init__(self, account_number, balance):
        self._account_number = account_number  # Protected
        self.__balance = balance  # Private
    
    def get_balance(self):
        return self.__balance
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f"Deposited ${amount}. New balance: ${self.__balance}"
        return "Invalid amount"
    
    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return f"Withdrew ${amount}. New balance: ${self.__balance}"
        return "Insufficient funds"

# Using encapsulation
account = BankAccount("12345", 1000)
print(account.deposit(500))  # Deposited $500. New balance: $1500
print(account.withdraw(200))  # Withdrew $200. New balance: $1300
# print(account.__balance)  # Error! Private attribute
```

### Polymorphism - Đa hình

```python
class Shape:
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2

# Polymorphism in action
shapes = [Rectangle(5, 3), Circle(4)]

for shape in shapes:
    print(f"Area: {shape.area():.2f}")
```

## File Handling

### Reading và Writing Files - Đọc và ghi file

```python
# Writing to a file
with open('example.txt', 'w') as file:
    file.write("Hello, World!\n")
    file.write("This is a test file.\n")
    file.write("Python is awesome!")

# Reading from a file
with open('example.txt', 'r') as file:
    content = file.read()
    print(content)

# Reading line by line
with open('example.txt', 'r') as file:
    for line in file:
        print(line.strip())

# Appending to a file
with open('example.txt', 'a') as file:
    file.write("\nThis line was appended.")

# Working with CSV files
import csv

# Writing CSV
data = [
    ['Name', 'Age', 'City'],
    ['John', 30, 'New York'],
    ['Jane', 25, 'Los Angeles'],
    ['Bob', 35, 'Chicago']
]

with open('people.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(data)

# Reading CSV
with open('people.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)
```

### Working with JSON - Làm việc với JSON

```python
import json

# Python object to JSON
person = {
    'name': 'John Doe',
    'age': 30,
    'city': 'New York',
    'hobbies': ['reading', 'swimming']
}

# Writing JSON to file
with open('person.json', 'w') as file:
    json.dump(person, file, indent=2)

# Reading JSON from file
with open('person.json', 'r') as file:
    loaded_person = json.load(file)
    print(loaded_person)

# JSON string to Python object
json_string = '{"name": "Jane", "age": 25}'
person_dict = json.loads(json_string)
print(person_dict['name'])  # Jane

# Python object to JSON string
person_json = json.dumps(person, indent=2)
print(person_json)
```

## Error Handling

### Try-Except Blocks - Xử lý lỗi

```python
# Basic error handling
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("Please enter a valid number")
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(f"An error occurred: {e}")
else:
    print("No errors occurred")
finally:
    print("This always executes")

# Custom exceptions
class AgeError(Exception):
    pass

def validate_age(age):
    if age < 0:
        raise AgeError("Age cannot be negative")
    if age > 150:
        raise AgeError("Age seems unrealistic")
    return True

# Using custom exceptions
try:
    validate_age(-5)
except AgeError as e:
    print(f"Age validation error: {e}")
```

### Context Managers - Quản lý ngữ cảnh

```python
# Custom context manager
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()

# Using custom context manager
with FileManager('test.txt', 'w') as file:
    file.write("Hello, World!")

# Using contextlib
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    yield
    end = time.time()
    print(f"Execution time: {end - start:.4f} seconds")

with timer():
    # Some time-consuming operation
    import time
    time.sleep(1)
```

## Modules và Packages

### Importing Modules - Import module

```python
# Import entire module
import math
print(math.pi)  # 3.141592653589793
print(math.sqrt(16))  # 4.0

# Import specific functions
from math import sqrt, pi
print(pi)  # 3.141592653589793
print(sqrt(16))  # 4.0

# Import with alias
import numpy as np
array = np.array([1, 2, 3, 4, 5])
print(array)  # [1 2 3 4 5]

# Import all (not recommended)
from math import *
print(sin(pi/2))  # 1.0
```

### Creating Modules - Tạo module

```python
# calculator.py
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# main.py
import calculator

result = calculator.add(5, 3)
print(result)  # 8

# Or import specific functions
from calculator import add, multiply
print(add(10, 5))  # 15
print(multiply(4, 6))  # 24
```

### Creating Packages - Tạo package

```python
# mypackage/
# ├── __init__.py
# ├── math_utils.py
# ├── string_utils.py
# └── data_utils.py

# __init__.py
from .math_utils import add, multiply
from .string_utils import reverse_string
from .data_utils import filter_data

__all__ = ['add', 'multiply', 'reverse_string', 'filter_data']

# math_utils.py
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

# string_utils.py
def reverse_string(text):
    return text[::-1]

# data_utils.py
def filter_data(data, condition):
    return [item for item in data if condition(item)]

# Using the package
from mypackage import add, reverse_string
print(add(5, 3))  # 8
print(reverse_string("Hello"))  # olleH
```

## Best Practices

### Code Style - Phong cách code

```python
# PEP 8 - Python style guide
# Use meaningful variable names
user_name = "John Doe"  # Good
u = "John Doe"  # Bad

# Use snake_case for variables and functions
def calculate_total_price():
    pass

# Use CamelCase for classes
class ShoppingCart:
    pass

# Use UPPER_CASE for constants
MAX_RETRY_COUNT = 3

# Proper indentation (4 spaces)
def long_function_name(
    parameter1,
    parameter2,
    parameter3
):
    print(parameter1)

# Line length (max 79 characters)
long_string = (
    "This is a very long string that "
    "needs to be split across multiple lines"
)
```

### Documentation - Tài liệu

```python
def calculate_compound_interest(principal, rate, time, compounds_per_year=1):
    """
    Calculate compound interest.
    
    Args:
        principal (float): Initial amount of money
        rate (float): Annual interest rate (as decimal)
        time (float): Time in years
        compounds_per_year (int): Number of times interest is compounded per year
    
    Returns:
        float: Final amount after compound interest
    
    Raises:
        ValueError: If any parameter is negative
    
    Example:
        >>> calculate_compound_interest(1000, 0.05, 2)
        1102.5
    """
    if principal < 0 or rate < 0 or time < 0:
        raise ValueError("All parameters must be positive")
    
    amount = principal * (1 + rate / compounds_per_year) ** (compounds_per_year * time)
    return amount

# Type hints
from typing import List, Dict, Optional

def process_users(users: List[Dict[str, str]]) -> List[str]:
    """Process a list of user dictionaries and return their names."""
    return [user['name'] for user in users if 'name' in user]

def get_user_by_id(user_id: int) -> Optional[Dict[str, str]]:
    """Get user by ID, return None if not found."""
    # Implementation here
    pass
```

### Testing - Kiểm thử

```python
import unittest

class CalculatorTest(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures."""
        self.calc = Calculator()
    
    def test_add(self):
        """Test addition functionality."""
        result = self.calc.add(3, 5)
        self.assertEqual(result, 8)
    
    def test_divide_by_zero(self):
        """Test division by zero raises error."""
        with self.assertRaises(ValueError):
            self.calc.divide(10, 0)
    
    def tearDown(self):
        """Clean up after tests."""
        pass

# Running tests
if __name__ == '__main__':
    unittest.main()

# Using pytest (more modern)
import pytest

def test_add():
    assert add(2, 3) == 5

def test_divide():
    assert divide(10, 2) == 5

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(10, 0)
```

## Ví dụ thực tế

### Web Scraping - Thu thập dữ liệu web

```python
import requests
from bs4 import BeautifulSoup
import csv

def scrape_news_headlines():
    """Scrape news headlines from a website."""
    url = "https://news.ycombinator.com"
    
    try:
        # Send HTTP request
        response = requests.get(url)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find headlines
        headlines = []
        for item in soup.find_all('span', class_='titleline'):
            title = item.find('a').text.strip()
            link = item.find('a')['href']
            headlines.append({'title': title, 'link': link})
        
        # Save to CSV
        with open('headlines.csv', 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=['title', 'link'])
            writer.writeheader()
            writer.writerows(headlines)
        
        print(f"Scraped {len(headlines)} headlines")
        return headlines
        
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return []

# Usage
headlines = scrape_news_headlines()
for headline in headlines[:5]:
    print(f"- {headline['title']}")
```

### Data Analysis - Phân tích dữ liệu

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def analyze_sales_data():
    """Analyze sales data and create visualizations."""
    # Load data
    df = pd.read_csv('sales_data.csv')
    
    # Basic statistics
    print("Sales Data Summary:")
    print(df.describe())
    
    # Monthly sales trend
    monthly_sales = df.groupby('month')['revenue'].sum()
    
    # Create visualization
    plt.figure(figsize=(12, 6))
    monthly_sales.plot(kind='bar')
    plt.title('Monthly Sales Revenue')
    plt.xlabel('Month')
    plt.ylabel('Revenue ($)')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('monthly_sales.png')
    plt.show()
    
    # Product performance
    product_sales = df.groupby('product')['quantity'].sum().sort_values(ascending=False)
    
    plt.figure(figsize=(10, 6))
    product_sales.head(10).plot(kind='bar')
    plt.title('Top 10 Products by Sales Quantity')
    plt.xlabel('Product')
    plt.ylabel('Quantity Sold')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('product_performance.png')
    plt.show()
    
    return monthly_sales, product_sales

# Usage
monthly_sales, product_sales = analyze_sales_data()
print("\nTop 5 Products:")
print(product_sales.head())
```

### API Development - Phát triển API

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__)
CORS(app)

def init_db():
    """Initialize database with sample data."""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            age INTEGER
        )
    ''')
    
    # Insert sample data
    cursor.execute('''
        INSERT OR IGNORE INTO users (name, email, age) VALUES
        ('John Doe', 'john@example.com', 30),
        ('Jane Smith', 'jane@example.com', 25),
        ('Bob Johnson', 'bob@example.com', 35)
    ''')
    
    conn.commit()
    conn.close()

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users."""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    
    conn.close()
    
    user_list = []
    for user in users:
        user_list.append({
            'id': user[0],
            'name': user[1],
            'email': user[2],
            'age': user[3]
        })
    
    return jsonify(user_list)

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user."""
    data = request.get_json()
    
    if not data or 'name' not in data or 'email' not in data:
        return jsonify({'error': 'Name and email are required'}), 400
    
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
            (data['name'], data['email'], data.get('age'))
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        return jsonify({'id': user_id, 'message': 'User created successfully'}), 201
        
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Email already exists'}), 400

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
```

## Kết luận

### Python - Hành trình bắt đầu

Python đã mở ra cánh cửa cho hàng triệu developers trên thế giới. Với cú pháp đơn giản, thư viện phong phú, và cộng đồng lớn, Python là lựa chọn hoàn hảo cho cả người mới bắt đầu và developer có kinh nghiệm.

**🎯 Những điều quan trọng cần nhớ:**

1.  **Start Simple**: Bắt đầu với những điều cơ bản
2.  **Practice Daily**: Luyện tập hàng ngày
3.  **Use Virtual Environments**: Sử dụng môi trường ảo
4.  **Follow PEP 8**: Tuân thủ coding standards
5.  **Build Projects**: Xây dựng dự án thực tế

**🚀 Next Steps:**

*   Học về web frameworks (Django, Flask)
*   Khám phá data science (Pandas, NumPy)
*   Tìm hiểu về AI/ML (TensorFlow, PyTorch)
*   Tham gia cộng đồng Python

**💡 Pro Tips:**

*   Sử dụng Jupyter Notebook cho data analysis
*   Tìm hiểu về async programming
*   Học về testing và debugging
*   Tham gia open source projects

Python không chỉ là một ngôn ngữ lập trình - nó là cánh cửa mở ra vô số cơ hội trong thế giới công nghệ.

**Tài liệu tham khảo:**

*   [Python Official Documentation](https://docs.python.org/)
*   [PEP 8 Style Guide](https://www.python.org/dev/peps/pep-0008/)
*   [Real Python Tutorials](https://realpython.com/)
*   [Python Package Index (PyPI)](https://pypi.org/)