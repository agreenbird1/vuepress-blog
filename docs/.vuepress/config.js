module.exports = {
  title: "RoleTang's Blog",
  description: "随心记录~",
  theme: "reco",
  head: [["link", { rel: "icon", href: "favicon.ico" }]], // 配置 favicon
  themeConfig: {
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "前端",
        items: [
          { text: "HTML", link: "/html/" },
          { text: "CSS", link: "/css/ei" },
          { text: "JavaScript", link: "/js/ei" },
        ],
      },
      {
        text: "Vue",
        items: [
          { text: "Vue2", link: "/vue2/" },
          { text: "Vue3", link: "/vue3/" },
        ],
      },
      {
        text: "打包工具",
        items: [
          { text: "Vite", link: "/vite/vite" },
          { text: "Webpack", link: "/webpack/" },
        ],
      },
      {
        text: "设计模式",
        link: "/designPattern/",
      },
      {
        text: "计算机网络",
        link: "/network/",
      },
      {
        text: "操作系统",
        link: "/os/",
      },
      {
        text: "杂项",
        items: [{ text: "测试", link: "/test/" }],
      },
      {
        text: "RoleTang的博客",
        items: [
          { text: "gitee", link: "https://gitee.com/tqt_greenhand" },
          { text: "github", link: "https://github.com/agreenbird1" },
          { text: "掘金", link: "https://juejin.cn/user/2085101550187517" },
        ],
      },
    ],
    sidebar: {
      "/css/": ["ei", "engineering"],
      "/js/": ["ei", "axios", "perf"],
      "/html/": [
        {
          title: "HTML",
        },
      ],
      "/network/": [
        {
          title: "计算机网络基础",
          collapsable: true,
          children: ["translayer", "applayer", "Http", "websocket"],
        },
      ],
      "/designPattern/": [
        {
          title: "设计模式概览",
          collapsable: true,
          children: ["single", "pubsub", "strategy"],
        },
      ],
      "/vite/": ["vite", "esbuild", "rollup"],
      "/webpack/": [{ title: "webpack基础", collapsable: true }],
      "/test/": [
        {
          title: "前端测试基础",
          children: ["jest", "vue3Test"],
        },
      ],
    },
    plugins: ["vuepress-plugin-serve"],
  },
};
