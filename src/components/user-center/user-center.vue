<template>
  <transition name="slide">
    <div class="user-center">
      <header>
        <i class="icon icon-back"  @click.stop="back"></i>
        <switches :switches="switches" :currentIndex="currentIndex" @chooseIndex="chooseIndex"></switches>
      </header>
      <div class="play-random">
        <div class="play-random-content" @click.stop="random">
          <i class="icon icon-play"></i>
          随机播放全部
        </div>
      </div>
      <div class="shortcut">
        <div class="list-wrapper">
          <scroll ref="favorite-list" class="favorite-list" :data="favoriteList" v-show="currentIndex === 0">
            <ul>
              <li v-for="(item,index) in favoriteList" 
                  :key="index"
                  class="favorite-list-item"
                  @click.stop="insertSong(item)"
              >
                <span class="name">
                  {{ item.name }}
                </span>
                <h2 class="singer">
                  {{ item.singer }}-{{ item.album }}
                </h2>
              </li>
            </ul>
          </scroll>
          <scroll class="play-history" ref="play-history" :data="playHistory" v-show="currentIndex === 1">
            <ul>
              <li v-for="(item,index) in playHistory" 
                  :key="index"
                  class="play-history-item"
                  @click.stop="insertSong(item)"
              >
                <span class="name">
                  {{ item.name }}
                </span>
                <h2 class="singer">
                  {{ item.singer }}-{{ item.album }}
                </h2>
              </li>
            </ul>
          </scroll>
          <div class="no-result-wrapper" v-show="noReslut">
            <no-result :text="noResultDesc"></no-result>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/switches'
import {mapGetters, mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import {playlistMixin} from 'common/js/mixin' 
import {Song} from 'common/js/song'
import NoResult from 'base/no-result/no-result'
export default {
  mixins: [playlistMixin],
  props: {},
  methods: {
    ...mapActions([
      'addSong',
      'randomPlay'
    ]),
    back() {
      this.$router.go(-1)
    },
    chooseIndex(index) {
      this.currentIndex = index
      this.$nextTick(() => {
        this.$refs['play-history'].refresh()
      })
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs['favorite-list'].$el.style.bottom = bottom
      this.$refs['favorite-list'].refresh()
      this.$refs['play-history'].$el.style.bottom = bottom
      this.$refs['play-history'].refresh()
    },
    insertSong(song) {
      this.addSong(new Song(song))
    },
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (!list.length) {
        return
      }
      list = list.map((item) => {
        return new Song(item)
      })
      this.randomPlay({list})
    }
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ]),
    noReslut() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      }
      return !this.playHistory.length
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      }
      return '暂无播放记录'
    }
  },
  components: {
    Switches,
    Scroll,
    NoResult
  },
  data () {
    return {
      switches: ['我喜欢的', '最近听的'],
      currentIndex: 0
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.user-center
  position fixed
  z-index 150
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
  &.slide-enter-active, &.slide-leave-active
    transition all .3s linear
  &.slide-enter, &.slide-leave-to
    transform translate3d(100%,0,0)
  header
    position relative
    .icon
      position absolute
      left 10px
      top 0px
      color $color-theme
      font-size 20px
  .play-random
    height 40px
    margin-top 30px
    text-align center
    font-size 12px
    color rgba(255,255,255,.5)
    .play-random-content
      display inline-block
      width 120px
      border 1px solid rgba(255,255,255,.5)
      padding 5px 0
      border-radius 10px
      .icon
        display inline-block
        font-size 13px
        position relative
        top 1px
        margin-right 2px
  .shortcut
    .list-wrapper
      .favorite-list
        position fixed
        left 30px
        right 30px
        bottom 0
        top 140px
        overflow hidden
        .favorite-list-item
          font-size 12px
          color rgba(255,255,255,.5)
          margin-bottom 20px
          .name
            color #fff
          .singer
            margin-top 10px
      .play-history
        position fixed
        left 30px
        right 30px
        bottom 0
        top 140px
        overflow hidden
        .play-history-item
          font-size 12px
          color rgba(255,255,255,.5)
          margin-bottom 20px
          .name
            color #fff
          .singer
            margin-top 10px
</style>
