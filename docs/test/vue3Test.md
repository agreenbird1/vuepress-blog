---
title: vue3 + ts 组件测试
author: RoleTang
date: '2022-07-15'
---

# 入门 vue3 + ts 组件测试

之前发布了一个npm包，使用的是vue3 + ts + rollup等实现和打包。它不像vite，因为这兄弟能更快的集成vue3测试所需要的环境。并且vue官网也有一些介绍，可以更少走弯路。我自己就需要从头安装依赖和进行配置，这里简单的记录一下。

测试分为很多种，有手动测试和自动化测试、有单元测试和集成测试等等。对于一个组件库来说，更推荐的还是进行单元测试。相比而言耗费的时间更少，以后进行组件功能的扩展的时候也可以减少对之前的组件功能的测试即回归测试。



## vue中的组件测试

在 Vue 应用中，主要用组件来构建用户界面。因此，当验证应用的行为时，组件是一个很自然的独立单元。从粒度的角度来看，组件测试位于单元测试之上，可以被认为是集成测试的一种形式。你的 Vue 应用中大部分内容都应该由组件测试来覆盖，我们建议每个 Vue 组件都应有自己的组件测试文件。

组件测试应该捕捉组件中的 prop、事件、提供的插槽、样式、CSS class 名、生命周期钩子，和其他相关的问题。

组件测试不应该模拟子组件，而应该像用户一样，通过与组件互动来测试组件和其子组件之间的交互。例如，组件测试应该像用户那样点击一个元素，而不是编程式地与组件进行交互。

组件测试主要需要关心组件的公开接口而不是内部实现细节。对于大部分的组件来说，公开接口包括触发的事件、prop 和插槽。当进行测试时，请记住，**测试这个组件做了什么，而不是测试它是怎么做到的**。

- **推荐**
  - 对于 **视图** 的测试：根据输入 prop 和插槽断言渲染输出是否正确。
  - 对于 **交互** 的测试：断言渲染的更新是否正确或触发的事件是否正确地响应了用户输入事件。

