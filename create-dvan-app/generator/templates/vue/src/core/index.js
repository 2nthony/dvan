import Vue from 'vue'
import App from '../App.vue'
<% if (VueRouter) { -%>
import { createRouter } from './router'
<% } -%>
<% if (Vuex) { -%>
import { createStore } from './store'
<% } -%>

export function createApp(opts = {}) {
<% if (VueRouter) { -%>
  const router = createRouter()
<% } -%>
<% if (Vuex) { -%>
  const store = createStore()
<% } -%>
  const app = new Vue({
    ...opts,
<% if (VueRouter) { -%>
    router,
<% } -%>
<% if (Vuex) { -%>
    store,
<% } -%>
    render: h => h(App)
  })

  return { app<% if (VueRouter) { %>, router<% } %><% if (Vuex) { %>, store<% } %> }
}
