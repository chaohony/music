<template>
  <div class="search-box">
    <i class="icon-search icon"></i>
    <input 
    type="text" 
    v-model="query" 
    :placeholder="placeholder"
    ref="input">
    <i 
    class="icon-dismiss icon" 
    v-show="query"
    @click.stop.prevent="clearAll"></i>
  </div>
</template>

<script>
import {debounce} from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    clearAll() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    },
    blur() {
      this.$refs.input.blur()
    }
  },
  computed: {},
  components: {},
  data () {
    return {
      query: ''
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.search-box
  width 90%
  margin 0 auto
  height 40px
  border-radius 5px
  background rgba(255,255,255,.1)
  line-height 30px
  .icon
    display inline-block
    font-size 25px
    color $color-background
    position relative
    top 6px
    left 6px
    &.icon-dismiss
      font-size 15px
      top 0
  input
    height 100%
    display inline-block
    width 80%
    background transparent 
    position relative
    top 1px
    text-indent 7px
    outline none
    color $color-text-d
</style>
