---
title: Diff算法
author: RoleTang
date: '2022-09-28'
---

### 为什么需要diff算法？

对于一个容器（比如我们常用的`#app`）而言，它的内容一般有三种情况：

1. 字符串类型，即是文本。
2. 子节点数组，即含有一个或者多个子节点
3. null，即没有子节点

在`vue`中，会将`dom`元素当作`vdom`进行处理，我们的`HTML Attributes、事件绑定`都会现在`vdom`上进行操作处理，最终渲染成真实`dom`。

> Virtual Dom：用于描述真实dom节点的JavaScript对象。

**使用vdom的原因在于，如果每次操作都是直接对真实dom进行操作，那么会造成很大的开销。使用vdom时就能将性能消耗从真实dom操作的级别降低至JavaScript层面，相对而言更加优秀。**一个简单的`vdom`如下：

```js
const vdom = {
    type:"div",
    props:{
        class: "class",
        onClick: () => { console.log("click") }
    },
    children: [] // 简单理解这就是上述三种内容
}
```



对于`vue`节点的**更新**而言，是采用的`vdom`进行比较。

`diff`算法便是用于容器内容的**第二种情况**。当更新前的容器中的内容是一组子节点时，且更新后的内容仍是一组节点。**如果不采用`diff`算法**，那么最简单的操作就是将之前的`dom`全部卸载，再将当前的新节点全部挂载。

但是直接操作dom对象是非常耗费性能的，**所以diff算法的作用就是找出两组vdom节点之间的差异，并尽可能的复用dom节点，使得能用最小的性能消耗完成更新操作。**



接下来说三个diff算法，从简单到复杂循序渐进。



### 简单的Diff算法

#### 为什么需要key？

接下来通过两种情况进行说明为什么需要`key`？

如果存在如下两组新旧节点数组：

```js
const oldChildren = [
    {type: 'p'},
    {type: 'span'},
    {type: 'div'},
]

const newChildren = [
    {type: 'div'},
    {type: 'p'},
    {type: 'span'},
    {type: 'footer'},
]
```

如果我们是进行正常的比较，步骤应该是这样：

找到相对而言较短的一组进行循环对比

- 第一个`p`标签与`div`标签不符，需要先将`p`标签卸载，再将`div`标签挂载。
- 第一个`spam`标签与`p`标签不符，需要先将`span`标签卸载，再将`p`标签挂载。
- 第一个div标签与`span`标签不符，需要先将`div`标签卸载，再将`span`标签挂载。
- 最后多余一个标签`footer`存在在新节点数组中，将其挂载即可。

那么我们发现其中进行了7次`dom`操作，但是命名前三个都是可以复用的，只是位置发生了变化。如果进行复用节点我们需要判断两个节点是相等的，但是现在的已有条件还不能满足。

**所以我们需要引入key，它相当于是虚拟节点的身份证号，只要两个虚拟节点的type和key都相同，我们便认为他们是相等的，可以进行dom的复用。**

这时我们便可以找到复用的元素进行dom的移动，相对而言会比不断的执行节点的挂载卸载要好。

但是，dom的复用不意味不需要更新：

```js
const oldVNode = {type: 'p', children: 'old', key: 1}
const newVNode = {type: 'p', children: 'new', key: 2}
```

上述节点拥有相同的`type`和`key`，我们可以复用，此时进行子节点的更新即可。



#### 简单的diff算法步骤

先用一个例子说明整个流程，再叙述其方法

```js
const oldChildren = [
    {type: 'p', children: 'p', key: 1},
    {type: 'span', children: 'span', key: 2},
    {type: 'div', children: 'div', key: 3},
    {type: 'section', children: 'section', key : 4},
]

const newChildren = [
    {type: 'div', children: 'new div', key: 3},
    {type: 'p', children: 'p', key: 1},
    {type: 'span', children: 'span', key: 2},
    {type: 'footer', children: 'footer', key: 5},
]
```

为了叙述简单，这里使用不同的标签。整个流程如下：

!()[/]

- 从新节点数组开始遍历

- 第一个是div标签，当前的下标是0，之前的下标是2。相对位置并未改变，不需要移动，只需要就行更新节点内容即可。

- 第二个是p标签，当前的下标是1，之前的下标是0。就相对位置而言，p相对于div标签有变化，需要进行移动。移动的位置就是在div标签之后。

- 第三个是span标签，当前的下标是2，之前的下标是1。就相对位置而言，p相对于div标签有变化，需要进行移动。移动的位置就是在p标签之后。

