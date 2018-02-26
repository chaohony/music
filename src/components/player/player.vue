<template>
    <div class="player" v-show="playList.length > 0">
      <transition 
      name="fly"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave">
        <div class="normal-player" v-show="fullScreen">
          <div class="player-container">
            <img :src="currentSong.image" class="filter-image">
            <div class="back">
              <i class="icon-back" @click.stop.prevent="toggleSkin"></i>
            </div>
            <h5 class="name">{{ currentSong.name }}</h5>
            <h5 class="singer">{{ currentSong.singer }}</h5>
            <div 
            class="cd-wrapper"
            @touchstart.stop.prevent="touchstart"
            @touchmove.stop.prevent="touchmove"
            @touchend.stop.prevent="touchend"
            ref="cd-wrapper">
              <div class="cd-container" ref="cd-container">
                <img class="cd" ref="cd" :class="run_pause" :src="currentSong.image">
                <p class="currentLyric">{{ currentLine }}</p>
              </div>
            <div class="dots">
              <span class="dot" :class="{active: currentShow === 'cd'}"></span>
              <span class="dot" :class="{active: currentShow === 'lyric'}"></span>
            </div>
            </div>
            <progress-bar 
            :currentTime="currentTime"
            :duration="duration"
            @slide="slide"
            @addSlide="addSlide"
            ref="progress-bar"></progress-bar>
            <div class="btn-group">
              <span class="btn-l-l">
                <i class="icon" :class="iconMode" @click.stop.prevent="changeMode"></i>
              </span>
              <span class="btn-l">
                <i class="icon icon-prev" :class="{disable: !songReady}" @click.stop="prev"></i>
              </span>
              <span class="btn-m">
                <i 
                class="icon icon-b" 
                :class="[icon_play,{disable: !songReady}]" 
                @click.stop.prevent="togglePlay"></i>
              </span>
              <span class="btn-r">
                <i class="icon icon-next" :class="{disable: !songReady}" @click.stop="next"></i>
              </span>
              <span class="btn-r-r">
                <i class="icon icon-not-favorite"></i>
              </span>
            </div>
          </div>
          <scroll 
          class="lyric-container" 
          v-if="currentLyric" 
          :data="currentLyric.lines"
          ref="lyric-container">
            <ul class="lyric-wrapper">
              <li 
              :class="{active: index === currentLyricNum}" 
              class="lyric-item" 
              v-for="(line, index) in currentLyric.lines" 
              :key="index"
              ref="lyric-line">
                {{ line.txt }}
              </li>
            </ul>
          </scroll>
        </div>
      </transition>
      <div class="mini-player" v-show="!fullScreen" @click="showFullScreen">
        <div class="left">
          <div class="left-image-wrapper" ref="left-image">
            <img class="left-image" :class="run_pause" :src="currentSong.image">
          </div>
          <div class="intro">
            <div class="name">{{ currentSong.name }}</div>
            <div class="singer">{{ currentSong.singer }}</div>
          </div>
        </div>
        <div class="right">
          <div class="play">
            <i :class="icon_play" @click.stop.prevent="togglePlay"></i>
            <progress-circle :radius="radius" :percent="percent">
            </progress-circle>
          </div>
          <div class="list">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </div>
      <audio 
      ref="audio" 
      :src="currentSong.url"
      @canplay="ready"
      @timeupdate="timeupdate"
      @ended="end"></audio>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressCircle from 'base/progress-circle/progress-circle'
