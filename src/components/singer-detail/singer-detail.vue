<template>
  <!-- 加入转场动画 -->
  <transition class="slide">
    <music-list
      :songs="songs"
      :title="title"
      :bg-image="bgImage"
    >
      music-list
    </music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  name: 'SingerDetail',
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
            // console.log(songs)
            this.songs = songs
            console.log(this.songs)
          })
        }
      })
    },
    // 歌曲数据处理
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        // 对象结构赋值
        let { musicData } = item
        if (isValidMusic(musicData)) {
          // console.log(musicData.url)
          // console.log(musicData.albumid)
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  // 转场动画
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
