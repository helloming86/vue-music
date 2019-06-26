// vue.config.js
// module.exports = {
//   configureWebpack: {
//     resolve: {
//       alias: {
//         'api': '@/api',
//         'common': '@/common',
//         'components': '@/components',
//         'views': '@/views',
//         'router': '@/router',
//         'store': '@/store'
//       }
//     }
//   }
// }
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('router', resolve('src/router'))
      .set('store', resolve('src/store'))
  }
}
