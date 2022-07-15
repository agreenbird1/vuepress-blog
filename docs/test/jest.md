---
title: Jest入门
author: RoleTang
date: '2022-07-15'
---

首先，对于测试并不是所有的前端项目都需要进行的，因为编写测试也会耗费不少的时间。对于一些较小的项目，编写测试只会拖慢时间进度。但编写测试也有它的好处

- 它可以减少出现如手动测试中可能忽略的地方而出现的问题
- 同时对于一个项目后续的扩展非常有帮助，可以减少大量的回归测试
- 如果项目进行重构，也会加快重构速度，提高效率

但还有一点，对于一个组件库来说，在条件允许的情况下都可以编写一定的测试，因为组件通常被用作公用的基础组件。编写测试可以提高的组件的可维护性和稳定性。



>  `jest`：意为玩笑



`jest`是一款是一款优雅、简洁的 JavaScript 测试框架。它可以集成很多的支持，包括`ts`、`node`、`jest-environment-jsdom`（模拟浏览器的环境）。也对大多数现有的前端框架都提供了支持，比如`react`、`vue`、`angular`。

通常来说，测试文件一般以 `.test.[jt]sx?`结尾，在安装了`jest`之后启动命令它会自动的递归查找项目目录下符合条件的文件进行测试。

首先初始化一个简单的项目，然后安装`jest`

```bash
pnpm install jest -D
```

安装完成后，我们可以执行以下命令，选择对应的配置项

```shell
npx jest --init
```

我的选择如下：

![image-20220713104947373](/test/jest配置.png)

之后便可以执行命令进行测试。接下来先介绍几个常用的`API`。



## expect

见名知意，是为期望。比如说，某一个变量，我期望它的值是多少，是否符合我的预期，符合即测试通过，否则测试不通过。常常与它一起使用的，被称之为匹配器（`matcher`），举个例子。

```js
let a = 1;
let str = "test"
expect(a).toBe(1); // ✔，测试通过，期望a它的值是1。toBe函数可以理解为一个匹配器，可以匹配简单类型。
expect(str).toBe(1) // x，测试不通过，期望的值与实际的值不符合。
```

当然匹配器的种类非常之多，可以举例几个常用的匹配器。

```js
let obj = {
    name: "rt"
}
expect(obj).toEqual({ name: "rt" }); // 匹配对象或者数组

let boo = false;
expect(boo).toBeTruthy(); // 匹配任何可以为真的语句，它遵循一般的真值转换，比如1为真，0为假。

let big = 3;
expect(big).toBeGreaterThan(1); // 比较大小

let arr = [1, 2, 3, 4]
expect(arr).toContain(1); // 包含
expect(arr).not.toContain(5); // 加上一个 .not 即为反义
```

总的来说匹配器的名字都非常符合它的本意，大多数会用到的你能想到的它都有。[匹配器](https://jestjs.io/zh-Hans/docs/using-matchers)这里有更多更全面的介绍。



## test(it)

`test`即是测试的单元，我理解为单元测试。它也可以使用别名 `it`，相比而言我更喜欢使用`it`，可能感觉更能装b。

我们可以创建一个文件，输入以下内容：

```js
// demo.test.js
expect(1).toBe(1);
```

我们直接运行测试命令，`pnpm run test`，会得到以下错误。

```shell
 ● Test suite failed to run
	Your test suite must contain at least one test.
```

意思是一个测试文件至少包含一个测试，所以单独使用`expect`是行不通的。重新加上一个`test`函数进行包裹

```js
test("德莫 test", () => {
  expect(1).toBe(1);
});
// 同下
// it("德莫 test", () => {
//   expect(1).toBe(1);
// });
```

再次运行，即可通过。

他总共有三个参数

Creates a test closure.

- *@param* `name` — The name of your test - 测试名称

- *@param* `fn` — The function for your test - 包含测试期望的函数

- *@param* `timeout` — The timeout for an async function test - 若是一个异步测试，超时的时间，默认为5000mm

具体可见[全局设定 · test](https://jestjs.io/zh-Hans/docs/api#testname-fn-timeout)



## describe

创建一个分组，可以在这里面测试几个相关的`test`。

```js
const myBeverage = {
  delicious: true,
  sour: false,
};

describe('my beverage', () => {
  test('is delicious', () => {
    expect(myBeverage.delicious).toBeTruthy();
  });

  test('is not sour', () => {
    expect(myBeverage.sour).toBeFalsy();
  });
});
```

## 测试异步代码

我们可以创建一个`async.test.js`文件，内容如下

```js
// async.test.js
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(1), 3000);
  });
};

it("demo test", () => {
  fetchData().then((res) => {
    expect(res).toBe(1);
  });
});
```

我们可以运行`pnpm run test async.test.js`测试一下这个文件，这种命令可以只运行这一个测试文件。

结果如下

![image-20220713095822705](/test/延迟失败.png)

显然是不正确的，因为我们定时器中设置了三面的延迟，但运行时间只有0.4s。我们可以在测试中加一句断言，改动如下：

```js
// async.test.js
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(1), 3000);
  });
};

it("demo test", () => {
  expect.assertions(1); // 说明这个测试中肯定会有一个断言
  fetchData().then((res) => {
    expect(res).toBe(1);
  });
});
```

再次运行命令，得到的结果如下：

![image-20220713100248146](/test/0次断言.png)

意思是这个测试中至少需要拥有一次断言。

这说明我们的`fetchData`根本没有实现，因为对于`jest`而言，它只负责从前到后跑一遍，没有异常就算测试通过。

但其实对于`test`传入的回调来说，会收到一个名为`done`的参数，它也是一个函数，在它执行结束前测试都不会结束。

改动如下：

```js
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(1), 3000);
  });
};

it("demo test", (done) => {
  expect.assertions(1);
  fetchData().then((res) => {
    expect(res).toBe(1);
    done(); // 在此执行
  });
});
```

再次运行命令，结果如下

![image-20220713103132958](/test/done.png)

可以看到时间上的明显差别，测试也已经成功。



但如果`setTimeout`延迟时间过长，不可能一直进行等待。这时，我们可以使用`jest`提供的其他的`api`来解决。改动代码如下：

```js
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(1), 3000);
  });
};

it("demo test", (done) => {
  jest.useFakeTimers();
  expect.assertions(1);
  fetchData().then((res) => {
    expect(res).toBe(1);
    done();
  });
  jest.advanceTimersByTime(3000);
  // jest.runAllTimers();
});
```

`jest.useFakeTimers()`方法 - 直译过来就是欺骗定时器，底层实现原理大家感兴趣的可以去[这里)](https://www.jestjs.cn/docs/jest-object#fake-timers)查看。

`jest.advanceTimersByTime(msToRun)` - 传入毫秒的时间，直接加快定时器

`jest.runAllTimers()` - 跳过所有定时器

这样子，我们就可以不需要进行等待的时间了。再次运行，结果如下：

![image-20220713104319572](/test/fake.png)



当然还有异步请求类似的测试，与正常的测试差别并不大，大家可以看[这里](https://www.jestjs.cn/docs/asynchronous)。



## 生命周期钩子

总共有四个，意思很简单，这里便不再多做演示

- `beforeAll(fn, timeout)` - 在所有`test`开始之前执行
- `beforeEach(fn, timeout)` - 在每一个`test`开始之前执行
- `afterAll(fn, timeout)` - 在所有`test`开始之后执行
- `afterEach(fn, timeout)` - 在每一个`test`执行完成后执行



当然，`jest`的东西还是非常之多，包括模拟函数，异步测试等等。但大概了解了这些，至少能看懂一部分其他人写的代码。