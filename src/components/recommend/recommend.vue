<template>
    <div class="recommend">
      <scroll :data="discList" class="recommend-content" ref="scroll">
        <div>
          <div class="banner" ref="banner" v-if="recommends.length > 0">
            <slider :recommends="recommends" :loop="loop" :auto="auto">
              <div v-for="(item,index) in recommends" :key="index" class="pic-item" ref="pic">
                <a :href="item.linkUrl" class="pic-a">
                  <img width="100%" :src="item.picUrl" class="pic-img">
                </a>
              </div>
            </slider>
          </div>
          <div class="discList" ref="discList">
            <h1 class="title">热门歌单推荐</h1>
            <ul class="disc">
              <li v-for="(item,index) in discList" :key="index" class="disc-item">
                <img class="image" width="60" height="60" v-lazy="item.imgurl">
                <div class="block">
                  <span class="name" v-html="item.creator.name"></span>
                  <span class="desc" v-html="item.dissname"></span>
                </div>
              </li>
            </ul>
          </div>
          <div class="loading-container" v-if="!discList.length">
            <loading></loading>
          </div>
        </div>
      </scroll>
    </div>
</template>

<script>
import {getRecommends, getDiscList} from 'api/recommend'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {ERR_OK} from 'api/config'
export default {
  props: {},
  methods: {
    _getRecommends() {
      getRecommends().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (ERR_OK === res.code) {
          this.discList = res.data.list
        }
      })
    }
  },
  computed: {},
  components: {
    Slider,
    Scroll,
    Loading
  },
  data () {
    return {
      recommends: [],
      loop: true,
      auto: true,
      discList: []
    }
  },
  mounted() {
    this._getRecommends()
    this._getDiscList()
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.recommend
  position fixed
  top 80px
  bottom 0
  width 100%
  .recommend-content
    height 100%
    overflow hidden
  .banner
    width 100%
    overflow hidden
    .pic-item
      display inline-block
  .discList
    padding 10px
    .title
      text-align center
      color $color-theme
      font-size 13px
      padding 10px 0 20px 0
    .disc
      font-size 0
      .disc-item
        margin-bottom 20px
        display flex
        .image
          display inline-block
          margin-right 20px
          vertical-align top
          flex 0 0 60px
          width 60px
        .block
          flex 1
          white-space wrap
          .name
            display block
            padding-top 10px
            padding-bottom 10px
            vertical-align top
            font-size 14px
          .desc
            font-size 14px
            color rgba(255,255,255,.3)
  .loading-container
    position fixed
    top 80px
    bottom 0
    width 100%
</style>
