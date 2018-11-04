import createApp from '@dvan/app/createApp'

const { app, router } = createApp({ mode: 'history' })

router.onReady(() => {
  app.$mount('#app')
}, console.error)
