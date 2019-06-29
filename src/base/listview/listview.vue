<template>
  <!-- 异步获取数据，使用Scroll组件时，侦听数据变化 -->
  <!-- :data 的 data 指代子组件Scroll的 props 的 data -->
  <!-- "data" 的 data 指代父组件ListView 的d ata -->
  <!-- 子组件Scroll 的 props对象的listenScroll属性值是父组件ListView的listenScroll -->
  <scroll class="listview"
          :data="data"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
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
            :class="{'current': currentIndex===index}"
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
  data () {
    return {
      // 监测：实时滚动位置
      scrollY: -1,
      // 监测：当前index，需要高亮显示的index
      currentIndex: 0
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
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 计算每个group的高度
    _calculateHeight () {
      // 每次计算高度时，初始化列表高度为空数组
      this.listHeight = []
      const list = this.$refs.listGroup
      // 一开始高度为 0
      let height = 0
      // 第一组数据的高度为0
      this.listHeight.push(height)
      // 遍历listGroup，数组中增加每个Group的高度数据
      for (let i = 0; i < list.length; i++) {
        // 获得每个group的元素
        let item = list[i]
        // console.log(item.clientHeight)
        // item 是一个DOM，可以直接通过clientHeight获取高度
        height += item.clientHeight
        // 列表高度累加
        this.listHeight.push(height)
      }
      // console.log(this.listHeight)
    }
  },
  created () {
    // 在created()钩子里面定义touch，不会像定义在data和props中需要实时监听；
    // 主要作用是方便onShortcutTouchStart和onShortcutTouchMove都能使用touch
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    // probeType 设置为3，表示滚动监听级别为实时
    this.probeType = 3
  },
  watch: {
    // 监听data：listview发生变化时，要重新计算高度，所以定义在watch中
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    // 监听scrollY的变化，判断scrollY目前落在那个group区间
    // 逻辑：大于下限，小于上限
    scrollY (newY) {
      const listHeight = this.listHeight
      // console.log(this.listHeight)
      for (let i = 0; i < listHeight.length; i++) {
        // 下限：当前listgroup
        let height1 = listHeight[i]
        // 上限：下一个listgroup的下限即是本listgroup的上限
        let height2 = listHeight[i + 1]
        // 当遍历到最后一个数据时height2不存在 !height2 就为true
        // 向上滚动时，newY 为负值
        // 下面if的逻辑：当到最后一个元素时（!height2 为 true）
        // 或者 向上滑动时落在上下限区间
        // 则 当前的index就是i值
        if (!height2 || (-newY > height1 && -newY < height2)) {
          this.currentIndex = i
          console.log(this.currentIndex)
          return
        }
      }
      this.currentIndex = 0
    }
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
