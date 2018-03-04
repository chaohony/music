<template>
    <div class="header">
      <img class="header-img" width="30" height="30" src="../../common/image/default.png"/>
      <span class="header-title">Chicken Music</span>
      <router-link to="/user" class="mine" tag="div">
        <i class="icon-mine"></i>
      </router-link>
    </div>
</template>

<script>
export default {
  props: {},
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
.header
  text-align center
  height 50px
  line-height 50px
  position relative
  .header-title
    font-size 16px
    vertical-align middle
  .header-img
    vertical-align middle
    margin-right 10px
    position relative
    top -4px
  .mine
    position absolute
    right 13px
    top 2px
    color $color-theme
    font-size 20px
</style>
