<template>
    <div class="app">
      <m-header></m-header>
      <tab></tab>
      <keep-alive>
        <router-view/>
      </keep-alive>
      <player></player>
    </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  props: {},
  methods: {},
  computed: {},
  components: {
    MHeader,
    Tab,
    Player
  },
  data () {
    return {}
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "common/stylus/variable.styl"
@import "common/stylus/mixin.styl"

</style>
