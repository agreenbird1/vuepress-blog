---
title: typescript基础
author: RoleTang
date: '2022-08-17'
---


1. 为什么要使用typescript？

    1. 保证了类型安全。比如特定的类型才能做对应的事情，对应``boolean``类型的值，就不能做加减法；比如一个对象它的类型没有``name``属性，所以也不能对其进行此属性的读取；包括函数参数的限制、使用方法的限制……
    2. 更好的静态的类型检查（编译时检查），并配合编辑器在开发时候提供提示等。

2. const和readonly的区别？
    `const`可以防止对应的值被更改，但对象的属性中的值还可以更改，因为const像是一个地址的引用。`readonly`可以防止对象的属性被更改。

3. typescript类型系统中的类型？

    包含了JavaScript中的八个基本类型，以及他们的包装类型（Number、String……）

    1. 元组（``Tuple``）：固定元素个数的数组类型。
        ```typescript
        type Tuple = [string, number]
        ```

    2. 接口（``Interface``）：用于描述函数、对象以及构造器的结构
    
    3. 枚举（````）：一系列值的复合
        ```typescript
         Transpiler {
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


5. typescript中的this？

    和js中的this特点一致，包括箭头函数的特点。但是需要在配置中进行开启，否则会一直报错。

6. interface如何给数组做声明？
    ```typescript
    // Array 声明
    interface NumberArray { 
        [index: number]: number; 
    } 
    ```

7. 联合类型(|)的特点？

    代表当前声明的值可以是传入的声明中的几个类型中的其中一个类型。
    
8. 交叉类型(&)的特点？
    
    对于复合类型，其内容会包含在一起。而对于简单类型，就是取的相同的重合的交叉类型。

9. `const` 枚举和普通枚举的区别？

    它会在编译阶段被删除，并且不能包含计算成员。

10. declare，declare global是什么？

    declare 是用来定义全局变量、全局函数、全局命名空间、js modules、class等

    declare global 为全局对象 window 增加新的属性

    ```typescript
    declare global { 
        interface Window { 
            csrf: string; 
        }
    }
    ```

11. 类中成员的 public、private、protected、readonly 修饰符的理解？

    - public: 成员都默认为public，被此限定符修饰的成员是可以被外部访问；
    - private: 被此限定符修饰的成员是只可以被类的内部访问；
    - protected: 被此限定符修饰的成员是只可以被类的内部以及类的子类访问;
    - readonly: 关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

12. const断言

    1. 对象字面量的属性，获得readonly的属性，成为只读属性

    2. 数组字面量成为readonly tuple只读元组

    3. 字面量类型不能被扩展（比如从hello类型到string类型）

    ```typescript
    let val = "hello" as const; // 此时 val 的类型为 "hello"
    val = "hi" // 会报错，类型不一致
    
    // 但是实际上
    let val1 = "hello" // 此时 val1 的类型是 string

    // type '"hello"'
    let x = "hello" as const
    // type 'readonly [10, 20]'
    let y = [10, 20] as const
    // type '{ readonly text: "hello" }'
    let z = { text: "hello" } as const
    ```
