// jsonp 的 Promise 封装
import originJSONP from 'jsonp'
import { Promise } from 'q'

/**
 * 对外暴露自定义 方法/函数 jsonp()
 *
 * @export
 * @param {*} url   请求地址，纯净，不带任何参数
 * @param {*} data  通常URL是带参数的，Url的Query存储在这里 两个拼接是最终的地址
 * @param {*} option    对应三方js库jsonp的option
 */
export default function jsonp (url, data, option) {
  // 拼接URL：如果入参url不带?则先拼接一个？再拼接Query；如果入参url带？则先拼接一个&再拼接Query
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  // 返回一个Promise对象
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(data)
      }
    })
  })
}

/**
 * 拼接Url的qQuery参数
 * @param {*} data  jsonp()的data
 * @returns 返回拼接后的Query参数
 */
function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  // 使用substring()的目的是去掉最前面的&符号，方便拼接
  return url ? url.substring(1) : ''
}
