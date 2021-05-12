import Vue from 'vue'
import App from './App.vue'
import VueTippy from "vue-tippy";
import vb from 'vue-babylonjs';
//TODO: FOR SOME GOD FORSAKEN REASON THE SCSS WON'T WORK AND THE LIBRARIES ARE ALL MESSED UP



Vue.config.productionTip = false
Vue.use(vb);
Vue.use(VueTippy);

new Vue({
  render: h => h(App),
}).$mount('#app')
