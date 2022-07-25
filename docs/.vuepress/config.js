module.exports = {
  title: "RoleTang's Blog",
  description: '随心记录~',
  theme: 'reco',
  head: [['link', { rel: 'icon', href: 'favicon.ico' }]], // 配置 favicon
  themeConfig: {
    sidebar: 'auto',
    nav: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '前端',
        items: [{ text: '前端三件套', link: '/total/html/' }],
      },
      {
        text: 'Vue',
        link: '/vue/',
      },
      {
        text: '打包工具',
        items: [
          { text: 'Vite', link: '/vite/vite' },
          { text: 'Webpack', link: '/webpack/' },
        ],
      },
      {
        text: '设计模式',
        link: '/designPattern/',
      },
      {
        text: '计算机网络',
        link: '/network/',
      },
      {
        text: '其他',
        items: [
          { text: '测试', link: '/other/test/' },
          { text: '操作系统', link: '/other/os/' },
          { text: '性能优化', link: '/other/perf/' },
          { text: '面经', link: '/other/eis/juexiao' },
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
      { text: 'CSS', link: '/css/ei' },
      { text: 'JavaScript', link: '/js/ei' },
    ],
    sidebar: {
      '/total/': [
        {
          title: 'HTML',
          collapsable: false, // 可选的, 默认值是 true,
          children: ['html/'],
        },
        {
          title: 'CSS',
          collapsable: false,
          children: ['css/ei', 'css/engineering', 'css/less'],
        },
        {
          title: 'JS',
          collapsable: false,
          children: ['js/ei', 'js/axios', 'js/perf'],
        },
        {
          title: '手写系列',
          collapsable: false,
          children: [
            'handwrite/cba',
            'handwrite/curry',
            'handwrite/extends',
            'handwrite/instanceOf',
            'handwrite/mitt',
            'handwrite/new',
            'handwrite/other',
            'handwrite/promise',
            'handwrite/reduce',
          ],
        },
        {
          title: '其他常见',
          collapsable: false,
          children: ['other'],
        },
      ],
      '/network/': [
        {
          title: '计算机网络基础',
          collapsable: true,
          children: ['translayer', 'applayer', 'Http', 'websocket'],
        },
      ],
      '/designPattern/': [
        {
          title: '设计模式概览',
          collapsable: true,
          children: [
            'single',
            'pubsub',
            'strategy',
            'proxy',
            'iterator',
            'command',
          ],
        },
      ],
      '/vite/': ['vite', 'esbuild', 'rollup'],
      '/webpack/': [{ title: 'webpack基础', collapsable: true }],
      '/other/test/': ['', 'jest', 'vue3Test'],
      '/vue/': ['', 'designVue'],
      '/other/os/': [
        {
          title: '计算机操作系统',
        },
      ],
      '/vue/vue2/': [
        {
          title: 'vue2',
        },
      ],
      '/vue/vue3/': [
        {
          title: 'vue3',
        },
      ],
      '/other/perf/': [
        {
          title: '性能优化',
          collapsable: false,
        },
      ],
      '/other/eis/': [
        {
          title: '暑假实习面经',
          children: ['juexiao', 'dianjiang', 'lenovo', 'jinshanyun'],
        },
        {
          title: '2023秋招面经',
        },
      ],
    },
    plugins: ['vuepress-plugin-serve'],
  },
}
