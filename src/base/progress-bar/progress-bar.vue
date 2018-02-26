<template>
    <div class="progress-bar">
      <div class="wrapper">
        <span class="currentTime">{{ time }}</span>
        <div 
        class="bar-container" 
        ref="bar-container"
        @click.stop.prevent="click">
          <div class="bar-progress" ref="bar-progress">
            <div class="btn"
            @touchstart.stop.prevent="touchstart"
            @touchmove.stop.prevent="touchmove"
            @touchend.stop.prevent="touchend"></div>
          </div>
        </div>
        <span class="duration">{{ fixedDuration }}</span>
      </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  props: {
    duration: {
      type: Number,
      default: 0
    },
    currentTime: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapMutations({
      setPlay: 'SET_PLAY_STATE'
    }),
    click(e) {
      if (!this.touch.clientWidth) {
        this.touch.clientWidth = this.$refs['bar-container'].clientWidth
      }
      let x1 = e.clientX
      let {left} = this.$refs['bar-container'].getBoundingClientRect()
      let sliderPercent = (x1 - left) / this.touch.clientWidth
      this.$emit('slide', sliderPercent)
      if (!this.playing) {
        this.setPlay(true)
      }
    },
    touchstart(e) {
      this.touch.initiated = true
      if (!this.touch.clientWidth) {
        this.touch.clientWidth = this.$refs['bar-container'].clientWidth
      }
      this.touch.x1 = e.touches[0].clientX
      let {left} = this.$refs['bar-container'].getBoundingClientRect()
      this.touch.left = left
      this.touch.currentWidth = parseInt(this.$refs['bar-progress'].style.width)
      this.sliderPercent = (this.touch.x1 - left) / this.touch.clientWidth
    },
    touchmove(e) {
      if (!this.touch.initiated) {
        return
      }
      this.touch.x2 = e.touches[0].clientX
      // 处理进度条长度逻辑
      let offset = this.touch.x2 - this.touch.x1
      this._offsetWidth(this.touch.currentWidth, offset)
      // 处理时间逻辑
      let offsetTime = offset / this.touch.clientWidth * this.duration
      this.time = this._formatTime(parseInt(this.currentTime + offsetTime))
    },
    touchend(e) {
      let deltaPercent = (this.touch.x2 - this.touch.x1) / this.touch.clientWidth
      if (!deltaPercent) {
        this.$emit('slide', this.sliderPercent)
      } else {
        let currentPercent = this.touch.currentWidth / this.touch.clientWidth
        this.$emit('addSlide', currentPercent, deltaPercent)
        this.touch.x2 = undefined
      }
      if (!this.playing) {
        this.setPlay(true)
      }
      this.touch.currentWidth = ''
      this.touch.initiated = false
    },
    timeupdate() {
      if (!this.touch.initiated) {
        setTimeout(() => {
          this.time = this._formatTime(this.currentTime)
        }, 0)
      }
    },
    _paddingWithZero(s) {
      s = s + ''
      return ('00' + s).substring(s.length)
    },
    _offsetWidth(currentWidth, offset) {
      let progress = this.$refs['bar-progress']
      progress.style.width = currentWidth + offset + 'px'
    },
    _formatTime(time) {
      let m = time / 60 | 0
      let s = this._paddingWithZero(time % 60)
      if (time <= 0) {
        return '0:00'
      } else if (time >= this.duration) {
        return this.fixedDuration
      }
      return `${m}:${s}`
    }
  },
  computed: {
    fixedDuration() {
      let m = this.duration / 60 | 0
      let s = this._paddingWithZero(this.duration % 60)
      return `${m}:${s}`
    },
    percent() {
      let percent = this.currentTime / this.duration
      return percent
    },
    ...mapGetters([
      'playing'
    ])
  },
  watch: {
    percent(newP, oldP) {
      if (!this.touch.initiated) {
        let progress = this.$refs['bar-progress']
        let container = this.$refs['bar-container']
        let totalWidth = container.clientWidth
        progress.style.width = totalWidth * newP + 'px'
      }
    }
  },
  components: {},
  data () {
    return {
      touch: {},
      time: '0.00'
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.progress-bar
  position absolute
  bottom 120px
  left 30px
  right 30px
  .wrapper
    position relative
    width 100%
    box-sizing border-box
    padding 0 30px
    .currentTime,.duration
      display inline-block
      font-size 12px
    .currentTime
      position absolute
      left -10px
      top 6px
    .duration
      position absolute
      right -10px
      top 6px
    .bar-container
      display inline-block
      width 100%
      height 5px
      background $color-background-d
      .bar-progress
        height 5px
        max-width 100%
        width 0
        background $color-theme
        position relative
        .btn
          position absolute
          right -8px
          top -5px
          width 16px
          height 16px
          border-radius 50%
          background #fff
          &::after
            display block
            content ''
            width 12px
            height 12px
            background $color-theme
            border-radius 50%
            position absolute
            top 2px
            right 2px
</style>
