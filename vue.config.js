const path = require('path')
const bodyParser = require('body-parser')
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
      app.get('/api/getCdInfo', function (req, res) {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/
            const matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((e) => {
          console.log(e)
        })
      })
      // 代理转发：将/api/lyric请求使用axios进行处理和转发
      // 示例代码，使用axios的headers伪造了referer和host
      app.get('/api/lyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        // `headers` 是即将被发送的自定义请求头
        // `params` 是即将与请求一起发送的 URL 参数，必须是一个无格式对象(plain object)或 URLSearchParams 对象
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          // 成功时，获取服务器响应data数据，并对返回的json格式的数据进行解析
          let ret = response.data
          if (typeof ret === 'string') {
            // 正则表达式规则：`^` 为匹配输入字符串的开始位置；`$` 为匹配输入字符串的结束位置。
            // 正则表达式规则：`\w` 匹配字母、数字、下划线。等价于'[A-Za-z0-9_]'。
            // 正则表达式规则：`+` 匹配前面的子表达式一次或多次。例如，'zo+' 能匹配 "zo" 以及 "zoo"，但不能匹配 "z"。
            // 正则表达式规则：`[0-9]+` 匹配多个数字， `[0-9]` 匹配单个数字，`+` 匹配一个或者多个。
            // [abc] 查找方括号之间的任何字符。 [0-9] 查找任何从 0 至 9 的数字。
            // (x|y) 查找任何以 | 分隔的选项。
            // 正则表达式规则：`()` 标记一个子表达式的开始和结束位置。子表达式可以获取供以后使用。要匹配这些字符，请使用 `\(` 和 `\)`。
            // 正则表达式规则：`{` 标记限定符表达式的开始。要匹配 `{`，请使用 `\{`。
            // `.` 匹配除换行符 `\n` 之外的任何单字符。要匹配 . ，请使用 `\.`
            // 正则表达式规则：限定符，定符用来指定正则表达式的一个给定组件必须要出现多少次才能满足匹配。有 * 或 + 或 ? 或 {n} 或 {n,} 或 {n,m} 共6种。
            const reg = /^\w+\(({.+})\)$/
            const matches = ret.match(reg)
            if (matches) {
              // matches[0] 匹配 \w+ matches[1] 匹配 {.+}
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((e) => {
          // 失败时，打印错误信息
          console.log(e)
        })
      })
      // 代理转发post请求，接收json格式的数据
      // 转发给QQ官网接口地址时，添加了headers，伪造了referer和origin，并设置了Content-type
      app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/search', function (req, res) {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
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
