import 'babel-polyfill'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "video.js/dist/video-js.min.css"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueApollo from 'vue-apollo'
import BootstrapVue from 'bootstrap-vue'
import store from './store'
import client from './client'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

Vue.config.productionTip = false;

Vue.use(VueApollo)
Vue.use(BootstrapVue)
Vue.component('VueSlider', VueSlider)

const apolloProvider = new VueApollo({
  defaultClient: client,
})

const app = new Vue({
  router,
  apolloProvider,
  store,
  render: h => h(App),
})
app.$mount('#root');
