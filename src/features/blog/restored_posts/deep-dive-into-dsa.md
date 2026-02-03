---
title: "Deep Dive Into DSA"
date: 2025-08-27T04:08:04.000Z
tags: [Algorithms, DSA, Data Structures, Programming]
---

Welcome to our deep dive into Data Structures and Algorithms (DSA)! This series is designed to help anyone, from beginners to experienced developers, understand the fundamentals of DSA. We’ll break down complex concepts into easily digestible pieces, so you can master them with just a few reads.

## Outline

### 1\. Data Structures

*   Array
*   String
*   Linked List
*   Stack
*   Queue
*   Deque
*   **Advanced:**
    *   Hash Table / Hash Map
    *   Set / Multiset
    *   Heap (Priority Queue)
    *   Tree
        *   Binary Tree
        *   Binary Search Tree (BST)
        *   AVL Tree
        *   Red-Black Tree
        *   Segment Tree / Fenwick Tree (BIT)
        *   Trie (Prefix Tree)
    *   Graph
        *   Adjacency List / Adjacency Matrix

### 2\. Algorithms

*   **Sorting**
    *   Bubble Sort
    *   Selection Sort
    *   Insertion Sort
    *   Merge Sort
    *   Quick Sort
    *   Heap Sort
    *   Counting / Radix / Bucket Sort
*   **Searching**
    *   Linear Search
    *   Binary Search
    *   Ternary Search
*   **Recursion & Backtracking**
    *   N-Queens
    *   Sudoku Solver
    *   Maze Solver
*   **Dynamic Programming (DP)**
    *   Fibonacci
    *   Longest Common Subsequence (LCS)
    *   Longest Increasing Subsequence (LIS)
    *   Knapsack Problem
    *   Coin Change
    *   Matrix Chain Multiplication
*   **Greedy Algorithms**
    *   Activity Selection
    *   Huffman Coding
    *   Minimum Spanning Tree (Kruskal, Prim)
*   **Graph Algorithms**
    *   BFS (Breadth-First Search)
    *   DFS (Depth-First Search)
    *   Dijkstra’s Algorithm
    *   Bellman-Ford
    *   Floyd-Warshall
    *   Topological Sort
    *   Union-Find (Disjoint Set Union – DSU)
*   **Math / Number Theory**
    *   Euclidean GCD
    *   Sieve of Eratosthenes
    *   Modular Arithmetic
    *   Fast Exponentiation

### 3\. Advanced Topics

*   Divide and Conquer
*   Sliding Window
*   Two Pointers
*   Binary Search on Answer
*   Bit Manipulation
*   String Algorithms (KMP, Rabin-Karp, Z-Algorithm)
*   Computational Geometry
*   Segment Tree with Lazy Propagation
*   Dynamic Programming Optimization (Knuth, Convex Hull Trick)

* * *

## 1\. Introduction to Data Structures and Algorithms

### What are Data Structures?

In computer science, a **data structure** is a way of organizing and storing data in a computer so that it can be accessed and modified efficiently. Think of it as a container for data that is designed for a specific purpose. Just as you would use a different container for liquids than for solids, you would use different data structures for different kinds of data and operations.

For example, if you have a list of items and you need to be able to add or remove items from the beginning of the list very quickly, a **Linked List** might be a good choice. If you need to be able to access any item in the list instantly by its position, an **Array** would be a better choice.

### What are Algorithms?

An **algorithm** is a step-by-step procedure for solving a problem or accomplishing a task. In the context of computer science, algorithms are the “brains” of a program. They take some input, perform a series of operations, and produce some output.

For example, a sorting algorithm takes a list of numbers as input and produces a new list with the numbers in ascending or descending order. A search algorithm takes a list and a value as input and tells you whether the value is in the list.

### Why are DSA Important?

Data Structures and Algorithms are the foundation of computer science. Understanding them is crucial for writing efficient, scalable, and maintainable code. Here are a few reasons why DSA are so important:

*   **Efficiency**: Choosing the right data structure and algorithm can make the difference between a program that runs in milliseconds and one that takes minutes or even hours.
*   **Problem Solving**: DSA provide you with a set of tools and techniques for solving common programming problems.
*   **Interview Preparation**: DSA are a major focus of technical interviews at top tech companies.
*   **Scalability**: As the amount of data your program has to work with grows, the efficiency of your code becomes more and more important.

In the next post, we’ll dive into **Big O Notation**, which is how we measure the efficiency of algorithms. Stay tuned!

* * *

## 2\. Big O Notation: Understanding Algorithm Efficiency

Now that we have a basic understanding of what data structures and algorithms are, let’s talk about how we measure their efficiency. This is where **Big O notation** comes in.

### What is Big O Notation?

Big O notation is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity. In computer science, we use it to classify algorithms according to how their run time or space requirements grow as the input size grows.

In simpler terms, Big O notation tells you how the performance of an algorithm will change as the input size increases. It’s a way of talking about the “worst-case scenario” for an algorithm’s performance.

### Common Big O Notations

Here are some of the most common Big O notations you’ll encounter:

*   **O(1) - Constant Time**: The algorithm takes the same amount of time to run, regardless of the size of the input. For example, accessing an element in an array by its index.
*   **O(log n) - Logarithmic Time**: The algorithm’s run time grows logarithmically with the input size. This is very efficient. An example is binary search.
*   **O(n) - Linear Time**: The algorithm’s run time grows linearly with the input size. This is a common and acceptable level of performance. An example is searching for an element in an unsorted array.
*   **O(n log n) - Linearithmic Time**: The algorithm’s run time is a combination of linear and logarithmic. This is common for efficient sorting algorithms like Merge Sort and Quick Sort.
*   **O(n^2) - Quadratic Time**: The algorithm’s run time is proportional to the square of the input size. This is common for algorithms that involve nested loops, like Bubble Sort.
*   **O(2^n) - Exponential Time**: The algorithm’s run time doubles with each addition to the input data set. This is very slow and should be avoided if possible. An example is the recursive calculation of Fibonacci numbers.
*   **O(n!) - Factorial Time**: The algorithm’s run time grows factorially with the input size. This is the slowest and most inefficient type of algorithm. An example is the traveling salesman problem solved with a brute-force approach.

### Why is Big O Important?

Understanding Big O notation is crucial for writing efficient and scalable code. It allows you to:

*   **Compare algorithms**: You can use Big O to compare the efficiency of different algorithms that solve the same problem.
*   **Identify bottlenecks**: You can use Big O to identify parts of your code that might be slow and could be optimized.
*   **Make informed decisions**: You can use Big O to make informed decisions about which data structures and algorithms to use for a particular task.

In our next section, we’ll start exploring common data structures, beginning with **Arrays**. We’ll analyze the Big O complexity of their operations. Stay tuned!

* * *

## 3\. Common Data Structures

Now that we have a good understanding of Big O notation, let’s start exploring some of the most common data structures. We’ll begin with the simplest and most widely used data structure: the **Array**.

### Arrays

An array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together. This makes it easy to calculate the position of each element by simply adding an offset to a base value, i.e., the memory location of the first element of the array (generally denoted by the name of the array).

