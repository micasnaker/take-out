// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {Button} from 'mint-ui'
import './mock/mockServer' // 加载mockServer 即可
import VueLazyload from 'vue-lazyload'
import loading from './common/imgs/loading.gif'
import './filters' // 加载过滤器

// 注册全局组件标签
Vue.component(Button.name, Button) // <mt-button></mt-button>

Vue.use(VueLazyload, { // 内部自定义了一个在指令 v-lazy
  loading
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  render: h => h(App),
  template: '<App/>',
  router, // 使用上 Vue-router
  store, // 使用上 Vuex
  VueLazyload // 使用上 VueLazyload
})
