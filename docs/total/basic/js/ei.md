---
title: javascript基础
author: RoleTang
date: '2022-08-16'
---

1. 深入理解微任务、事件循环

   [深入：微任务与Javascript运行时环境 - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)

2. 事件绑定的几种方式和区别

   1. `dom上直接绑定`：多次绑定只执行第一个
   2. `onclick绑定`：多次绑定只执行最后一个

   3. `addEventListener绑定`：绑定多次都会执行，同时是w3c标准指定的，但在ie8及以下不支持，使用attachEvent（后绑定先执行）兼容。

3. 扩展运算符实现原理？（MDN 展开语法）

   扩展运算符一般都是执行的浅拷贝。

   `对象的使用`：相当于浅拷贝可枚举属性。将其划分为`key-value`的形式

   ```js
   const a = { a: 1, b: 2 }
   for (const iterator of a) {
    console.log(iterator)
   }
   console.log({ ...a })
   ```

   `数组等`：浅拷贝值即可。

   注意：在数组或函数参数中使用展开语法时, 该语法只能用于 可迭代对象。例如：[...[1,2,3]] ✔。[...{a:1,b:2}]❌

4. 剩余参数

   看起来语法和展开语法完全相同。但展开运算符用于解构数组和对象。而剩余参数更像是将多个元素收集到数组中。

   一般用于函数形参接收。如果最后一个参数是以 ``...`` 开头，则最后一个形参为剩余参数。

5. 剩余参数和arguments对象的区别

   - 剩余参数只包含那些没有对应形参的实参，而 `arguments` 对象包含了传给函数的所有实参。
   - `arguments`对象不是一个真正的数组，而剩余参数是真正的 `Array`实例，也就是说你能够在它上面直接使用所有的数组方法，比如 `sort`，`map`，`forEach`或`pop`。
   - `arguments`对象还有一些附加的属性 。

6. 执行上下文（后被称作词法环境）

   三种情况：
   1. 全局上下文是为运行代码主体而创建的执行上下文，也就是说它是为那些存在于 JavaScript 函数之外的任何代码而创建的。
   2. 每个函数会在执行的时候创建自己的执行上下文。这个上下文就是通常说的 “本地上下文”。
   3. 使用 eval() 函数也会创建一个新的执行上下文。

   每一个上下文在本质上都是一种作用域层级。

   函数的上下文决定了他们可以访问到哪些数据，以及他们的行为。每个上下文都有一个关联的变量对象（VO），而这个上下文中定义的所有函数和变量都会保存在这个VO上。

   全局上下文是最外层的上下文，浏览器中是`window`对象，而`nodejs`中是`global`，因此，通过`var`定义的变量都会保存在`window`上。

   函数在执行的时候会创建一个自己的执行上下文，同时包含三个属性

   1. `[[scopes]]`：作用域链，下一个属性为包含当前函数的上下文，以此类推，直到全局
   2. `this`
   3. VO对象（最初只有一个`arguments`属性）



   理应说上下文在执行完毕后其内容都将被销毁。

7. 常用事件：鼠标事件、拖拽事件

   `焦点事件`

   1. `focus`：元素获得焦点（**不会冒泡**）
   2. `blur`：元素失去焦点（**不会冒泡**）

   `表单事件`

   1. `reset`：点击重置按钮时触发（button中type=reset）
   2. `submit`：提交表单时触发

   `视图事件`：

   1. `resize`：文档视图调整大小，一般作用于window上
   2. `scroll`：文档滚动时

   `键盘事件`：

   1. `keydown`：按下任意按键
   2. `keyup`：释放任意按键
   3. `keypress`：除`shift`、`fn`、`capslock`的键被按住时连续触发

   `鼠标事件`：

   1. `click`：在元素上按下并释放任意鼠标按键。
   2. `contextmenu`：右键点击（在右键菜单显示之前触发）
   3. `dbclick`：在元素上双击鼠标
   4. `mousedown`：在元素上按下任意鼠标按键
   5. `mouseup`：在元素上释放任意鼠标按键
   6. `mouseenter`：指针移入某一元素
   7. `mouseleave`：指针移出某一元素（**不冒泡**）
   8. `mousemove`：指针在元素内移动时持续触发
   9. `mouseout`：指针移出元素，或者移到它的子元素上
   10. `mouseover`：指针移到有事件监听的元素或者它的子元素内
   11. `wheel`：滚轮事件

   `拖拽事件`：

   1. `drag`：正在移动元素或者文本选区
   2. `dragstart`：用户开始拖动HTML元素或选中的文本
   3. `dragenter`：被拖动的元素或文本选区移入有效释放目标区
   4. `dragleave`：被拖动的元素或文本选区移出有效释放目标区
   5. `dragover`：被拖动的元素或文本选区正在有效释放目标上被拖动
   6. `dragend`：拖放操作结束
   7. `drop`：元素在有效释放目标区上释放

8. 如何将一个数组随机打乱?

   `Math.random`生成的数字基于0-1

   ```js
   [1, 2, 3, 4].sort((x, y) => Math.random() - 0.5);
   ```

9. 如何实现一个LRUCache？

   https://leetcode.cn/problems/lru-cache/

   LRU：最近最少使用

   利用map的特性

   当依次添加进入map时候是顺序进入map的

   所以便可以以次记录使用的先后

   当使用了一个之前的值之后，将其删除再重新添加进入map

   达到LRU的效果

