---
title: 数组方法手写
author: RoleTang
date: '2022-08-17'
---


### map

```javascript
/**
 * map 默认会返回一个新数组，新数组中的内容为回调返回的内容组合而成。
 * 同时如果中间没有内容不可返回，应该直接跳过。比如数组为
 * arr[0]、arr[5]，那么返回的应该只有两个的值，中间不存在的值不用返回
 * @param { Function } cb - 回调函数
 * @param { any } thisArg - 回调执行时候应该绑定的 this 参数
 */
Array.prototype.map = function (cb, thisArg) {
  if (this === null || this === undefined)
    throw new Error("Cannot read property 'map' of null or undefined!");
  if (typeof cb !== "function") throw new Error(cb + "is not a function");

  // 将 this 转换成对象
  const arr = Object(this);
  const res = [];
  for (let idx = 0; idx < arr.length; idx++) {
    // 当前下标存在才返回
    // 或者说是当前下标有值才返回
    if (idx in arr) {
      res.push(cb.call(thisArg, arr[idx], idx, arr));
    }
  }
  return res;
};
```


### reduce

```javascript
/**
 *
 * @param { Function } cb - 回调函数，四个参数 previousVal，currentVal，idx，arr
 * @param {*} initialVal - 初始值
 * @returns
 */
Array.prototype.reduce = function (cb, initialVal) {
  if (this === null || this === undefined)
    throw new Error("Cannot read property 'map' of null or undefined!");
  if (typeof cb !== "function") throw new Error(cb + "is not a function");
  // 如果数组为空 且 没有初始值则会报错
  if (this.length === 0 && initialVal === undefined)
    throw new Error("Reduce of empty array with no initial value");
  // 如果数组为空则直接返回 initialVal
  if (this.length === 0) return initialVal;
  let arr = Object(this);
  // 正常情况循环从 0 开始，但是如果数组开始没有值，需要找到第一个有值的下标
  let i = 0;
  let res = initialVal;
  // 当没有传递 initialVal 的时候
  // initialVal 赋值为 arr 的第一个存在的值，同时遍历时候需要跳过
  if (!initialVal) {
    for (; i < arr.length; i++) {
      if (i in arr) {
        res = arr[i];
        i++;
        break;
      }
    }
  }
  for (; i < arr.length; i++) {
    // 仍然需要判断存在
    if (i in arr) {
      res = cb(res, arr[i], i, arr);
    }
  }
  return res;
};

```

### filter

```javascript
Array.prototype.filter = function (cb, thisArg) {
  if (this === null || this === undefined)
    throw new Error("Cannot read property 'map' of null or undefined!")
  if (typeof cb !== 'function') throw new Error(cb + 'is not a function')

  const arr = Object(this)
  const res = []
  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      let bool = cb(arr[i], i, arr)
      bool && res.push(arr[i])
    }
  }
  return res
}

```