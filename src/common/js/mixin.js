import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist function method')
    }
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  }
}
export const playerMixin = {
  computed: {
    ...mapGetters([
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'fullScreen',
      'playMode',
      'sequenceList',
      'favoriteList'
    ]),
    iconMode() {
      return this.playMode === playMode.sequence ? 'icon-sequence' : this.playMode === playMode.random ? 'icon-random' : 'icon-loop'
    }
  },
  methods: {
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setIndex: 'SET_CURRENT_INDEX',
      setPlayList: 'SET_PLAY_LIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    changeMode() {
      this.setPlayMode((this.playMode + 1) % 3)
      let list = null
      if (this.playMode === playMode.random) {
        let temp = this.sequenceList.slice()
        list = shuffle(temp)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item, index) => {
        return this.currentSong.id === item.id
      })
      this.setIndex(index)
    },
    getFavorite(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    }
  }
}
export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    deleteOne(query) {
      this.deleteSearchHistory(query)
    },
    beforeScrollStart() {
      this.$refs['search-box'].blur()
    },
    onQueryChange(query) {
      this.query = query
    },
    add(item) {
      if (item.k) {
        this.$refs['search-box'].setQuery(item.k)
        return
      }
      this.$refs['search-box'].setQuery(item)
    }
  }
}
