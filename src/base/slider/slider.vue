<template>
    <div class="slier" ref="slider">
      <div class="picGroup" ref="picGroup" @touchstart="_touchevent">
        <slot></slot>
      </div>
      <div class="dots">
        <span v-for="(item,index) in dots" :key="index" class="span" :class="{active: index === currentPage}"></span>
      </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    loop: {
      type: Boolean,
      default: false
    },
    recommends: {
      type: Array,
      default () {
        return []
      }
    },
    auto: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    _touchevent() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    _onScrollEnd() {
      let pageInfo = this.scroll.getCurrentPage()
      this.currentPage = pageInfo.pageX
      if (this.auto) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.scroll.next()
        }, 4000)
      }
    },
    _initWidth(flag) {
      let slider = this.$refs.slider
      let picGroup = this.$refs.picGroup
      this.children = picGroup.children
      if (flag) {
        this.dots = new Array(this.children.length - 2)
      } else {
        this.dots = new Array(this.children.length)
      }
      let unitWidth = slider.clientWidth
      let totalWidth = 0
      for (let i = 0; i < this.children.length; i++) {
        totalWidth += unitWidth
        this.children[i].style.width = unitWidth + 'px'
      }
      if (this.loop && !flag) {
        totalWidth += 2 * unitWidth
      }
      picGroup.style.width = totalWidth + 'px'
      slider.style.width = unitWidth + 'px'
    },
    _initSlider() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.slider, {
          click: true,
          scrollX: true,
          momentum: false,
          snap: {
            loop: true,
            threshold: 0.3,
            speed: 700
          }
        })
        this.scroll.on('scrollEnd', this._onScrollEnd)
        if (this.auto) {
          this.scroll.trigger('scrollEnd')
        }
      }
    }
  },
  computed: {},
  components: {
    BScroll
  },
  data () {
    return {
      children: null,
      dots: [],
      currentPage: 0
    }
  },
  beforeDestroy() {
    this.scroll.disable()
    clearTimeout(this.timer)
  },
  mounted() {
    setTimeout(() => {
      this._initWidth()
      this._initSlider()
      window.addEventListener('resize', () => {
        this._initWidth(true)
      })
    }, 20)
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.slier
  position relative
  .picGroup
    width 100%
    white-space nowrap
  .dots
    position absolute
    bottom 5px
    left 0
    text-align center
    width 100%
    .span
      width 10px
      height 10px
      border-radius 50%
      margin 0 5px
      display inline-block
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
