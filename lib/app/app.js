import Vue from 'vue'

import { createRouter } from './router'

import enhanceApp from './engine/enhanceApp'
import { routes } from './engine/routes'

Vue.config.productionTip = false

export function createApp () {
  const router = createRouter({ routes })

  enhanceApp({ Vue, router })

  const app = new Vue({
    router,
    render: h => h(
      'div',
      {
        attrs: { id: '__dvan' },
        style: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
        }
      },
      [
        h('router-view')
      ]
    )
  })

  return { app, router }
}
