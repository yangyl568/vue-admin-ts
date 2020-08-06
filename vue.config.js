// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const name = 'vue-admin-ts'

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/' : '/', TODO: 需要的可修改
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    // host: 'devdnsadmin.xc2018.com.cn',
    // host: '127.0.0.1',
    port: 8080,
    open: true,
    progress: false,
    proxy: {
      // change xxx-api/login => /mock-api/v1/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true, // needed for virtual hosted sites
        ws: true // proxy websockets
        // pathRewrite: {
        //   ['^' + process.env.VUE_APP_BASE_API]: ''
        // }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  chainWebpack(config) {
    // 在webpack的name字段中提供应用程序的标题，这样就可以在index.html中访问它来注入正确的标题。
    // config.set('name', name)

    // https://webpack.js.org/configuration/devtool/#development
    // 更改开发环境源码。
    // The default in vue-cli is 'eval-cheap-module-source-map'.
    // config
    //   .when(process.env.NODE_ENV === 'development',
    //     config => config.devtool('eval-cheap-source-map')
    //   )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: path.resolve(__dirname, 'src/components'),
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
