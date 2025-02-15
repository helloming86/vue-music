// 获取state的映射文件
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

// 计算属性，根据playList和currentIndex状态来确认当前歌曲
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
