<template>
  <div class="recommend" ref="recommend">
    <!-- slide组件的data属性值是父组件recommend的discList -->
    <!-- 为什么要侦听呢，因为recommend页面的数据都是异步获取的，获取到数据后，页面才被撑开，高度发生变化 -->
    <!-- slide组件侦听了data的变化，当data变化时重新计算scroll的高度，保证能正确滚动 -->
    <scroll class="recommend-content"
      :data="discList"
      ref="scroll"
    >
      <!-- 使用better-scroll 支队第一个元素有效，所以讲slider和list使用div包裹起来 -->
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <div class="slider-content">
            <slider ref="slider">
              <div v-for="(item,index) in recommends" :key="index">
                <a :href="item.linkUrl">
                  <!-- 设置class名needsclick fastclick监听到后img元素的点击事件后，fastclick就不会拦截img元素的click过程 -->
                  <!-- 这时为了解决better-scroll 与 fastclick 就点击事件的冲突：列表需要点击，而fastclick本身的功能是限制点击 -->
                  <img class="needsclick"
                    :src="item.picUrl"
                    @load="loadImage"
                  >
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1>热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList"
              :key="index"
              class="item"
            >
              <div class="ico">
                <img v-lazy="item.imgurl"
                  alt=""
                  width="60"
                  height="60"
                >
              </div>
              <div class="text">
                <!-- {{item.creator.name}} -->
                <!-- v-text="item.creator.name" -->
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container"
        v-show="!discList.length"
      >
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type='text/ecmascript-6'>
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { playlistMixin } from 'common/js/mixin'

export default {
  name: 'recommend',
  mixins: [playlistMixin],
  components: {
    Slider,
    Scroll,
    Loading
  },
  data () {
    return {
      recommends: [],
      discList: [],
      checkLoaded: false
    }
  },
  methods: {
    handlePlaylist (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data.slider)
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list)
          this.discList = res.data.list
        }
      })
    },
    loadImage () {
      // 调用scroll组件的refresh()方法
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        height: 0
        padding-top: 40%
        overflow: hidden
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
