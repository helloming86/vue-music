<template>
  <div>Singer</div>
</template>

<script>
import Singer from 'common/js/singer'
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'singer',
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = res.data.list
          // console.log(this.singers)
          console.log(this._normalizeSinger(this.singers))
        }
      })
    },
    // 规范化Singer：因为原始jsonp返回不满足我们的要求，所以需要按照我们实际的要求进行规范化处理
    _normalizeSinger (list) {
      // 创建map对象
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      console.log(map)
      // map对象是无序的，我们需要将map对象转换成有序的列表
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // sort() 排序
      // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。
      hot.concat(ret)
      console.log(hot.concat(ret))
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 8
    width: 100%
</style>
