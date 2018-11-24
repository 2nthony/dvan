import Vue from 'vue'
import createRouter from './router'

import ClientOnly from './components/ClientOnly'
// component for client-only content
Vue.component('ClientOnly', ClientOnly)

const r = require.context('@', true, /\.\/plugins\/\S*\.m?js$/)
const enhances = new Set()
r.keys().forEach(fp => {
  if (r(fp).default) {
    enhances.add(r(fp).default)
  }
})

export default ({ App } = {}) => {
  const router = createRouter()

  const options = {
    router,
    render: h => h(App || require('./App.vue').default)
  }

  if (enhances.size > 0) {
    enhances.forEach(e => e({ Vue, options, router }))
  }

  const app = new Vue(options)

  return { app, router }
}
