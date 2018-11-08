import Vue from 'vue'
import Router from 'vue-router'
import routes from '@modules/vue-auto-routes'

Vue.use(Router)

export default () => {
  const router = new Router({
    mode: __ROUTER_MODE__,
    base: __PUBLIC_PATH__,
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    },
    routes: [
      ...routes,
      {
        path: '*',
        name: '404',
        component: () => {
          return import(/* webpackChunkName: "404" */
            './404.vue'
          )
        }
      }
    ]
  })

  return router
}
