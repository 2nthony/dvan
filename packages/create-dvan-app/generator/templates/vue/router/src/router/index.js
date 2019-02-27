import Vue from 'vue'
import Router from 'vue-router'
<% if (VueAutoRoutes) { -%>
import { routes } from 'vue-auto-routes'
<% } -%>

Vue.use(Router)

const router = new Router({
<% if (VueAutoRoutes) { -%>
  routes,
<% } else { -%>
  routes: [
    {
      path: '/',
      component: () => import('./pages/index.vue')
    },
    {
      path: '/bar',
      component: () => import('./pages/bar.vue')
    }
  ]
<% } -%>
})

export default router
