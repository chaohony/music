<template>
    <transition name="slide">
      <div class="singer-detail">
        <music-list 
        :title="title" 
        :image="image" 
        :songs="songs"
        ></music-list>
      </div>
    </transition>
</template>

<script>
import MusicList from 'base/music-list/music-list'
import {ERR_OK} from 'api/config'
import {getSingerDetail} from 'api/singer'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'
export default {
  props: {},
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push({
          path: '/singer'
        })
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.singerDetail = res.data
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item, index) => {
        let {musicData} = item
        ret.push(createSong(musicData))
      })
      return ret
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    title() {
      return this.singer.name
    },
    image() {
      return this.singer.avatar
    }
  },
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  mounted() {
    this._getSingerDetail()
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.singer-detail
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
