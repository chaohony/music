<template>
  <scroll 
  class="song-list" 
  :data="songs" 
  :listenToScroll="listenToScroll"
  @scroll="scroll"
  :probeType="probeType">
    <div>
      <ul class="song-wrapper" v-if="songs.length > 0">
        <li 
        v-for="(item,index) in songs" 
        :key="index" 
        class="item"
        @click.stop.prevent="selectItem(item,index)">
          <h4 class="name">{{ item.name }}</h4>
          <div class="desc">{{ item.singer }}-{{ item.album }}</div>
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
export default {
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    scroll(scrollY) {
      this.$emit('scroll', scrollY)
    },
    selectItem(item, index) {
      this.$emit('selectItem', item, index)
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
  // overflow hidden
.song-wrapper
  padding 30px
  .item
    margin-bottom 20px
  .name
    font-size 14px
    color #fff
    padding-bottom 5px
  .desc
    font-size 14px
    color $color-text-d
</style>
