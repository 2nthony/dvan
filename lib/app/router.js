import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  const router = new Router({
    scrollBehavior: () => ({ y: 0 })
  })

  return router
}
