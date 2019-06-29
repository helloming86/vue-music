<template>
  <!-- 异步获取数据，使用Scroll组件时，侦听数据变化 -->
  <!-- :data 的 data 指代子组件Scroll的 props 的 data -->
  <!-- "data" 的 data 指代父组件ListView 的d ata -->
  <scroll class="listview"
    :data="data"
    ref="listview"
  >
    <ul>
      <li v-for="(group, index) in data"
        :key="index"
        class="list-group"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item"
            v-for="item in group.items"
            :key="item.id"
          >
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- @touchstart 是DOM原生的事件方法 -->
    <div class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <!-- 使用 :data-index 为 data-index 属性动态绑定属性值 -->
        <li class="item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
        >
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18

export default {
  name: 'ListView',
  props: {
    data: {
      type: Array,
      // 类型为Array时，default为null
      default: null
    }
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      // console.log(e.target)
      // anchorIndex 是一个字符串
      let anchorIndex = getData(e.target, 'index')
      // e.touches[0]第一个手指的touch信息
      let firstTouch = e.touches[0]
      // 第一个手指的touch信息的pageY值
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      console.log(firstTouch)
      this.touch.y2 = firstTouch.pageY
      console.log(this.touch.y2)
      // 两个Y值之间的偏移
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      console.log(delta)
      // 现将字符串转化成整形，再相加
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo (index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  created () {
    // 在created()钩子里面定义touch，不会像定义在data中需要实时监听；
    // 主要作用是方便onShortcutTouchStart和onShortcutTouchMove都能使用touch
    this.touch = {}
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
