---
title: TypeScript初探
author: RoleTang
date: '2022-08-17'
---


### ts高级工具

1. keyof

  对象、`class` 在 `TypeScript` 对应的类型是索引类型（`Index Type`），可以映射类型。

  获取一个类型上的所有键的值，并返回一个**联合类型**。

  `keyof` T 是查询索引类型中所有的索引，叫做索引查询，返回的是索引的联合类型。

  T[Key] 是取索引类型某个索引的值，叫做索引访问。

  `in` 是用于遍历联合类型的运算符。

   ```typescript
   interface IPerson {
     name: string;
     age: string;
   }
   type Person = keyof IPerson; // "name" | "age" ,意思是Person类型的值只能选中这其中两个

   // 常见用法

   const p1: IPerson = {
     name: "afanti",
     age: "18",
   };

   // 在 type challenge 前两道题中也有体现
   // 限定了访问对象的key的合法化
   function getValue(p: IPerson, k: Person) {
     return p[k];
   }
   ```

2. in

   相当于对可枚举的类型进行遍历，拿上面例子举例

   ```typescript
   type TypeToNumber<T> {
     [k in keyof T]: number;
   }
   // 意思是同样的键，相当于被转成了一种值都是 number 的对象
   const numberObj: TypeToNumber<IPerson> = {
     name: 10,
     age: 19,
   };

   // 对于元组类型来说，直接取下标的值
   type TupleToObject<T extends readonly (string | number)[]> = {
     [P in T[number]]: P
   }
   ```

3. infer

   推到类型，简单的使用

   ```typescript
   type FirstType<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R]
     ? T
     : never;

   type res = FirstType<[1, 2, 3]>; // 此时 res 类型就为 1

   // 当然也可以取最后一个，之前的等等
   type FirstType<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R]
     ? R
     : never;

   // 模式匹配，进行提取
   type myPromise = Promise<7>;
   type getMyPromiseValue<P> = P extends Promise<infer value> ? value : never;
   type p = getMyPromiseValue<myPromise>; // type p = 7
   ```



4. 泛型工具

   1. Partial\<T\> 将类型中的所有属性变为可选的

   2. Record\<T> 通常用来声明普通的对象

   3. Pick\<T> 提取一个类型中的子类型（提取部分属性）

      ```typescript
      interface IAnimal {
          type: string;
          name: string;
          age: string;
      }
      type People = Pick<IAnimal, "name" | "age">;
      interface IPeople extends Pick<IAnimal, "name" | "age"> {}
      // 相当于
      interface IPeople {
          name: string;
          age: string;
      }
      ```



   4. Exclude<T, U>  此工具是在 T 类型中，去除 T 类型和 U 类型的交集，返回剩余的部分。

      一般作用于 联合 类型

      ```typescript
      type T = Exclude<"a" | "b" | "c", "a" | "b">; // 作用于联合类型
      // type Exclude<T, U> = T extends U ? never : T
      // 那么对于上述例子
      type D = Exclude<IPeople, IAnimal>; // D 其实就是 IPeople
      type E = Exclude<IAnimal, IPeople>; // never
      ```

   5. Extract\<T> 与Exclude相反，取交集

   6. Omit\<T, K> 与pick相反，会得到除了传入的 K 之外的键

   7. RetrurnType\<T>

      ```typescript
      type foo = () => string | number;

      type R = ReturnType<foo>; // string | number;
      ```



   8. Required\<T> 与 Partial 相反，是将所有的属性都变成必须属性

   9. Parameters\<T\> 用于提取函数类型的参数类型。

   10. Awaited\<T> 实现取到 Promise 的Value Type的类型

       ```ts
       // type AwaitedRes = number
       type AwaitedRes = Awaited<Promise<Promise<Promise<number>>>>;
       ```

   11. Uppercase\<T> 大写

   12. Lowercase\<T> 小写

   13. Capitalize\<T> 首字母大写

   14. Uncapitalize\<T> 去掉首字母大写

5. 枚举 enum

   最简单的例子

   ```typescript
   enum Boolean {
     YSE,
     NO,
   }
   // 相当于是默认填充的数字下标
   console.log(Boolean.YSE); // 0
   console.log(Boolean.NO); // 1

   // 一般更推荐使用 字符串枚举
   // 日志输出更友好，也有更严格的类型检查
   enum Boolean {
     YSE = "YES",
     NO,
   }


   enum Boolean {
     YSE = 2,
     NO,
   }

   // 那么此时 NO 就会接着上面最近的一个开始
   // Boolean.NO === 2  true
   ```
  同时枚举能够包含计算成员，比如
  ```typescript
  enum Test {
    One,
    Two,
    Three = 'three'.length
    Four // 必须手动赋值
  }
  ```
  但是需要特别注意的是包含了计算成员的下一个成员必须具有初始化的值。

