import { commonParams } from './config'
import { getUid } from 'common/js/uid'
import axios from 'axios'
import { ERR_OK } from 'api/config'

const debug = process.env.NODE_ENV !== 'production'

// 获取歌词API
export function getLyric (mid) {
  // API请求地址，因为webpack自定义了转发，所以，URL地址设置为webpack的转发地址
  const url = debug ? '/api/lyric' : 'http://ustbhuangyi.com/music/api/lyric'
  // commonParams 公共参数，source2 API其他参数
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })
  // 使用axios的get方法，获取响应结果的data数据
  // then方法可以接受两个回调函数作为参数。
  // 第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。
  // 其中，第二个函数是可选的，不一定要提供。这两个函数都接受Promise对象传出的值作为参数。
  return axios.get(url, {
    params: data
  }).then((res) => {
    // 有时需要将现有对象转为 Promise 对象，Promise.resolve方法就起到这个作用。
    // Promise.resolve('foo')   ===    new Promise(resolve => resolve('foo'))
    // 如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。
    return Promise.resolve(res.data)
  })
}

export function getSongsUrl (songs) {
  // 如果是debug模式，API接口地址是/api/getPurlUrl，否则为http://ustbhuangyi.com/music/api/getPurlUrl
  const url = debug ? '/api/getPurlUrl' : 'http://ustbhuangyi.com/music/api/getPurlUrl'

  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const urlMid = genUrlMid(mids, types)

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3

    function request () {
      return axios.post(url, {
        comm: data,
        req_0: urlMid
      }).then((response) => {
        const res = response.data
        if (res.code === ERR_OK) {
          let urlMid = res.req_0
          if (urlMid && urlMid.code === ERR_OK) {
            const purlMap = {}
            urlMid.data.midurlinfo.forEach((item) => {
              if (item.purl) {
                purlMap[item.songmid] = item.purl
              }
            })
            if (Object.keys(purlMap).length > 0) {
              resolve(purlMap)
            } else {
              retry()
            }
          } else {
            retry()
          }
        } else {
          retry()
        }
      })
    }

    function retry () {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    request()
  })
}

function genUrlMid (mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
