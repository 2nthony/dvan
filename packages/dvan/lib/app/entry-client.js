import { createApp } from './createApp'

const { app, router } = createApp()

router.onReady(() => app.$mount('#app'))
