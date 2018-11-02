import Vue from 'vue'
import createRouter from './router'

export default opts => {
  opts = Object.assign({}, opts)

  const router = createRouter(opts)

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