#### How Arrays Work

Imagine you have a row of boxes, one after another. Each box can hold one item, and they are all the same size. If you know where the first box is, you can easily find any other box in the row. This is how arrays work in memory.

#### Basic Operations on Arrays

Here are the basic operations you can perform on an array, along with their Big O complexity:

*   **Accessing an element by index**: `O(1)` - This is the biggest advantage of an array. Since the elements are stored in contiguous memory locations, we can directly access any element in constant time.
*   **Searching for an element**: `O(n)` - In the worst-case scenario, we have to scan through the entire array to find the element we are looking for.
*   **Inserting an element**: `O(n)` - If we want to insert an element at the beginning or in the middle of the array, we have to shift all the subsequent elements to the right to make space. In the worst case (inserting at the beginning), this takes linear time.
*   **Deleting an element**: `O(n)` - Similar to insertion, if we want to delete an element from the beginning or in the middle of the array, we have to shift all the subsequent elements to the left to fill the gap. In the worst case (deleting from the beginning), this takes linear time.

#### Code Example: Arrays in Javascript

```javascript
// Creating an array
const fruits = ["Apple", "Banana", "Orange"];
console.log(fruits); // Output: ["Apple", "Banana", "Orange"]

// Accessing an element by index
console.log(fruits[1]); // Output: "Banana"

// Adding an element to the end of the array
fruits.push("Mango");
console.log(fruits); // Output: ["Apple", "Banana", "Orange", "Mango"]

// Removing an element from the end of the array
fruits.pop();
console.log(fruits); // Output: ["Apple", "Banana", "Orange"]

// Adding an element to the beginning of the array
fruits.unshift("Strawberry");
console.log(fruits); // Output: ["Strawberry", "Apple", "Banana", "Orange"]

// Removing an element from the beginning of the array
fruits.shift();
console.log(fruits); // Output: ["Apple", "Banana", "Orange"]

// Finding the index of an element
console.log(fruits.indexOf("Banana")); // Output: 1
```

#### Advantages of Arrays

*   **Fast access**: Accessing an element by its index is very fast.
*   **Memory efficiency**: Arrays are memory efficient as they store elements in contiguous memory locations.

#### Disadvantages of Arrays

*   **Fixed size**: The size of an array is fixed when it is created. You cannot change it later.
*   **Costly insertions and deletions**: Inserting and deleting elements in the middle of an array is slow.

In our next section, we’ll look at another fundamental data structure: **Linked Lists**. We’ll see how they overcome some of the limitations of arrays. Stay tuned!

* * *

### String

A string is a sequence of characters. In Javascript, strings are immutable, which means they cannot be changed after they are created.

#### Code Example: Strings in Javascript

```javascript
const str = "Hello, World!";

// Length of the string
console.log(str.length); // Output: 13

// Accessing characters
console.log(str[0]); // Output: "H"
console.log(str.charAt(0)); // Output: "H"

// Slicing
console.log(str.slice(0, 5)); // Output: "Hello"

// Concatenation
const str2 = " How are you?";
console.log(str.concat(str2)); // Output: "Hello, World! How are you?"

// Searching
console.log(str.indexOf("World")); // Output: 7
```

### Linked Lists

A linked list is a linear data structure, but unlike arrays, the elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers. In simple words, a linked list consists of nodes where each node contains a data field and a reference(link) to the next node in the list.

#### How Linked Lists Work

Imagine a treasure hunt. Each clue tells you where to find the next clue. A linked list is similar. Each “node” in the list contains some data and a “pointer” to the next node. You start at the “head” of the list and follow the pointers to get to the next node.

#### Types of Linked Lists

*   **Singly Linked List**: Each node has a pointer to the next node.
*   **Doubly Linked List**: Each node has a pointer to the next node and a pointer to the previous node.
*   **Circular Linked List**: The last node points back to the first node, forming a circle.

#### Basic Operations on Linked Lists

*   **Accessing an element by value**: `O(n)` - You have to traverse the list from the beginning to find the element.
*   **Searching for an element**: `O(n)` - Similar to accessing, you have to traverse the list.
*   **Inserting an element**: `O(1)` - If you are inserting at the beginning of the list, it’s a constant time operation. Inserting in the middle or at the end requires traversing the list, making it `O(n)`.
*   **Deleting an element**: `O(1)` - If you are deleting from the beginning of the list, it’s a constant time operation. Deleting from the middle or at the end requires traversing the list, making it `O(n)`.

#### Code Example: Linked Lists in Javascript

```javascript
// Node class
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

// Linked List class
class LinkedList {
  constructor() {
    this.head = null;
  }

  // Add a node to the end of the list
  add(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
  }

  // Print the list
  print() {
    let current = this.head;
    let result = "";
    while (current) {
      result += current.data + " -> ";
      current = current.next;
    }
    console.log(result + "null");
  }
}

const list = new LinkedList();
list.add(10);
list.add(20);
list.add(30);
list.print(); // Output: 10 -> 20 -> 30 -> null
```

#### Advantages of Linked Lists

*   **Dynamic size**: Linked lists can grow and shrink dynamically.
*   **Easy insertions and deletions**: Inserting and deleting elements is easier and more efficient than in arrays, especially at the beginning of the list.

#### Disadvantages of Linked Lists

*   **Slow access**: Accessing an element requires traversing the list from the beginning.
*   **Extra memory**: Linked lists require extra memory for storing the pointers.

* * *

### Stacks and Queues

Stacks and Queues are abstract data types that can be implemented using either arrays or linked lists. They are used to store and manage data in a specific order.

#### Stacks

A stack is a “Last-In, First-Out” (LIFO) data structure. The last element added to the stack is the first one to be removed. Think of a stack of plates. You add a new plate to the top, and you also remove a plate from the top.

**Basic Operations on Stacks:**

*   **Push**: `O(1)` - Add an element to the top of the stack.
*   **Pop**: `O(1)` - Remove an element from the top of the stack.
*   **Peek/Top**: `O(1)` - Get the top element of the stack without removing it.

#### Queues

A queue is a “First-In, First-Out” (FIFO) data structure. The first element added to the queue is the first one to be removed. Think of a queue of people waiting for a bus. The first person to join the queue is the first one to get on the bus.

**Basic Operations on Queues:**

*   **Enqueue**: `O(1)` - Add an element to the back of the queue.
*   **Dequeue**: `O(1)` - Remove an element from the front of the queue.
*   **Front**: `O(1)` - Get the front element of the queue without removing it.

#### Code Example: Queues in Javascript

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  // Add an element to the back of the queue
  enqueue(element) {
    this.items.push(element);
  }

  // Remove an element from the front of the queue
  dequeue() {
    if (this.items.length === 0) {
      return "Underflow";
    }
    return this.items.shift();
  }

  // Get the front element of the queue
  front() {
    return this.items[0];
  }
}

const queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log(queue.front()); // Output: 10
console.log(queue.dequeue()); // Output: 10
console.log(queue.front()); // Output: 20
```

### Deque (Double Ended Queue)

A Deque (pronounced “deck”) is a double-ended queue. It’s a data structure that is similar to a queue, but it allows you to add and remove elements from both the front and the back.

#### Code Example: Deque in Javascript

```javascript
class Deque {
  constructor() {
    this.items = [];
  }

  // Add an element to the front of the deque
  addFront(element) {
    this.items.unshift(element);
  }

  // Add an element to the back of the deque
  addBack(element) {
    this.items.push(element);
  }

  // Remove an element from the front of the deque
  removeFront() {
    if (this.items.length === 0) {
      return "Underflow";
    }
    return this.items.shift();
  }

  // Remove an element from the back of the deque
  removeBack() {
    if (this.items.length === 0) {
      return "Underflow";
    }
    return this.items.pop();
  }

  // Get the front element of the deque
  front() {
    return this.items[0];
  }

  // Get the back element of the deque
  back() {
    return this.items[this.items.length - 1];
  }
}

const deque = new Deque();
deque.addBack(10);
deque.addBack(20);
deque.addFront(5);
console.log(deque.items); // Output: [5, 10, 20]
console.log(deque.removeFront()); // Output: 5
console.log(deque.removeBack()); // Output: 20
console.log(deque.items); // Output: [10]
```

* * *

### Trees

A tree is a hierarchical data structure that consists of nodes connected by edges. The top-most node is called the “root”, and the nodes below it are called “children”. Each node can have zero or more children.

#### How Trees Work

Think of a family tree. You have a person at the top (the root), and they have children, who in turn have their own children, and so on.

#### Types of Trees

*   **Binary Tree**: A tree where each node has at most two children.
*   **Binary Search Tree (BST)**: A binary tree where the value of each node is greater than or equal to the values in its left subtree and less than or equal to the values in its right subtree.
*   **AVL Tree**: A self-balancing binary search tree.
*   **B-Tree**: A self-balancing tree that is optimized for storage systems.

#### Basic Operations on Binary Search Trees

*   **Searching for an element**: `O(log n)` on average, `O(n)` in the worst case (for an unbalanced tree).
*   **Inserting an element**: `O(log n)` on average, `O(n)` in the worst case.
*   **Deleting an element**: `O(log n)` on average, `O(n)` in the worst case.

#### Code Example: Binary Search Tree in Javascript

```javascript
// Node class
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

// Binary Search Tree class
class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // Insert a node
  insert(data) {
    const newNode = new Node(data);
    if (!this.root) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(node, newNode) {
    if (newNode.data < node.data) {
      if (!node.left) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  // Search for a node
  search(node, data) {
    if (!node) {
      return null;
    } else if (data < node.data) {
      return this.search(node.left, data);
    } else if (data > node.data) {
      return this.search(node.right, data);
    } else {
      return node;
    }
  }
}

const bst = new BinarySearchTree();
bst.insert(15);
bst.insert(25);
bst.insert(10);
bst.insert(7);
bst.insert(22);
bst.insert(17);
bst.insert(13);

console.log(bst.search(bst.root, 10)); // Output: Node { data: 10, ... }
console.log(bst.search(bst.root, 99)); // Output: null
```

* * *

### Graphs

A graph is a non-linear data structure consisting of nodes (or vertices) and edges that connect them. Graphs are used to represent networks, such as social networks, road networks, and computer networks.

#### How Graphs Work

Think of a map of a city. The cities are the nodes, and the roads connecting them are the edges.

#### Types of Graphs

*   **Undirected Graph**: The edges have no direction.
*   **Directed Graph**: The edges have a direction.
*   **Weighted Graph**: Each edge has a weight or cost associated with it.

#### Graph Representations

There are two main ways to represent a graph:

*   **Adjacency Matrix**: An adjacency matrix is a 2D array of size V x V where V is the number of vertices in the graph. Each cell `adj[i][j]` is 1 if there is an edge from vertex `i` to vertex `j`, otherwise it is 0.
*   **Adjacency List**: An adjacency list is an array of linked lists. The size of the array is equal to the number of vertices. Each entry `array[i]` represents the linked list of vertices adjacent to the `i`\-th vertex.

The code example I provided earlier for the `Graph` class uses an adjacency list.

#### Common Graph Traversal Algorithms

*   **Breadth-First Search (BFS)**: Traverses the graph level by level.
*   **Depth-First Search (DFS)**: Traverses the graph by exploring as far as possible along each branch before backtracking.

#### Code Example: Graphs in Javascript

```javascript
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1);
  }

  bfs(start) {
    const queue = [start];
    const result = [];
    const visited = {};
    visited[start] = true;
    let currentVertex;

    while (queue.length) {
      currentVertex = queue.shift();
      result.push(currentVertex);

      this.adjacencyList[currentVertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }
    return result;
  }

  dfs(start) {
    const result = [];
    const visited = {};
    const adjacencyList = this.adjacencyList;

    (function dfsRecursive(vertex) {
      if (!vertex) return null;
      visited[vertex] = true;
      result.push(vertex);
      adjacencyList[vertex].forEach(neighbor => {
        if (!visited[neighbor]) {
          return dfsRecursive(neighbor);
        }
      });
    })(start);

    return result;
  }
}

const graph = new Graph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addVertex("E");
graph.addVertex("F");

graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "D");
graph.addEdge("C", "E");
graph.addEdge("D", "E");
graph.addEdge("D", "F");
graph.addEdge("E", "F");

console.log("BFS:", graph.bfs("A")); // Output: BFS: [ 'A', 'B', 'C', 'D', 'E', 'F' ]
console.log("DFS:", graph.dfs("A")); // Output: DFS: [ 'A', 'B', 'D', 'E', 'C', 'F' ]
```

* * *

### Hash Tables

A hash table is a data structure that is used to store key-value pairs. It uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.

#### How Hash Tables Work

Imagine a library where each book has a unique code. The librarian can use this code to find the exact location of the book on the shelves. A hash table works in a similar way. The “key” is like the book’s code, and the “hash function” is like the librarian who knows where to find the book.

#### Basic Operations on Hash Tables

*   **Inserting a key-value pair**: `O(1)` on average.
*   **Deleting a key-value pair**: `O(1)` on average.
*   **Searching for a value by key**: `O(1)` on average.

#### Collision Resolution

Sometimes, the hash function generates the same index for multiple keys. This is called a “collision”. There are two common ways to handle collisions:

*   **Chaining**: Each bucket in the hash table is a linked list. When a collision occurs, the new key-value pair is added to the linked list.
*   **Open Addressing**: When a collision occurs, we look for the next empty slot in the hash table.

#### Code Example: Hash Tables in Javascript

```javascript
class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
  }

  _hash(key) {
    let total = 0;
    const WEIRD_PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      const char = key[i];
      const value = char.charCodeAt(0) - 96;
      total = (total * WEIRD_PRIME + value) % this.keyMap.length;
    }
    return total;
  }

  set(key, value) {
    const index = this._hash(key);
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }
    this.keyMap[index].push([key, value]);
  }

  get(key) {
    const index = this._hash(key);
    if (this.keyMap[index]) {
      for (let i = 0; i < this.keyMap[index].length; i++) {
        if (this.keyMap[index][i][0] === key) {
          return this.keyMap[index][i][1];
        }
      }
    }
    return undefined;
  }
}