### ts装饰器

特点：

- 装饰器本身就是一个**函数**；
- 装饰器接收的参数是**构造函数**；
- 装饰器通过 `@` 符号来进行使用。

```typescript
function testDecorator1(constructor: any) {
  console.log(constructor);
  console.log("testDecorator1");
}
function testDecorator2(constructor: any) {
  console.log("testDecorator2");
}

@testDecorator1
@testDecorator2
class Test {}

const t1 = new Test();
```



类似nest.js中的写法

```typescript
function generateDecorator(url: string) {
  return function (constructor: any) {
    constructor.prototype.url = url;
  };
}

@generateDecorator("/login")
class Container {}

const t1 = new Container();
console.log((t1 as any).url);
```



标准的写法

```typescript
function testDecorator() {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    return class extends constructor {
      name = 'Tuesday';
      getName() {
        return this.name;
      }
    };
  };
}

const Test = testDecorator()(
  class {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
  }
);

const test = new Test('Monday');
console.log(test.getName()); // Tuesday
```



### ts原理

**型变**

`ts`的作用之一就是给`JavaScript`添加一套类型系统，它可以使得`JavaScript`类型更加安全。比如`number`类型的值只能赋值给`number`类型的值，`Date` 类型的对象就不能调用 `exec` 方法等。

同时在这种类型的限制下，却又不能太死板。比如需要使父类型的值赋值给子类型的变量。

比如说：苹果作为父类，红苹果作为子类。那么，红苹果一定是苹果，苹果也可以是红苹果，但需要判断之类。这种改变称之为**型变**。

一种是**子类型可以赋值给父类型**，叫做**协变（covariant）**

一种是**父类型可以赋值给子类型**，叫做**逆变（contravariant）**

1. 协变

   以红苹果举例

   ```typescript
   interface IApple {
     name: string
   }

   interface IRedApple extends IApple {
     color: 'red'
   }

   const apple2: IRedApple = { name: 'apple1', color: 'red' }
   const apple1: IApple = apple2 // 红苹果一定是苹果
   ```

2. 逆变

   ```typescript
   let printName = (apple: IApple) => {
     console.log(apple.name)
   }

   let printColor = (apple: IRedApple) => {
     console.log(apple.color)
   }

   // 是可以的，因为 printColor 使用 IRedApple 进行约束，但是 printName 只用到了父类型的属性和方法，它仍然是类型安全的。 => 这就是逆变，函数的参数有逆变的性质（而返回值是协变的，也就是子类型可以赋值给父类型）。
   // printColor = printName // √

   // printName 函数声明时候使用的是 IApple 进行约束，但是按照 IRedApple 的方式进行访问，那么就不安全了（存在 IApple 不存在的属性）。
   // 如果需要完成赋值不报错，关闭 strictFunctionTypes 选项（tsconfig.json中），就可以完成双向协变。
   // printName = printColor // ×
   ```

   参数的位置是逆变的，也就是被赋值的函数参数要是赋值的函数参数的子类型。这样理解，**函数中的操作很多，有可能会操作一些父类没有子类自身扩展的属性、方法。如果参数作为作为子类，子类的东西是包含父类的，父类有的东西，子类早已经继承，所以函数里面的操作并不影响。**

   **返回值是协变的，也就是子类型可以赋值给父类型**，而这句话可以再看一个例子

   ```typescript
   type Func = (a: string) => void;

   // 不能将类型“(a: 'hello') => undefined”分配给类型“Func”。
   //  参数“a”和“a” 的类型不兼容。
   //  不能将类型“string”分配给类型“"hello"”
   const func: Func = (a: 'hello') => undefined
   ```

   这里就能体现参数是逆变的，返回值是协变的。`'hello'`类型不是`string`类型的父类，不可以赋值，相反，`'hello'`更是`string`的子类。

   而`undefined`是`void`的子类，可以赋值。



**不变**

逆变和协变都是型变，是针对父子类型而言的，非父子类型自然就不会型变，也就是**不变**。

非父子类型不会发生型变，只要类型不一样都会报错。

**如何判断是否为父子类型？**

在`Java`语言中，常常使用`extends`关键字进行声明，这种叫做`名义类型系统`。同时`ts`可以这样使用来明确父子类型的关系，但也可以不使用`extends`，如下：

```typescript
interface IApple {
  name: string
}

interface IRedApple {
  name: string
  color: 'red'
}
type isExtends = IRedApple extends IApple ? true : false // true！

type f = 'a' | 'b' | 'c'
type s = 'a' | 'b'
type isExtends = s extends f ? true : false // true！
```

