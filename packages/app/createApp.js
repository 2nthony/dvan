import Vue from 'vue'
import createRouter from './router'

/* Components */
import ClientOnly from './components/ClientOnly'
// Component for client-only content
Vue.component('ClientOnly', ClientOnly)

const r = require.context('@', true, /\.\/plugins\/\S*\.m?js$/)
const plugins = new Set()
r.keys().forEach(fp => {
  if (r(fp).default) {
    plugins.add(r(fp).default)
  }
})

export default ({ App } = {}) => {
  const router = createRouter()

  const options = {
    router,
    render: h => h(App || require('./App.vue').default)
  }

  if (plugins.size > 0) {
    plugins.forEach(e => e({ Vue, options, router }))
  }

  const app = new Vue(options)

  return { app, router }
}
