---
title: "Sort in JavaScript - Professional Style"
date: 2018-05-09T09:52:32.000Z
tags: [javascript]
categories: [javascript]
---

## 1\. Selection Sort

**Tiếng Việt:** Sắp xếp chọn trực tiếp

**Time Complexity:** O(n²)  
**Space Complexity:** O(1)

```javascript
function selectionSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    
    // Tìm phần tử nhỏ nhất trong phần chưa sắp xếp
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap phần tử nhỏ nhất với phần tử đầu tiên của phần chưa sắp xếp
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  return array;
}
```

## 2\. Insertion Sort

**Tiếng Việt:** Sắp xếp chèn trực tiếp

**Time Complexity:** O(n²)  
**Space Complexity:** O(1)

```javascript
function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let current = array[i];
    let j = i - 1;
    
    // Di chuyển các phần tử lớn hơn current về phía sau
    while (j >= 0 && array[j] > current) {
      array[j + 1] = array[j];
      j--;
    }
    
    // Chèn current vào vị trí đúng
    array[j + 1] = current;
  }
  return array;
}
```

## 3\. Binary Insertion Sort

**Tiếng Việt:** Sắp xếp chèn trực tiếp dựa trên tìm kiếm nhị phân

**Time Complexity:** O(n²)  
**Space Complexity:** O(1)

```javascript
function binaryInsertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let current = array[i];
    let left = 0;
    let right = i - 1;
    
    // Tìm vị trí chèn bằng binary search
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (array[mid] > current) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    
    // Dịch chuyển các phần tử để tạo chỗ cho current
    for (let j = i; j > left; j--) {
      array[j] = array[j - 1];
    }
    
    // Chèn current vào vị trí đúng
    array[left] = current;
  }
  return array;
}
```

## 4\. Interchange Sort

**Tiếng Việt:** Sắp xếp đổi chỗ trực tiếp

**Time Complexity:** O(n²)  
**Space Complexity:** O(1)

```javascript
function interchangeSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[i]) {
        // Swap sử dụng destructuring
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  }
  return array;
}
```

## 5\. Bubble Sort

**Tiếng Việt:** Sắp xếp nổi bọt

**Time Complexity:** O(n²)  
**Space Complexity:** O(1)

```javascript
function bubbleSort(array) {
  let n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    // Đưa phần tử lớn nhất về cuối
    for (let j = 0; j < n - 1 - i; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
      }
    }
    
    // Nếu không có swap nào xảy ra, mảng đã được sắp xếp
    if (!swapped) break;
  }
  
  return array;
}
```

## 6\. Shaker Sort (Cocktail Sort)

**Tiếng Việt:** Sắp xếp lắc

**Time Complexity:** O(n²)  
**Space Complexity:** O(1)

```javascript
function shakerSort(array) {
  let left = 0;
  let right = array.length - 1;
  
  while (left < right) {
    let newRight = left;
    let newLeft = right;
    
    // Đi từ trái qua phải
    for (let i = left; i < right; i++) {
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        newRight = i;
      }
    }
    right = newRight;
    
    // Đi từ phải qua trái
    for (let i = right; i > left; i--) {
      if (array[i] < array[i - 1]) {
        [array[i], array[i - 1]] = [array[i - 1], array[i]];
        newLeft = i;
      }
    }
    left = newLeft;
  }
  
  return array;
}
```

## 7\. Quick Sort

**Tiếng Việt:** Sắp xếp nhanh

**Time Complexity:** O(n log n) average, O(n²) worst  
**Space Complexity:** O(log n)

```javascript
function quickSort(array, left, right){
	let l = left, r = right;
	let m = Math.floor((l + r) / 2);
	let pivot = array[m];

	while(l <= r){
		while(array[l] < pivot) l++;
		while(array[r] > pivot) r--;
		if(l <= r){
			let t = array[l];
			array[l] = array[r];
			array[r] = t;
			l++;
			r--;
		}
	}

	if(l < right) quickSort(array, l, right);
	if(r > left) quickSort(array, left, r);
}
```

## 8\. Merge Sort

**Tiếng Việt:** Sắp xếp trộn

**Time Complexity:** O(n log n)  
**Space Complexity:** O(n)