以上内容均来自[测试 | Vue.js (vuejs.org)](https://staging-cn.vuejs.org/guide/scaling-up/testing.html#unit-testing)



## 依赖安装

这里我选择的测试框架主要为 `jest` 和 `vue test utils`，执行一下命令（当然你可以不是`pnpm`）

`pnpm install @types/jest @vue/test-utils @vue/vue3-jest jest jest-environment-jsdom ts-jest ts-node`

- jest 
- jest-environment-jsdom - jsdom，浏览器环境模拟
- ts-jest - 处理ts文件
- ts-node - 在nodejs中支持ts
- @types/jest 
- @vue/test-utils
- @vue/vue3-jest - 处理vue文件



```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "target": "esnext",
    "module": "esnext",
    "strict": false,
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "types": ["@types/jest"],
  },
  "include": ["src/index.ts", "src/env.d.ts", "src/**/*.ts", "src/**/**/*.tsx"]
}

export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node",
    "vue",
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  transform: {
    // 用 `babel-jest` 处理 js
    ".*\\./\\.[jt]sx?$/$": "babel-jest",
    // 用 `@vue/vue3-jest` 处理 `*.vue` 文件。 @vue/test-utils官网中说使用 vue-jest@5，但实际也跑不起来，还处于beta版本。
    ".*\\.(vue)$": "@vue/vue3-jest",
  },
};
```



## 开始测试

创建`__test__`文件夹在src目录下，当然也可以在根目录。你的测试文件都应该以`.test.tsx?`结尾，如果想使用`tsx`的方式，就应该在`tsconfig.json`中更改关于jsx的配置，上文已经给出。

这里我的组件主要分为两种，一种是支持函数式调用的组件，比如`message消息提示`，notify注意消息等。以message组件举例，它的实现代码可以在这里查看[Vue-UI - message](https://github.com/agreenbird1/Vue-UI/tree/master/src/components/Message)。

最终实现的效果为

![](C:\Users\48775\Pictures\写作图片\message演示.gif)



创建`message.test.ts`文件，测试直接使用时候的情况。

```ts
import { mount } from "@vue/test-utils";
import Message from "../../components/Message/index.vue";
import warning from "../../components/Svgs/warning.vue";
import error from "../../components/Svgs/error.vue";

const TEXT = "TEST TEXT";

describe("message test", () => {
  // 测试默认渲染下
  it("render", () => {
    const wrapper = mount(Message);
    expect(wrapper.find(".text").text()).toEqual(""); // text 渲染
    expect(wrapper.findComponent(warning)).toBeTruthy(); // svg 渲染
  });

  // 测试传递 prop 的情况下
  it("render", () => {
    const wrapper = mount(Message,{
      props:{
        text:TEXT,
        type:"error"
      }
    });
    expect(wrapper.find(".text").text()).toEqual(TEXT); // text 渲染
    expect(wrapper.findComponent(error)).toBeTruthy(); // svg 渲染
  });
});

```

组件式使用时候，都是通过`wrapper`来判断对应的元素的创建，文字的显示等等。

对于`message`组件，以第一个`test`举例，因为其样式比较简单，所以判断的点主要在是否正常渲染文字和显示对应的图标。默认的消息提示类型就是`warning`，对应的图标也是。在不传递展示的文字的情况下，它的显示就是空。所以分为三步即可：

1. 获取挂载后的容器
2. 通过容器找到承载文字显示的`dom`节点，得到它的文字进行断言
3. 通过容器找到对应应该显示的图标组件，判断它是否存在



mount函数，我的理解就是在虚拟环境下挂载你的组件，它会返回一个`wrapper`，也就是挂载组件之后的容器。它接收两个参数，第一个参数是组件，第二个就是你可以传递的`props`参数等，定义如下：

```typescript
interface MountingOptions<Props, Data = {}> {
  attachTo?: HTMLElement | string
  attrs?: Record<string, unknown>
  data?: () => {} extends Data ? any : Data extends object ? Partial<Data> : any
  props?: (RawProps & Props) | ({} extends Props ? null : never)
  slots?: { [key: string]: Slot } & { default?: Slot }
  global?: GlobalMountOptions
  shallow?: boolean
}

function mount(Component, options?: MountingOptions): VueWrapper
```

我们测试主要的判断依据都是通过`wrapper`来得知的。

上面还用到了`find`和`findComponent`方法。前者是通过选择器找到对应的`dom`（并非真实，模拟的`jsdom`），后者是找到对应的`component`，继而获得它的属性、值等，然后进行断言操作。

下面列举一些常用的方法：

`attributes`：返回一个 `dom node` 的属性

`classes`：返回一个`dom`的类名集合，是一个数组 - 常用，用于判断样式的挂载

`emitted`：组件触发事件 - 常用

```vue
// component.vue
<script setup lang="ts">
const emits = defineEmits(["greet"]);
emits("greet","hello");
emits("greet","world");
</script>
```

```typescript
// emit.test.ts
import { mount } from '@vue/test-utils'
import Component from './Component.vue'

test('emitted', () => {
  const wrapper = mount(Component)
  expect(wrapper.emitted()).toHaveProperty('greet')
  expect(wrapper.emitted().greet).toHaveLength(2)
  expect(wrapper.emitted().greet[0]).toEqual(['hello'])
  expect(wrapper.emitted().greet[1]).toEqual(['goodbye'])
})
```

`find`：查找一个`dom`元素，如果存在的话 - 常用

`findComponent`：查找一个`Vue Component Instance`元素，如果存在的话  - 常用

`html`：以字符串的形式返回元素的内容 - 常用

`text`：返回元素中的文字 - 常用

`trigger`：触发元素的事件，比如`click`、`submit`



创建`message-manage.test.ts`测试函数式调用的情况

```typescript
import message from "../../components/Message/message";
import { nextTick } from "vue";

const SELECTOR = ".message-container";
const TEXT = "TEST TEXT";

describe("message when function call", () => {
  it("create", async () => {
    message({
      type: "warning",
      text: TEXT,
    });
    const messageBox: HTMLElement = document.querySelector(SELECTOR);
    expect(messageBox).toBeDefined(); // 是否已经创建
    // 需要等下一次渲染之后就行选择器的选择，这样才能获取到 dom
    // 否则获取到的 dom 元素都是 null
    await nextTick();
    // 是否已经插入对应的文本，message 中设计插入了一个 &nbsp; 所以使用 toContain
    expect(messageBox.querySelector(".text").textContent).toContain(TEXT);
  });

  it("create by function type", async () => {
    message.success(TEXT);
    const messageBox: HTMLElement = document.querySelector(SELECTOR);
    await nextTick();
    expect(messageBox.querySelector(".text").textContent).toContain(TEXT);
  });
});
```

在函数式调用中，我们往往会看它是否创建了对应的`dom`，对应的`dom`有没有展示你想要的内容。通常是自己去亲自操作`dom`，获取`dom`。以第一个`test`为例，步骤如下：

1. 函数式调用时候并没有`wrapper`返回，所以通过`dom`操作手动获取对应的`dom`节点。这里使用的`querySelector`方法
2. 通过得到的dom`节点再向下搜索`，得到对应的内容进行断言测试

这里需要注意的是使用到了`nextTick`函数，使用过vue的朋友都知道它的用途。我们在挂载了组件之后，若是要马上操作或者得到`dom`元素需要等到下一次渲染之后，这里`nextTick`的作用就是为了我们能够得到`dom`。



## 其他注意

### tsx

如果你想使用`tsx`的语法，那么就需要在测试文件中引入`h`函数，以`Button`组件举例。

```tsx
import { mount } from "@vue/test-utils";
import { h } from "vue"; // 可以通过 ts 编译，需要在 ts.config.json 中配置
import Button from "../../components/Button/index.vue";
import Error from "../../components/Svgs/error.vue";

const TEXT = "TEST TEXT";

describe("button test", () => {
  // 测试传入 props class 是否正常挂载
  it("create", () => {
    const wrapper = mount(Button, {
      props: {
        type: "plain",
        size: "mini",
      },
    });
    expect(wrapper.classes()).toContain("plain");
    expect(wrapper.classes()).toContain("mini");
  });

  // 测试默认插槽中的文字是否渲染正常
  it("render text", () => {
    const wrapper = mount(
      // 使用 h 函数来挂载 slot
      // h(Button, null, {
      //   default: () => TEXT,
      // })
      // 等价的 tsx/jsx 语法
      () => <Button>{() => TEXT}</Button>,
      {
        props: {
          size: "mini",
          type: "plain",
        },
      }
    );

    expect(wrapper.text()).toEqual(TEXT);
  });

  // 测试 icon 插槽传入组件是否正常
  it("render icon", () => {
    const wrapper = mount(
      () => (
        <Button size="mini" type="plain">
          {{
            icon: () => <Error />,
          }}
        </Button>
      )
    );
    expect(wrapper.findComponent(Error).exists()).toBeTruthy();
  });
});
```

你可能会报错，因为`.vue`的声明中并不存在`size`、`plain`的`props`属性，需要将声明改为

```typescript
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<any, any, unknown>;
  export default component;
}
```

当然，你也可以使用h函数渲染，具体语法不再多说。



### 插槽测试

组件中难免会用到插槽，官网中对于插槽的测试已经给的非常详细，可以看[这里](https://test-utils.vuejs.org/guide/advanced/slots.html)



### 定时器测试

`notify`函数式组件中使用到了setTimeout，调用notify函数之后在4500mm后会删除之间挂载的组件。我的测试方法如下：

```typescript
// mock 定时器
  jest.useFakeTimers();
  // 模拟的 setTimeout 函数，同时也会跟踪它的调用
  jest.spyOn(window, "setTimeout");
// 验证 duration
  it("notification props about duration", async () => {
    expect.assertions(2); // 断言次数判断
    notify({
      title: TITLE,
      text: TEXT,
      duration: 4000,
      showClose: true,
    });
    const notificationBox: HTMLElement = document.querySelector(SELECTOR);
    await nextTick();
    // 可以判断当前的定时器的调用时机，默认值为 4500，断言时候调用为 4000
    // 因为整个函数中只有 notify 函数会调用setTimeout，所以可以借此来判断
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 4000);
  });
```



## 总结

在实现之前我也一直觉得测试非常难，更别说有针对性的组件测试。但是一步一步实现下来最终也算小有收获，很多东西我可能并不是一定清楚的，但是希望有看到的大佬能指点一下。总的来说，[vue test utils](https://test-utils.vuejs.org/)官网对很多的测试的方法都有比较详细的介绍了，大家可以多多参考阅读。

