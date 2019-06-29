<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  name: 'Scroll',
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    // Scroll是否监听滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {
        // 使用me保存了this（Vue实例），在内层使用me表示还是外层的this
        let me = this
        // scroll.on 事件，有一个回调函数，pos是位置信息
        // 监听Scroll组件的滚动事件，并且执行回调函数：像父组件派发scroll事件，同时传回pos信息（子传父）
        this.scroll.on('scroll', (pos) => {
          // Vue实例的$emit方法，所以，这里用me
          me.$emit('scroll', pos)
        })
      }
    },
    enable () {
      // 运算方法
      // a && b
      // 只要“&&”前面是false，无论“&&”后面是true还是false，结果都将返“&&”前面的值;
      //  只要“&&”前面是true，无论“&&”后面是true还是false，结果都将返“&&”后面的值;
      // a || b
      // 只要“||”前面为false,不管“||”后面是true还是false，都返回“||”后面的值。
      //  只要“||”前面为true,不管“||”后面是true还是false，都返回“||”前面的值。
      // 如果有this.scrol，就调用this.scrol的enable()方法
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    // 刷新scroll，重新计算高度
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}

</script>

<style lang="stylus" scoped>
</style>
