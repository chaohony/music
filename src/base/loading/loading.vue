<template>
  <div class="loading">
    <img width="40" height="40" src="./loading.gif">
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
.loading
  text-align center
  width 100%
  padding-top 50%
  line-height 100%
  img
    display inline-block
</style>