10. JSON.stringify

    对其中的 `undefined`，`function` 将在 `JSON.stringify` 时会忽略掉，而不会管这个函数中是否有真正的值。

    但是如果`getter`的有具体的返回值，则会使用返回值

    ```js
    const obj = {
      a: 3,
      b: 4,
      c: null,
      d: undefined,
      get e() {
          return 666
      },
      f () { }
    };
    JSON.stringify(obj)
    {"a":3,"b":4,"c":null,"e":666}
    ```

11. js内存管理

    `栈`：存放普通数据类型

    `堆`：存放复杂类型（引用？）

    `池`：存放常量，又叫常量池

12. async/await关键字的好处（为什么要使用）

    为什么有（好处?）：`async`和`await`关键字让我们可以用一种更简洁的方式写出基于`Promise`的异步行为，而无需刻意地链式调用`promise`

    是对promise的一种简化，可以将promise当作同步任务进行处理（await关键字会使得当前async函数暂停，直到promise的异步结果返回），也更简单，同时省去链式调用。

    `注意`：async声明的函数默认返回一个promise对象

13. 为什么Promise.prototype.catch可以捕获前面出现的所有错误？

    如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调`onRejected`；

    它的执行代码其实更类似与在try catch中执行的，遇见错误会向后抛出，

    Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。

14. 实现类的私有变量

    使用symbol定义变量

    尽管每次都可以创建Symbol('a')，但其实不是同一个

15. 数据结构

    ![image-20220314162839915](/js/数据结构.png)

16. 事件委托

    事件委托通常为过多事件处理程序的解决方案。

    事件委托利用事件冒泡，可以只使用一个事件处理程序达到管理多个同一类型的事件的效果。

    比如一个ul元素绑定一个点击事件。其所有子元素li就可以点击向上冒泡。绑定一个id或者其他标识，或者使用target比较.

    包括click，mouseover和mouseout等事件。

17. 暂时性死区

    当程序的控制流程在新的作用域（module function 或 block 作用域）进行实例化时，在此作用域中用let/const声明的变量会先在作用域中被创建出来，但因此时还未进行词法绑定，所以是不能被访问的，如果访问就会抛出错误。因此，在这运行流程进入作用域创建变量，到变量可以被访问之间的这一段时间，就称之为暂时死区。

    当在两个作用域当中，使用let关键字定义了一个变量，若是在声明之前进行访问便会报错。因为let的存在形成了一个封闭的作用域相当于

    ```javascript
    var a = 1
    function foo() {
    	console.log(a) //Cannot access 'a' before initialization
    	let a = 2
    }
    ```

18. js事件

    - 事件流

      事件流分为三个阶段：`事件捕获`、`到达目标`、`事件冒泡`。

    - 事件处理程序onclick，addeventlistener、removeeventlistener等

    - 事件对象通常是绑定事件的元素，也是目标元素

    - 事件类型包括很多：鼠标事件、输入事件、滚轮事件、键盘事件等

    事件模型

    1. DOM0级模型： ，这种模型不会传播，所以没有事件流的概念，但是现在有的浏览器支持以冒泡的方式实现，它可以在网页中直接定义监听函数，也可以通过 js属性来指定监听函数。这种方式是所有浏览器都兼容的。
    2. IE 事件模型： 在该事件模型中，一次事件共有两个过程，事件处理阶段，和事件冒泡阶段。事件处理阶段会首先执行目标元素绑定的监听事件。然后是事件冒泡阶段，冒泡指的是事件从目标元素冒泡到 document，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。这种模型通过 attachEvent 来添加监听函数，可以添加多个监听函数，会按顺序依次执行。
    3. DOM2 级事件模型： 在该事件模型中，一次事件共有三个过程，第一个过程是事件捕获阶段。捕获指的是事件从 document 一直向下传播到目标元素，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。后面两个阶段和 IE 事件模型的两个阶段相同。这种事件模型，事件绑定的函数是 addEventListener，其中第三个参数可以指定事件是否在捕获阶段执行。

19. MutationObserver （异步）

    https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver

    MutationObserver 接口提供了监视对DOM树所做更改的能力,它也是一个构造器，接受一个 callback 参数，用来处理节点变化的回调函数，callback 接收两个参数：

    - mutations：节点变化记录列表`（sequence）`
    - observer：构造 MutationObserver 对象。

    MutationObserver 对象实例有三个方法，分别如下：

    - observe：设置观察目标，接受两个参数，target：观察目标，options：通过对象成员来设置观察选项
    - disconnect：阻止观察者观察任何改变
    - takeRecords：清空记录队列并返回里面的内容

    observe 方法中 options 参数有已下几个选项：

    attributes：设置 true，表示观察目标属性的改变

    subtree：设置为 true，目标以及目标的后代改变都会观察

20. ??=、 ?.、  &&=、  ||=

    ??=(逻辑空赋值): 只有赋值左边为null和undefined时候才生效

    ?. : 可选链操作符号。允许读取位于连接对象链深处的属性的值，而不必明确验证链中的每个引用是否有效。可以为null和undefined，此时该表达式短路返回值是 `undefined`。

    &&=(逻辑与赋值):只有左边为真才会返回右边的结果，否则返回左边的结果

    ||=(逻辑或赋值):若左边为真，返回左边的结果，否则返回右边的结果。仅当左边为`falsy`值（认定转换为false）的时候赋值。

