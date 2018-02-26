<template>
    <scroll 
    :listenToScroll="listenToScroll" 
    class="listview" 
    ref="listview" 
    :data="singerList"
    @scroll="scroll">
      <ul class="outer-wrapper">
        <li
        class="outer-item" 
        v-for="(item,index) in singerList" 
        :key="index"
        ref="outer-item">
          <h1 class="title">{{ item.title }}</h1>
          <ul class="inner-wrapper">
            <li 
            v-for="(singer,i) in item.items" 
            :key="i" 
            class="inner-item"
            @click.stop.prevent="_selectItem(singer)">
              <img class="avatar" width="50" height="50" :src="singer.avatar" alt="">
              <span class="name">{{ singer.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div 
      class="menu-list" 
      @touchstart.stop.prevent="_touchstart"
      @touchmove.stop.prevent="_touchmove"
      @touchend.stop.prevent="_touchend">
        <span
        v-for="(item,index) in singerList"
        :key="index"
        class="menu-item"
        :class="{active: index===currentIndex}"
        :data-index="index">
          {{ format(item.title) }}
        </span>
      </div>
      <div 
      class="fixedtop" 
      v-show="singerList.length && fixedTitle"
      ref="fixedtop">
        {{ fixedTitle }}
      </div>
      <div class="loading-container" v-show="!singerList.length">
        <loading></loading>
      </div>
    </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/util'
import Loading from 'base/loading/loading'
const ANCHOR_HEIGHT = 17
const FIXED_HEIGHT = 30
export default {
  props: {
    singerList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    format(str) {
      return str.substring(0, 1)
    },
    scroll(scrollY) {
      this.scrollY = scrollY
      scrollY = Math.abs(scrollY)
      const list = this.listHeight
      for (let i = 0; i < list.length - 1; i++) {
        if (scrollY >= list[i] && scrollY < list[i + 1]) {
          this.currentIndex = i
          this.diff = list[i + 1] - scrollY
          return
        }
      }
    },
    _selectItem(singer) {
      this.$emit('selectItem', singer)
    },
    _calculateHeight() {
      this.listHeight = []
      let items = this.$refs['outer-item']
      let tempHeight = 0
      this.listHeight.push(tempHeight)
      items.forEach((item, index) => {
        tempHeight += item.clientHeight
        this.listHeight.push(tempHeight)
      })
    },
    _touchstart(e) {
      this.touch = {}
      this.touch.initiated = true
      let anchorIndex = getData('index', e.target)
      let firstTouch = e.touches[0]
      this._scrollTo(anchorIndex)
      this.touch.anchorIndex = anchorIndex
      this.touch.y1 = firstTouch.pageY
    },
    _scrollTo(index) {
      let el = this.$refs['outer-item'][index]
      this.$refs.listview.scrollToElement(el)
    },
    _touchmove(e) {
      if (!this.touch.initiated) {
        return
      }
      let nextTouch = e.touches[0]
      this.touch.y2 = nextTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let index = parseInt(this.touch.anchorIndex) + delta
      if (index < 0 || index > 22) {
        return
      }
      this._scrollTo(index)
    },
    _touchend(e) {
      this.touch.initiated = false
    }
  },
  computed: {
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.singerList[this.currentIndex] ? this.singerList[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  data () {
    return {
      currentIndex: 0,
      listenToScroll: true,
      touch: null,
      scrollY: 0,
      diff: 0
    }
  },
  watch: {
    singerList() {
      setTimeout(() => {
        this._calculateHeight()
      })
    },
    diff(newVal) {
      let margin = (newVal > 0 && newVal < FIXED_HEIGHT) ? FIXED_HEIGHT - newVal : 0
      this.$refs.fixedtop.style.transform = `translate3d(0,-${margin}px,0)`
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/mixin.styl"
.listview
  position fixed
  left 0
  top 80px
  bottom 0
  right 0
  overflow hidden
  .inner-wrapper
    padding-bottom 20px
  .outer-item
    width 100%
    .title
      height 30px
      background $color-highlight-background
      padding-left 30px
      line-height 30px
      font-size 12px
      width 100%
      color $color-text-l
  .inner-item
    padding-left 30px
    padding-top 20px
  .avatar
    border-radius 50%
    display inline-block
    margin-right 20px
    vertical-align middle
  .name
    display inline-block
    font-size 14px
    color $color-text-l
    vertical-align middle
  .menu-list
    position fixed
    width 14px
    right 2px
    background $color-background-d
    padding 20px 2px
    border-radius 10px
    top 160px
    font-size 13px
    .menu-item
      display inline-block
      padding 2px 0
      width 100%
      text-align center
      color $color-text-l
      &.active
        color $color-theme
  .fixedtop
    position absolute
    top -1px
    left 0
    right 0
    height 30px
    padding-left 30px
    font-size 12px
    background $color-highlight-background
    color $color-text-l
    line-height 30px
  .loading-container
    position fixed
    left 0
    top 80px
    right 0
    bottom 0
</style>
