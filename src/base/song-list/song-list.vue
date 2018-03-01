<template>
  <scroll 
  class="song-list" 
  :data="songs" 
  :listenToScroll="listenToScroll"
  @scroll="scroll"
  :probeType="probeType"
  ref="scroll">
    <div>
      <ul class="song-wrapper" v-if="songs.length > 0">
        <li 
        v-for="(item,index) in songs" 
        :key="index" 
        class="item"
        @click.stop.prevent="selectItem(item,index)"
        >
          <div class="item-block-left" v-show="rank">
            <span class="icon" :class="getCup(index)">{{ getText(index) }}</span>
          </div>
          <div class="item-block-right">
            <h4 class="name">{{ item.name }}</h4>
            <div class="desc">{{ item.singer }}-{{ item.album }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="loading-container" v-if="!songs.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false 
    }
  },
  methods: {
    scroll(scrollY) {
      this.$emit('scroll', scrollY)
    },
    selectItem(item, index) {
      this.$emit('selectItem', item, index)
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    getCup(index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    getText(index) {
      if (index > 2) {
        return index + 1 
      }
    }
  },
  computed: {},
  components: {
    Scroll,
    Loading
  },
  data () {
    return {
      listenToScroll: true,
      probeType: 3
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.song-list
  position absolute 
  left 0
  right 0
  bottom 0
  top 0
  background #222
  .song-wrapper
    padding 30px
    .item
      margin-bottom 20px
      display flex
      align-items center
    .item-block-left
      flex 0 0 25px
      width 25px 
      margin-right 30px
      text-align center
      color $color-theme
      font-size 20px
      .icon
        display inline-block
        width 25px
        height 25px
        background-size 25px 25px
        &.icon0
          bg-image('./first')
        &.icon1
          bg-image('./second')
        &.icon2
          bg-image('./third')
    .item-block-right
      flex 1
    .name
      font-size 14px
      color #fff
      padding-bottom 5px
    .desc
      font-size 14px
      color $color-text-d
  </style>
