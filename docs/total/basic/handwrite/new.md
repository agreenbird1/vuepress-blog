---
title: new手写及原理
author: RoleTang
date: '2022-07-25'
---


1. new操作符实现了什么

   1. 会将new.target指向构造函数(es6+)
   2. 创建了一个全新的对象。
   3. 这个对象会被执行`[[Prototype]]`（也就是`__proto__`）链接。
   4. 生成的新对象会绑定到函数调用的`this`，**也就是将新的对象当作构造函数的this进行执行以此进行this绑定！**
   5. 如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。

   ```JavaScript
   function newOperator(ctor){
       if(typeof ctor !== 'function'){
         throw 'newOperator function the first param must be a function';
       }
       // ES6 new.target 是指向构造函数
       newOperator.target = ctor;
       // 1.创建一个全新的对象，
       // 2.并且执行[[Prototype]]链接
       // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
       var newObj = Object.create(ctor.prototype);
       // ES5 arguments转成数组 当然也可以用ES6 [...arguments], Aarry.from(arguments);
       // 除去ctor构造函数的其余参数
       var argsArr = [].slice.call(arguments, 1);
       // 3.生成的新对象会绑定到函数调用的`this`。
       // 获取到ctor函数返回结果
       var ctorReturnResult = ctor.apply(newObj, argsArr);
       // 小结4 中这些类型中合并起来只有Object和Function两种类型 typeof null 也是'object'所以要不等于null，排除null
       var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
       var isFunction = typeof ctorReturnResult === 'function';
       if(isObject || isFunction){
           return ctorReturnResult;
       }
       // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。
       return newObj;
   }
   ```

2.