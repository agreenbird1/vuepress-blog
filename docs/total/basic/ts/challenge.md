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

8. IsUnion [小册实例](https://juejin.cn/book/7047524421182947366/section/7048282387825819687)

```typescript
// 如何判断是否是联合类型
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never
// 何解？
// 首先，A extends A 是为了触发联合类型的特性，使得 A 可以单独抽离做运算
// 之后，我们通过 [B] extends [A] 来做判断。此时 A 是联合类型的一个子集，B是完整的联合类型
// 肯定是不成立的，所以返回 true，判断成功。
// 其次如果是其他类型，不会有分散传递的特性，[B] extends [A] 肯定是成立的。
/
// 数组转联合类型
type ArrToUnion<T extends unknown[]> = T[number]
```

9. IsAny [小册实例](https://juejin.cn/book/7047524421182947366/section/7048282437238915110)

```typescript
// 特性：any & 任意值（除never） 都是 any
type IsAny<T> = 1 extends 2 & T ? true : false
// 对于 1、 2 来说，是可以替换成其他除never之外的类型
```

10. IsNever

```typescript
// never 在条件类型中也比较特殊，如果条件类型左边是类型参数，并且传入的是 never，那么直接返回 never：
// 比如
type TestNever<T> = T extends number ? 1 : 2;


'
```

11. UnionToIntersection

```typescript
// 联合类型转交叉类型
// 使用逆变的性质，父类型可以赋值给子类型的
type UnionToIntersection<U> =
    (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown
        ? R
        : never
```

12. GetOptional

```typescript
// 对于可选的属性都是 value | undefined。
// 所以我们可以通过 {} extends Pick<T, key> 来判断当前的 key 是否是可选的
// never 的值不会被提取
type GetOptional<T extends Record<string, any>> = {
  [key in keyof T as {} extends Pick<T, key> ? key : never]: T[key]
}

```

12. GetRequired

```typescript
// 同上，将条件的值反转即可
type GetRequired<T extends Record<string, any>> = {
  [key in keyof T as {} extends Pick<T, key> ? never : key]: T[key]
}

```

13. CombineArr

```typescript
// 两个数组合并，并去除不相交的元素
// 通过将数组内容转成联合类型再判断一次当前的元素是否在另一个数组内
// T extends Res[number]
type CombineArr<T extends unknown[], Res extends unknown[]> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends Res[number]
    ? CombineArr<Rest, Res>
    : CombineArr<Rest, [First, ...Res]>
  : T extends Res[number]
  ? Res
  : [...T, ...Res]
```

13. ParseQueryString

```typescript
// 合并参数
// 对于相同的 key，value各有两种情况：数组、单个的值
// 如果都是数组，combineArr 就行
// 如果有一方不是数组，则将另一方化成数组进行 combineArr
// 如果两方都不是数组，则比较是否相同，相同则只返回一个
type MergeValues<
  One extends unknown[] | string,
  Other extends unknown[] | string
> = One extends unknown[]
  ? Other extends unknown[]
    ? CombineArr<One, Other>
    : CombineArr<One, [Other]>
  : Other extends unknown[]
  ? CombineArr<[One], Other>
  : One extends Other
  ? One
  : [One, Other]

type t = 1 extends [2, 3, 1][number] ? true : false

// 将多个参数合并。
// 遍历他们所有的key
// 如果此参数有多个，需要合并为数组
type MergeParams<
  OneParam extends Record<string, any>,
  OtherParams extends Record<string, any>
> = {
  [key in keyof OneParam | keyof OtherParams]: key extends keyof OneParam
    ? key extends keyof OtherParams
      ? MergeValues<OneParam[key], OtherParams[key]>
      : OneParam[key]
    : key extends keyof OtherParams
    ? OtherParams[key]
    : never
}

// 用于对单个的 param 进行解析
type ParseParam<Param extends string> =
  Param extends `${infer key}=${infer value}` ? { [k in key]: value } : {}

// queryString 可能有多个值，所以需要递归处理
type ParseQueryString<Str extends string> =
  Str extends `${infer Param}&${infer Rest}`
    ? MergeParams<ParseParam<Param>, ParseQueryString<Rest>>
    : ParseParam<Str>
```

14. CurryFn

```typescript
// 获取柯里化后的函数的类型
// 比如:
(a: number, b: number, c: number) => void
(a: number) => (b: number) => (c: number) => void

// 循环参数进行构造,每一个参数一个返回函数
type GetCurried<Params, Return> = Params extends [infer First, ...infer Rest]
  ? (arg: First) => GetCurried<Rest, Return>
  : Return

// 约定函数类型
type CurryFn<Fn extends Function> = Fn extends (
  ...args: infer Params
) => infer Return
  ? GetCurried<Params, Return>
  : never
```