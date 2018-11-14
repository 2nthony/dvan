/* global __ROUTER_MODE__, __PUBLIC_PATH__ */

import Vue from 'vue'
import Router from 'vue-router'
import { routes } from '@modules/vue-auto-routes'

Vue.use(Router)

export default () => {
  let NotFound

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
      ...(routes.filter(route => {
        if (route.path !== '/404') {
          return route
        } else {
          NotFound = route
        }
      })),

      // 404
      Object.assign({
        component: () => import(/* webpackChunkName: "404" */ './404.vue')
      }, NotFound, { path: '*' })
    ]
  })

  return router
}
