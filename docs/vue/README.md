---
title: vue常见面试题
author: RoleTang
date: '2022-07-25'
---

## vue面试题

1. 虚拟dom为什么能够跨平台？

因为渲染器的作用。

vue中的渲染器被进行了二次封装，对不同的平台，传入不同的配置。同时对不同平台的api进行了抽离。比如浏览器中的渲染dom的api可以被当作参数进行传递进去。

2. 父子组件挂载顺序

父beforeCreate-> 父create -> 子beforeCreate-> 子created -> 子mounted -> 父mounted

3. nextTick

    - nextTick是Vue提供的一个全局API。由于vue的`异步更新策略`导致我们对数据的修改不会立刻体现在dom变化上，此时如果想要立即获取更新后的dom状态，就需要使用这个方法
    - 异步队列实现：vue维护了一个队列。多次修改响应式数据只会执行一次（P63）队列中的数据都被放在了promise.then()中执行，是异步的。
    - nextTick也是异步的。首选是promise

4. 1. 为什么不用index作key？

   首先，key作为虚拟dom判断相相等的唯一标识（通过type和key判断是否相同）

   1. 性能问题：

      当使用index的时候，如果删除或者移动了数组中间的某个元素，那么虚拟dom对应的key值都会改变，对应的也无法做到虚拟dom的复用，造成额外的开销。

   2. 输入值的错位

      当数据中存在输入框时，我们在数据前添加新节点或者删除节点，会导致input框中的数组残留，且不能达到对应的位置。因为在v-for渲染的列表中，是采用的就地比较，你位置和key和type都没变化，那么复用便会造成问题。

2. 模板和渲染函数？

   Vue 模板会被预编译成虚拟 DOM 渲染函数。在处理高度动态的逻辑时，渲染函数相比于模板更加灵活，因为你可以完全地使用 JavaScript 来构造你想要的 vnode。

   那为什么还需要使用模板？

   1. 更加的贴近实际的`HTML`，也更方便的重用一些代码片段。
   2. 由于其确定的语法，能够更好的做静态分析。然后提升虚拟DOM的性能表现。

3. scoped的原理

   1. 为每个组件生成一个唯一的标识
   2. 给组件实例的根对象添加一个对应的标签属性``data-v-标识``
   3. 给每一个选择器添加一个属性选择器

4. 对vue的理解

   vue是一个声明式、渐进式框架，是一个设计为可以自底向上逐层应用的框架。是一个类似MVVM模型的框架（因为MVVM中不允许修改model的数据），同时它也是一个编译-运行时的框架。（运行时：类似用户手动提供dom树形对象进行渲染；编译时：类似通过模板字符串创建dom进行编译）

5. 1. 解决页面初始化闪烁问题

   ```vue
   // 不会显示，直到编译结束。
   <div v-cloak>
   	{{message}}
   </div>
   [v-cloak]{
   	display: none;
   }
   ```


6. 什么是MVVM

   `视图模型双向绑定`，是`Model-View-ViewModel`的缩写，也就是把MVC中的`Controller`演变成`ViewModel`。`Model`层代表数据模型，`View`代表UI组件，`VieuModel`是`view`和`Model`层的桥梁，数据会绑定到`viewModel`层并自动将数据渲染到页面中，视图变化的时候会通知`ViewModel`层更新数据。以前是操作DOM结构更新视图，现在是数据驱动视图。

   `优点`

   - `低耦合`。视图（View）可以独立于Model变化和修改，一个Model可以绑定到不同的View上，当View变化的时候Model可以不变化，当Model变化的时候View也可以不变；
   - `可重用性`。你可以把一些视图逻辑放在一个Model里面，让很多View重用这段视图逻辑。
   - `独立开发`。开发人员可以专注于业务逻辑和数据的开发(ViewModel)，设计人员可以专注于页面设计。
   - `可测试`。

   **Observer（数据监听器）** : Observer的核心是通过Object.defineProprtty()（Proxy代理）来监听数据的变动，这个函数内部可以定义setter和getter，每当数据发生变化，就会触发setter。这时候Observer就要通知订阅者，订阅者就是Watcher

   **Watcher（订阅者）** : Watcher订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是：

   1. 在自身实例化时往属性订阅器(dep)里面添加自己
   2. 自身必须有一个update()方法
   3. 待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调

7. 为什么v-for和v-if不建议用在一起？

   v2中：`v-for`的优先级更高，这意味着 `v-if` 将分别重复运行于每个 `v-for` 循环中。

   v3中：`v-if`的优先级更高，`v-if`将没有权限访问`v-for`中的变量。

