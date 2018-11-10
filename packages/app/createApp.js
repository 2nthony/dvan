import Vue from 'vue'
import createRouter from './router'

export default ({
  App
} = {}) => {
  const router = createRouter()

  const app = new Vue({
    router,
    render: h => h(App || require('./App.vue').default)
  })

  return { app, router }
}
