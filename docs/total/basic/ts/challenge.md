---
title: type challenge
author: RoleTang
date: '2022-09-14'
---

刷type challenge遇见的新知识，记录一下。

1. [元组转换程对象](https://github.com/type-challenges/type-challenges/blob/main/questions/00011-easy-tuple-to-object/README.zh-CN.md)

```typescript
// in T[number]，因为 T 是元组，将其内容取出做联合类型并遍历
type TupleToObject<T extends readonly any[]> = {
  [key in T[number]]: key
}
```

2. [Awaited](https://github.com/type-challenges/type-challenges/blob/main/questions/00189-easy-awaited/README.zh-CN.md)

```typescript
// Promise 有嵌套，所以可以递归判断
type MyAwaited<T> =
  T extends Promise<infer P> ?
  P extends Promise<unknown> ? MyAwaited<P> : P
  : never
```

3. [Array.includes](https://github.com/type-challenges/type-challenges/blob/main/questions/00898-easy-includes/README.zh-CN.md)

```typescript
// 相当于是用递归来做循环，依次判断
type Includes<T extends readonly any[], U> =
  T extends [infer P, ... infer R] ?
    Equal<P, U> extends true ? true :  Includes<R, U>
  : false
```