<template>
  <transition name="fall">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  methods: {
    show() {
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide() {
      this.showFlag = false
    }
  },
  computed: {},
  components: {},
  data () {
    return {
      showFlag: false
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.top-tip
  position fixed
  top 0
  width 100%
  z-index 500
  background $color-dialog-background
  &.fall-enter-active,&.fall-leave-active
    transition all .3s
  &.fall-enter,&.fall-leave-to
    transform translate3d(0, -100%, 0)
</style>
