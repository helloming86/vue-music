// 统一的状态管理更改状态mutation文件
import * as types from './mutation-type'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}

export default mutations
