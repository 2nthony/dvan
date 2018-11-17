import Vue from 'vue'
import createRouter from './router'

const r = require.context('@app/enhanceApp', false, /\.m?js$/)
const enhances = new Set()
r.keys().forEach(fp => {
  if (r(fp).default) {
    enhances.add(r(fp).default)
  }
})

export default ({ App } = {}) => {
  const router = createRouter()

  const app = new Vue({
    router,
    render: h => h(App || require('./App.vue').default)
  })

  if (enhances.size > 0) {
    enhances.forEach(enhanceApp => enhanceApp({ Vue, app, router }))
  }

  return { app, router }
}
