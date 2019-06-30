<template>
  <!-- 加入转场动画 -->
  <transition class="slide">
    <div class="singer-detail">
      singer-detail
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'SingerDetail'
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
  // 转场动画
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
