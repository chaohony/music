<template>
  <transition name="slide">
    <div class="confirm" v-show="showFlag">
      <div class="confirm-wrapper">
        <div class="confirm-container">
          <p class="text">{{ text }}</p>
          <div class="btn-group">
            <div @click.stop.prevent="cancel" class="button cancel">{{ cancelText }}</div>
            <div @click.stop.prevent="confirm" class="button yes">{{ confirmText }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '是否清空所有历史数据'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确认'
    }
  },
  methods: {
    show() {
      this.showFlag = true
    },
    hide() {
      this.showFlag = false 
    },
    cancel() {
      this.hide()
      this.$emit('cancel')
    },
    confirm() {
      this.hide()
      this.$emit('confirm')
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
.confirm
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background $color-background-d
  .confirm-wrapper
    position relative
    width 100%
    height 100%
    .confirm-container
      position absolute
      top 50%
      left 50%
      width 300px
      margin-left -150px
      margin-top -50px
      border-radius 10px
      text-align center
      background rgba(255,255,255,.1)
      font-size 0
      .text
        font-size 16px
        padding-top 10px
        color rgba(255,255,255,.5)
        width 100%
        border-1px(rgba(0,0,0,.5))
        position relative
        padding-bottom 15px
      .btn-group
        display flex
        height 40px
        white-space nowrap
        line-height 40px
        .button
          flex 1
          display inline-block
          font-size 16px
          box-sizing border-box
          border-right 1px solid rgba(0,0,0,.5)
          color rgba(255,255,255,.5)
          &:last-child
            border-right none
.slide-enter-active
  animation confirm-fadein .3s linear
  .confirm-container
    animation confirm-zoomin .3s linear
.slide-leave-active
  animation confirm-fadeout .3s linear
  .confirm-container
    animation confirm-zoomout .3s linear
  @keyframes confirm-fadein
    0% 
      opacity 0
    100% 
      opacity 1
  @keyframes confirm-zoomin
    0%
      transform scale(0)
    50%
      transform scale(1.3)
    100%
      transform scale(1)
  @keyframes confirm-fadeout
    0%
      opacity 1
    100%
      opacity 0
  @keyframes confirm-zoomout
    0%
      transform scale(1)
    50%
      transform scale(1.3)
    100%
      transform scale(0)
</style>
