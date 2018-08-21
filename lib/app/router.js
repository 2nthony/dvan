import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const r = require.context('@pages', true, /\.(vue|js)$/)
const routes = r.keys().map(fp => {
  if (/\.(vue|js)$/.test(fp)) {
    fp = fp.replace(/^\.\//, '').replace(/\.(vue|js)$/, '')
    return {
      path: `/${fp.replace(/index/g, '')}`,
      name: fp.replace(/\//g, '-'),
      component: () => import(`@pages/${fp}`)
    }
  }
})

export function createRouter () {
  const router = new Router({
    mode: 'history',
    base: __PUBLIC_PATH__,
    scrollBehavior: () => ({ y: 0 }),
    routes
  })

  return router
}
