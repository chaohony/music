<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag">
      <div class="header">
        <h2 class="title">
          {{ addText }}
          <i class="icon icon-close" @click.stop="hide"></i>
        </h2>
      </div>
      <div class="search-box-container">
        <search-box ref="search-box" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches @chooseIndex="changeIndex" :currentIndex="currentIndex" :switches="switches"></switches>
        <div class="list-wrapper">
          <scroll ref="play-history" class="play-history" :data="playHistory" v-show="currentIndex === 0">
            <ul>
              <li   v-for="(item,index) in playHistory" 
                    :key="index" 
                    class="play-history-item"
                    @click.stop="selectItem(item)"
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
          <scroll class="search-history" v-show="currentIndex === 1">
            <search-list :searches="searchHistory" @select="add" @deleteOne="deleteOne"></search-list>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest  @select="selectSong" 
                  :showSinger="showSinger" 
                  class="suggest" 
                  :query="query" 
                  :reserveBottom="reserveBottom"
                  @beforeScrollStart="beforeScrollStart"
        ></suggest>
      </div>
      <top-tip ref="top-tip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'base/suggest/suggest'
import {searchMixin} from 'common/js/mixin'
import Scroll from 'base/scroll/scroll'
import Switches from 'base/switches/switches'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'
import {Song} from 'common/js/song'
import {mapGetters, mapActions} from 'vuex'
export default {
  mixins: [searchMixin],
  props: {
    addText: {
      type: String,
      default: '添加文案'
    }
  },
  methods: {
    ...mapActions([
      'addSong'
    ]),
    show() {
      this.showFlag = true
      this.$nextTick(() => {
        if (!this.currentIndex) {
          this.$refs['play-history'].refresh()
        } else {
          this.$refs['search-history'].refresh()
        }
      })
    },
    hide() {
      this.showFlag = false
    },
    selectSong() {
      this.saveSearch()
    },
    changeIndex(index) {
      this.currentIndex = index
    },
    selectItem(song) {
      this.addSong(new Song(song))
      this.$refs['top-tip'].show()
    }
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  },
  data () {
    return {
      showFlag: false,
      reserveBottom: false,
      showSinger: false,
      switches: ['最近播放', '搜索历史'],
      currentIndex: 0
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.add-song
  position fixed
  z-index 200
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
  &.slide-enter-active,&.slide-leave-active
    transition all .3s linear
  &.slide-enter,&.slide-leave-to
    transform translate3d(100%,0,0)
  .header
    height 40px
    line-height 40px
    position relative
    text-align center
    font-size 18px
    color #fff
    .icon
      display inline-block
      position absolute
      right 20px
      top 10px
      color $color-theme
      font-size 20px
  .search-box-container
    margin-top 20px
  .search-result
    padding 0 20px
    position relative
    .suggest
      position fixed
      top 100px
      left 20px
      right 20px
      bottom 0
      z-index 0
  .shortcut
    .list-wrapper
      margin-top 40px
      .play-history
        position fixed
        left 30px
        right 30px
        bottom 0
        top 192px
        overflow hidden
        .play-history-item
          font-size 14px
          color rgba(255,255,255,.5)
          margin-bottom 20px
          .name
            color #fff
          .singer
            margin-top 10px
      .search-history
        position fixed
        left 30px
        right 30px
        bottom 0
        top 192px
        overflow hidden
        .search-history-item
          font-size 14px
  .tip-title
    text-align: center
    padding: 18px 0
    font-size: 0
    .icon-ok
      font-size: $font-size-medium
      color: $color-theme
      margin-right: 4px
    .text
      font-size: $font-size-medium
      color: $color-text
</style>
