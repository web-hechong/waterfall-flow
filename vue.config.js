const { defineConfig } = require('@vue/cli-service')
const path = require('path')


module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/waterfall-flow/' : '/',
  outputDir: 'docs',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.js', '.vue', '.json']
    }
  }
})