21. 模块化、工程化

    模块是能够单独命名并独立地完成一定功能的程序语句的**集合**，通过模块化我们能够更好的

    1. 对代码进行抽象
    2. 代码封装
    3. 代码复用
    4. 代码管理

    `你不知道的JavaScript`：模块有两个主要特征：（1）为创建内部作用域而调用了一个包装函数；（2）包装函数的返回 值必须至少包括一个对内部函数的引用，这样就会创建涵盖整个包装函数内部作用域的 闭包

    常用的模块化：

    - CommonJS

      Nodejs是其主要实践者，提供了四个环境变量（模块内的全局变量，而并非node环境下的全局变量）。`module（一个对象，包含exports、id等）`、`exports`、`require`。实际使用时，用`module.exports`定义当前模块对外输出的接口。**且其是同步的**。它并不适用于浏览器（browserify），因为同步加载情况下会阻塞js代码的同步执行。

    - ESM（ES6 Module）

      ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块解决方案。其模块功能主要由两个命令构成：`export（导出的不是一个对象，是一个引用列表）`和`import`。`export`命令用于规定模块的对外接口，`import`命令用于输入其他模块提供的功能。同时可以使用`import()（promise）`函数动态导入模块内容。**且其是异步的**

      `加载过程`：

    - 两者的区别

      2.  CommonJS 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成（**运行时加载**）。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成（**编译时加载**）。
      3.  Commonjs导出的是一个对象，是module.exports。而esm导出的是变量的引用（引用列表，使用的module environment record，实施的是动态绑定，绑定引用）