const hashTable = new HashTable();
hashTable.set("hello", "world");
hashTable.set("goodbye", "world");
hashTable.set("a", "b");

console.log(hashTable.get("hello")); // Output: world
console.log(hashTable.get("goodbye")); // Output: world
console.log(hashTable.get("a")); // Output: b
console.log(hashTable.get("c")); // Output: undefined
```

### Set / Multiset

A **Set** is a data structure that stores a collection of unique elements. It does not allow duplicate values. A **Multiset** is similar to a set, but it allows duplicate values.

In Javascript, you can use the built-in `Set` object to work with sets.

#### Code Example: Set in Javascript

```javascript
const mySet = new Set();

mySet.add(1);
mySet.add(5);
mySet.add(5); // This will be ignored
mySet.add("some text");

console.log(mySet); // Output: Set { 1, 5, 'some text' }

console.log(mySet.has(1)); // Output: true
console.log(mySet.has(3)); // Output: false

mySet.delete(5);
console.log(mySet); // Output: Set { 1, 'some text' }
```

### Heap (Priority Queue)

A **Heap** is a special tree-based data structure in which the tree is a complete binary tree. Heaps are of two types:

*   **Max-Heap**: In a Max-Heap, for any given node C, the value of C is less than or equal to the value of its parent. This means the largest element is at the root.
*   **Min-Heap**: In a Min-Heap, for any given node C, the value of C is greater than or equal to the value of its parent. This means the smallest element is at the root.

A **Priority Queue** is an abstract data type that is like a regular queue or stack, but where each element has a “priority”. Elements with higher priority are served before elements with lower priority. Priority queues are often implemented using heaps.

#### Code Example: Min-Heap in Javascript

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  swap(i1, i2) {
    [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  insert(key) {
    this.heap.push(key);
    let index = this.heap.length - 1;
    while (index !== 0 && this.heap[index] < this.heap[this.getParentIndex(index)]) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  extractMin() {
    if (this.heap.length === 0) {
      return null;
    }
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapify(0);
    }
    return root;
  }

  heapify(i) {
    const left = this.getLeftChildIndex(i);
    const right = this.getRightChildIndex(i);
    let smallest = i;

    if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
      smallest = left;
    }
    if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
      smallest = right;
    }
    if (smallest !== i) {
      this.swap(i, smallest);
      this.heapify(smallest);
    }
  }
}

const heap = new MinHeap();
heap.insert(3);
heap.insert(2);
heap.insert(1);
heap.insert(15);
heap.insert(5);
heap.insert(4);
heap.insert(45);

console.log(heap.extractMin()); // Output: 1
console.log(heap.extractMin()); // Output: 2
console.log(heap.extractMin()); // Output: 3
```

### Trie (Prefix Tree)

A **Trie**, also known as a **prefix tree**, is a tree-like data structure that is used to store a dynamic set of strings. Tries are commonly used for implementing autocomplete features and for spell checking.

Each node in a trie represents a single character of a string. A node may have multiple children, one for each possible next character.

#### Code Example: Trie in Javascript

```javascript
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
  }

  search(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }
    return current.isEndOfWord;
  }

  startsWith(prefix) {
    let current = this.root;
    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }
    return true;
  }
}

const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple"));   // Output: true
console.log(trie.search("app"));     // Output: false
console.log(trie.startsWith("app")); // Output: true
trie.insert("app");
console.log(trie.search("app"));     // Output: true
```

* * *

## 4\. Common Algorithms

Now that we’ve covered the most common data structures, let’s look at some common algorithms that are used to solve various problems.

### Searching Algorithms

*   **Linear Search**: `O(n)` - Searches for an element in an array by iterating through the array from beginning to end.
*   **Binary Search**: `O(log n)` - Searches for an element in a _sorted_ array by repeatedly dividing the search interval in half.
*   **Ternary Search**: `O(log3 n)` - This is a divide and conquer algorithm that is used to find the position of a target value within a sorted array. It is similar to binary search, but it divides the array into three parts instead of two.

#### Code Example: Searching Algorithms in Javascript

```javascript
// Linear Search
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

// Binary Search (requires a sorted array)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log(linearSearch(arr, 23)); // Output: 5
console.log(binarySearch(arr, 23)); // Output: 5

// Ternary Search (requires a sorted array)
function ternarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (right - left >= 0) {
    const mid1 = left + Math.floor((right - left) / 3);
    const mid2 = right - Math.floor((right - left) / 3);

    if (arr[mid1] === target) {
      return mid1;
    }
    if (arr[mid2] === target) {
      return mid2;
    }

    if (target < arr[mid1]) {
      right = mid1 - 1;
    } else if (target > arr[mid2]) {
      left = mid2 + 1;
    } else {
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }
  return -1;
}
console.log(ternarySearch(arr, 23)); // Output: 5
```

### Sorting Algorithms

*   **Bubble Sort**: `O(n^2)` - Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.
*   **Insertion Sort**: `O(n^2)` - Builds the final sorted array one item at a time.
*   **Merge Sort**: `O(n log n)` - A divide-and-conquer algorithm that divides the array into two halves, sorts them recursively, and then merges them.
*   **Quick Sort**: `O(n log n)` on average, `O(n^2)` in the worst case - A divide-and-conquer algorithm that picks an element as a pivot and partitions the array around the pivot.

#### Code Example: Sorting Algorithms in Javascript

```javascript
// Bubble Sort
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Insertion Sort
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}

// Merge Sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  function merge(left, right) {
    const results = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        results.push(left[i]);
        i++;
      } else {
        results.push(right[j]);
        j++;
      }
    }
    while (i < left.length) {
      results.push(left[i]);
      i++;
    }
    while (j < right.length) {
      results.push(right[j]);
      j++;
    }
    return results;
  }

  return merge(left, right);
}

// Quick Sort
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = pivot(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function pivot(arr, start = 0, end = arr.length - 1) {
  const swap = (arr, i, j) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  let pivot = arr[start];
  let swapIdx = start;

  for (let i = start + 1; i <= end; i++) {
    if (pivot > arr[i]) {
      swapIdx++;
      swap(arr, swapIdx, i);
    }
  }
  swap(arr, start, swapIdx);
  return swapIdx;
}

// Selection Sort
function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (i !== minIndex) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}

// Heap Sort
function heapSort(arr) {
  const buildMaxHeap = (arr) => {
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i);
    }
  };

  const heapify = (arr, n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  };

  const n = arr.length;
  buildMaxHeap(arr);

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}


const unsortedArr = [23, 5, 8, 12, 91, 38, 16, 56, 72, 2];
console.log("Bubble Sort:", bubbleSort([...unsortedArr]));
console.log("Insertion Sort:", insertionSort([...unsortedArr]));
console.log("Merge Sort:", mergeSort([...unsortedArr]));
console.log("Quick Sort:", quickSort([...unsortedArr]));
console.log("Selection Sort:", selectionSort([...unsortedArr]));
console.log("Heap Sort:", heapSort([...unsortedArr]));
```

