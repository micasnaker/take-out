<!--  -->
<template>
  <div>
      <ShopHeader></ShopHeader>
      <div class="tab">
        <div class="tab-item">
          <!-- replace 加上replace: true后，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。 -->
          <router-link to="/shop/goods" replace>点餐</router-link>
        </div>
        <div class="tab-item">
          <router-link to="/shop/ratings" replace>评价</router-link>
        </div>
        <div class="tab-item">
          <router-link to="/shop/info" replace>商家</router-link>
        </div>
      </div>

  <!-- 缓存路由组件对象 --> 
  <!-- 好处：复用路由组件对象，复用路由组件获取的后台数据 -->
      <keep-alive>
      <router-view></router-view>
      </keep-alive>
  </div>
</template>

<script>
import ShopHeader from '../../components/ShopHeader/ShopHeader'
export default {
  data () {
    return {
    };
  },

  components: {
    ShopHeader
  },

  computed: {},

  mounted(){
    this.$store.dispatch('getShopInfo')
  },

  methods: {}
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
 @import "~@/common/stylus/mixins.styl";
.tab
    height 40px
    line-height 40px
    background #fff
    bottom-border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      float left
      width: 33.33333%
      text-align center
      font-size 14px
      color rgb(77, 85, 93)
      a
        display block
        position relative
        &.router-link-active
          color #02a774
          &::after
            content ''
            position absolute
            left 50%
            bottom 1px
            width 35px
            height 2px
            transform translateX(-50%)
            background #02a774
</style>