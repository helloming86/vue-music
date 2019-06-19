// vue.config.js
// module.exports = {
//   configureWebpack: {
//     resolve: {
//       alias: {
//         'api': '@/api',
//         'common': '@/common',
//         'components': '@/components',
//         'views': '@/views'
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
      .set('assets', resolve('src/assets'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('router', resolve('src/router'))
      .set('store', resolve('src/store'))
  }
}
