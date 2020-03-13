module.exports = {
  title: 'v-builder',
  description: 'Advanced page builder based on Vue.js',
  base: '/v-builder/',
  themeConfig: {
    lastUpdated: 'Last Updated',
    repo: 'iboldurev/v-builder',
    docsRepo: 'iboldurev/v-builder',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    sidebar: [
      '/',
      '/getting-started',
      '/section',
      '/styler',
      '/exporting',
      '/API',
    ],
    nav: [
      { text: 'API', link: '/API' },
      { text: 'Example', link: '/example' },
    ]
  }
}