这里的两个例子表明，`ts`中的父子类型判断有所不同，它是通过结构来进行判断，看哪一个结构更加**具体**。比如对于第二个例子来说，`f`的类型更宽泛，`s`更具体，`s`就是子类型。



### 一些注意

1. & 的不同之处

   ```typescript
   // 对于复合类型
   type obj1 = {
     name: string;
   };
   type obj2 = {
     age: number;
   };
   type myobj = obj1 & obj2;
   type myobj = {
     name: string;
     age: number;
   }

   // 但如果对其他简单类型
   type key = string | number | symbol;
   type myKey = key & number;
   type myKey = number;
   // 它相当于只保留了相交的类型，排除了其他不相交的类型
   ```

2. extends 的用处

   ```typescript
   // 1. 一般用作接口继承，此处不作演示

   // 2. 用作类似 if else 的三元运算符
   type myPromise = Promise<7>;
   // 如果 P extends Promise，则使用 infer 推导出value的类型并赋值
   // 否则赋类型为 nerver
   type getMyPromiseValue<P> = P extends Promise<infer value> ? value : never;
   type p = getMyPromiseValue<myPromise>; // type p = 7
   type pnever = getMyPromiseValue<7>; // type p = never
   ```

3. any和unknown的区别

   any 和 unknown 都代表任意类型，但是 unknown 只能接收任意类型的值，而 any 除了可以接收任意类型的值，也可以赋值给任意类型（除了 never）。类型体操中经常用 unknown 接受和匹配任何类型，而很少把任何类型赋值给某个类型变量。

4. **type** 和 **interface** 的区别

   按照官网的话说

   > Almost all features of an `interface` are available in `type`, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.

   `type` 通过 & 来进行扩展，而 `interface` 通过继承  `extends`  来进行扩展。

   同时，`interface` 定义的接口会自动合并，而type重复会报错。同时，`interface` 像是对一个对象的约束，约束这个对象只能拥有什么东西，拥有什么动作。

   ```typescript
   // 更像是类型别名
   type myAnimal = 'dog' | 'cat';
   // 使用接口更像是对 myAnimal 这个对象定义了一个规范，约束
   interface myAnimal {
       types: 'dog' | 'cat'
   }
   ```

   建议：定义函数类型时候使用`type`，其他的时候能用`interface` 就用 `interface`，否则再使用`type`

5. ${string} 的用处

   ```typescript
   type StartsWith<
     Str extends string,
     Prefix extends string
   > = Str extends `${Prefix}${string}` ? true : false;
   type sw = StartsWith<"avv", "a">;
   // ${string} 代表字符串，任意字符串，这样就能判断对应的是否是以 prefix 开头
   // 当然如果是 ${number} ，那就都是数字，以此类推
   ```

6. 将_连接的string类型改为小驼峰类型

   ```typescript
   type _str = "str_Str_Str";
   // 这里将用 `` 模板字符串将字符串划分开来，再进行类型的推导。
   type toTuofeng<str extends string> =
     str extends `${infer s1}_${infer s2}${infer s3}`
       ? `${s1}${Uppercase<s2>}${toTuofeng<s3>}`
       : str;

   type str = toTuofeng<_str>;
   ```

7. 联合类型的运算

   会把联合类型的每一个元素单独传入做类型计算，最后合并。

   ```ts
   type union = "a" | "b" | "c";

   type UpperCaseA<Item extends string> = Item extends "a"
     ? Uppercase<Item>
     : Item;
   // 将 union 拆分成三个内容进行分别的运算
   type UpperAUnion = UpperCaseA<union>; // "b" | "c" | "A"
   // 都拆分了计算后再传递，不需要递归
   type str = `${union}~`; // "a~" | "b~" | "c~"
   ```

8. 联合类型的交叉

   ```ts
   // 简单类型中是取交集
   type a = 1 | 2 | 3;
   type b = 3 | 4 | 5;

   // 复杂类型是取并集
   type c = a & b; // 做交叉类型   c = 3
   type d = () => void | {
     a: 1;
   }; // () => void | { a: 1; }
   ```

9. ts中函数重载的方式

   1. 声明多次

      ```typescript
      declare function func(age: number): string;
      declare function func(name: string): string;
      ```



   2. `interface`中声明

      ```typescript
      interface func {
        (name: string): string
        (age: number): string
      }
      ```



   3. 取交叉类型（复杂类型就是合并）

      ```typescript
      type func = ((name: string) => string) & ((age: number) => string)
      ```

