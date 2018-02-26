<template>
    <div class="music-list">
      <div class="back">
        <i class="icon-back" @click="_back"></i>
      </div>
      <h1 class="title">{{ title }}</h1>
      <div class="header" ref="header">
        <img class="img" :src="image">
        <div class="wrapper"></div>
        <div class="random-play" ref="random-play" @click.stop.prevent="random">
          <i class="icon-play"></i>
          随机播放全部
        </div>
      </div>
      <div class="bg-wrapper" ref="bg-wrapper"></div>
      <song-list 
      ref="song-list" 
      :songs="songs"
      @scroll="scroll"
      @selectItem="selectItem"></song-list>  
    </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import {mapActions} from 'vuex'
const RESERVED_HEIGHT = 50
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    _back() {
      this.$router.push({
        path: '/singer'
      })
    },
    scroll(scrollY) {
      let zIndex = -1
      let scale = 1
      let header = this.$refs.header
      if (!this.minTranslateY) {
        this.minTranslateY = -(header.clientHeight - RESERVED_HEIGHT)
      }
      const percent = Math.abs(scrollY / this.minTranslateY)
      if (scrollY > 0) {
        scale = 1 + percent
        zIndex = 10
      }
      let maxHeight = Math.max(this.minTranslateY, scrollY)
      this.$refs['bg-wrapper'].style.transform = `translate3d(0,${maxHeight}px,0)`
      if (scrollY < this.minTranslateY) {
        zIndex = 10
        header.style.paddingTop = 0
        header.style.height = RESERVED_HEIGHT + 'px'
        this.$refs['random-play'].style.display = 'none'
      } else {
        header.style.height = 0
        header.style.paddingTop = '70%'
        this.$refs['random-play'].style.display = ''
      }
      header.style.transform = `scale(${scale})`
      header.style.zIndex = zIndex
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random() {
      this.randomPlay({list: this.songs})
    }
  },
  computed: {},
  components: {
    SongList
  },
  data () {
    return {
      scrollY: 0
    }
  },
  mounted() {
    let header = this.$refs.header
    let height = header.clientHeight
    this.$refs['song-list'].$el.style.top = `${height}px`
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.music-list
  position fixed
  left 0
  right 0
  bottom 0
  top 0
  .header
    width 100%
    height 0
    line-height 0
    padding-top 70%
    position relative
    overflow hidden
    z-index -1
    transform-origin top
    .img
      width 100%
      position absolute
      top 0
      left 0
      z-index -1
    .wrapper
      width 100%
      position absolute
      top 0
      height 100%
      background #000
      opacity 0.4
    .random-play
      position absolute
      left 50%
      border-radius 14px
      width 140px
      bottom 30px
      height 30px
      line-height 30px
      z-index 10
      margin-left -70px
      text-align center
      color $color-theme
      font-size 14px
      border 1px solid $color-theme
      .icon-play
        vertical-align middle
        display inline-block
        font-size 16px
        position relative
        top -1px
        margin-right 2px
  .back
    position absolute
    font-size 24px
    top 0
    height 30px
    padding-top 20px
    padding-left 20px
    color $color-theme
    z-index 21
  .title
    width 100%
    height 50px
    text-align center
    position absolute
    top 0
    left 0
    z-index 20
    line-height 40px
    color #ffffff
    font-size 18px
  .bg-wrapper
    width 100%
    height 100%
    background $color-background
</style>
