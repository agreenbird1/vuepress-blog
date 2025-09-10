---
title: 排序
author: RoleTang
date: '2025-09-10'
---

| 排序算法   | 最好时间复杂度 | 最坏时间复杂度 | 平均时间复杂度 | 空间复杂度 | 稳定性 |
|------------|----------------|----------------|----------------|------------|--------|
| 快速排序   | O(n log n)     | O(n²)          | O(n log n)     | O(log n)   | 否     |
| 归并排序   | O(n log n)     | O(n log n)     | O(n log n)     | O(n)       | 是     |
| 冒泡排序   | O(n)           | O(n²)          | O(n²)          | O(1)       | 是     |
| 选择排序   | O(n²)          | O(n²)          | O(n²)          | O(1)       | 否     |
| 堆排序     | O(n log n)     | O(n log n)     | O(n log n)     | O(1)       | 否     |
| 希尔排序   | O(n log n)~O(n²) | O(n²)        | O(n^1.3)~O(n^1.5) | O(1)   | 否     |

- 快速排序：最坏情况出现在数组已基本有序时（但可以通过随机化选取 pivot 缓解）。

- 归并排序：无论数据分布如何，时间复杂度都很稳定，但空间复杂度较高。

- 冒泡排序：有优化版（当某一轮未发生交换时可提前结束），最好情况 O(n)。

- 选择排序：始终是 O(n²)，且不稳定（可能跨元素交换破坏相对顺序）。

- 堆排序：时间复杂度稳定，但不稳定（因为堆的调整会改变相对顺序）。

- 希尔排序：复杂度依赖于增量序列选择，性能比 O(n²) 排序好，但不稳定。

### 快速排序
```js
/**
 * 选择一点作为基准
 * 将大于基准点的放在后面，小于基准点的放在前面
 * 循环往复直到全部处理
 */
const quickSort = (arr) => {
    // 额外空间的快速排序
    if (arr.length <= 1) return arr
    const benchmark = arr[0]
    const left = []
    const right = []
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < benchmark) left.push(arr[i])
        else right.push(arr[i])
    }
    return [...quickSort(left), benchmark, ...quickSort(right)]
}

const quickSortInPlace = (arr, left, right) => {
    if (left >= right) return
    const partition = (arr, left, right) => {
        const benchmark = arr[left]
        let i = left + 1
        // 将小于benchmark的值放在i之前，否则i之后，以此达到分组的目的
        for (let j = i; j <= right; j++) {
            if (arr[j] < benchmark) {
                // 解构赋值
                ;[arr[j], arr[i]] = [arr[i], arr[j]]
                i++
            }
        }
        // 将 i 与基准点交换，后续不再处理基准点，位置已经确定了
        ;[arr[left], arr[i - 1]] = [arr[i - 1], arr[left]]
        return i - 1
    }
    const point = partition(arr, left, right)
    quickSortInPlace(arr, left, point - 1)
    quickSortInPlace(arr, point + 1, right)
    return arr
}
```
### 归并排序

### 冒泡排序
```js
/**
 * 冒泡排序
 * 相邻元素两两比较，把大的元素一步步“冒”到右边（末尾），直到整个数组有序。
 */
const bubbleSort = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

```
### 选择排序

### 堆排序

### 希尔排序