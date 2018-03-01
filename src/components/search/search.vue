<template>
    <div class="search">
      <search-box ref="search-box" @query="onQueryChange" :placeholder="placeholder"></search-box>
      <div class="hot-wrapper" v-show="!query">
        <h2 class="title">热门搜索</h2>
        <span 
        v-for="(item,index) in hot" 
        :key="index"
        class="item"
        @click.stop.prevent="add(item)">{{ item.k }}</span>
      </div>
      <suggest class="suggest" :query="query" v-show="query"></suggest>
      <router-view></router-view>
    </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHot} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'base/suggest/suggest'
export default {
  props: {},
  methods: {
    _getHot() {
      getHot().then((res) => {
        if (res.code === ERR_OK) {
          this.hot = res.data.hotkey.slice(0, 10)
        }
      })
    },
    onQueryChange(query) {
      this.query = query
    },
    add(item) {
      this.$refs['search-box'].setQuery(item.k)
    }
  },
  computed: {},
  components: {
    SearchBox,
    Suggest
  },
  data () {
    return {
      placeholder: '搜索歌曲、歌手',
      hot: [],
      query: ''
    }
  },
  created() {
    this._getHot()
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.search
  padding-top 20px
  position relative
  .hot-wrapper
    width 90%
    margin 0 auto
    .title
      color rgba(255,255,255,.5)
      margin 20px 0
      font-size 14px
    .item
      display inline-block
      padding 6px 13px
      color rgba(255,255,255,.5)
      background rgba(255,255,255,.1)
      margin-right 15px
      font-size 14px
      border-radius 5px
      margin-bottom 10px
  .suggest
    position fixed
    top 160px
    left 20px
    right 20px
    bottom 0
</style>
