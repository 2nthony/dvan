import Vue from 'vue'
import createRouter from './router'
import _App from './App.vue'

export default ({
  App
} = {}) => {
  const router = createRouter()

  const app = new Vue({
    router,
    render: h => h(App || _App)
  })

  return { app, router }
}
