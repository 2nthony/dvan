import Vue from 'vue'

import { createRouter } from './router'

export function createApp () {
  const router = createRouter()

  const app = new Vue({
    router,
    render: h => h(
      'div',
      {
        attrs: {
          id: '__dvan'
        }
      },
      [
        h('router-view')
      ]
    )
  })

  return { app, router }
}
