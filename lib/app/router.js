import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter ({ routes }) {
  const router = new Router({
    mode: 'history',
    base: __PUBLIC_PATH__,
    scrollBehavior: () => ({ y: 0 }),
    routes
  })

  return router
}
