import Vue from 'vue'

import { createRouter } from './router'

Vue.config.productionTip = false

// enhanceApp
try {
  const enhanceAppPath = require.context('@app', false, /enhanceApp.js/).keys()[0].replace(/^\.\//, '')
  const enhanceApp = require(`@app/${enhanceAppPath}`).default
  enhanceApp({ Vue })
} catch (e) {}

export function createApp () {
  const router = createRouter()

  const app = new Vue({
    router,
    render: h => h(
      'div',
      {
        attrs: { id: '__dvan' }
      },
      [
        h('router-view')
      ]
    )
  })

  return { app, router }
}
