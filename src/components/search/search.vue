<template>
    <div class="search">
      <search-box ref="search-box" @query="onQueryChange" :placeholder="placeholder"></search-box>
      <scroll ref="scroll" class="shortcut" :data="shortcut">
        <div class="shortcut-container">
          <div class="hot-wrapper" v-show="!query">
            <h2 class="title">热门搜索</h2>
            <span v-for="(item,index) in hot" :key="index" class="item" @click.stop.prevent="add(item)">{{ item.k }}</span>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h2 class="title">
              <span class="history">搜索历史</span>
              <span class="icon">
                <i class="icon-clear" @click.stop.prevent="showConfirm"></i>
              </span>
            </h2>
            <search-list :searches="searchHistory" @select="add" @deleteOne="deleteOne"></search-list>
          </div>
        </div>
      </scroll>
      <suggest class="suggest" :query="query" v-show="query" @beforeScrollStart="beforeScrollStart" @select="saveSearch">
      </suggest>
      <confirm ref="confirm" @cancel="cancel" @confirm="confirm">
      </confirm>
      <router-view></router-view>
    </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHot} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'base/suggest/suggest'
import {mapActions, mapGetters} from 'vuex'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {playlistMixin} from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  props: {},
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'deleteAll'
    ]),
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
      if (item.k) {
        this.$refs['search-box'].setQuery(item.k)
        return
      }
      this.$refs['search-box'].setQuery(item)
    },
    beforeScrollStart() {
      this.$refs['search-box'].blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    deleteOne(query) {
      this.deleteSearchHistory(query)
    },
    clear() {
      this.deleteAll()
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    cancel() {
      // 用户触发了取消删除操作
    },
    confirm() {
      this.clear()
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
    shortcut() {
      return this.hot.concat(this.searchHistory)
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
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
    this.$watch('query', (newQuery) => {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    })
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.search
  padding-top 20px
  .shortcut
    position fixed
    top 140px
    bottom 0
    left 0
    right 0
    z-index -1
    overflow hidden
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
    z-index 0
  .search-history
    padding 20px
    color rgba(255,255,255,.5)
    font-size 14px
    .title
      display flex
      justify-content space-between
      .history
        vertical-align top
        margin-bottom 20px
</style>
