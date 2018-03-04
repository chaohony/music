<template>
  <div class="play-list">
    <transition name="slide">
      <div class="play-list-wrapper" v-show="showFlag">
        <div class="play-list-container">
          <span class="icon">
            <i :class="iconMode" @click.stop="changeMode"></i>
          </span>
          <h2 class="title">
            <span class="title-left">{{ iconText }}</span>
            <span class="title-right">
              <i class="icon-clear" @click.stop="showConfirm"></i>
            </span>
          </h2>
          <scroll class="song-wrapper" ref="scroll" :data="sequenceList">
            <transition-group name="fall" tag="ul" class="song-container">
              <li ref="song-item" @click.stop="selectItem(item,index)" class="song-block" v-for="(item,index) in sequenceList" :key="item.id">
                <div class="item-left">
                  <i class="current" :class="getCurrentIcon(item)"></i>
                  {{ item.name }}
                </div>
                <div class="icon-group">
                  <i class="icon-group-left" 
                     @click.stop.prevent="toggleFavorite(item)" 
                     :class="getFavorite(item)"
                  ></i>
                  <i class="icon-delete" @click.stop="deleteOne(item)"></i>
                </div>
              </li>
            </transition-group>
          </scroll>
          <div class="add-container">
            <div class="add-block" @click.stop="addSongTo">
              <i class="icon0 icon-add"></i>
              添加歌曲到队列
            </div>
          </div>
          <div class="close" @click.stop="hide">
            关闭
          </div>
        </div>
      </div>
    </transition>
    <transition name="fall">
      <div class="background" v-show="showFlag" @click.stop="hide"></div>
    </transition>
    <confirm @confirm="confirm" @cancel="cancel" ref="confirm" text="是否清空播放列表" confirmText="清空"></confirm>
    <add-song ref="add-song" addText="添加歌曲到列表"></add-song>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import {playMode} from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import {playerMixin} from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'
export default {
  mixins: [playerMixin],
  props: {},
  methods: {
    ...mapMutations({
      'setPlayState': 'SET_PLAY_STATE',
      'setCurrentIndex': 'SET_CURRENT_INDEX'
    }),
    ...mapActions([
      'deleteSong',
      'clearPlaylist'
    ]),
    show() {
      this.showFlag = true
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
        this.scrollToCurrent(this.currentSong)
      })
    },
    hide() {
      this.showFlag = false
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    selectItem(item, index) {
      if (this.playMode === playMode.random) {
        index = this.playList.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.setPlayState(true)
      }
      this.scrollToCurrent(item)
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex((song) => {
        return song.id === current.id
      })
      this.$refs.scroll.scrollToElement(this.$refs['song-item'][index], 500)
    },
    deleteOne(item) {
      this.deleteSong(item)
      setTimeout(() => {
        this.scrollToCurrent(this.currentSong)
      }, 200)
      if (!this.playList.length) {
        this.hide()
      }
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    cancel() {
      // 用户取消操作
    },
    confirm() {
      this.clearPlaylist()
      this.hide()
    },
    addSongTo() {
      this.$refs['add-song'].show()
    }
  },
  computed: {
    ...mapGetters([
      'playing',
      'sequenceList',
      'currentSong',
      'playMode',
      'playList'
    ]),
    iconText() {
      switch (this.iconMode) {
        case 'icon-loop':
          return '单曲循环'
        case 'icon-sequence':
          return '顺序播放'
        case 'icon-random':
          return '随机播放'
        default:
          return ''
      }
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  data () {
    return {
      showFlag: false
    }
  },
  watch: {}
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.play-list-wrapper
  position fixed
  bottom 0
  left 0
  right 0
  background $color-highlight-background
  color #fff
  z-index 152
  &.slide-enter-active,&.slide-leave-active
    transition all .2s linear
  &.slide-enter,&.slide-leave-to
    transform translate3d(0,100%,0)
    opacity 0
  .play-list-container
    position relative
    .icon
      position absolute
      top 13px
      left 20px
      color $color-theme
      font-size 28px
    .title
      padding 20px 20px 0 20px
      display flex
      justify-content space-between
      height 40px
      .title-left
        flex 0 0 100px
        width 100px
        box-sizing border-box
        padding-left 35px
        font-size 14px
        color rgba(255,255,255,.5)
      .title-right
        flex 0 0 20px
        color rgba(255,255,255,.5)
    .song-wrapper
      width 100%
      height 200px
      overflow hidden
      .song-container
        padding 0 20px
        .song-block
          display flex
          height 15px
          justify-content space-between
          margin-bottom 20px
          &.fall-enter-active, &.fall-leave-active
            transition all .1s linear
          &.fall-enter, &.fall-leave-to
            height 0
          .item-left
            color rgba(255,255,255,.5)
            font-size 14px
            padding-left 30px
            position relative
            .current
              position absolute
              left 0
              top 0
              font-size 14px
              color $color-theme
          .icon-group
            color $color-theme
            font-size 14px
            .icon-group-left
              &.icon-favorite
                color #d93f30
            i
              display inline-block
              margin-right 8px
              &:last-child
                margin-right 0
    .add-container
      height 60px
      text-align center
      .add-block
        display inline-block
        width 160px
        height 30px
        border 1px solid rgba(255,255,255,.5)
        border-radius 15px
        line-height 30px
        font-size 13px
        color rgba(255,255,255,.5)
        transform translateY(25%)
  .close
    height 60px
    background $color-background
    text-align center
    line-height 60px
    color rgba(255,255,255,.5)
    font-size 18px
.background
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background #000
  opacity .5
  z-index 151
  &.fall-enter-active,&.fall-leave-active
    transition all .2s linear
  &.fall-enter,&.fall-leave-to
    transform translate3d(0,100%,0)
</style>
