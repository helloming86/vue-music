// 统一的状态管理更改状态mutation文件
import * as types from './mutation-type'

const mutations = {
  // 我们可以使用 ES6 风格的计算属性命名功能来使用一个常量作为函数名
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}

export default mutations