- 第四个标签是footer，遍历旧节点数组发现并无匹配的元素。代表当前的元素是新节点，将其插入，插入的位置是span标签之后。

- 最后一步，遍历旧节点数组，并去新节点数组中查找是否有对应的节点，没有则卸载当前的元素。



**如何找到需要移动的元素？**

上述声明了一个**lastIdx**变量，其初始值为0。**作用是保存在新节点数组中，对于已经遍历了的新节点在旧节点数组的最大的下标。那么对于后续的新节点来说，只要它在旧节点数组中的下标的值小于当前的lastIdx，代表当前的节点相对位置发生了改变，则需要移动，**

举个例子：`div`在旧节点数组中的位置为2，大于当前的`lastIdx`，更新其值为2。对于`span`标签，它的旧节点数组位置为1，其值更小。又因为当前在新节点数组中处于`div`标签之后，就是相对位置发生了变化，便需要移动。

lastIdx需要动态维护。



#### 总结

简单`diff`算法便是拿新节点数组中的节点去旧节点数组中查找，通过`key`来判断是否可以复用。并记录当前的`lastIdx`，以此来判断节点间的相对位置是否发生变化，如果变化，需要进行移动。





### 双端diff算法

简单`diff`算法并不是最优秀的，它是通过双重循环来遍历找到相同`key`的节点。举个例子：

```js
const oldChildren = [
    {type: 'p', children: 'p', key: 1},
    {type: 'span', children: 'span', key: 2},
    {type: 'div', children: 'div', key: 3},
]

const newChildren = [
    {type: 'div', children: 'new div', key: 3},
    {type: 'p', children: 'p', key: 1},
    {type: 'span', children: 'span', key: 2},
]
```

其实不难发现，我们只需要将div标签节点移动即可，**即进行一次移动**。不需要重复移动前两个标签也就是p、span标签。而简单diff算法的比较策略即是从头至尾的循环比较策略，具有一定的缺陷。



> 顾名思义，双端diff算法是一种同时对新旧两组子节点的两个端点进行比较的算法

![](/read/vue/双端1.png)

**那么双端diff算法开始的步骤如下：**

1. 比较 oldStartIdx节点 与 newStartIdx 节点，相同则复用并更新，否则
2. 比较 oldEndIdx节点 与 newEndIdx 节点，相同则复用并更新，否则
3. 比较 oldStartIdx节点 与 newEndIdx 节点，相同则复用并更新，否则
4. 比较 oldEndIdx节点 与 newStartIdx 节点，相同则复用并更新，否则

简单概括：

1. 旧头 === 新头？复用，不需移动
2. 旧尾 === 新尾？复用，不需移动
3. 旧头 === 新尾？复用，需要移动
4. 旧尾 === 新头？复用，需要移动

对于上述例子而言，比较步骤如下：

![](/read/vue/双端diff1.gif)





**上述的情况是一种非常理想的情况，我们可以根据现有的diff算法完全的处理两组节点，因为每一轮的双端比较都会命中其中一种情况使得其可以完成处理。**

但往往会有其他的情况，比如下面这个例子：

```js
const oldChildren = [
    {type: 'p', children: 'p', key: 1},
    {type: 'span', children: 'span', key: 2},
    {type: 'div', children: 'div', key: 3},
    {type: 'ul', children: 'ul', key: 4},
]

const newChildren = [
    {type: 'div', children: 'new div', key: 3},
    {type: 'p', children: 'p', key: 1},
    {type: 'ul', children: 'ul', key: 4},
    {type: 'span', children: 'span', key: 2},
]
```

此时我们会发现，上述的四个步骤都会无法命中任意一步。所以需要额外的步骤进行处理。即是：在四步比较失败后，找到新头节点在旧节点中的位置，并进行移动即可。动图示意如下：

![](/read/vue/双端diff2.gif)



当然还有**删除、增加**等均不满足上述例子的操作，但操作核心一致，这里便不再赘述。

#### 总结

双端diff算法的优势在于对于一些比较特殊的情况能更快的对节点进行处理，也更贴合实际开发。而双端的含义便在于通过两组子节点的头尾分别进行比较并更新。



### 快速diff算法

首先，快速diff算法包含了**预处理步骤**。它借鉴了纯文本diff的思路，这时它为何快的原因之一。

比如：

```js
const text1 = '我是快速diff算法'
const text2 =  '我是双端diff算法'
```

