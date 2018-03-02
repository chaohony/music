<template>
    <div class="scroll" ref="scroll">
      <slot></slot>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'
export default {
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 3
    },
    scrollY: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    listenToScroll: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    onScroll(pos) {
      this.scroll && this.$emit('scroll', pos.y)
    },
    scrollToElement(el, time = 300) {
      this.scroll && this.scroll.scrollToElement(el, time)
    },
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    _initScroll() {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scroll, {
          probeType: this.probeType,
          click: this.click,
          eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
        })
        if (this.listenToScroll) {
          this.scroll.on('scroll', this.onScroll)
        }
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScrollStart')
          })
        }
      })
    }
  },
  computed: {},
  components: {},
  data () {
    return {}
  },
  mounted() {
    this._initScroll()
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"

</style>
