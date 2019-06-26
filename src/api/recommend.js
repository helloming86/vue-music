import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // 对象字典拼接，空字典+通用Query参数+一般Query参数
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}
