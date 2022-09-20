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

4. [Parameters](https://github.com/type-challenges/type-challenges/blob/main/questions/03312-easy-parameters/README.zh-CN.md)

```typescript
// 类型放在类型的位置
// (...args: infer R) => any 而不是 (infer R) => any
type MyParameters<T extends (...args: any[]) => any> =
  T extends (...args: infer R) => any ? R : never
```

5. [MyReadonly2](https://github.com/type-challenges/type-challenges/blob/main/questions/00008-medium-readonly-2/README.zh-CN.md)

```typescript
type MyExclude<T, U> = T extends U ? never : T

// 将传递了的 K 的索引变为 readonly，其余的不变返回
// 如果没有传递 K，则所有 T 中的索引都变为 readonly
// 值得注意的是这里使用了默认值！
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [key in K]: T[key]
} & {
  [key in MyExclude<keyof T, K>]: T[key]
}
```

6. RemoveItem [小册实例](https://juejin.cn/book/7047524421182947366/section/7048282249464119307)

```typescript
// 将数组中的特定的元素删除

// 相互继承则相等
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)

// 传递一个默认参数，将不匹配的元素放入，匹配的放入。相当于移除
type RemoveItem<
  T extends unknown[],
  Item,
  Res extends unknown[] = []
> = T extends [infer First, ...infer Rest]
  ? IsEqual<First, Item> extends true
    ? RemoveItem<Rest, Item, [...Res]>
    : RemoveItem<Rest, Item, [...Res, First]>
  : Res

```

7. 四则运算

```typescript
// ts中并不能做四则运算。
// 我们能想到的唯一的数值就是数组的长度，所以可以以此下手

// 通过构造相同长度的数组，取其长度值，便是对应的数字
type buildArr<
  length extends number,
  ele extends unknown = unknown,
  Arr extends unknown[] = []
> = Arr['length'] extends length ? Arr : buildArr<length, ele, [ele, ...Arr]>

// 加法：构造两个数组，取其和
type Add<num1 extends number, num2 extends number> = [
  ...buildArr<num1>,
  ...buildArr<num2>
]['length']

// 减法：将剩余的数组长度取出
type subtract<
  num1 extends number,
  num2 extends number
> = buildArr<num1> extends [...buildArr<num2>, ...infer Rest]
  ? Rest['length']
  : never

// 乘法
// 1. 自己的实现：3 * 2 = 2 + 2 + 2
//    所以设计一个Rest数组保存加的次数，到0时返回对应结果的长度即可
type multiply<
  num1 extends number,
  num2 extends number,
  Res extends unknown[] = [],
  Rest extends unknown[] = buildArr<num1>
> = Rest['length'] extends 0
  ? Res['length']
  : Rest extends [infer First, ...infer Other]
  ? multiply<Other['length'], num2, [...buildArr<num2>, ...Res]>
  : never

// 2. 神光实现
//    相当于减少一个计数的数组，都能直接用减法了呀为什么还要计数！！！
type multiply<
    Num1 extends number,
    Num2 extends number,
    ResultArr extends unknown[] = []
> = Num2 extends 0 ? ResultArr['length']
        : multiply<Num1, Subtract<Num2, 1>, [...BuildArray<Num1>, ...ResultArr]>;

// 除法：每次减去num2，直到为0
type divide<
  num1 extends number,
  num2 extends number,
  Res extends unknown[] = []
> = num1 extends 0
  ? Res['length']
  : divide<subtract<num1, num2>, num2, [...Res, unknown]>
```