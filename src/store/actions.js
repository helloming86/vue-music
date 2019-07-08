// 统一的状态管理异步action文件
// 使用场景 1.异步操作 2.多个mutations封装
import * as types from './mutation-type'
export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
