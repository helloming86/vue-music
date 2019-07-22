import { getLyric, getSongsUrl } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor ({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.filename = `C400${this.mid}.m4a`
    this.url = url
  }

  // Song类的getLyric方法，用于获取歌词
  getLyric () {
    if (this.lyric) {
      // 有时需要将现有对象转为 Promise 对象，Promise.resolve方法就起到这个作用。
      // Promise.resolve('foo')   ===    new Promise(resolve => resolve('foo'))
      // 如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      // 调用 api/song 里面定义的 getLyric API
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          // base64解码
          this.lyric = Base64.decode(res.lyric)
          // console.log(this.lyric)
          // 成功回调
          resolve(this.lyric)
        } else {
          // 失败回调
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function isValidMusic (musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

export function processSongsUrl (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then((purlMap) => {
    songs = songs.filter((song) => {
      const purl = purlMap[song.mid]
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
        // console.log(song.url)
        return true
      }
      return false
    })
    // console.log(songs)
    return songs
  })
}
