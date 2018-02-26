import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function getIndex(list, song) {
  return list.findIndex((item, index) => {
    return song.id === item.id
  })
}

export function selectPlay({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.playMode === playMode.random) {
    let randomList = list.slice()
    randomList = shuffle(randomList)
    commit(types.SET_PLAY_LIST, randomList)
    index = getIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAY_STATE, true)
}
export function randomPlay({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = list.slice()
  randomList = shuffle(randomList)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAY_STATE, true)
  commit(types.SET_CURRENT_INDEX, 0)
}
