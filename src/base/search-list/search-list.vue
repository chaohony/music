<template>
  <div class="search-list">
    <ul>
      <li class="search-item" 
          v-for="(item,index) in searches" 
          :key="index"
          @click.stop.prevent="selectItem(item)"    
      >
        <span class="name">
          {{ item }}
        </span>
        <span class="icon">
          <i class="icon-delete" @click.stop.prevent="deleteOne(item)"></i>
        </span>
      </li>
    </ul>
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
  .name
    vertical-align top
  .icon
    font-size 12px
</style>