那么就会先从头比较并去除可用元素，其次会重后比较相同元素并复用，那么结果就会如下：

```js
const text1 = '快速'
const text2 = '双端'
```

此时再进行一些其他的比较和处理便会简单很多。

其次，快速diff算法还使用了一种算法来尽可能的复用dom节点，这个便是**最长递增子序列算法**。为什么要用呢？先举个例子：

```js
// oldVNodes
const vnodes1 = [
    {type:'p', children: 'p1', key: 1},
    {type:'div', children: 'div', key: 2},
    {type:'span', children: 'span', key: 3},
    {type:'input', children: 'input', key: 4},
    {type:'a', children: 'a', key: 6}
    {type:'p', children: 'p2', key: 5},
]

// newVNodes
const vnodes2 = [
    {type:'p', children: 'p1', key: 1},
    {type:'span', children: 'span', key: 3},
    {type:'div', children: 'div', key: 2},
    {type:'input', children: 'input', key: 4},
    {type:'p', children: 'p2', key: 5},
]
```

经过预处理步骤之后得到的节点如下：

```js
// oldVNodes
const vnodes1 = [
    {type:'div', children: 'div', key: 2},
    {type:'span', children: 'span', key: 3},
    {type:'input', children: 'input', key: 4},
    {type:'a', children: 'a', key: 6},
]

// newVNodes
const vnodes2 = [
    {type:'span', children: 'span', key: 3},
    {type:'div', children: 'div', key: 2},
    {type:'input', children: 'input', key: 4},
]
```

此时我们需要获得`newVNodes`节点相对应`oldVNodes`节点中的下标位置，我们可以采用一个`source`数组，先循环遍历一次`newVNodes`，得到他们的`key`，再循环遍历一次`oldVNodes`，获取对应的下标关系，如下：

```js
const source = new Array(restArr.length).fill(-1)
// 处理后
source = [1, 2, 0, -1]
```

**注意！这里的下标并不是完全正确！因为这是预处理后的下标，并不是刚开始的对应的下标值。此处仅是方便讲解。**其次，`source`数组的长度是剩余的`newVNodes`的长度，**若在处理完之后它的值仍然是-1则说明当前的key对应的节点在旧节点数组中没有，即是新增的节点。**

此时我们便可以通过`source`求得最长的递增子序列的值为 **[1, 2]**。**对于index为1，2的两个节点来说，他们的相对位置在原oldVNodes中是没有变化的，那么便不需要移动他们**，只需要移动其余的元素。这样便能达到最大复用dom的效果。

#### 步骤

以上述例子来说：

1. 首先进行预处理

   ![](/read/vue/快速diff预处理.gif)

   **注意！预处理过的节点虽然复用，但仍然需要进行更新。**

2. 进行`source`填充

   ![](/read/vue/快速diff2.png)

   当然这里递增子序列 [1, 2] 和 [0, 1]都是可以的。

3. 进行节点移动

   - 用索引i指向新节点数组中的最后一个元素
   - 用索引s指向最长递增子序列中的最后一个元素

   **然后循环进行以下步骤比较**：

   1. source[i] === -1？等于代表新节点，挂载即可。随后移动i
   2. i === 递增数组[s]? **等于代表当前的节点存在在递增子序列中，是复用的节点，当前的节点无需移动。**
   3. 上述均不成立代表需要移动节点。

   ![](/vue/快速diff3.gif)

   4. 节点更新，结束。



#### 总结

核心思路便是进行了类似**文本预处理**的步骤去除头尾重复的节点。其次便是采用了**最长递增子序列**来复用相对位置没有发生变化的节点，这些节点是不需要移动的，便能最快的复用和更新。



### 最后

其实不论是哪一种`diff`算法，它都需要遵循同样的处理规则：

- 判断哪些节点需要移动，以及如何移动。
- 找出那些需要被添加的或者被移除的节点。

本文都是基于**霍春阳**大佬的 **《vuejs设计与实现》** 一书记录的内容，书写的非常好，我这种新手阅读起来都能了解其基本原理。

- [（6K字！）从0实现一个vue3响应系统！](https://juejin.cn/post/7132131702670884901)

-   [vue3的设计思路](https://juejin.cn/post/7126553357581287437)
-   [前端框架设计的核心要素](https://juejin.cn/post/7128012321515503629)
-   [权衡的艺术](https://juejin.cn/post/7129852635515093022)