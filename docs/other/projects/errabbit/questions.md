---
title: 项目问题
author: RoleTang
date: '2022-07-26'
---

1. 如何做权限验证

   JWT验证

   用户登录的时候服务器会返回一个token

   本地会保存一个token，当请求比如结算订单的时候就需要进行token验证。然后设置请求拦截器，当有token的时候便携带



   - cookie是存储在客户端的，且不可跨域（详见浏览器缓存中）

   - session

     - session 是另一种记录服务器和客户端会话状态的机制
     - session 是基于 cookie 实现的，session 存储在服务器端，sessionId 会被存储到客户端的cookie 中

     `认证流程`：

     - 用户第一次请求服务器的时候，服务器根据用户提交的相关信息，创建对应的 Session
     - 返回响应时将此 Session 的唯一标识信息 SessionID 返回给浏览器
     - 浏览器接收到服务器返回的 SessionID 信息后，会将此信息存入到 Cookie 中，同时 Cookie 记录此 SessionID 属于哪个域名
     - 当用户第二次访问服务器的时候，请求会自动判断此域名下是否存在 Cookie 信息，如果存在自动将 Cookie 信息也发送给服务端，服务端会从 Cookie 中获取 SessionID，再根据 SessionID 查找对应的 Session 信息，如果没有找到说明用户没有登录或者登录失效，如果找到 Session 证明用户已经登录可执行后面操作。

   - cookie 和 session的区别

     - **安全性：** Session 比 Cookie 安全，Session 是存储在服务器端的，Cookie 是存储在客户端的。

     - **存取值的类型不同**：Cookie 只支持存字符串数据，想要设置其他类型的数据，需要将其转换成字符串，Session 可以存任意数据类型。

     - **有效期不同：** Cookie 可设置为长时间保持，比如我们经常使用的默认登录功能，Session 一般失效时间较短，客户端关闭（默认情况下）或者 Session 超时都会失效。

     - **存储大小不同：** 单个 Cookie 保存的数据不能超过 4K，Session 可存储数据远高于 Cookie，但是当访问量过多，会占用过多的服务器资源。

   - token（令牌）

     特点

     - **服务端无状态化、可扩展性好**
     - **支持移动端设备**
     - 安全
     - 支持跨程序调用

     流程

     1. 客户端使用用户名跟密码请求登录
     2. 服务端收到请求，去验证用户名与密码
     3. 验证成功后，服务端会签发一个 token 并把这个 token 发送给客户端
     4. 客户端收到 token 以后，会把它存储起来，比如放在 cookie 里或者 localStorage 里
     5. 客户端每次向服务端请求资源的时候需要带着服务端签发的 token
     6. 服务端收到请求，然后去验证客户端请求里面带着的 token ，如果验证成功，就向客户端返回请求的数据

     - **每一次请求都需要携带 token，需要把 token 放到 HTTP 的 Header 里**
     - **基于 token 的用户认证是一种服务端无状态的认证方式，服务端不用存放 token 数据。用解析 token 的计算时间换取 session 的存储空间，从而减轻服务器的压力**
     - **token 完全由应用管理，所以它可以避开同源策略**

   - ###### Refresh Token

     另一种token，相比token时效更长。当token过期时候可以使用它进行请求发送。同时返回新的token和refresh toke

     ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/29/16f523a04d1c887b~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

   - Jwt

     - 服务端的保护路由将会检查请求头 Authorization 中的 JWT 信息，如果合法，则允许用户的行为
     - 因为 JWT 是自包含的（内部包含了一些会话信息），因此减少了需要查询数据库的需要
     - 因为 JWT 并不使用 Cookie 的，所以你可以使用任何域名提供你的 API 服务而不需要担心跨域资源共享问题（CORS）
     - 因为用户的状态不再存储在服务端的内存中，所以这是一种无状态的认证机制

     ![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/29/16f523a04e881087~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

     非对称加密中生成私钥、公钥的方式（git bash 中可以操作openssl，而cmd中不行）。

     ![image-20220505170145123](/projects/image-20220505170145123.png)



2. 如何做本地购物车

   添加数据的时候直接添加，保存在vuex中，并做本地存储。

3. axios的二次封装你做了什么，有什么好处？

   1. 设置不同的baseURL。可以根据不同的环境使用不同的接口。根据process.env.NODE_ENV来判断当前的环境是开发环境还是生产环境。
   2. 将请求方法设置更加统一。比如创建一个新的实例，然后统一通过当前实例进行请求。
   3. 可以设置全局的、实例的请求和响应拦截器。比如请求拦截器中可以携带token信息，JWT信息之类的。比如响应请求拦截器中可以判断当前token是否过期之类，进行页面的重定向。