<template>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/recommend">推荐</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/singer">歌手</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/rank">排行</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/search">搜索</router-link>
      </div>
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
.tab
  display flex
  .tab-item
    flex 1 0 0
    text-align center
    height 30px
    line-height 30px
  .active
    color: $color-theme
    border-bottom: 2px solid $color-theme
</style>
