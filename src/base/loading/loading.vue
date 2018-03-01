<template>
  <div class="loading" ref="loading">
    <img width="20" height="20" src="./loading.gif">
  </div>
</template>

<script>
export default {
  props: {
    noPadding: {
      type: Boolean,
      default: false
    }
  },
  methods: {},
  computed: {},
  components: {},
  data () {
    return {}
  },
  mounted() {
    if (this.noPadding) {
      this.$refs.loading.style.paddingTop = '5%'
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
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
