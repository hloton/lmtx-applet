import App from './App'
import store from "@/store";
import utils from "@/utils";
import uView from '@/uni_modules/uview-ui' 


import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
Vue.use(utils).use(uView)
uni.$app = app;


// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif