const path = require('path')
const axios = require('axios')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true,
  devServer: {
    // 代理转发：将/api/getDiscList请求使用axios进行处理和转发
    // 示例代码，使用axios的headers伪造了referer和host
    before (app) {
      app.get('/api/getDiscList', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        // node.js req.query会从查询字符串格式（“a=1&b=2”）转换为对象格式{a: 1,b: 2}
        // req.query：获取URL的查询参数串
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          // webpack Express 框架
          // Response对象的 json()方法/属性
          // res.json()：传送JSON响应
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('base', resolve('src/base'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('router', resolve('src/router'))
      .set('store', resolve('src/store'))
  }
}
