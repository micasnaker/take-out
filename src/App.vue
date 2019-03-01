<!-- App -->
<template>
  <div id="app">

    <!-- 底部 tabbar -->
      <router-view></router-view>
			<FooterGuid v-show="$route.meta.showFooter"></FooterGuid>
  </div>
</template>

<script>
import FooterGuid from './components/FooterGuid/FooterGuid'
export default {
  data () {
    return {
    }
  },

  components: {
    FooterGuid
  }
}

</script>

<style lang="stylus">
  .app
    width 100%
    height 100%
    background #f5f5f5
</style>
