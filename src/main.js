import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
// 引入路由和状态管理
import router from 'router'
import store from 'store'
import './registerServiceWorker'
import 'common/stylus/index.styl'
// import './common/stylus/index.styl'
import fastclick from 'fastclick'

// 没有300毫秒延时
fastclick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