22. Object.defineProperty

    `Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象

    `Object.defineProperty(obj, prop, descriptor)`

    谈一谈descriptor

    - configurable // 通用

      当且仅当该属性的 `configurable` 键值为 `true` 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
      默认为 `false`。

    - enumerable // 通用

      当且仅当该属性的 `enumerable` 键值为 `true` 时，该属性才会出现在对象的枚举属性中。
      默认为 `false`。

    - value // 属性描述符

      该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。
      默认为`undefined`。

    - writable // 属性描述符

      当且仅当该属性的 `writable` 键值为 `true` 时，属性的值，也就是上面的 `value`，才能被改变。默认为 `false`。

    - getter  // 存取描述符

    - setter  // 存取描述符

     存取描述符和属性描述符不能共存

23. typeof

    能够快速区分基本数据类型，但是不能够区分null、array和object

    ```javascript
    typeof null === 'object'
    typeof new Array === 'object'
    typeof new Object === 'object'
    ```

24. es6 - es12 新语法。

    需要了解能够说出一部分特性。

    [基础很好？总结了38个ES6-ES12的开发技巧，倒要看看你能拿几分？🐶 - 掘金 (juejin.cn)](https://juejin.cn/post/6995334897065787422)

25. 常见的排序算法

    `快速排序`：每次拿第一个作为基准点

    `快速排序的思想`：其实是冒泡排序的一种改进方法。通常是选定第一个记录作为基准，并使用交换的方法将所有的记录分成两部分，大于的排后面，小于的排前面。那么当前基准点便找准了位置。然后循环一直到只有基准点为止。

    相比于冒泡排序，是比较相邻的元素，比较和移动的次数都更多。

    `冒泡排序`：改进的冒泡排序，可以设置一个变量记录最后一次交换的位置（即是后面的不需要再比较）

    `选择排序`：每次遍历一次将最大的值放在最前面或者最后面

    | 算法     | 时间复杂度 | 空间复杂度 | 稳定性 |
    | -------- | ---------- | ---------- | ------ |
    | 快速排序 | O(nlog n)  | O(nlog n)  | 不稳定 |
    | 冒泡排序 | O(n²)      | O(1)       | 稳定   |
    | 选择排序 | O(n²)      | O(1)       | 稳定   |
    | 堆排序   | O(nlog n)  | O(1)       | 不稳定 |
    | 归并排序 | O(nlog n)  | O(1)       | 稳定   |

26. 如何判断一个单链表是否有环

    1. 利用map存储每次遍历过的节点，每次判断即可

    2. 利用快慢指针，快指针一次走两步，慢指针一次走一步。因为两个节点就能成环。刚好满足。
    3. 利用JSON.stringify()不能化有循环引用的值的特性。

27. getComputedStyle

    `getComputedStyle`会获取当前元素所有最终使用的CSS属性值，`window.getComputedStyle`等价于`document.defaultView.getComputedStyle`调用,

28. DOMContentLoaded和onLoad

    DOMContentLoaded是仅当dom加载完成

    onLoad是等待所有资源完成，包括图片

29. Object.create()

    创建一个没有原型的对象

    **`Object.create()`**方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

30. 介绍下 Set、Map、WeakSet 和 WeakMap 的区别？

    set

    1. 成员不能重复；
    2. 只有键值，没有键名，有点类似数组；
    3. 可以遍历，方法有add、delete、has

    weakset

    1. 成员都是对象（弱引用）；
    2. 成员都是弱引用，随时可以消失（不计入垃圾回收机制）。可以用来保存 DOM 节点，不容易造成内存泄露；
    3. 不能遍历，方法有add、delete、has；

    map

    1. 本质上是键值对的集合，类似集合,键值都可以是任意类型(包括null，undefined)；
    2. 可以使用forEach遍历；
    3. 有delete、keys、entries、has、get、set等方法

    weakmap

    1. 只接收对象为键名（null 除外），不接受其他类型的值作为键名；
    2. 键名指向的对象，不计入垃圾回收机制；
    3. 不能遍历，方法同get、set、has、delete  size；

31. 数组去重的方式

    [【前端工程师面试宝典】学习说明_互联网校招面试真题面经汇总_牛客网 (nowcoder.com)](https://www.nowcoder.com/tutorial/96/24304825a0c04ea9a53cdb09cb664834)

    1. 双重for循环,splice
    2. set
    3. 利用sort+ 遍历
    4. for+includes方法（新建一个数组，查看是否包含·）
    5. filter+indexOf
    6. for+Map

32. for of 和 for in 的区别

    - for of：**for...of**语句在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句

    - for in：**`for...in`语句**以任意顺序遍历一个对象的除[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)以外的[可枚举](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)属性，包括继承的可枚举属性。（MDN给出的说法是更适合用于调试）



33. with 语句块

    可以改变上下文

    如下：`console`对象被注入到了`with`语句块中，便可直接使用（像是window一样）

    ```javascript
    with (console) {
      log('I dont need the "console." part anymore!');
    }
    ```

34. obj.res 和 obj[res]和obj['res']的区别

    .a 语法通 常被称为“属性访问”，["a"] 语法通常被称为“键访问”。

    区别：

    - obj.res不可读取数字
    - obj[res]可以使用变量读取
    - obj['res']可以动态访问（es6语法：计算属性名），拼接字符串obj['r' + 'e' + 's']

35. 如 果 你 想 禁 止 一 个 对 象 添 加 新 属 性 并 且 保 留 已 有 属 性， 可 以 使 用 Object.prevent  Extensions(..)：

    ```javascript
    var myObject = {  a:2  };
    Object.preventExtensions( myObject );
    myObject.b = 3;
    myObject.b; // undefined
    ```

     在非严格模式下，创建属性 b 会静默失败。在严格模式下，将会抛出 TypeError 错误。

36. 常用的数组方法???     ====>>>> 尽量记住参数

    | 方法     | 是否改变原数组 | 是否返回新数组           |
    | -------- | -------------- | ------------------------ |
    | concat   | 否             | 是                       |
    | every    | 否             | 否（布尔，全部通过）     |
    | some     | 否             | 否（布尔，至少一个通过） |
    | entries  | 否             | 否（可迭代对象）         |
    | fill     | 是             | 否                       |
    | find     | 否             | 否                       |
    | forEach  | 否             | 否                       |
    | filter   | 否             | 是                       |
    | includes | 否             | 否                       |
    | indexof  | 否             | 否                       |
    | join     | 是             | 否（字符串）             |
    | keys     | 否             | 否（可迭代对象）         |
    | map      | 否             | 是                       |
    | pop      | 是             | 否（删除的元素）         |
    | push     | 是             | 否（新长度）             |
    | reduce   | 否             | 否（返回值）             |
    | reverse  | 是             | 否（原数组）             |
    | sort     | 是             | 否（原数组）             |
    | shift    | 是             | 否（删除元素的）         |
    | slice    | 否             | 是                       |
    | splice   | 是             | 否（原数组）             |
    | unshift  | 是             | 否（新长度）             |





37. 介绍一下原型链，从构造函数到原型，再到原型链，盗用构造函数，原型式继承，寄生式继承

    [【前端工程师面试宝典】学习说明_互联网校招面试真题面经汇总_牛客网 (nowcoder.com)](https://www.nowcoder.com/tutorial/96/1678a0fd35cd4db486af18589e34e4d4)

    1. 原型链继承

       将子类的原型链指向父类的对象实例

       `Chile.prototype = new Parent();`

       缺点：多个子类公用父类实例，不能向父级构造函数传参，且一个变化其余的都会变化。

    2. 构造函数继承

       使用apply方法在子类中调用父类并绑定自身this，可以共有父类属性

       `Parent.call(this, name, id);`

       缺点： 不能使用父类原型的方法，构造函数不可复用

    3. 组合式继承

       前两个结合在一起

       缺点：会执行两次父类的构造函数，消耗较大内存，子类的构造函数会代替原型上的那个父类构造函数

    4. 原型式继承

       ```javascript
       var parent = {
         names: ['a']
       }
       function copy(object) {
         function F() {}
         F.prototype = object;
         return new F();
       }
       var child = copy(parent);

       ```

    5. 寄生式继承

    原理：二次封装原型式继承，并拓展

      ```javascript
       function createObject(obj) {
        var o = copy(obj);
        o.getNames = function() {
          console.log(this.names);
          return this.names;
        }
        return o;
      }

       ```
    优点：可添加新的属性和方法

    6. 寄生组合式继承

      将组合继承中的盗用原型链的方法改为原型式继承

       ```javascript
       function copy(object) {
         function F() {}
         F.prototype = object;
         return new F();
       }

       function inheritPrototype(subClass, superClass) {
         // 复制一份父类的原型
         var p = copy(superClass.prototype);
         // 修正构造函数
         p.constructor = subClass;
         // 设置子类原型
         subClass.prototype = p;
       }

       function Parent(name, id){
         this.id = id;
         this.name = name;
         this.list = ['a'];
         this.printName = function(){
           console.log(this.name);
         }
       }
       Parent.prototype.sayName = function(){
         console.log(this.name);
       };
       function Child(name, id){
        Parent.call(this, name, id);
         // Parent.apply(this, arguments);
       }
       inheritPrototype(Child, Parent);

       ```

38. == 和 === 的区别

`==`在比较时候会进行`隐式转换`，然后再比较

`隐式转换详解`：

- 如果两个操作数都是对象，则仅当两个操作数都引用同一个对象时才返回`true`。
- 如果一个操作数是`null`，另一个操作数是`undefined`，则返回`true`。
- 如果两个操作数是不同类型的，就会尝试在比较之前将它们转换为相同类型：
  - 当**数字与字符串**进行比较时，会尝试将字符串转换为数字值。
  - 如果操作数之一是**Boolean**，则将布尔操作数转换为1或0。
    - 如果是`true`，则转换为`1`。
    - 如果是 `false`，则转换为`0`。
  - 如果操作数之一**是对象**，另一个是数字或字符串，会尝试使用对象的`valueOf()`和`toString()`方法将对象转换为原始值。
- 如果操作数具有相同的类型，则将它们进行如下比较：
  - `String`：`true`仅当两个操作数具有相同顺序的相同字符时才返回。
  - `Number`：`true`仅当两个操作数具有相同的值时才返回。`+0`并被`-0`视为相同的值。如果任一操作数为`NaN`，则返回`false`。
  - `Boolean`：`true`仅当操作数为两个`true`或两个`false`时才返回`true`。

`===`是严格比较，包括类型和值，即不会进行隐式转换。

39. map和对象的区别

    1. map可以使用任意值为键，对象只可以使用字符串和symbol作键
    2. map是一个可迭代对象，而对象不是
    3. 使用方法的区别，map使用set、clear、has等方法，拥有size等属性。

40. 为什么`typeof NaN === 'number'`

`NaN`：not a number

就是计算机科学中数值数据类型的一类型值。

如何得到NaN

    1. 以NaN为操作数
    2. 0/0的除法
    3. 负数的平方根



41. Object.prototype.toSring.call()

    能够精准区分数据类型

42. 异步编程

    `同步编程`:顺序执行代码或者处理器指令

    `异步编程`:js是单线程的,同步执行时后面的代码需要等待前面的代码执行.而异步编程则是指前面的任务执行不会阻塞后面代码的执行.

    早期是通过回调函数来实现的,往往会造成回调地狱的后果,且难以编码.后面便出现了期约,和Promise规范,以及es6的promise API.

43. 什么是事件循环？

    首先了解一个概念

    JavaScript运行时：在执行 JavaScript 代码的时候，JavaScript 运行时实际上维护了一组用于执行 JavaScript 代码的 **代理**。每个代理由一组执行上下文的集合、执行上下文栈、主线程、一组可能创建用于执行 worker 的额外的线程集合、一个任务队列以及一个微任务队列构成。除了主线程（某些浏览器在多个代理之间共享的主线程）之外，其它组成部分对该代理都是唯一的。

    ​	而这些代理是由**事件循环**驱动的。`事件循环`负责收集用事件（包括用户事件以及其他非用户事件等）、对任务进行排队以便在合适的时候执行回调。然后它执行所有处于等待中的 JavaScript 任务（宏任务），然后是微任务，然后在开始下一次循环之前执行一些必要的渲染和绘制操作。

    ​	首先，JavaScript是单线程，这意味着在任何时候js只能执行同步任务。

    ​	当js执行异步任务的时候，会将异步任务丢给webAPIs,当webAPIs执行完异步任务的时候再让js线程执行回调。这时候便要说事件队列了，当webAPIs完成任务后再将你的回调函数放入事件队列，它其实也是由浏览器维护的。当主线程即是你的脚本被js引擎执行完成后，便将事件队列头部的事件加入执行。

    ​	但是事件队列又有细分，即是**宏任务**队列以及**微任务**队列。并且每次执行宏任务之前都会清空微任务队列中的任务。

    ​	微任务队列包括了`promise`的`catch`，`then`，`finally`方法，以及一个特殊的方法，`queueMicrotask(foo)`，foo函数就会被放入微任务队列中，还包括了`html5`的一个`mutationobserver`方法。

    ​	宏任务队列一般接触的就是两个定时函数，`setTimeout`和`setInterval`，当然还有dom事件。

    ​	总的来说，事件循环就是在执行主程序和队列中的事件之间反复横跳，其中这两者之间优先执行主程序任务，再执行事件队列中的任务；而执行事件队列中的任务时候又优先执行微任务队列中的任务。

    - eventLoop 是由JS的宿主环境（浏览器）来实现的；
    - 事件循环可以简单的描述为以下四个步骤:
      1. 函数入栈，当Stack中执行到异步任务的时候，就将他丢给Web APIs（浏览器操作接口BOM,DOM）,接着执行同步任务,直到Stack为空；
      2. 此期间WebAPIs完成这个事件，把回调函数放入队列中等待执行（微任务放到微任务队列，宏任务放到宏任务队列）
      3. 执行栈为空时，Event Loop把微任务队列执行清空；
      4. 微任务队列清空后，进入宏任务队列，取队列的第一项任务放入Stack中执行，执行完成后，查看微任务队列是否有任务，有的话，清空微任务队列。重复4，继续从宏任务中取任务执行，执行完成之后，继续清空微任务，如此反复循环，直至清空所有的任务。

44. target和currentTarget的区别

    target是触发事件的元素

    currentTarget是绑定事件的元素

45. var && let && const

    1. var定义的变量，`没有块的概念，可以跨块访问`, 不能跨函数访问。
       let定义的变量，只能在块作用域里访问，不能跨块访问，也不能跨函数访问。
       const用来定义常量，使用时必须初始化(即必须赋值)，只能在块作用域里访问，且不能修改。

    2. var可以`先使用，后声明`，因为存在变量提升；let必须先声明后使用。

    3. var是允许在相同作用域内`重复声明同一个变量`的，而let与const不允许这一现象。

    4. 在全局上下文中，基于let声明的全局变量和全局对象GO（window）没有任何关系 ;
       var声明的变量会和GO有映射关系；

    5. ` 会产生暂时性死区`

       `{  me = 'li'    `

       ​		`let me }`

46. JS的垃圾回收机制

    `浏览器的Javascript具有自动垃圾回收机制(GC:Garbage Collecation)，垃圾收集器会定期（周期性）找出那些不在继续使用的变量，然后释放其内存。`

    `可达性`：“可达”值是那些以某种方式可访问或可用的值。它们一定是存储在内存中的。

    `引用计数算法`：就是记录该对象被引用的次数，引用次数为0，则代表该对象可以被清除。

    `标记清除算法：mark-and-sweep`

    从根部``<global>``开始遍历并标记所有的引用，所有被标记到的对象都会被记住，以免重复遍历。没有被标记到的对象即会被清除。

    js引擎所做的优化：

    - **分代收集（Generational collection）**—— 对象被分成两组：`新生代` 和 `老生代`。新生代空间通常较小，老生代空间更大，存储经历过垃圾收集算法还存在的数据。

      `新生代(Scavenge算法)`：又分为两个区域：`使用区（from）`和`空闲区（to）`，新的数据来了先会被放入使用区，当使用区快被写满时候，会进行一次垃圾收集工作。此时将使用区的活动对象（可达）进行标记，并直接复制到空闲区。则使用区和空闲区便进行校色互换。当一个对象在进行多次使用区和空闲区的互换之后仍然存在的话，便会将其移入老生代。

      移入条件：

      - 对象是否经历过一次`Scavenge`算法
      - `To`空间的内存占比是否已经超过`25%`

      `老生代`：便是使用的`标记清除算法`和`标记整理算法`（每次清理之后会将活动对象移动到老生代的一端，减少碎片）。

      `好处`：对于小的数据，进行清除会更加快速。也不需要每次对较大内存的数据进行遍历。



    - **增量收集（Incremental collection）**

      `全停顿`：js单线程，当进行GC的时候，若是需要清除的垃圾太大太多，会造成卡顿的现象（阻塞js脚本的执行）。

      `辅助线程`：主线程执行GC时候开启辅助线程帮助GC，6 = 1 x 6

      6 = 3 x 2；更快，但终究会造成全停顿。

      根据全停顿，尽管开启了辅助线程，但仍然会卡顿。所以

      `增量收集`：收集 - js脚本 - 收集 - js脚本 ------

      一次收集一部分，可以减少卡顿。

      那么如何判断哪些被标记过，哪些还未被遍历呢？

      `三色表记法`：

      - 白色指的是未被标记的对象
      - 灰色指自身被标记，成员变量（该对象的引用对象）未被标记
      - 黑色指自身和成员变量皆被标记

      刚开始所有为`白色`，从根对象开始遍历，被遍历到的对象变为`灰色`，自身属性被遍历完了便成为`黑色`。

      但如果，遍历了之后又改变了引用关系呢（即是从非垃圾变成了垃圾）？这个不用担心，下一轮GC它便会被清理

      那如果此时有一个黑色对象将一个白色对象引用了呢？

      `强三色不变性`：即一旦有黑色对象引用白色对象，该机制会强制将引用的白色对象改为灰色，从而保证下一次增量 `GC` 标记阶段可以正确标记



    - **闲时收集（Idle-time collection）**—— 垃圾收集器只会在 CPU 空闲时尝试运行，以减少可能对代码执行的影响。

47. JS内存泄漏

    常见的内存泄漏

    - 闭包
    - 隐式的全局变量（调用全局函数中对this进行了属性添加）
    - dom引用（清除一个节点，清楚完后需置空）
    - 定时器
    - 事件监听器等。
    - console.log()函数也有可能造成内存泄漏

48. 作用域和作用域链

    `作用域`:作用域就是一个**独立的区域**，讲得具体点就是在我们的程序中定义变量的一个独立区域，它决定了当前执行代码对变量的访问权限

    `MDN`：当前的执行上下文。值和表达式在其中 "可见" 或可被访问到的上下文。

    js属于静态（词法）作用域，即是函数在创建的时候就已经确定了其作用域。比如函数内部就是一个作用域，它在`被创建`的时候其内部的`[[scopes]]:[上级执行上下文]`。当此函数被执行的时候会创建属于自己的执行上下文并压入[[scope]]的头部。

    `作用域链`:就是变量查找的规则，会从`[[scopes]]`：从头开始一直找到根（GO），这样的查找过程形成的链条就是作用域链。

49. 闭包(Closure)

    `闭包`是指有权访问另一个函数作用域中的变量的函数，通常是在函数嵌套中实现的--《JavaScript高级程序设计》
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

    `你不知道的JavaScript`：当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域之外执行，这时 就产生了闭包。

    `极客时间`：根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。

    **其实**在定时器、事件监听器、 Ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步（或者同步）任务中，只要使 用了回调函数，实际上就是在使用闭包！

    `形成条件`：

    1. 函数的嵌套
    2. 内部函数引用外部函数的局部变量，延长外部函数的变量生命周期

    `个人理解`：函数创建的时候便会形成自己的作用域，且内部会创建一个作用域链[[scopes]]的属性，在函数创建之初，其会引用它的上级作用域。并形成一个指向。尽管外层的函数在执行完毕后本应该被释放，但因为有内层函数的引用，所以不会被释放。

    `两大作用`：

    - 保护：划分一个独立的代码执行区域，在这个区域中有自己私有变量存储的空间，保护自己的私有变量不受外界干扰（操作自己的私有变量和外界没有关系）；
    - 保存：如果当前上下文不被释放【只要上下文中的某个东西被外部占用即可】，则存储的这些私有变量也不会被释放，可以供其下级上下文中调取使用，相当于把一些值保存起来了；

    `副作用`：导致内存泄露

    **举例**：

    ```js
    function foo() {
        var myName = " 极客时间 "
        let test1 = 1
        const test2 = 2
        var innerBar = {
            setName:function(newName){
                myName = newName
            },
            getName:function(){
                console.log(test1)
                return myName
            }
        }
        return innerBar
    }
    var bar = foo()
    bar.setName(" 极客邦 ")
    bar.getName()
    console.log(bar.getName())
    ```

    当执行这段代码的时候，你应该有过这样的分析：由于变量 myName、test1、test2 都是原始类型数据，所以在执行 foo 函数的时候，它们会被压入到调用栈中；当 foo 函数执行结束之后，调用栈中 foo 函数的执行上下文会被销毁，其内部变量 myName、test1、test2 也应该一同被销毁。

    要解释这个现象，我们就得站在内存模型的角度来分析这段代码的执行流程。

    - 当 JavaScript 引擎执行到 foo 函数时，首先会编译，并创建一个空执行上下文。
    - 在编译过程中，遇到内部函数 setName，JavaScript 引擎还要对内部函数做一次快速的词法扫描，发现该内部函数引用了 foo - 函数中的 myName 变量，由于是内部函数引用了外部函数的变量，所以 JavaScript 引擎判断这是一个闭包，于是在堆空间创建换一个“closure(foo)”的对象（这是一个内部对象，JavaScript 是无法访问的），用来保存 myName 变量。
    - 接着继续扫描到 getName 方法时，发现该函数内部还引用变量 test1，于是 JavaScript 引擎又将 test1 添加到“closure(foo)”对象中。这时候堆中的“closure(foo)”对象中就包含了 myName 和 test1 两个变量了。
    - 由于 test2 并没有被内部函数引用，所以 test2 依然保存在调用栈中、



50. JS中的this

    this其实是指向的当前代码运行时所处的上下文环境。

    `默认绑定`：非严格模式下指向`window`，严格模式下为`undefined`

    `隐式绑定`：谁调用，this指向谁。注意`隐式绑定丢失问题`，函数作为回调，或者新的指向时。

    ```javascript
        var a = 'go'
        function foo() {
            console.log(this.a) // go
        }

        function foo1(fn) {
            var a = 'foo1'
            fn()
        }

        foo1(foo)
    ```

    `显示绑定`：使用call、bind、apply方法

    `new`：this绑定在new创建的对象上

    `箭头函数`：箭头函数没有自己的this，会指向自己最近的所处的上下文。-

    - **箭头函数中的`this`继承于它外面第一个不是箭头函数的函数的`this`指向**。
    - **箭头函数的 this 一旦绑定了上下文，就不会被任何代码改变**。

51. 箭头函数

    特点：

    1. 写法特点，不需要使用function关键字
    2. 当没有参数的时候直接写一个小括号即可
    3. 只有一个参数的时候小括号都可以省略
    4. 只有一个返回值的时候可以省略大括号，并省去return关键字

    与普通函数的区别：

    1. 箭头函数不存在prototype原型。
    2. 不能使用new 关键字，即是没有构造函数
    3. 没有自己的this，使用的this是离自己最近的非箭头函数的this
    4. 没有arguments对象
    5. 不能作generator

52. 原型和原型链

    js的面向对象系统是被设计为基于原型设计模式的。

    那么对于原型模式来说，一般遵循四个要求：

    1. 所有的数据都是对象（当然js中的基本数据类型并不全是对象）
    2. 得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它
    3. 对象会记住它的原型
    4. 如果对象无法响应某个请求，它会将这个请求委托给自己的原型。

    所以这里不得不提js的构造函数。

    所有的构造函数在创建的时候都会绑定一个`prototype`原型对象,同时`prototype`原型对象的`constructor`属性也会指向构造函数。

    对于一个构造函数来说,可以有实例属性和静态属性。

    实例属性通过this绑定,且只有其实例拥有

    静态属性通过构造函数直接绑定.当然后来可以通过static关键字来绑定.

    那么原型的作用,就是提供了一个环境可以绑定一些公用的方法属性,使得所有的实例都能够访问,且只需要定义一次,因为实例的隐式原型\_\_proto\_\_也是指向构造函数的原型的,同时当实例查找对应的实例属性和方法的时候,当找不到的时候便会去原型对象上查找,依次类推,直到null.

    ![image-20220303154538148](/js/原型链.png)

    **当你试图得到一个对象的某个属性时会触发 原型[[Get]] 操作**，如果这个对象本身没有这个属性，那么它会去它的隐式原型 `__proto__`（也就是它的构造函数的显式原型 `prototype`）中寻找：

53. 可迭代对象（Iterable Object）和生成器（generator）

    Iterable Object有一个名为 `Symbol.iterator` 的方法（一个专门用于使对象可迭代的内建 symbol）,此方法必须返回一个 **迭代器（iterator）** —— 一个有 `next` 方法的对象,而next()方法返回的对象的格式必须为{value:someVal,done:Boolean}的格式。

    generator使用如下,相当于可以控制函数的执行.

    ```javascript
    function* generateSequence() {
      yield 1;
      const val = yield 2; // val = 3
      return 3;
    }

    let generator = generateSequence();
    let one = generator.next(3); // one即是返回值是 {value:1,done:false}
    //generator.next()可以传递参数进行获取
    ```

54. async/await，使用generator和promise实现

55. async函数面试题

    ```javascript
    async function async1() {
      console.log('async1 start')
      await async2()
      // await后的代码相当于是加入了微任务队列
      console.log('async1 end')
    }
    async function async2() {
      console.log('async2')
    }

    console.log('script start')

    new Promise((resolve, reject) => {
      resolve('promise')
    }).then((res) => console.log(res))

    async1()

    // script start
    // async1 start
    // async2
    // promise
    // async1 end
    ```

56. 块作用域

   块是指被大括号("{}")包裹住的相关联的statements的集合

   比如if语句、for循环语句

57. for in 、传统 for 循环、forEach 有什么区别

   传统for循环就是根据数组的下标对元素进行一个获取

   for in 循环就是迭代对象的`可枚举`属性，包括原型链上的

   for of循环在可迭代对象上迭代

   forEach是数组、map等使元素依次执行依次回调函数，且不可使用continue、break等关键字（使用了则直接报错）

58. super

super关键字将单独出现，并且必须在使用this关键字之前使用

59. web worker

简单使用

`worker`中没有`window`对象，取而代之的`self`对象。说明不能直接操作`dom`节点，也不能使用`window`对象的默认方法和属性。

同时创建worker者可以使用`terminate`方法关闭worker

或者worker本身使用close方法进行自关闭

```javascript
// 创建一个worker
// 指定一个脚本文件执行worker线程
const worker = new Worker('./21_worker.js')
setTimeout(() => {
    worker.postMessage('hello my worker')
    worker.terminate() // 创建者关闭
}, 2000)