```javascript
function merge(array, left, m, right){
	let l = left, r = m + 1;
	let tmp = [];

	while(l <= m && r <= right){
		if(array[l] < array[r]) tmp.push(array[l++]);
		else tmp.push(array[r++]);
	}

	while(l <= m) tmp.push(array[l++]);
	while(r <= right) tmp.push(array[r++]);

	for(let i = 0; i < tmp.length; i++)
		array[i + left] = tmp[i];
}

function mergeSort(array, left, right){
	if(left < right){
  let m = Math.floor((left + right) / 2);
  mergeSort(array, left, m);
  mergeSort(array, m + 1, right);
  merge(array, left, m, right);
	}
}
```

## 9\. Heap Sort

**Tiếng Việt:** Sắp xếp vun đống

**Time Complexity:** O(n log n)  
**Space Complexity:** O(1)

```javascript
function heapify(array, N, i){
  let left = 2*i + 1, right = 2*i + 2, largest;
    
  if(left < N && array[left] > array[i]) largest = left;
  else largest = i;
    
  if(right < N && array[right] > array[largest]) largest = right;
    
  if(largest != i){
    let t = array[i];
    array[i] = array[largest];
    array[largest] = t;
    heapify(array, N, largest);
  }
}
		     
function buildHeap(array){
  let m = Math.floor(array.length / 2 - 1);
  for(let i = m; i >= 0; i--)
    heapify(array, array.length, i);
}
		     
function heapSort(array){
  buildHeap(array);
        
  for(let i = array.length - 1; i >= 0; i--)    {
    let t = array[0];
    array[0] = array[i];
    array[i] = t;

    heapify(array, i, 0);
  }
}
```

## 10\. Counting Sort

**Time Complexity:** O(n + k) where k is range  
**Space Complexity:** O(k)

```javascript
function countingSort(array, maxValue = Math.max(...array)) {
  const counts = new Array(maxValue + 1).fill(0);
  const result = [];
  
  // Đếm frequency của mỗi phần tử
  for (const num of array) {
    counts[num]++;
  }
  
  // Xây dựng mảng kết quả
  for (let i = 0; i <= maxValue; i++) {
    while (counts[i] > 0) {
      result.push(i);
      counts[i]--;
    }
  }
  
  return result;
}
```

## 11\. Radix Sort

**Time Complexity:** O(d × (n + k)) where d is digits  
**Space Complexity:** O(n + k)

```javascript
function radixSort(array) {
  const max = Math.max(...array);
  
  // Sắp xếp theo từng digit, bắt đầu từ digit thấp nhất
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(array, exp);
  }
  
  return array;
}

function countingSortByDigit(array, exp) {
  const n = array.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  
  // Đếm occurrences của mỗi digit
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(array[i] / exp) % 10;
    count[digit]++;
  }
  
  // Thay đổi count[i] để chứa actual position
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  // Xây dựng output array
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(array[i] / exp) % 10;
    output[count[digit] - 1] = array[i];
    count[digit]--;
  }
  
  // Copy output array vào array gốc
  for (let i = 0; i < n; i++) {
    array[i] = output[i];
  }
}
```

## So sánh hiệu suất

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Counting Sort | O(n + k) | O(n + k) | O(n + k) | O(k) | Yes |
| Radix Sort | O(d(n + k)) | O(d(n + k)) | O(d(n + k)) | O(n + k) | Yes |

## Testing và Benchmark

```javascript
// Test function
function testSortingAlgorithm(sortFn, array) {
  const start = performance.now();
  const sorted = sortFn([...array]); // Clone để không modify original
  const end = performance.now();
  
  console.log(`${sortFn.name}: ${end - start} ms`);
  return sorted;
}

// Benchmark example
const testArray = Array.from({length: 1000}, () => Math.floor(Math.random() * 1000));

console.log('Benchmarking sorting algorithms:');
testSortingAlgorithm(quickSort, testArray);
testSortingAlgorithm(mergeSort, testArray);
testSortingAlgorithm(heapSort, testArray);
testSortingAlgorithm(bubbleSort, testArray); // Sẽ chậm hơn nhiều

// Native JavaScript sort
console.log('Native sort:');
const start = performance.now();
[...testArray].sort((a, b) => a - b);
const end = performance.now();
console.log(`Native sort: ${end - start} ms`);
```

## Khi nào nên dùng algorithm nào?

*   **Small arrays (< 50):** Insertion Sort
*   **Nearly sorted data:** Insertion Sort, Bubble Sort
*   **Memory constrained:** Heap Sort, Selection Sort
*   **Stability required:** Merge Sort, Insertion Sort
*   **General purpose:** Quick Sort, Merge Sort
*   **Integer data with small range:** Counting Sort, Radix Sort