import Vue from 'vue'
import Router from 'vue-router'
import routes from 'vue-auto-routes'

Vue.use(Router)

export default () => {
  const router = new Router({
    mode: 'hash',
    routes
  })

  return router
}
