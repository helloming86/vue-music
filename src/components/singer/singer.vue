<template>
  <div>Singer</div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'

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
          // console.log(this.singers)ObtainSingerData
        }
      })
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
