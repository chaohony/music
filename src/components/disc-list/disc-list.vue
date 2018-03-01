<template>
  <transition name="slide">
    <div class="disc-list">
      <music-list
      :title="title" 
      :image="image" 
      :songs="songs"
      :rank="rank"></music-list>
    </div>
  </transition>
</template>

<script>
import MusicList from 'base/music-list/music-list'
import {ERR_OK} from 'api/config'
import {getRanklist} from 'api/rank'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'
export default {
  props: {},
  methods: {
    _getRanklist() {
      if (!this.topList.id) {
        this.$router.back()
        return
      }
      getRanklist(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item, index) => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title() {
      return this.topList.topTitle
    },
    image() {
      if (this.songs.length) {
        return this.songs[0].image
      }
    }
  },
  components: {
    MusicList
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  created() {
    this._getRanklist()
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.disc-list
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
  transition all .3s linear
  &.slide-enter,&.slide-leave-to
    transform translate3d(100%,0,0)
</style>
