module.exports = {
  title: "RoleTang's Blog",
  description: '随心记录~',
  theme: 'reco',
  themeConfig: {
    nav: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '前端',
        items: [
          { text: 'HTML', link: '/html/ei' },
          { text: 'CSS', link: '/css/ei' },
          { text: 'JavaScript', link: '/js/ei' },
        ],
      },
      {
        text: 'Vue',
        items: [
          { text: 'Vue2', link: '/vue2/' },
          { text: 'Vue3', link: '/vue3/' },
        ],
      },
      {
        text: '打包工具',
        items: [
          { text: 'Vite', link: '/vite/vite' },
          { text: 'Webpack', link: '/webpack/webpack' },
        ],
      },
      {
        text: '设计模式',
        link: '/designPattern/index',
      },
      {
        text: '计算机网络',
        link: '/network/index',
      },
      {
        text: '操作系统',
        link: '/os/',
      },
      {
        text: '杂项',
        items: [
          { text: '测试', link: '/test/basic' },
        ],
      },
      {
        text: 'RoleTang的博客',
        items: [
          { text: 'gitee', link: 'https://gitee.com/tqt_greenhand' },
          { text: 'github', link: 'https://github.com/agreenbird1' },
          { text: '掘金', link: 'https://juejin.cn/user/2085101550187517' },
        ],
      },
    ],
    sidebar: {
      '/css/': ['ei', 'engineering'],
      '/js/': ['ei', 'axios', 'perf'],
      '/network/': ['translayer', 'applayer', 'Http', 'websocket'],
      '/designPattern/': ['single', 'pubsub', 'strategy'],
      '/vite/': ['vite', 'esbuild', 'rollup'],
    },
    plugins: ['vuepress-plugin-serve'],
  },
}
