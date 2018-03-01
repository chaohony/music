<template>
  <transition name="slide">
    <div class="disc">
      <music-list :title="title" :image="image"
      :songs="songlist"></music-list>
    </div>
  </transition>
</template>

<script>
import MusicList from 'base/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {createSong} from 'common/js/song'
export default {
  props: {},
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.back()
      }
      getSongList(this.disc.dissid).then((res) => {
        this.songlist = this._normalizeSongs(res.cdlist[0].songlist)
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item, index) => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })
      return ret
    }
  },
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title() {
      return this.disc.dissname
    },
    image() {
      return this.disc.imgurl
    }
  },
  components: {
    MusicList
  },
  data () {
    return {
      songlist: []
    }
  },
  created() {
    this._getSongList()
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.disc
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