### Recursion & Backtracking

**Recursion** is a technique where a function calls itself to solve a problem. It’s a powerful technique that can be used to solve problems that can be broken down into smaller, similar sub-problems.

**Backtracking** is a general algorithmic technique that considers searching every possible combination in order to solve a computational problem. It is a refinement of the brute force approach, which systematically tries all possible combinations. Backtracking is often implemented using recursion.

#### N-Queens

The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other.

##### Code Example: N-Queens in Javascript

```javascript
function solveNQueens(n) {
  const result = [];
  const board = Array(n).fill(0).map(() => Array(n).fill('.'));

  function isSafe(row, col) {
    // Check row on left side
    for (let i = 0; i < col; i++) {
      if (board[row][i] === 'Q') {
        return false;
      }
    }
    // Check upper diagonal on left side
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') {
        return false;
      }
    }
    // Check lower diagonal on left side
    for (let i = row, j = col; i < n && j >= 0; i++, j--) {
      if (board[i][j] === 'Q') {
        return false;
      }
    }
    return true;
  }

  function solve(col) {
    if (col === n) {
      result.push(board.map(row => row.join('')));
      return;
    }
    for (let i = 0; i < n; i++) {
      if (isSafe(i, col)) {
        board[i][col] = 'Q';
        solve(col + 1);
        board[i][col] = '.'; // backtrack
      }
    }
  }

  solve(0);
  return result;
}

console.log(solveNQueens(4));
```

#### Sudoku Solver

The Sudoku Solver problem is to solve a 9x9 Sudoku puzzle.

##### Code Example: Sudoku Solver in Javascript

```javascript
function solveSudoku(board) {
  const n = 9;

  function isSafe(row, col, num) {
    // Check row
    for (let i = 0; i < n; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }
    // Check column
    for (let i = 0; i < n; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }
    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) {
          return false;
        }
      }
    }
    return true;
  }

  function solve() {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] === '.') {
          for (let num = 1; num <= 9; num++) {
            const charNum = num.toString();
            if (isSafe(i, j, charNum)) {
              board[i][j] = charNum;
              if (solve()) {
                return true;
              }
              board[i][j] = '.'; // backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve();
  return board;
}

const board = [
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
];

console.log(solveSudoku(board));
```

#### Maze Solver

The Maze Solver problem is to find a path from a starting point to an ending point in a maze.

##### Code Example: Maze Solver in Javascript

```javascript
function solveMaze(maze) {
  const n = maze.length;
  const solution = Array(n).fill(0).map(() => Array(n).fill(0));

  function isSafe(x, y) {
    return x >= 0 && x < n && y >= 0 && y < n && maze[x][y] === 1;
  }

  function solve(x, y) {
    if (x === n - 1 && y === n - 1) {
      solution[x][y] = 1;
      return true;
    }

    if (isSafe(x, y)) {
      solution[x][y] = 1;
      if (solve(x + 1, y)) {
        return true;
      }
      if (solve(x, y + 1)) {
        return true;
      }
      solution[x][y] = 0; // backtrack
      return false;
    }
    return false;
  }

  if (solve(0, 0)) {
    return solution;
  }
  return "NO PATH FOUND";
}

const maze = [
  [1, 0, 0, 0],
  [1, 1, 0, 1],
  [0, 1, 0, 0],
  [1, 1, 1, 1]
];

console.log(solveMaze(maze));
```

### Dynamic Programming (DP)

**Dynamic Programming** is a technique for solving complex problems by breaking them down into simpler sub-problems. It is similar to recursion, but it stores the results of the sub-problems to avoid re-computing them. This is called **memoization**.

There are two main properties of a problem that suggest that the problem can be solved using Dynamic Programming:

*   **Overlapping Subproblems**: A problem is said to have overlapping subproblems if it can be broken down into subproblems which are reused several times.
*   **Optimal Substructure**: A problem is said to have optimal substructure if an optimal solution can be constructed from optimal solutions of its subproblems.

#### Fibonacci

The Fibonacci sequence is a classic example of a problem that can be solved using Dynamic Programming. The Fibonacci sequence is a series of numbers in which each number is the sum of the two preceding ones, usually starting with 0 and 1.

##### Code Example: Fibonacci in Javascript

```javascript
// Using memoization
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

console.log(fib(10)); // Output: 55
```

#### Longest Common Subsequence (LCS)

The Longest Common Subsequence (LCS) problem is to find the longest subsequence common to all sequences in a set of sequences.

##### Code Example: LCS in Javascript

```javascript
function lcs(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

console.log(lcs("AGGTAB", "GXTXAYB")); // Output: 4
```

#### Longest Increasing Subsequence (LIS)

The Longest Increasing Subsequence (LIS) problem is to find the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order.

##### Code Example: LIS in Javascript

```javascript
function lis(arr) {
  const n = arr.length;
  const lis = Array(n).fill(1);

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j] && lis[i] < lis[j] + 1) {
        lis[i] = lis[j] + 1;
      }
    }
  }
  return Math.max(...lis);
}

const arr = [10, 22, 9, 33, 21, 50, 41, 60];
console.log(lis(arr)); // Output: 5
```

#### Knapsack Problem

The Knapsack Problem is a problem in combinatorial optimization: Given a set of items, each with a weight and a value, determine the number of each item to include in a collection so that the total weight is less than or equal to a given limit and the total value is as large as possible.

##### Code Example: 0/1 Knapsack in Javascript

```javascript
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= capacity; j++) {
      if (weights[i - 1] <= j) {
        dp[i][j] = Math.max(dp[i - 1][j], values[i - 1] + dp[i - 1][j - weights[i - 1]]);
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }
  return dp[n][capacity];
}

const weights = [1, 2, 3];
const values = [60, 100, 120];
const capacity = 5;
console.log(knapsack(weights, values, capacity)); // Output: 220
```

#### Coin Change

The Coin Change Problem is a classic dynamic programming problem. Given a value V, if we want to make change for V cents, and we have an infinite supply of each of C = { C1, C2, .. , Cm} valued coins, what is the minimum number of coins to make the change?

##### Code Example: Coin Change in Javascript

```javascript
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

const coins = [1, 2, 5];
const amount = 11;
console.log(coinChange(coins, amount)); // Output: 3
```

#### Matrix Chain Multiplication

The Matrix Chain Multiplication problem is to find the most efficient way to multiply a given sequence of matrices. The problem is not actually to perform the multiplications, but merely to decide in which order to perform the multiplications.

##### Code Example: Matrix Chain Multiplication in Javascript

```javascript
function matrixChainOrder(p) {
  const n = p.length;
  const m = Array(n).fill(0).map(() => Array(n).fill(0));

  for (let i = 1; i < n; i++) {
    m[i][i] = 0;
  }

  for (let L = 2; L < n; L++) {
    for (let i = 1; i < n - L + 1; i++) {
      const j = i + L - 1;
      m[i][j] = Number.MAX_SAFE_INTEGER;
      for (let k = i; k <= j - 1; k++) {
        const q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
        if (q < m[i][j]) {
          m[i][j] = q;
        }
      }
    }
  }
  return m[1][n - 1];
}

const p = [1, 2, 3, 4];
console.log(matrixChainOrder(p)); // Output: 18
```

