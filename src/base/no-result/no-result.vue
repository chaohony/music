<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '没有搜索结果'
    }
  },
  methods: {},
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
.no-result
  text-align center
  margin-top 150px
  color rgba(255,255,255,.5)
  .no-result-icon
    display inline-block
    width 86px
    height 96px
    background-size 86px 96px
    margin-bottom 20px
    bg-image('./no-result')
</style>
