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
        items: [
          { text: '前端三件套', link: '/total/basic/html/' },
          { text: 'nodejs', link: '/total/node/' },
        ],
      },
      {
        text: 'Vue',
        link: '/vue/',
      },
      {
        text: '打包工具',
        items: [
          { text: 'Vite', link: '/packtools/vite/vite' },
          { text: 'Webpack', link: '/packtools/webpack/' },
        ],
      },
      {
        text: '浏览器',
        link: '/browser/ei',
      },
      {
        text: '计算机基础',
        items: [
          { text: '计算机网络', link: '/computer/network/bs/' },
          { text: '操作系统', link: '/computer/os/' },
        ],
      },
      {
        text: '精读系列',
        items: [
          { text: 'vuejs设计与实现', link: '/read/vuejs/artweigh' },
          {
            text: 'JavaScript设计模式与开发实践',
            link: '/read/designPattern/',
          },
        ],
      },
      {
        text: '其他',
        items: [
          { text: '测试', link: '/other/test/' },
          { text: '性能优化', link: '/other/perf/' },
          { text: '面经', link: '/other/eis/juexiao' },
        ],
      },
      {
        text: '随便看看',
        items: [
          { text: 'gitee', link: 'https://gitee.com/tqt_greenhand' },
          { text: 'github', link: 'https://github.com/agreenbird1' },
          { text: '掘金', link: 'https://juejin.cn/user/2085101550187517' },
        ],
      },
    ],
    sidebar: {
      '/total/basic/': [
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
            'handwrite/array',
          ],
        },
        {
          title: 'TypeScript',
          collapsable: false,
          children: ['ts/tsStudy', 'ts/ei', 'ts/challenge'],
        },
        {
          title: '其他常见',
          collapsable: false,
          children: ['other'],
        },
      ],
      '/computer/network/': [
        {
          title: '计算机网络基础',
          collapsable: false,
          children: ['bs','translayer', 'applayer', 'Http', 'websocket'],
        },
      ],
      '/packtools/vite/': ['vite', 'esbuild', 'rollup'],
      '/packtools/webpack/': [{ title: 'webpack基础', collapsable: true }],
      '/other/test/': ['', 'jest', 'vue3Test'],
      '/vue/': ['', 'designVue'],
      '/computer/os/': [
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
          collapsable: false,
          children: ['juexiao', 'dianjiang', 'lenovo', 'jinshanyun'],
        },
        {
          title: '2023秋招面经',
          collapsable: false,
          children: ['sxf1', 'sxf2'],
        },
      ],
      '/total/node/': ['', 'ei'],
      '/browser/': [
        {
          title: '浏览器基础',
          collapsable: false,
          children: ['ei', 'basic', 'cache'],
        },
      ],
      '/read/vuejs/': [
        {
          title: 'vuejs设计与实现',
          collapsable: false,
          children: ['artweigh', 'core','design','reactive','diff'],
        },
      ],
      '/read/designPattern/': [
        {
          title: '设计模式概览',
          collapsable: false,
          children: [
            '',
            'single',
            'pubsub',
            'strategy',
            'proxy',
            'iterator',
            'command',
          ],
        },
      ],
    },
    plugins: ['vuepress-plugin-serve'],
  },
}