### Greedy Algorithms

A **Greedy algorithm** is an algorithmic paradigm that builds up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate benefit. Greedy algorithms are used for optimization problems.

A greedy algorithm has five components:

1.  A candidate set, from which a solution is created.
2.  A selection function, which chooses the best candidate to be added to the solution.
3.  A feasibility function, that is used to determine if a candidate can be used to contribute to a solution.
4.  An objective function, which assigns a value to a solution, or a partial solution.
5.  A solution function, which will indicate when we have discovered a complete solution.

#### Activity Selection

The Activity Selection problem is a classic example of a greedy algorithm. The problem is to select the maximum number of activities that can be performed by a single person, given that the person can only work on a single activity at a time.

##### Code Example: Activity Selection in Javascript

```javascript
function activitySelection(start, finish) {
  const n = start.length;
  const activities = [];
  for (let i = 0; i < n; i++) {
    activities.push({ start: start[i], finish: finish[i] });
  }

  activities.sort((a, b) => a.finish - b.finish);

  let i = 0;
  const result = [activities[i]];

  for (let j = 1; j < n; j++) {
    if (activities[j].start >= activities[i].finish) {
      result.push(activities[j]);
      i = j;
    }
  }
  return result;
}

const start = [1, 3, 0, 5, 8, 5];
const finish = [2, 4, 6, 7, 9, 9];
console.log(activitySelection(start, finish));
```

#### Huffman Coding

Huffman Coding is a lossless data compression algorithm. The idea is to assign variable-length codes to input characters, lengths of the assigned codes are based on the frequencies of corresponding characters. The most frequent character gets the smallest code and the least frequent character gets the largest code.

##### Code Example: Huffman Coding in Javascript

```javascript
class HuffmanNode {
  constructor(char, freq) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

function huffmanCoding(chars, freqs) {
  const n = chars.length;
  const priorityQueue = [];

  for (let i = 0; i < n; i++) {
    priorityQueue.push(new HuffmanNode(chars[i], freqs[i]));
  }

  priorityQueue.sort((a, b) => a.freq - b.freq);

  while (priorityQueue.length > 1) {
    const left = priorityQueue.shift();
    const right = priorityQueue.shift();

    const newNode = new HuffmanNode('

---

## 5. Conclusion

We've covered a lot of ground in this series! We've learned about the fundamental concepts of data structures and algorithms, how to measure their efficiency using Big O notation, and we've explored some of the most common data structures and algorithms.

Understanding DSA is a journey, not a destination. The key is to practice, practice, practice. Try implementing these data structures and algorithms yourself in your favorite programming language. Solve problems on platforms like LeetCode, HackerRank, and Codewars.

We hope this series has given you a solid foundation in DSA. Happy coding!
, left.freq + right.freq);
    newNode.left = left;
    newNode.right = right;

    priorityQueue.push(newNode);
    priorityQueue.sort((a, b) => a.freq - b.freq);
  }

  const root = priorityQueue[0];
  const codes = {};

  function getCodes(node, code) {
    if (node.left === null && node.right === null) {
      codes[node.char] = code;
      return;
    }
    getCodes(node.left, code + '0');
    getCodes(node.right, code + '1');
  }

  getCodes(root, '');
  return codes;
}

const chars = ['a', 'b', 'c', 'd', 'e', 'f'];
const freqs = [5, 9, 12, 13, 16, 45];
console.log(huffmanCoding(chars, freqs));
```

#### Minimum Spanning Tree (MST)

A Minimum Spanning Tree (MST) or minimum weight spanning tree is a subset of the edges of a connected, edge-weighted undirected graph that connects all the vertices together, without any cycles and with the minimum possible total edge weight.

There are two main algorithms to find the MST of a graph:

*   Kruskal’s Algorithm
*   Prim’s Algorithm

##### Kruskal’s Algorithm

Kruskal’s algorithm is a greedy algorithm that finds an MST for a weighted undirected graph. It finds a safe edge to add to the growing forest by finding, among all the edges that connect any two trees in the forest, an edge (u, v) of least weight.

###### Code Example: Kruskal’s Algorithm in Javascript

```javascript
function kruskal(graph) {
  const n = graph.numVertices;
  const edges = graph.edges.sort((a, b) => a.weight - b.weight);
  const parent = Array(n).fill(0).map((_, i) => i);
  const find = (i) => {
    if (parent[i] === i) {
      return i;
    }
    return find(parent[i]);
  };
  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootJ] = rootI;
    }
  };

  const result = [];
  let i = 0;
  let e = 0;
  while (e < n - 1) {
    const { u, v, weight } = edges[i];
    i++;
    const rootU = find(u);
    const rootV = find(v);
    if (rootU !== rootV) {
      e++;
      result.push({ u, v, weight });
      union(rootU, rootV);
    }
  }
  return result;
}

const graph = {
  numVertices: 4,
  edges: [
    { u: 0, v: 1, weight: 10 },
    { u: 0, v: 2, weight: 6 },
    { u: 0, v: 3, weight: 5 },
    { u: 1, v: 3, weight: 15 },
    { u: 2, v: 3, weight: 4 },
  ],
};
console.log(kruskal(graph));
```

##### Prim’s Algorithm

Prim’s algorithm is another greedy algorithm that finds an MST for a weighted undirected graph. It works by building the tree one vertex at a time, from an arbitrary starting vertex, at each step adding the cheapest possible connection from the tree to another vertex.

###### Code Example: Prim’s Algorithm in Javascript

```javascript
function prim(graph) {
  const n = graph.numVertices;
  const parent = Array(n).fill(null);
  const key = Array(n).fill(Infinity);
  const mstSet = Array(n).fill(false);

  key[0] = 0;
  parent[0] = -1;

  for (let count = 0; count < n - 1; count++) {
    let min = Infinity;
    let u = -1;

    for (let v = 0; v < n; v++) {
      if (mstSet[v] === false && key[v] < min) {
        min = key[v];
        u = v;
      }
    }

    mstSet[u] = true;

    for (let v = 0; v < n; v++) {
      if (graph.adjMatrix[u][v] && mstSet[v] === false && graph.adjMatrix[u][v] < key[v]) {
        parent[v] = u;
        key[v] = graph.adjMatrix[u][v];
      }
    }
  }
  return parent;
}

const graph2 = {
  numVertices: 5,
  adjMatrix: [
    [0, 2, 0, 6, 0],
    [2, 0, 3, 8, 5],
    [0, 3, 0, 0, 7],
    [6, 8, 0, 0, 9],
    [0, 5, 7, 9, 0],
  ],
};
console.log(prim(graph2));
```

### Graph Algorithms

I’ve already covered Breadth-First Search (BFS) and Depth-First Search (DFS). Here are some other important graph algorithms.

#### Dijkstra’s Algorithm

