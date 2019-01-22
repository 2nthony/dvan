import Vue from 'vue'
import Router from 'vue-router'
import { routes } from 'vue-auto-routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { x: 0, y: 0 }
  },
  routes
})

export default () => {
  const app = new Vue({
    router,
    render(h) {
      return h('div', {
        attrs: {
          id: 'app'
        }
      })
    }
  })

  return { app, router }
}
