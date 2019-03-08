/* eslint-env browser */
import Vue from 'vue'
import App from './App.vue'
<% if (VueRouter) { -%>
import router from './router'
<% } -%>
<% if (Vuex) { -%>
import store from './store'
<% } -%>

new Vue({
<% if (VueRouter) { -%>
  router,
<% } -%>
<% if (Vuex) { -%>
  store,
<% } -%>
  render: h => h(App)
}).$mount('#app')
