const path = require('path')

const date = new Date()
const year = date.getFullYear()
const month = date.getMonth() + 1
const day = date.getDate()
const hours = date
  .getHours()
  .toString()
  .padStart(2, '0')
const minutes = date
  .getMinutes()
  .toString()
  .padStart(2, '0')

const fileName = `${year}_${month}_${day}_${hours}${minutes}`

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: `${fileName}/assets/[name].[hash:8].[ext]`
      })
    config.module
      .rule('images')
      .use('url-loader')
      .loader('file-loader')
      .options({
        name: `${fileName}/assets/[name].[hash:8].[ext]`
      })
    config.plugin('html').tap(args => {
      // args[0].PATH = `/${fileName}/`
      args[0].title = '印得安后台管理系统'
      return args
    })
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#C3161C',
          'link-color': '#C3161C',
          'border-radius-base': '1px'
        },
        javascriptEnabled: true
      }
    }
  },
  lintOnSave: true, //false代表关闭，true代表开启
  // disable source map in production
  productionSourceMap: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],
  // 打包设置
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: `${fileName}`,
  indexPath: 'index.html'
}
