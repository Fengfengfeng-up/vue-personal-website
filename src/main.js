import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import service from './utils/request'
import '@/icons'
import Message from './components/Message'
import Login from './components/Login'
import { formatTime } from './utils'

if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  // 移动端消除300ms延迟
  require('fastclick').attach(document.body)
}

Vue.use(Message)
Vue.use(Login)

Vue.prototype.$http = service
Vue.prototype.$bus = new Vue()
Vue.prototype.$formatTime = formatTime
Vue.prototype.$setTitle = (title) => {
  document.querySelector('title').innerText = title
}

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
