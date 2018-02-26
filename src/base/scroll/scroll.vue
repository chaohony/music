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
      default: false
    },
    direction: {
      type: String,
      default: DIRECTION_V
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
    }
  },
  computed: {},
  components: {},
  data () {
    return {}
  },
  mounted() {
    if (!this.scroll) {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scroll, {
          probeType: this.probeType,
          click: this.click,
          eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
        })
        if (this.listenToScroll) {
          this.scroll.on('scroll', this.onScroll)
        }
      })
    }
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
