<template>
    <div class="progress-circle">
      <svg :width="radius" :height="radius" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <circle 
        class="circle"
        :r="15" 
        :cx="20" 
        :cy="20" 
        fill="transparent"
        stroke-width="3"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
        ></circle>
      </svg>
    </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  methods: {},
  computed: {
    dashArray() {
      return Math.PI * 15 * 2
    },
    dashOffset() {
      return -(this.dashArray - this.percent * this.dashArray)
    }
  },
  components: {},
  data () {
    return {}
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.progress-circle
  position absolute
  top 10px
  left -5px
  z-index -1
  .circle
    stroke $color-theme
    transform rotate(0)
</style>
