import Vue from 'vue'
import Meta from '@dvan/meta'
import createApp from '@dvan/app/createApp'

Vue.use(Meta, {
  keyName: 'head',
  attribute: 'data-dvan-attr',
  ssrAttribute: 'data-dvan-server-rendered',
  tagIDKeyName: 'dvanid',
  globalMeta: __GLOBAL_META__
})

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp({ mode: 'history' })
    router.push(context.url)
    context.meta = app.$meta()
    router.onReady(() => resolve(app), reject)
  })
}
