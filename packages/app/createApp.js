import Vue from 'vue'
import createRouter from './router'

export default () => {
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
