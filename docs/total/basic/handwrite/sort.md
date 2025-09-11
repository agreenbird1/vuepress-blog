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
```js
/**
 * 分治思想
 * 将数组拆分为最小单元也就是 1 个元素，此时即有序
 * 将最小单元依次合并，每次合并的结果都是有序的，最后拿到值
 */
const mergeSort = (arr) => {
    if (arr.length < 2) return arr;
    // 直接拆分为最小单元
    let dividingArrs = arr.map(i => [i]);
    const merge = (arr1, arr2) => {
        const res = [];
        let i = 0;
        let j = 0;
        // 双指针按大小排序
        while (i < arr1.length && j < arr2.length) {
            if (arr1[i] <= arr2[j]) res.push(arr1[i++]);
            else res.push(arr2[j++]);
        }
        // 跳出循环时必定有一个数组没有到达末尾，需要添加到res中
        if (i !== arr1.length) res.push(...arr1.slice(i));
        if (j !== arr2.length) res.push(...arr2.slice(j));
        return res;
    }
    while (dividingArrs.length > 1) {
        const next = [];
        for (let i = 0; i < dividingArrs.length; i += 2) {
            if (i + 1 === dividingArrs.length) next.push(dividingArrs[i]);
            else next.push(merge(dividingArrs[i], dividingArrs[i + 1]));
        }
        dividingArrs = next;
    }
    return dividingArrs[0];
}
```

### 冒泡排序
```js
/**
 * 冒泡排序
 * 相邻元素两两比较，把大的元素一步步“冒”到右边（末尾），直到整个数组有序。
 */
const bubbleSort = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        // 一轮比较决定一个最大值
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
```js
/**
 * 每次选择一个最小的放在最前面
 * 一轮选择定一个值
 */
const selectSort = (arr) => {
    if (arr.length < 2) return arr
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            // 将小值与位置 i 的值交换
            if (arr[j] < arr[i]) [arr[i], arr[j]] = [arr[j], arr[i]]
        }
    }
    return arr
}
```
### 堆排序
todo: 等刷到堆的算法题后补充

### 希尔排序
```js
/**
 * 优化的插入排序
 * 每次指定一个 gap，以这个 gap 为一组进行插入排序，当 gap 为 1 的时候接近有序
 */
const shellSort = (arr) => {
    const n = arr.length
    let gap = Math.floor(n / 2) // 初始步长（一般取 n/2）

    while (gap > 0) {
        // 对间隔为 gap 的子序列做插入排序
        for (let i = gap; i < n; i++) {
            let temp = arr[i]
            let j = i
            // 类似插入排序，但不是相邻比较，而是隔 gap 比较
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap]
                j -= gap
            }
            arr[j] = temp
        }
        gap = Math.floor(gap / 2) // 缩小 gap
    }

    return arr
}
```