Dijkstra’s algorithm is an algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks. It was conceived by computer scientist Edsger W. Dijkstra in 1956 and published three years later.

##### Code Example: Dijkstra’s Algorithm in Javascript

```javascript
function dijkstra(graph, start) {
  const n = graph.numVertices;
  const dist = Array(n).fill(Infinity);
  const sptSet = Array(n).fill(false);

  dist[start] = 0;

  for (let count = 0; count < n - 1; count++) {
    let min = Infinity;
    let u = -1;

    for (let v = 0; v < n; v++) {
      if (sptSet[v] === false && dist[v] <= min) {
        min = dist[v];
        u = v;
      }
    }

    sptSet[u] = true;

    for (let v = 0; v < n; v++) {
      if (!sptSet[v] && graph.adjMatrix[u][v] && dist[u] !== Infinity && dist[u] + graph.adjMatrix[u][v] < dist[v]) {
        dist[v] = dist[u] + graph.adjMatrix[u][v];
      }
    }
  }
  return dist;
}

const graph3 = {
  numVertices: 9,
  adjMatrix: [
    [0, 4, 0, 0, 0, 0, 0, 8, 0],
    [4, 0, 8, 0, 0, 0, 0, 11, 0],
    [0, 8, 0, 7, 0, 4, 0, 0, 2],
    [0, 0, 7, 0, 9, 14, 0, 0, 0],
    [0, 0, 0, 9, 0, 10, 0, 0, 0],
    [0, 0, 4, 14, 10, 0, 2, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 1, 6],
    [8, 11, 0, 0, 0, 0, 1, 0, 7],
    [0, 0, 2, 0, 0, 0, 6, 7, 0]
  ]
};
console.log(dijkstra(graph3, 0));
```

#### Bellman-Ford Algorithm

The Bellman-Ford algorithm is an algorithm that computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra’s algorithm, but more versatile, as it is capable of handling graphs in which some of the edge weights are negative numbers.

##### Code Example: Bellman-Ford Algorithm in Javascript

```javascript
function bellmanFord(graph, start) {
  const n = graph.numVertices;
  const dist = Array(n).fill(Infinity);
  dist[start] = 0;

  for (let i = 0; i < n - 1; i++) {
    for (const { u, v, weight } of graph.edges) {
      if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
      }
    }
  }

  for (const { u, v, weight } of graph.edges) {
    if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
      return "Graph contains negative weight cycle";
    }
  }

  return dist;
}

const graph4 = {
  numVertices: 5,
  edges: [
    { u: 0, v: 1, weight: -1 },
    { u: 0, v: 2, weight: 4 },
    { u: 1, v: 2, weight: 3 },
    { u: 1, v: 3, weight: 2 },
    { u: 1, v: 4, weight: 2 },
    { u: 3, v: 2, weight: 5 },
    { u: 3, v: 1, weight: 1 },
    { u: 4, v: 3, weight: -3 },
  ],
};
console.log(bellmanFord(graph4, 0));
```

#### Floyd-Warshall Algorithm

The Floyd-Warshall algorithm is an algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but with no negative cycles). A single execution of the algorithm will find the lengths (summed weights) of shortest paths between all pairs of vertices.

##### Code Example: Floyd-Warshall Algorithm in Javascript

```javascript
function floydWarshall(graph) {
  const n = graph.numVertices;
  const dist = Array(n).fill(0).map(() => Array(n).fill(Infinity));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        dist[i][j] = 0;
      } else if (graph.adjMatrix[i][j]) {
        dist[i][j] = graph.adjMatrix[i][j];
      }
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  return dist;
}

const graph5 = {
  numVertices: 4,
  adjMatrix: [
    [0, 5, Infinity, 10],
    [Infinity, 0, 3, Infinity],
    [Infinity, Infinity, 0, 1],
    [Infinity, Infinity, Infinity, 0]
  ]
};
console.log(floydWarshall(graph5));
```

#### Topological Sort

Topological sorting for Directed Acyclic Graph (DAG) is a linear ordering of vertices such that for every directed edge from vertex u to vertex v, u comes before v in the ordering. Topological Sorting for a graph is not possible if the graph is not a DAG.

##### Code Example: Topological Sort in Javascript

```javascript
function topologicalSort(graph) {
  const n = graph.numVertices;
  const inDegree = Array(n).fill(0);
  const adj = graph.adj;

  for (let i = 0; i < n; i++) {
    for (const neighbor of adj[i]) {
      inDegree[neighbor]++;
    }
  }

  const queue = [];
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }

  const result = [];
  while (queue.length) {
    const u = queue.shift();
    result.push(u);

    for (const neighbor of adj[u]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (result.length !== n) {
    return "Graph has a cycle";
  }

  return result;
}

const graph6 = {
  numVertices: 6,
  adj: [
    [],
    [],
    [3],
    [1],
    [0, 1],
    [0, 2]
  ]
};
console.log(topologicalSort(graph6));
```

#### Union-Find (Disjoint Set Union – DSU)

A Union-Find (or Disjoint Set Union) data structure is a data structure that stores a collection of disjoint (non-overlapping) sets. It provides operations for adding new sets, merging sets (replacing them by their union), and finding a representative member of a set.

##### Code Example: Union-Find in Javascript

```javascript
class DSU {
  constructor(n) {
    this.parent = Array(n).fill(0).map((_, i) => i);
  }

  find(i) {
    if (this.parent[i] === i) {
      return i;
    }
    return this.find(this.parent[i]);
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootJ] = rootI;
    }
  }
}

const dsu = new DSU(5);
dsu.union(0, 2);
dsu.union(4, 2);
dsu.union(1, 3);
console.log(dsu.find(4)); // Output: 0
console.log(dsu.find(1)); // Output: 1
```

### Math / Number Theory

This section covers some important mathematical and number theory concepts that are frequently used in competitive programming and algorithm design.

#### Euclidean GCD

The Euclidean algorithm is an efficient method for computing the greatest common divisor (GCD) of two integers, the largest number that divides them both without leaving a remainder.

##### Code Example: Euclidean GCD in Javascript

```javascript
function gcd(a, b) {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

console.log(gcd(48, 18)); // Output: 6
```

#### Sieve of Eratosthenes

The Sieve of Eratosthenes is an ancient algorithm for finding all prime numbers up to any given limit.

##### Code Example: Sieve of Eratosthenes in Javascript

```javascript
function sieveOfEratosthenes(n) {
  const primes = Array(n + 1).fill(true);
  primes[0] = false;
  primes[1] = false;

  for (let p = 2; p * p <= n; p++) {
    if (primes[p]) {
      for (let i = p * p; i <= n; i += p) {
        primes[i] = false;
      }
    }
  }

  const result = [];
  for (let i = 2; i <= n; i++) {
    if (primes[i]) {
      result.push(i);
    }
  }
  return result;
}

console.log(sieveOfEratosthenes(30)); // Output: [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 ]
```

#### Modular Arithmetic

Modular arithmetic is a system of arithmetic for integers, where numbers “wrap around” upon reaching a certain value—the modulus.

##### Code Example: Modular Arithmetic in Javascript

