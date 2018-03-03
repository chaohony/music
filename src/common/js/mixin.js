import {mapGetters} from 'vuex'
import {playMode} from 'common/js/config'
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
    iconMode() {
      return this.playMode === playMode.sequence ? 'icon-sequence' : this.playMode === playMode.random ? 'icon-random' : 'icon-loop'
    }
  }
}
