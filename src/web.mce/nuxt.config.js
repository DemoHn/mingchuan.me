module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'mingchuan.me',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  css: ['ant-design-vue/dist/antd.css', 'quill/dist/quill.snow.css'],
  router: {
    middleware: 'main'
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#3B8070' },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  env: {
    NODE_ENV: process.env.NODE_ENV
  },
  plugins: [{ src: '~plugins/quill-editor.js', ssr: false }],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
}
