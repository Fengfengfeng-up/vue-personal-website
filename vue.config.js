'use strict'
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

const port = process.env.port || process.env.npm_config_port || 3344 // dev port
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const PrerenderSPAPlugin = require('prerender-spa-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  outputDir: resolve('../nest-personal-website/front'),
  lintOnSave: isDev,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: (config) => {
    if (!isDev) {
      config.plugins.push(
        ...[
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|html)$/,
            threshold: 10240,
            minRatio: 0.8
          })
          // 预渲染
          // new PrerenderSPAPlugin({
          //   staticDir: resolve('../server/mobile'),
          //   routes: ['/cat'],
          //   minify: {
          //     collapseBooleanAttributes: true,
          //     collapseWhitespace: true,
          //     decodeEntities: true,
          //     keepClosingSlash: true,
          //     sortAttributes: true
          //   }
          // })
          // new BundleAnalyzerPlugin()
        ]
      )
      config.externals = {
        axios: 'axios',
        'highlight.js': 'hljs'
      }
    }
    config.resolve.alias = {
      '@': resolve('src'),
      '@v': resolve('src/views'),
      '@c': resolve('src/components'),
      '@u': resolve('src/utils')
    }
  },
  chainWebpack(config) {
    // config.plugins.delete('preload')
    // config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .tap((options) => {
        options = {
          plugins: [
            { removeXMLNS: true }, // 删除xmlns属性（对于内联svg，默认情况下禁用）
            { convertStyleToAttrs: true } // 将css样式转换为svg元素属性
          ]
        }
        return options
      })

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(isDev, (config) => config.devtool('cheap-source-map'))

    config.when(isDev, (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