import ProgressBar from 'base/progress-bar/progress-bar'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
export default {
  props: {},
  methods: {
    ...mapMutations({
      setState: 'SET_PLAY_STATE',
      setIndex: 'SET_CURRENT_INDEX',
      setScreen: 'SET_FULLSCREEN',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    }),
    togglePlay() {
      if (this.playing) {
        this.setState(false)
      } else {
        this.setState(true)
      }
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    toggleSkin() {
      this.setScreen(false)
    },
    showFullScreen() {
      this.setScreen(true)
    },
    next() {
      if (!this.songReady) {
        return
      }
      if (!this.playing) {
        this.setState(true)
      }
      if (this.playList.length === 1) {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      } else {
        if (this.currentIndex + 1 < this.playList.length) {
          this.setIndex(this.currentIndex + 1)
        } else {
          this.setIndex(0)
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      }
    },
    prev() {
      if (!this.songReady) {
        return
      }
      if (!this.playing) {
        this.setState(true)
      }
      if (this.playList.length === 1) {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      } else {
        if (this.currentIndex - 1 >= 0) {
          this.setIndex(this.currentIndex - 1)
        } else {
          this.setIndex(this.playList.length - 1)
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      }
    },
    ready() {
      this.songReady = true
    },
    end() {
      if (this.playMode === playMode.loop) {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
        return
      }
      this.next()
    },
    _getPos() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    enter(el, done) {
      const {x, y, scale} = this._getPos()
      
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs['cd-container'], 'move', done)
    },
    afterEnter(el) {
      animations.unregisterAnimation('move')
      this.$refs['cd-container'].style.animation = ''
    },
    leave(el, done) {
      const {x, y, scale} = this._getPos()
      let cdContainer = this.$refs['cd-container']
      cdContainer.style.transition = `all 0.4s`
      cdContainer.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
      cdContainer.addEventListener('transitionend', done)
    },
    afterLeave(el) {
      let cdContainer = this.$refs['cd-container']
      cdContainer.style.transition = ''
      cdContainer.style.transform = ''
    },
    timeupdate(e) {
      this.currentTime = e.target.currentTime | 0
      this.$refs['progress-bar'].timeupdate()
    },
    slide(percent) {
      const temptime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = temptime
      if (this.currentLyric) {
        this.currentLyric.seek(temptime * 1000)
      }
    },
    addSlide(cur, delta) {
      const temptime = Math.round(this.currentSong.duration * (cur + delta))
      this.$refs.audio.currentTime = temptime
      if (this.currentLyric) {
        this.currentLyric.seek(temptime * 1000)
      }
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item, index) => {
        return this.currentSong.id === item.id
      })
      this.setIndex(index)
    },
    changeMode() {
      this.setPlayMode((this.playMode + 1) % 3)
      let list = null
      if (this.playMode === playMode.random) {
        let temp = this.sequenceList.slice()
        list = shuffle(temp)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    handleLyric({lineNum, txt}) {
      this.currentLyricNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs['lyric-line'][lineNum - 5]
        this.$refs['lyric-container'].scrollToElement(lineEl, 1000)
      } else {
        this.$refs['lyric-container'].scrollTo(0, 0, 1000)
      }
      this.currentLine = txt
    },
    getLyric() {
      this.currentSong.getLyric().then((res) => {
        this.currentLyric = new Lyric(res, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.currentLyric = 0
      })
    },
    touchstart(e) {
      this.touch.initiated = true
      this.touch.x1 = e.touches[0].clientX
      this.touch.y1 = e.touches[0].clientY
    },
    touchmove(e) {
      if (!this.touch.initiated) {
        return
      }
      this.touch.x2 = e.touches[0].clientX
      this.touch.y2 = e.touches[0].clientY
      let deltaX = this.touch.x2 - this.touch.x1
      let deltaY = this.touch.y2 - this.touch.y2
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      let offset = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offset / window.innerWidth)
      this.$refs['lyric-container'].$el.style.transform = `translate3d(${offset}px,0,0)`
      this.$refs['cd-container'].style.opacity = 1 - this.touch.percent
    },
    touchend() {
      this.touch.initiated = false
      let offset
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offset = -window.innerWidth
          this.currentShow = 'lyric'
          opacity = 0
        } else {
          offset = 0
        }
      } else {
        if (this.touch.percent < 0.9) {
          offset = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offset = -window.innerWidth
        }
      }
      this.$refs['lyric-container'].$el.style.transform = `translate3d(${offset}px,0,0)`
      this.$refs['lyric-container'].$el.style['transition-duration'] = `300ms`
      this.$refs['cd-container'].style.opacity = opacity
    }
  },
  computed: {
    ...mapGetters([
      'playList',
      'currentSong',
      'playing',
      'currentIndex',
      'fullScreen',
      'playMode',
      'sequenceList'
    ]),
    icon_play() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    run_pause() {
      return this.playing ? '' : 'pause'
    },
    duration() {
      return this.currentSong.duration
    },
    percent() {
      return this.currentTime / this.duration
    },
    iconMode() {
      return this.playMode === playMode.sequence ? 'icon-sequence' : this.playMode === playMode.random ? 'icon-random' : 'icon-loop'
    }
  },
  watch: {
    playing(newPlaying) {
      this.$nextTick(() => {
        if (newPlaying) {
          this.$refs.audio.play()
        } else {
          this.$refs.audio.pause()
        }
      })
    },
    currentSong(newSong, oldSong) {
      if (newSong.id !== oldSong.id) {
        this.songReady = false
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
          this.getLyric()
        })
      }
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  data () {
    return {
      songReady: false,
      currentTime: 0,
      radius: 40,
      currentLyric: null,
      currentLyricNum: 0,
      currentShow: 'cd',
      currentLine: ''
    }
  },
  created() {
    this.touch = {}
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.player
  .normal-player
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 150
    background $color-background
    transition all .4s linear
    &.fly-enter-active,&.fly-leave-active
      .name,.singer,.btn-group
        transition all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.fly-enter,&.fly-leave-to
      opacity 0
      .name
        transform translate3d(0,-40px,0)
      .singer
        transform translate3d(0,-60px,0)
      .btn-group
        transform translate3d(0,90px,0)
    .player-container
      width 100%
      height 100%
      position relative
      .filter-image
        display inline-block
        opacity .6
        width 100%
        filter blur(20px)
        height 100%
        position absolute
        top 0
        left 0
        z-index -1
      .back
        position absolute
        left 20px
        top 20px
        transform rotate(-90deg)
        i
          font-size 25px
          color $color-theme
      .name
        height 40px
        line-height 40px
        text-align center
        font-size 18px
      .singer
        height 20px
        line-height 20px
        text-align center
        font-size 14px
      .cd-wrapper
        width 100%
        margin-top 30px
        padding-bottom 120px
        .cd-container
          width 70%
          margin 0 auto
          border-radius 50%
          height 0
          padding-top 70%
          position relative
          border 10px solid rgba(255,255,255,.1)
          .cd
            animation rotate 20s linear infinite
            width 100%
            position absolute
            border-radius 50%
            top 0
            left 0
            &.pause
              animation-play-state paused
          .currentLyric
            font-size 14px
            position absolute
            left 0
            right 0
            bottom -70px
            text-align center
            color rgba(255,255,255,.5)
      .dots
        position absolute
        bottom 150px
        left 0
        right 0
        text-align center
        font-size 0
        .dot
          display inline-block
          width 10px
          height 10px
          background rgba(255,255,255,1)
          border-radius 50%
          margin-right 5px
          &.active
            width 25px
            border-radius 5px
      .btn-group
        position absolute
        bottom 50px
        left 0
        box-sizing border-box
        padding 0 40px
        width 100%
        display flex
        justify-content space-between
        align-items center
        touch-action none
        .icon
          font-size 30px
          color $color-theme
          &.icon-b
            font-size 40px
          &.disable
            color $color-theme-d
    .lyric-container
      position fixed
      left 100%
      top 90px
      bottom 200px
      width 100%
      overflow hidden
      text-align center
      font-size 14px
      z-index -1
      .lyric-item
        margin-bottom 16px
        color $color-text-l
        &.active
          color #fff
  .mini-player
    position fixed
    left 0
    bottom 0
    height 60px
    right 0
    background $color-highlight-background
    display flex
    justify-content space-between
    .left
      flex 1 0 100px
      .left-image-wrapper
        display inline-block
        margin 10px 5px 0 10px
        width 40px
        height 40px
        .left-image
          display inline-block
          width 40px
          height 40px
          border-radius 50%
          animation rotate 20s linear infinite
          &.pause
            animation-play-state paused
      .intro
        display inline-block
        vertical-align top
        margin-top 15px
        .name
          font-size 14px
          margin-bottom 5px
        .singer
          font-size 12px
          color $color-text-d
    .right
      flex 0 0 90px
      color $color-theme
      position relative
      .play
        display inline-block
        font-size 30px
        margin-right 10px
        margin-top 15px
      .list
        display inline-block
        font-size 30px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
