<template>
    <div class="rank" ref="rank">
      <scroll ref="scroll" class="scroll" :data="topList">
        <ul class="rank-container">
          <li 
          class="item-block" 
          v-for="(item,index) in topList" 
          :key="index"
          @click.stop.prevent="selectItem(item)">
            <img class="avatar" :src="item.picUrl">
            <div class="container-right">
              <ul class="wrapper">
                <li class="text" v-for="(song,i) in item.songList" :key="i">
                  <span>{{ i+1 }}</span>
                  <span>{{ song.singername }}-{{ song.songname }}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul> 
      </scroll>
      <div class="loading-container" v-if="!topList.length">
        <loading></loading>
      </div>
      <router-view></router-view>
    </div>
</template>

<script>
import {getRank} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins: [playlistMixin],
  props: {},
  methods: {
    ...mapMutations({
      'setToplist': 'SET_TOP_LIST'
    }),
    _getRank() {
      getRank().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    handlePlaylist(list) {
      const bottom = list.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setToplist(item)
    }
  },
  computed: {},
  components: {
    Scroll,
    Loading
  },
  data () {
    return {
      topList: []
    }
  },
  created() {
    this._getRank()
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.scroll
  position fixed
  top 80px
  left 0
  right 0
  bottom 0
  overflow hidden
  .rank-container
    padding-top 20px
    padding-bottom 20px
  .item-block
    display flex
    width 90%
    margin 0 auto
    height 100px
    margin-top 20px
    &:first-child
      margin-top 0
    .avatar
      flex 0 0 100px
      width 100px
      height 100px
    .container-right
      flex 1
      background rgba(255,255,255,.1)
      padding 20px
      .wrapper
        font-size 12px
        color $color-text-d
        .text
          margin-bottom 10px
          &:nth-child(3)
            margin-bottom 0
  .loading-container
    position fixed
    top 80px
    bottom 0
    width 100%
</style>
