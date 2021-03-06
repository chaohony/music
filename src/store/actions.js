import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

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
export function addSong({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequencelist = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前的歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表是否有要待插入的歌曲，并返回其索引
  let fpIndex = getIndex(playlist, song)
  // 因为是插入歌曲，所以索引要加一
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }
  let currentSIndex = getIndex(sequencelist, currentSong) + 1
  let fsIndex = getIndex(sequencelist, song)
  sequencelist.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequencelist.splice(fsIndex, 1)
    } else {
      sequencelist.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAY_LIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAY_STATE, true)
}
export function deleteSong({commit, state}, item) {
  let playlist = state.playList.slice()
  let sequencelist = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = getIndex(playlist, item)
  playlist.splice(pIndex, 1)
  let sIndex = getIndex(sequencelist, item)
  sequencelist.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAY_LIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequencelist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  const playingState = playlist.length > 0
  commit(types.SET_PLAY_STATE, playingState)
}
export function saveSearchHistory({commit, state}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
export function deleteSearchHistory({commit, state}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
export function deleteAll({commit, state}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}
export function clearPlaylist({commit, state}) {
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAY_STATE, false)
}
export function savePlayHistory({commit, state}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}
export function saveFavoriteList({commit, state}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}
export function deleteFavoriteList({commit, state}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