8. nextTick如何实现的（等待下一次 DOM 更新刷新的工具方法）？

   vue中一次性修改多次响应式函数副作用函数只会执行一次。其中副作用函数执行的时候会将其放入到一个set中，并将其放入微任务队列异步执行。dom的更新也是异步的。nextTick即是在异步任务完成之后再执行其中的回调。

   解释：在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新之后的DOM

   使用场景：当需要修改数据后操控dom的话，就可以传递一个回调函数。

   实现：异步队列执行，微任务-->宏任务

9. vue2/和vue3的区别

   composition API

   Proxy

   更好的typescript支持

   添加了新的组件比如teleport

   将beforecreat和created生命周期钩子换成了setup

   使用reactive、ref等设置响应式数据等等

10. Object.defineProperty和Proxy的区别

   Object.defineProperty：`Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

   缺点：不能监听对象的新的属性值的变化，因为本方法本身就是作用于监听对象的一个属性，在初始化的时候进行循环进行监听的时候就已经决定了被监听的属性。在vue2中需要手动进行重新监听。(vm.$set)

   Proxy:proxy则是代理的整个对象，当进行对对象的属性的增加的时候仍然属于被代理的范畴。

11. **双向绑定**的实现

   v-bind的语法糖。比如input就是绑定v-bind和input事件

12. 谈一谈SPA

   全称 `Single Page Application`，即单页面应用。它所需的资源，如 HTML、CSS 和 JS 等，在一次请求中就加载完成，也就是不需刷新地动态加载。

   原理：监听url的变化，动态的切换组件。

   优点：

   - 页面切换快，并不需要重新加载渲染全部文件
   - 用户体验更好

   缺点：

   - 首屏加载速度慢
   - 不易于SEO，因为大多数是由js渲染出来的

13. computed于watch

通俗来讲，既能用 computed 实现又可以用 watch 监听来实现的功能，推荐用 computed， 重点在于 computed 的缓存功能

**watch 属性监听** 是一个对象（侦听器），键是需要观察的属性，值是对应回调函数，主要用来监听某些特定数据的变化，从而进行某些具体的业务逻辑操作,监听属性的变化，需要在数据变化时执行异步或开销较大的操作时使用

**computed 计算属性** 属性的结果会被`缓存`，当`computed`中的函数所依赖的属性没有发生改变的时候，那么调用当前函数的时候结果会从缓存中读取。除非依赖的响应式属性变化时才会重新计算，主要当做属性来使用 `computed`中的函数必须用`return`返回最终的结果。 `computed`更高效，优先使用。`data 不改变，computed 不更新。`（`一个数据影响多个数据`）

**使用场景** `computed`：当`一个属性受多个属性影响`的时候使用，例：购物车商品结算功能。 `watch`：当一条数据影响多条数据的时候使用，例：搜索数据

14. slot

   插槽实际上是一套内容分发的 API。

   1. 默认插槽

   2. 具名插槽

      ```vue
      // 子
      <slot name="header"> </slot>
      <slot> </slot> // 默认插槽
      <slot name="footer"> </slot>
      ```

      渲染

      ```vue
      // 父
      <template v-slot:header>
      //<template #header> 简写
          <p>the default content.</p>
      </template>
      <template v-slot:default>
          <p>the default content.</p>
      </template>
      <template v-slot:footerer>
          <p>the default content.</p>
      </template>
      ```

   3. 作用域插槽

      有时让插槽内容能够访问子组件中才有的数据是很有用的

      ```vue
      // 子
      <slot name="header" :items="someInfo"> </slot>
      ```

      ```vue
      // 父
      <template v-slot:header="slotProps">
          <p>{{ slotProps.items }}</p>
      </template>
      ```


## vue2
1. 生命周期

   `create阶段`：vue实例被创建

      - `beforeCreate` : 创建前，此时data和methods中的数据都还没有初始化

      - `created`： 创建完毕，data中有值，未挂载

   `mount阶段`： vue实例被挂载到真实DOM节点

      - `beforeMount`：可以发起服务端请求，去请求数据

      - `mounted`: 此时可以操作DOM

   `update阶段`：当vue实例里面的data数据变化时，触发组件的重新渲染

      - `beforeUpdate` :更新前

      - `updated`：更新后

   `unmount阶段`：vue实例被卸载

      - `beforeUnmount`：依然保有全部功能

      - `unmounted`：渲染副作用、侦听器都已经停止，可以清除一些副作用

   `destroy阶段`：vue实例被销毁

      - `beforeDestroy`：实例被销毁前，此时可以手动销毁一些方法。比如清除定时器，清除`dom`引用等等

      - `destroyed`:销毁后

   同时vue3移除了`create`、`beforeCreate`生命周期函数。直接写在setup函数中即可。

2. 为什么data必须是一个函数？

   因为`组件`可能被用来创建多个实例。如果 data 仍然是一个纯粹的对象，则所有的实例将共享引用同一个数据对象！通过提供 data 函数，每次创建一个新实例后，我们能够调用 data 函数，从而返回初始数据的一个全新副本数据对象，每个组件都拥有自己的作用域。

3. 组件通信的方式

   - v-model
   - props
   - $emit / v-on
   - .sync
   - ref
   - \$children /\$parent
   - \$attrs / $listeners
   - provide / inject
   - EventBus
   - Vuex
   - slot


## vue3
1. defineAsyncComponent

2. vue3和vue2 options API 和 composition API 的区别

   vue2中的方法都是写在一个一个的配置项中，比如methods、data等等。

   vue3中使用composition API 可以将各种逻辑封装成函数，需要时进行引用使用。

   - 逻辑组织更强，更美观
   - 逻辑复用，更加高耦合、低内聚

   vue3直接将关注的某一个点抽离一个单独的函数并使用。如果是vue2写在一个函数（文件）中代码也更难以维护。

3. 组件通信方式

    - props
    - $emit
    - ref（绑定到组件上，可以直接获取其暴露的值）
    - $attrs
    - v-model
    - provide / inject
    - Vuex
    - mitt




## vuex面试题

1. vuex是如何挂载到每一个组件上的

因为vue的根组件在usevuex的插件的时候，使用了混入，加入了beforeCreate的生命周期钩子进行混入。后面生成的vue实例都会进行挂载。

2. 为什么项目中用了Vuex还要用使用全局事件总线

诚然，事件总线非常方便，可以实现任意组件间的通信。但是，其数据是存储在组件内部的，如果进行多个组件间的传递就会很复杂。


## vue-router面试题

1. Html5 History 使用pushstate和replacetate不会触发popstate事件。会通过修改href来触发此事件。比如使用a标签时候，并且需要阻止默认行为。

而hash变化是可以由popstate和hashChange监听的。使用hash路由模式的时候也是优先判断当前浏览器是否支持popstate。

2. 什么是路由。

   前端路由就是借鉴了网络层的路由表的实现，路由表是通过存储转发实现功能。而前端路由则是根据url通过js控制渲染不同的组件。

3. 前端路由应该包含的部分。

   1. 路由表。映射关系
   2. 匹配器。根据关系匹配
   3. 历史记录栈。History

路由的实现方式。

  1. `hash` + `hashChange`

  - 兼容性好，`hashChange`支持到IE8

  - `url`中会携带`/#/`，不美观
        - 不需要服务端改造

  2. `History API` 和 `pushState` + `popState`

    - 兼容到IE10
    - `url`跟正常`url`一样
      - 由于其`url`跟正常`url`一样，所以在刷新时，会以此`url`为链接请求服务端页面，而服务端是没有这个页面的话会404，因此需要服务端配合将所有请求重定向到首页，将整个路由的控制交给前端路由

    **注意：`history.pushState()`或`history.replaceState()`不会触发`popstate`事件。只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在Javascript代码中调用`history.back()`或者`history.forward()`方法）**

4. 导航守卫流程

   - 导航被触发。
   - 在失活的组件里调用 `beforeRouteLeave` 守卫。
   - 调用全局的 `beforeEach` 守卫。
   - 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
   - 在路由配置里调用 `beforeEnter`。
   - 解析异步路由组件。
   - 在被激活的组件里调用 `beforeRouteEnter`。
   - 调用全局的 `beforeResolve` 守卫(2.5+)。
   - 导航被确认。
   - 调用全局的 `afterEach` 钩子。
   - 触发 DOM 更新。
   - 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

5. 路由导航守卫和Vue实例生命周期钩子函数的执行顺序？

   路由导航守卫都是在Vue实例生命周期钩子函数之前执行的。

6. 导航守卫参数

   to：即将要进入的目标 路由对象。

   from：当前导航正要离开的路由对象。

   next：函数，必须调用，不然路由跳转不过去。

   - `next()`：进入下一个路由。
   - `next(false)`：中断当前的导航。
   - `next('/')`或`next({ path: '/' })` : 跳转到其他路由，当前导航被中断，进行新的一个导航。

7. 如何构建一个404页面

   在vue-router配置routes的最后，通过`/*`匹配所有未被匹配的路由。

## vue-cli

执行流程
![image](/vue/vuecli.png)