// worker.js
onmessage = function(e){
  console.log('got some info, ' + e.data)
}
close() // 自关闭
```

60. setTimeout和setInterval

这两个方法的最小调用间隔时间是4ms。所以最小延时是4ms。

再加之其是加入宏任务队列，可能会产生误差

61. js为什么是单线程的以及其好处

因为js的主要用途是与用户进行一些简单的交互、以及操作Dom。但是如果使用多线程的话，可能会造成复杂的同步问题。比如`多个线程同时操作同一个dom的情况`等复杂的问题。

好处：

- 单线程就一个线程在玩，省去了线程间切换的开销
- 还有线程同步的问题，线程冲突的问题的也不需要担心

62. let声明的变量存储在哪里？

存储在一个块级作用域中，并未挂载在Window上
![image](/js/let作用域.png)

63. 浏览器不同标签页面通信？同源、跨域情况下？

同源：

- Broadcast Channel

  ```javascript
  // 在两个页面同时声明同一个channel
  const bc = new BroadcastChannel('tqt')
  // 分别发送和监听事件即可
  bc.postmessage('hello i am tqt')
  //另一个页面
  bc.onmessage = e => { console.log(e.data) } // e.data:hello i am tqt
  ```

- postmessage

  通过window.open打开的窗口可以拿到被打开窗口的window对象。然后可以通过window上的postmessage方法传递消息。

  被打开的窗口可以通过onmessage接收消息，并接收到对方的window对象。

  此时就可以互相发送消息。

非同源：

- iframe ：使用一个用户不可见的 iframe 作为“桥”。

64. jsonp详解

`JSONP`为民间提出的一种跨域解决方案，通过客户端的script标签发出的请求方式。

因为同源策略的限制，当客户端向服务器端请求数据后，服务器也会返回数据。但是浏览器在接收到数据之后会检查是否同源，不是会丢弃掉。

但是`jsonp`通过`script`标签，通过标签发出的请求不会被检查。

步骤

    1. 客户端首先声明一个接收数据的全局函数
    2. 客户端解析到外联的`script`标签，发送请求
    3. 服务器收到请求，返回函数的调用
    4. 客户端收到数据，执行回调获得数据

jsonp是一个同步请求，不存在同源检查，且只支持get请求。

65. 同源策略的意义

是一个重要的安全策略，它用于限制一个`origin`的文档或者它加载的脚本如i何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。如果没有同源策略，任意的脚本都可能与其他的网站交互，获取到其他网站的信息（document.cookie等）或者是修改其他网站的dom结构（比如输入框的结构），是非常危险的。

维基百科上最重要的一点便是  cookie 信息，因为现在的 web 应用广泛使用 cookie 存储用户的信息、校验信息等。

比如：如果iframe能够跨域。嵌套一个iframe指向一个银行网站，如果没有跨域。那么用户的访问和操作，除了域名，其他的部分没有任何区别，用户的安全也得不到保证。

66. 箭头函数中的this为什么这么设计？

就是为了直接能够获得外部函数的this。而不需要写

类似这样的代码  ``_self = this``

67. symbol（如何叙述？功能？）

   es7新增，是基本的数据类型

   表示一个唯一的标识符，即使我们创建了具有相同描述的symbol，它们的值也是不同的。

   同时它可以用作对象的键，它是不可以被迭代到的。

68. class 中的extends继承

   底层仍然是寄生组合式继承

69. null和undefined的区别

首先，null和undefined都是js的基本数据类型。

null是一个字面量，它代表当前变量未指向任何值，可以理解为尚未创建的对象。

undefined是一个全局对象的属性，指当前变量还未定义

怎么区分？

使用`typeof`区分

`Object.prototype.toString.call()`


