<template>
  <div class="search-list">
    <transition-group tag="ul" name="slide">
      <li class="search-item" v-for="item in searches" :key="item" @click.stop.prevent="selectItem(item)">
        <span class="name">
          {{ item }}
        </span>
        <span class="icon">
          <i class="icon-delete" @click.stop.prevent="deleteOne(item)"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectItem(query) {
      this.$emit('select', query)
    },
    deleteOne(query) {
      this.$emit('deleteOne', query)
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
.search-item
  display flex
  justify-content space-between
  padding-bottom 15px
  font-size 14px
  height 25px
  line-height 25px
  &.slide-enter-active,&.slide-leave-active
    transition all 0.2s linear
  &.slide-enter,&.slide-leave-to
    height 0
</style>
