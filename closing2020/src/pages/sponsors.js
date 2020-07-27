import Vue from 'vue'
import Sponsors from './Sponsors.vue'

// import './assets/style/index.scss'
Vue.config.productionTip = false

window.puppeteer = false

new Vue({
  render: h => h(Sponsors),
}).$mount('#app')