```javascript
// (a + b) % n
function modularAdd(a, b, n) {
  return (a + b) % n;
}

// (a * b) % n
function modularMultiply(a, b, n) {
  return (a * b) % n;
}

console.log(modularAdd(10, 15, 12)); // Output: 1
console.log(modularMultiply(10, 15, 12)); // Output: 6
```

#### Fast Exponentiation

Fast exponentiation, also known as exponentiation by squaring, is a general method for fast computation of large positive integer powers of a number.

##### Code Example: Fast Exponentiation in Javascript

```javascript
function power(x, y, p) {
  let res = 1;
  x = x % p;

  if (x === 0) return 0;

  while (y > 0) {
    if (y & 1) {
      res = (res * x) % p;
    }
    y = y >> 1;
    x = (x * x) % p;
  }
  return res;
}

console.log(power(2, 5, 13)); // Output: 6
```

### 3\. Advanced Topics

This section covers some advanced topics that are often used in competitive programming and to solve complex problems.

#### Divide and Conquer

Divide and Conquer is an algorithmic paradigm. A divide-and-conquer algorithm recursively breaks down a problem into two or more sub-problems of the same or related type, until these become simple enough to be solved directly. The solutions to the sub-problems are then combined to give a solution to the original problem.

Merge Sort and Quick Sort are good examples of the Divide and Conquer technique.

#### Sliding Window

The Sliding Window technique is a computational technique which aims to reduce the use of nested loops and replace it with a single loop, thereby reducing the time complexity.

##### Code Example: Sliding Window in Javascript

```javascript
function maxSubarraySum(arr, num) {
  let maxSum = 0;
  let tempSum = 0;
  if (arr.length < num) return null;

  for (let i = 0; i < num; i++) {
    maxSum += arr[i];
  }
  tempSum = maxSum;

  for (let i = num; i < arr.length; i++) {
    tempSum = tempSum - arr[i - num] + arr[i];
    maxSum = Math.max(maxSum, tempSum);
  }
  return maxSum;
}

console.log(maxSubarraySum([2, 6, 9, 2, 1, 8, 5, 6, 3], 3)); // Output: 19
```

#### Two Pointers

Two Pointers is a technique that is often used to search for pairs in a sorted array.

##### Code Example: Two Pointers in Javascript

```javascript
function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // Output: [ 0, 1 ]
```

#### Binary Search on Answer

Binary Search on Answer is a technique that is used to solve optimization problems. It is used when you are looking for the minimum or maximum value of a variable that satisfies certain conditions.

#### Bit Manipulation

Bit manipulation is the act of algorithmically manipulating bits or other pieces of data shorter than a word.

#### String Algorithms (KMP, Rabin-Karp, Z-Algorithm)

*   **KMP (Knuth-Morris-Pratt) Algorithm**: The KMP algorithm is a string searching algorithm that searches for occurrences of a “word” `W` within a main “text” `T` by employing the observation that when a mismatch occurs, the word itself embodies sufficient information to determine where the next match could begin, thus bypassing re-examination of previously matched characters.
*   **Rabin-Karp Algorithm**: The Rabin-Karp algorithm is a string-searching algorithm that uses hashing to find any one of a set of pattern strings in a text.
*   **Z-Algorithm**: The Z-algorithm is a linear-time string searching algorithm that finds all occurrences of a pattern in a text.

#### Computational Geometry

Computational geometry is a branch of computer science devoted to the study of algorithms which can be stated in terms of geometry.

#### Segment Tree with Lazy Propagation

A Segment Tree is a data structure that allows answering range queries over an array effectively, while still being flexible enough to allow modifying the array. Lazy propagation is a technique that allows for efficient range updates on a segment tree.

#### Dynamic Programming Optimization (Knuth, Convex Hull Trick)

*   **Knuth’s Optimization**: Knuth’s optimization is a technique that can be used to optimize certain dynamic programming problems from O(n^3) to O(n^2).
*   **Convex Hull Trick**: The Convex Hull Trick is a technique that is used to optimize certain dynamic programming problems. It is used when the recurrence relation is of the form `dp[i] = min(dp[j] + b[j] * a[i])` for `j < i`.

* * *

## 5\. Conclusion

We’ve covered a lot of ground in this series! We’ve learned about the fundamental concepts of data structures and algorithms, how to measure their efficiency using Big O notation, and we’ve explored some of the most common data structures and algorithms.

Understanding DSA is a journey, not a destination. The key is to practice, practice, practice. Try implementing these data structures and algorithms yourself in your favorite programming language. Solve problems on platforms like LeetCode, HackerRank, and Codewars.

We hope this series has given you a solid foundation in DSA. Happy coding!

* * *

## 5\. Conclusion

We’ve covered a lot of ground in this series! We’ve learned about the fundamental concepts of data structures and algorithms, how to measure their efficiency using Big O notation, and we’ve explored some of the most common data structures and algorithms.

Understanding DSA is a journey, not a destination. The key is to practice, practice, practice. Try implementing these data structures and algorithms yourself in your favorite programming language. Solve problems on platforms like LeetCode, HackerRank, and Codewars.

We hope this series has given you a solid foundation in DSA. Happy coding!

```plaintext

### 3. Advanced Topics

This section covers some advanced topics that are often used in competitive programming and to solve complex problems.

#### Divide and Conquer

Divide and Conquer is an algorithmic paradigm. A divide-and-conquer algorithm recursively breaks down a problem into two or more sub-problems of the same or related type, until these become simple enough to be solved directly. The solutions to the sub-problems are then combined to give a solution to the original problem.

Merge Sort and Quick Sort are good examples of the Divide and Conquer technique.

#### Sliding Window

The Sliding Window technique is a computational technique which aims to reduce the use of nested loops and replace it with a single loop, thereby reducing the time complexity.

##### Code Example: Sliding Window in Javascript

```javascript
function maxSubarraySum(arr, num) {
  let maxSum = 0;
  let tempSum = 0;
  if (arr.length < num) return null;

  for (let i = 0; i < num; i++) {
    maxSum += arr[i];
  }
  tempSum = maxSum;

  for (let i = num; i < arr.length; i++) {
    tempSum = tempSum - arr[i - num] + arr[i];
    maxSum = Math.max(maxSum, tempSum);
  }
  return maxSum;
}

console.log(maxSubarraySum([2, 6, 9, 2, 1, 8, 5, 6, 3], 3)); // Output: 19
```

#### Two Pointers

Two Pointers is a technique that is often used to search for pairs in a sorted array.

##### Code Example: Two Pointers in Javascript

```javascript
function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // Output: [ 0, 1 ]
```

* * *

## 5\. Conclusion

We’ve covered a lot of ground in this series! We’ve learned about the fundamental concepts of data structures and algorithms, how to measure their efficiency using Big O notation, and we’ve explored some of the most common data structures and algorithms.

Understanding DSA is a journey, not a destination. The key is to practice, practice, practice. Try implementing these data structures and algorithms yourself in your favorite programming language. Solve problems on platforms like LeetCode, HackerRank, and Codewars.

We hope this series has given you a solid foundation in DSA. Happy coding!