---
title: 第四章 响应系统的作用与实现
author: RoleTang
date: '2022-09-17'
---

## 副作用函数

> 能产生副作用的函数就是副作用函数。

何为副作用？在我理解，就是会可能对其他的除了自身以外的数据造成变化的的函数。比如修改了全局变量，修改了引用的参数（比如对象的属性）等等。与之对应的概念还要**纯函数**，大家可以看一下。

[纯函数是什么？ - SegmentFault 思否](https://segmentfault.com/a/1190000039330123)

举个例子：

```javascript
let val = 1

function effect () {
    val = 2 // 修改不属于自身的作用域的变量。
}
```

因为`val`是一个全局的变量，它可能在多处被使用。而`effect`函数中对它的值进行了更改，在某些情况下就可能就会发生一些意料之外的事情。

## 响应式的数据

根据上述的副作用函数的概念，我们看这样的例子：

```javascript
const obj = {
    val: 1
}

function effect1 () {
    document.body.innerText = obj.val
}

function effect2 () {
    console.log(obj.val)
}
```

副作用函数`effect1`中使用到了`obj.val`的值，如果我们能做到当`obj.val`的值发生变化的时候重新执行`effect1`函数，那么我们就可以说`obj`对象是一个**响应式的数据**。

当前面临的问题是：

- 如何知道`effect`中使用了`obj`对象的值？
- 如何在`obj`对象值改变时使得`effect`函数重新执行？

我们看上述`effect2`函数，仅是在函数中进行了`log`的操作，你觉得它有可能产生副作用吗？答案是肯定的！但在此例中还不可行。我们可以稍加变化一下：

```javascript
const obj = {
    val: 1
}

const proxyObj = new Proxy(obj, {
  get: function (target, property, receiver) {
  	// 读取前的其他操作！
    return target[property]
  },
})

function effect2 () {
    console.log(proxyObj.val)
}
```

没错！就是使用`Proxy`进行代理，此时我们便可以拦截对象的读取操作。

### Proxy

> **Proxy** 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

上述中提到过两个问题，在引入`proxy`代理之后都可以解决。

- `effect`副作用函数若使用了`obj`对象的值，会**触发其读取操作**。
- 当`obj`对象的值发生改变的时候，会**触发其设置操作**。

`proxy`在《vue.js设计与实现》一书的第五章有非常详细的讲解，这里便不过多展开。我们只需要知道它能够代理一个对象，并拦截对该对象的基本操作。没有接触过的朋友可以先看看[这里](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。

接下来我们看看如何具体实现。

## 响应式系统的基本实现

现在，我们可以梳理一下大致的脉络：**当有副作用函数使用了响应式的数据，我们需要将当前的副作用函数收集起来；当响应式的数据发生改变之后，我们又需要将副作用函数进行取出并重新执行。**

![](C:\Users\86176\Desktop\roleTang\web\PCweb\frames\vue\vue_projects\vuepress-blog\docs\.vuepress\public\read\vue\响应式系统.png)

梳理完流程之后，我们又面临了以下几个问题：

- 如何将当前的副作用函数进行收集？
- 如何设计收集副作用函数的容器？

我们可以将副作用函数`effect`改造一下：

```javascript
let activeEffect // 通过一个全局变量保存当前的副作用函数
function effect (fn) {
    activeEffect = fn
    fn()
}
```

此时我们可以用其对副作用函数进行注册，即使它是一个匿名函数。

那如何**设计我们的容器**呢？

### 容器设计

首先我们知道，当前我们的响应式数据的结构就是对象。**而一个响应式系统也可以有多个响应式的对象，一个对象可以有多个属性，一个对应的属性可以有多个副作用函数**。比如：

```javascript
const obj1 = {
    obj1A: 1,
    obj1B: 2
}
function effect1 () {
    console.log(obj1.obj1A)
}
function effect2 () {
    console.log(obj1.obj1A)
}
// obj2………………
```

即是：

```javascript
obj1
 |___obj1A
	   |___effect1
	   |___effect2
 |___obj1B
	   |___effect3
	   |___effect4
-------------------
obj2
 |___obj2A
	   |___effect5
	   |___effect6
 |___obj2B
	   |___effect7
	   |___effect8
…………
```

那顺着上述内容我们反向思考

- 存储副作用函数：可以使用数组，`Set`集合
- 存储键-数组/`Set`集合：可以使用对象、`map`
- 存储对象-对象/`map`：可以使用`map`、`weakMap`

那最终vuejs选择使用`weakMap`、`map`、`Set`三个数据结构当作容器。

`weakMap`的特点是：

1. 只能是以对象作为键
2. 对值是弱引用，也就是不会对GC造成影响
3. 不能循环遍历

那么最主要的原因还是第二点，它不会对垃圾回收造成影响。

综合来说：

```javascript
WeakMap
   |___key: obj1 ___value: Map
    						|___key:obj1A ___value: Set   						 		|___key:obj1B ___value: Set
                                                             	|___key: obj2 ___value: Map                                           				  |___key:obj2A ___value: Set
							|___key:obj2B ___value: Set

```

### 实现

接下来我们试着实现一个基本的响应式系统：

```javascript
let activeEffect // 保存当前的副作用函数
let bucket = new WeakMap() // 最大的容器，桶

// 副作用函数收集、注册
function effect(fn) {
  activeEffect = fn // 收集
  fn()
}

// get 拦截。追踪副作用函数，收集到 bucket 中
function track(target, key) {
  // 没有 activeEffect ，说明当前并不是副作用函数的执行
  if (!activeEffect) return
  // 取出当前对象所在的 map 对象
  let depsMap = bucket.get(target)
  // 如果不存在就新建一个 map 对象并设置到 bucket 中
  if (!depsMap) bucket.set(target, (depsMap = new Map()))
  // 取出当前 key 对应的副作用函数集合
  let deps = depsMap.get(key)
  if(!deps) depsMap.set(key, (deps = new Set()))
  // 收集副作用函数
  deps.add(activeEffect)
}

// set 拦截。触发变化，取出副作用函数执行
function trigger(target, key) {
  const depsMap = bucket.get(target)
  // 不存在说明并未收集
  if (!depsMap) return
  const deps = depsMap.get(key)
  // 执行
  deps && deps.forEach(effect => effect())
}
```

那么，我们来试一下是否做到了响应式

```javascript
const target = {
  a: 1
}

// 目前只需拦截读、写操作
const obj = new Proxy(target, {
  get(target, key) {
    // 收集当前的副作用函数，如果它存在的话
    track(target, key)
    // 返回值
    return target[key]
  },
  set(target, key, newVal) {
    // 设置值
    target[key] = newVal
    // 取出它对应的 Set 进行副作用函数的执行
    trigger(target, key)
  },
})

// 注册副作用函数
effect(() => {
  console.log(obj.a)
})
obj.a = 2

// 结果
// 1
// 2
```

可能有朋友看见上面的代码，就在想如果每一次作响应式的对象都要这样自己追踪触发岂不是很麻烦？那我们可以简单的封装一下：

```JavaScript
function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      // 收集当前的副作用函数，如果它存在的话
      track(target, key)
      // 返回值
      return target[key]
    },
    set(target, key, newVal) {
      // 设置值
      target[key] = newVal
      // 取出它对应的 Set 进行副作用函数的执行
      trigger(target, key)
    },
  })
}

const obj = reactive(target)
// 其他代码……
```

是的，这其实就具有我们在vuejs3中常使用的`reactive`简单的雏形了。当然，《vue.js设计与实现》后续会更详细的介绍，这里也不再多说。但后续代码中都会用到，因为这样会更简洁。

一个完善的响应系统需要处理很多的特殊情况，接下来介绍。

### 分支切换与CleanUp

何为**分支切换**？书中给出的例子如下：

```javascript
const obj = {
  ok: true,
  text: "text"
}
const proxyObj = reactive(obj)
effect(() => {
  document.body.innerText = proxyObj.ok ? proxyObj.text : 'not'
})
```

当`proxyObj.ok`的值发生变化之后，`document.body.innerText`也会随之改变。自我理解感觉就是一个`if`语句，不同的条件会有不同的分支和代码的执行。

那么分支切换会带来什么问题呢？

因为`proxyObj.text`作为响应式对象中的属性，它也会将副作用函数进行了收集。如果执行 `proxyObj.ok = false;`代码，且它的值不再改变，意味着`document.body.innerText`的值将一直都是`'not'`。而在这之前，我们已经将`proxyObj.text`的副作用函数收集了，尽管以后我们都可能很难用到它。这就产生了**遗留的副作用函数**。

如何解决呢？

我们可以改造一下`effect`和`track`函数：

```javascript
function effect (fn) {
  function effectFn () {
    // 新增：删除之前存在的依赖，后续会重新收集（因为会执行fn函数）
    // 这里便能将之前遗留的副作用函数清除掉
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  // 将包含了当前副作用函数的 Set 集合存入，方便后续删除
  effectFn.deps = []
  effectFn()
}

function cleanup (effectFn) {
  // 循环遍历拿到所有包含了effectFn的Set deps
  for(let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
   	// 删除收集的关系
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

function track(target, key) {
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) bucket.set(target, (depsMap = new Map()))
  let deps = depsMap.get(key)
  if(!deps) depsMap.set(key, (deps = new Set()))
  deps.add(activeEffect)
  // 将收集了当前副作用函数的 Set 集合加入到依赖
  activeEffect.deps.push(deps)
}
```

通过在副作用函数上添加一个数组来保存包含了自己的Set集合，在后续的跟踪时候都先清除掉之前的依赖关系，再重新建立当前的依赖关系。这样来保证能够清除之前的遗留的副作用函数。

好了，到此为止我们便解决了副作用函数遗留的问题。

### 无限执行

上面我们解决了副作用函数遗留的问题，那么我们尝试运行它，又会出现无限执行的问题。因为在`trigger`函数中，我们会去执行收集的依赖函数，也就是

```javascript
deps && deps.forEach(effect => effect())
```

参照上述修改了之后的`effect`函数，我们不难发现，我们会去调用`clean`方法将对应的`effect`函数清除。但是后续又会因为重新执行`effect`函数触发了`get`拦截将其重新收集了起来，而此时上面的`forEach`循环仍然在遍历并且执行`effect`函数，所以导致了无限执行。

具体的原因书中提到：**在调用forEach循环遍历Set集合的时候，如果一个值之前已经被访问过并被删除，但又被重新添加到集合的话，如果此时循环并未结束，那么该值又会被重新访问。**

我们可以去MDN上[Set.prototype.forEach()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set/forEach)找到它的规范。这个规定在[ECMAScript® 2023 Language Specification (tc39.es)](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.foreach)，原文是：

![](C:\Users\86176\Desktop\roleTang\web\PCweb\frames\vue\vue_projects\vuepress-blog\docs\.vuepress\public\read\vue\setForEach.png)

所以我们需要修改`trigger`函数如下：

```javascript
function trigger(target, key) {
  const depsMap = bucket.get(target)
  // 不存在说明并未收集
  if (!depsMap) return
  const deps = depsMap.get(key)
  // 执行
  // deps && deps.forEach(effect => effect()) 删除
  const depsToRun = new Set(deps) // 新增
  depsToRun.forEach(effect => effect()) // 新增
}
```

也就是在执行副作用函数时重新建立一个`Set`来进行执行操作，避免之前的问题。

### 嵌套的effect和effect栈

有这样的情况：

```javascript
const target = {
  a: 'a',
  b: 'b',
}

// 目前只需拦截读、写操作
const obj = reactive(target)

// effect 中嵌套 effect
effect(() => {
  effect(() => {
    console.log('b:', obj.b)
  })
  console.log('a:', obj.a)
})
obj.a = 2 // 注意这里

// 输出结果
// b: b
// a: a
// b: b
```

看结果的第三个输出，我们在在最后的地方修改了`obj.a`的值，按理来说我们执行的副作用函数应该会执行A，也就是所属于它的`effect`函数，但其实执行的只是B。

```javascript
// A
() => {
  effect(() => {
    console.log('b:', obj.b)
  })
  console.log('a:', obj.a)
}

// B
() => {
   console.log('b:', obj.b)
}
```

很好理解，因为前文中我们使用的是一个`activeEffect`变量保存的当前的`effect`函数。在上述代码中，我们执行到`effect A`时，`activeEffect`的值为`effect A`；但又会执行`effect B`，此时`activeEffect`的值也随之改变成`effect B`。当我们后续再去读取`obj.a`的时候，它的`effect`函数收集而来的对应也是`effect B`了。

此时我们可以用**栈**来解决这一问题。栈的特性便是后进先出，对于上述的`effect`函数，便是如此。执行外层的时候将`effect A`放入栈中，执行内存时再将`effect B`放入栈中。后续的`effect A`便是需要先被收集的，而`effect B`则在后面。这也保证了对应的执行顺序。

![](C:\Users\86176\Desktop\roleTang\web\PCweb\frames\vue\vue_projects\vuepress-blog\docs\.vuepress\public\read\vue\effect栈.png)

这时我们便需要将响应系统的代码进行修改：

```javascript
let effectStack = [] // 新增

// 副作用函数收集、注册
function effect(fn) {
  function effectFn() {
    // 新增：删除之前存在的依赖，后续会重新收集（因为会执行fn函数）
    // 这里便能将之前遗留的副作用函数清除掉
    cleanup(effectFn)
    // 执行之前添加 新增
    activeEffect = effectFn
    effectStack.push(activeEffect)
    fn()
    // 之后移除  新增
    effectStack.pop()
    activeEffect = effectStack.at(-1) // 等于当前最上层的 effect
  }
  // 将包含了当前副作用函数的 Set 集合存入，方便后续删除
  effectFn.deps = []
  effectFn()
}
```

至此，便解决了嵌套`effect`的问题。再执行之前的代码便能正确运行。



### 无限递归循环

试看下面一段代码：

```javascript
const obj = reactive({
  a: 1
})
effect(() => {
  obj.a = obj.a + 1
})
```

我们简述一下上述副作用代码收集的流程

1. 读取`obj.a`，触发`get`拦截并收集当前的`effect`函数。
2. `obj.a`又被赋值，触发`set`拦截并重新执行`effect`函数，而此时上一次的`effect`函数还未完全执行完成。
3. 回到第1步

这样下来，我们便陷入了一个**无限递归循环执行**的流程中，最终导致栈溢出（RangeError: Maximum call stack size exceeded）。

不难发现，我们当前在`trigger`函数中执行的依赖和我们正在执行的`activeEffect`依赖是同一个依赖，所以我们只需要判断当前的执行的`effect`副作用函数是否和`activeEffect`为同一个函数，是则跳过。更改`trigger`函数：

```javascript
function trigger(target, key) {
  const depsMap = bucket.get(target)
  // 不存在说明并未收集
  if (!depsMap) return
  const deps = depsMap.get(key)
  // 执行
  // deps && deps.forEach(effect => effect()) 删除
  const depsToRun = new Set() // 更改
  deps.forEach((effect) => {
   	// 不为当前的activeEffect副作用函数才可执行
    effect !== activeEffect && depsToRun.add(effect)
  })
  depsToRun.forEach(effect => effect()) // 新增
}
```

这样便解决了当前的问题。

### 调度执行

回看一下我们写到现在的响应系统，一套流程明显已经固定。此时我们并不能掌控副作用函数的执行的时机，执行的次数。因为在设置拦截之后，它便会自动执行。所以我们需要副作用函数的执行具有**可调度性**。

书中举例说：

```javascript
const obj = reactive({
  a: 1,
})
effect(() => {
  console.log(obj.a)
})
obj.a++
console.log("执行完毕！")

// 结果
// 1
// 2
// 执行完毕！
```

那如果我希望得到的结果是这样呢？

```javascript
// 结果
// 1
// 执行完毕！
// 2
```

可能朋友们想到两种方式。

- 直接调换代码的执行顺序
- 将副作用函数异步调用，或者加入宏/微任务队列中

第一种显然不可取，我们可以改造一下副作用函数，传递多一个参数进去，进行配置：

```javascript
effect(() => {
  console.log(obj.a)
},
// options
{
  // 调度器，控制副作用函数执行的时机
  scheduler (fn) {
    // ...
  }
})

// 第二个配置选项
function effect(fn, options = {}) {
  function effectFn() {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(activeEffect)
    fn()
    effectStack.pop()
    activeEffect = effectStack.at(-1)
  }
  // 新增，保存配置选项到副作用函数上
  effectFn.options = options
  effectFn.deps = []
  effectFn()
}
```

同时，我们需要在`trigger`函数中根据`effectFn.options`来判断控制其执行时机：

```javascript
function trigger(target, key) {
  const depsMap = bucket.get(target)
  // 不存在说明并未收集
  if (!depsMap) return
  const deps = depsMap.get(key)
  const depsToRun = new Set()
  deps.forEach((effect) => {
    effect !== activeEffect && depsToRun.add(effect)
  })
  depsToRun.forEach((effect) => {
    // 新增
    // 如果当前的副作用函数上存在了调度器，则将其传递进入调度器，调度器决定它的执行时机
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    }
    else effect()
  }) // 新增
}
```

再次执行便可以得到我们想要的结果。

那么再看下面这种情况：

```javascript
const obj = reactive({
  a: 1,
})
effect(() => {
  console.log(obj.a)
})
obj.a++
obj.a++

// 结果
// 1
// 2
// 3
```

根据代码来看，我们两次执行了`obj.a++`，得到的结果并无问题。但其实我们知道    	2	只是一个过渡的状态，最终会变成 3 ，那么我们只需要在它的值成为3的时候执行一次副作用函数即可。特别是如果自增的次数成千上万，副作用函数都一直执行的话，会带来很大的不必要的开销。那如何解决呢？

我们分析一下，当前的`obj.a++`执行了两次，但其实我们只需要达成两个条件:

- 知晓当前是`obj.a`的变化，并保存它的副作用函数
- 在最后一次执行完毕后再执行一次它的副作用函数

第一点已经达成，所以我们只需要完成第二点。

```javascript
// 任务队列，利用 Set 去重
const jobQueue = new Set()
// 用微任务配合标志变量来跳过过渡
const p = Promise.resolve()
let isFlushing = false

function flushJob() {
  // 当前任务队列正在刷新，则什么都不做
  if (isFlushing) return
  isFlushing = true
  p.then(() => {
    // 将副作用函数的执行放入微任务队列种执行
    jobQueue.forEach((job) => job())
  }).finally(() => {
    // 执行完毕之后重置标志
    isFlushing = false
  })
}

// 同时更改effect中的scheduler
effect(
  () => {
    console.log(obj.a)
  },
  {
    // 通过任务队列来执行副作用函数
    scheduler(fn) {
      jobQueue.add(fn)
      flushJob()
    },
  }
)
```

此时我们再执行当前的代码便能跳过过渡阶段的副作用函数的执行了。

我的理解就是：**对于`obj.a++`这一步骤来说，它是同步执行的。不论它有两次还是成千上万次，都会在当前一个时机内全部执行完毕。那么在第一次执行时，我们通过`jobQueue`来保存了对应的副作用函数，得益于Set的自动去重机制，`jobQueue`中一直都只会有一个与之对应的副作用函数，而不论你`obj.a++`执行了多少次。同时利用`Promise`将队列的副作用函数放入微任务队列中执行，并利用`isFulshing`作为标志在后续的`flushJob`函数执行时进行判断。最终在同步代码执行完毕后，再去循环执行异步任务中的任务也就是`jobQueue`中的副作用函数，便达到了跳过中间的过渡并实现响应式的效果了。**

那么这里需要注意的是：**`jobQueue`中一直都只会有一个与之对应的副作用函数**。并不是指`jobQueue`中只有一个副作用函数，而是对于同一个副作用函数只会存在一次并执行一次。

比如：

```javascript
effect(
  () => {
    console.log(obj.a)
  },
  {
    scheduler(fn) {
      jobQueue.add(fn)
      flushJob()
    },
  }
)
obj.a++
obj.a++
effect(
  () => {
    console.log(obj.b)
  },
  {
    scheduler(fn) {
      jobQueue.add(fn)
      flushJob()
    },
  }
)
obj.b++
obj.b++

// 结果
// 1
// 1
// 3
// 3
```

这里便是对于obj.a和obj.b两个属性来说有它们分别的两个副作用函数再`jobQueue`中。

## 计算属性Couputed

接下来讲的是vuejs中一个非常重要的且非常有特色的功能——计算属性。

现在我们的`effect`函数是立即执行的。意思是，只要我们传递一个副作用函数，马上就会执行，比如：

```js
const data = reactive({ a: 1, b: 2 })

effect(() => {
  console.log(data.a) // 立即执行
})
```

在之前我们有一个`options`参数，可以对`effect`的执行做一些修改，比如懒执行——**lazy**。

当传递了`lazy`属性之后呢，不需要立即执行副作用函数，而是让他在我们需要它执行的时候执行，比如将`effect`函数修改一下：

```js
function effect(fn, options = {}) {
  // …… 省略
  // 新增！computed 设置
  if (!options.lazy) {
    effectFn()
  }
  // 新增！将包装后的副作用函数返回
  return effectFn
}
```

此时我们便可以拿到包装后的副作用函数！

此时我们可以传递一个`getter`给`effect`函数，后续的结果在我们需要的时候再进行执行并得到。

```js
const obj = reactive({a: 1, b: 2})
const effectFn = effect(() => obj.a + obj.b,{ lazy: true })
const realVal = effectFn() // 需要时候手动执行
```



但此时我们还得不到`realVal`的值，因为对于effect函数来说，副作用函数fn的结果并未保存，也无法得到。稍加改变：

```js
function effect(fn, options = {}) {
  function effectFn() {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(activeEffect)
    // 新增！将真正的结果保存
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack.at(-1) // 等于当前最上层的 effect
    // 新增！需要时返回
    return res
  }
  // …… 省略
}
```

接着我们可以尝试封装一个**computed**函数：

```js
const computed = (getter) => {
  // 传递 lazy 时候，不直接执行 effectFn，将其拿到
  const effectFn = effect(getter, {
    lazy: true,
  })
  // 通过包装一个对象，返回对应的值，用到的时候才会执行
  const obj = {
    get value() {
      return effectFn()
    },
  }
  return obj
}
```

那么此时再尝试一下，已经可以输出正确的值了：

```js
const obj = reactive({a: 1, b: 2})
const val = computed(() => obj.a + obj.b)
console.log(val)
```



但是现在还有一些问题。如果我们不停的去读取val，都会触发`computed`内部的`getter`，以至于每一次都会执行一次`effectFn`函数，这时很没有必要的。

那么对于`computed`的计算属性的值来说，**只要相关的响应式变量没有发生改变，就不需要重新去执行effectFn函数的**。将其修改一下：

```js
const computed = (getter) => {
  // 新增！分别存储值以及当前的 getter 依赖的响应式的变量是否有被修改
  let val,dirty = true
  const effectFn = effect(getter, {
    lazy: true,
    // 通过 scheduler 来修改 dirty
    scheduler() {
      dirty = true
    },
  })
  const obj = {
    get value() {
      // 新增！只有依赖的响应式的变量有被修改才重新执行计算，否则使用缓存
      if (dirty) {
        val = effectFn()
        dirty = false
      }
      return val
    },
  }
  return obj
}
```



我们分别使用了两个变量`val、dirty`来保存副作用函数返回的值以及标志依赖的响应式变量的值是否有被更改。并且使用`scheduler`调度器，在计算属性的依赖的响应式变量被修改的时候进行执行。以此达到**缓存**的效果。



## watch



所谓`watch`，**其本质就是观测一个数据，当数据发生变化的时候通知并执行相应的回调函数。**实际上，它就是使用了`effect`函数并配合`options.scheduler`进行自定义的执行。如：

```js
const obj = reactive({val: 1})
effect(
    () => {
        console.log(obj.val)
    },{
    scheduler() {
        // 当obj.val的值变化的时候，执行自定义的调度函数
    }
})
```

通过第一个回调，在获取`obj.val`的值的时候会通过`proxy`收集副作用函数，并在后续其值改变的时候进行触发。但是因为有自定义的`scheduler`选项，则会执行`scheduler`，而不会去触发执行副作用函数，这样便达成了目的。

那么接下来就可以以此思路实现一个最简单版本的`watch`：

```js
const watch = (source, cb) => {
  // 使用 effect 收集
  // 因为对应监听的数据可能是一个对象，所以单独提取
  effect(() => traverse(source), {
    scheduler() {
      cb()
    },
  })
}

// 递归读取当前响应式对象的所有数据，确保能够监听到其变化
const traverse = (value, seen = new Set()) => {
  // 如果是对象，需要继续遍历。否则简单的数据类型代表已经被读取过了
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value)
  // 暂时只考虑 source 是对象，递归深度的读取
  for (const key in value) {
    traverse(value[key], seen)
  }
  return value
}
```

那么我们在使用的时候也可以只监听对应的一个属性，此时我们一般传递的是一个`getter`，所以改造一下`watch`：

```js
const watch = (source, cb) => {
  // 新建一个 getter 来收集
  let getter
  // 是函数的话代表是一个 getter，则直接赋值
  if (typeof source === 'function') {
    getter = source
  } else getter = () => traverse(source)

  // 使用 effect 收集
  effect(() => getter(), {
    scheduler() {
      cb()
    },
  })
}
```

那么我们还可以继续添加一些功能。在实际使用`watch`的时候我们可以拿到对应的`oldVal`和`newVal`，其实就是开启了`lazy`，获取到包装的副作用函数的返回值。

```js
const watch = (source, cb) => {
  // ……
  // 新增！
  let oldVal, newVal
  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler() {
      // 新增！重新得到值
      newVal = effectFn()
      cb(newVal, oldVal)
      oldVal = newVal
    },
  })
  // 新增！第一次手动调用就是初始的旧值
  oldVal = effectFn()
}
```

注意，刚开始的时候便执行了一次`effectFn()`，此时得到的就是当前的初始值。在后续`scheduler`中进行调用的时候是已经有值变化了，那么再得到的值就是已经变化后的新值。

**立即执行的watch**

其实也就是我们常用的`immediate`参数，我们可以以此继续改造一下：

```js
const watch = (source, cb, options = {}) => {
  // ……
  // 新增！抽离回调执行的步骤
  const job = () => {
    // 重新得到值
    newVal = effectFn()
    cb(newVal, oldVal)
    oldVal = newVal
  }
  const effectFn = effect(() => getter(), {
    lazy: true,
    // 新增！
    scheduler: job,
  })
  // 新增！
  if (options.immediate) {
    job()
  } // 第一次手动调用就是初始的旧值
  else oldVal = effectFn()
}
```

此时我们再对`watch`做一些测试，发现就都能够输出正确的内容了。



## 总结

好了，到这里已经完成了响应系统的基础的大部分内容了。我们需要牢记的仍然是响应系统最基本的实现：**当有副作用函数使用了响应式的数据，我们需要将当前的副作用函数收集起来；当响应式的数据发生改变之后，我们又需要将副作用函数进行取出并重新执行。** 与此同时配合Proxy API进行响应数据的读取、设置拦截操作。

其次，我们可以**通过配置不同的参数，来控制副作用函数执行的时机**，主要的便是options.scheduler以及lazy等参数。computed和watch均是以此而来。

本文都是基于**霍春阳**大佬的 **《vuejs设计与实现》** 一书记录的内容，书写的非常好，我这种新手阅读起来都能了解其基本原理。



