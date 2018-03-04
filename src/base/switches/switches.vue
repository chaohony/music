<template>
  <div class="switches">
    <ul class="switches-wrapper">
      <li @click.stop="chooseIndex(index)" class="switches-item" :class="{active: currentIndex === index}" v-for="(item,index) in switches" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default() {
        return ['列表项1', '列表项2']
      } 
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    chooseIndex(index) {
      this.$emit('chooseIndex', index)
    }
  },
  computed: {},
  components: {},
  data () {
    return {}
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.switches
  .switches-wrapper
    text-align center
    margin-top 20px
    .switches-item
      display inline-block
      padding 0 30px
      height 30px
      line-height 30px
      background $color-background
      border 1px solid rgba(255,255,255,.1)
      font-size 14px
      color rgba(255,255,255,.5)
      &.active
        color #ffffff
        background #333
      &:first-child
        border-top-left-radius 8px
        border-bottom-left-radius 8px
        border-right none
      &:last-child
        border-left none
        border-top-right-radius 8px
        border-bottom-right-radius 8px
</style>
