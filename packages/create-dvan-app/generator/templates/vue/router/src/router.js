import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
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
})

export default router
