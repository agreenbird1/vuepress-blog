---
title: typescript面试题
author: RoleTang
date: '2022-08-11'
---


1. 为什么要使用typescript？

    1. 保证了类型安全。比如特定的类型才能做对应的事情，对应``boolean``类型的值，就不能做加减法；比如一个对象它的类型没有``name``属性，所以也不能对其进行此属性的读取；包括函数参数的限制、使用方法的限制……
    2. 更好的静态的类型检查（编译时检查），并配合编辑器在开发时候提供提示等。

2. const和readonly的区别？

3. typescript类型系统中的类型？

    包含了JavaScript中的八个基本类型，以及他们的包装类型（Number、String……）

    1. 元组（``Tuple``）：固定元素个数的数组类型。
        ```typescript
        type Tuple = [string, number]
        ```

    2. 接口（``Interface``）：用于描述函数、对象以及构造器的结构
    
    3. 枚举（``Enum``）：一系列值的复合
        ```typescript
        enum Transpiler {
            Babel = 'babel',
            Postcss = 'postcss',
            Terser = 'terser',
            Prettier = 'prettier',
            TypeScriptCompiler = 'tsc'
        }
        const transpiler = Transpiler.TypeScriptCompiler;
        ```

    4. 字面量类型

    5. never：代表不可达。比如 ``type n = 1 & 'a'``，永远没有一个类型是1、'a'的交叉类型。

    6. void：代表空，可以是 undefined 或 never。

    7. any：是任意类型，任何类型都可以赋值给它，它也可以赋值给任何类型（除了 never）。

    8. unknown：是未知类型，任何类型都可以赋值给它，但是它不可以赋值给别的类型。

4. interface和type的区别？

    按照官网的话说

   > Almost all features of an `interface` are available in `type`, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable. 
   翻译总结：能够使用interface定义的，大都能被被type定义。但是接口一直都是可以被扩展的，但type不一定。

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

5. TypeScript 中 any、never、unknown、null & undefined 和 void 有什么区别？

6. typescript中的this？

7. 