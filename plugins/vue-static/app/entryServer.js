import createApp from './createApp'

export default ctx => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()
    router.push(ctx.url)
    router.onReady(() => resolve(app), reject)
  })
}
