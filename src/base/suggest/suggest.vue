<template>
  <scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" ref="scroll" :beforeScroll="beforeScroll" @beforeScrollStart="beforeScrollStart">
    <ul class="suggest-wrapper">
      <li v-for="(item,index) in result" :key="index" class="suggest-item" @click.stop.prevent="selectItem(item)">
        <div class="icon">
          <i :class="getIcon(item)"></i>
        </div>
        <div class="name">
          {{ getName(item) }}
        </div>
      </li>
      <loading :noPadding="true" class="loading" v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result text="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import {getSearch} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {Singer} from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
import NoResult from 'base/no-result/no-result'
const perpage = 20
const TYPE_SINGER = 'singer'
export default {
  mixins: [playlistMixin],
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    reserveBottom: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    ...mapActions([
      'addSong'
    ]),
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    search() {
      this.page = 1
      this.$refs.scroll.scrollTo(0, 0, 0)
      this.hasMore = true
      getSearch(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      getSearch(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    _checkMore(list) {
      const song = list.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({
          ...data.zhida,
          ...{type: TYPE_SINGER}
        })
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item, index) => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    getIcon(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      } 
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.addSong(item)
      }
      this.$emit('select')
    },
    handlePlaylist(playlist) {
      if (!this.reserveBottom) {
        return
      }
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    beforeScrollStart() {
      this.$emit('beforeScrollStart')
    }
  },
  computed: {},
  components: {
    Scroll,
    Loading,
    NoResult 
  },
  watch: {
    query(newQ) {
      this.search(newQ)
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true
    }
  },
  created() {
    this.beforeScroll = true
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.suggest
  overflow hidden
  background $color-background
.suggest-item
  height 30px
  line-height 30px
  color rgba(255,255,255,.5)
  white-space nowrap
  overflow hidden 
  text-overflow ellipsis
.icon
  display inline-block
.name
  display inline-block
  font-size 14px
  vertical-align top
  padding-left 10px
</style>
