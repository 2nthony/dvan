import Vue from 'vue'
import { createRouter } from './router'

export const createApp = () => {
  const router = createRouter()

  const app = new Vue({
    router,
    render: h => h(
      'div',
      {
        attrs: {
          id: 'app'
        }
      },
      [
        h('router-view')
      ]
    )
  })

  return { app, router }
}
