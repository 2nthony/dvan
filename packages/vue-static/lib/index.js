exports.name = '@dvan/vue-static'

exports.extend = api => {
  api.hook('onInitCLI', () => {
    api.cli
      .command('vue-gen', 'Render Vue-SSR to static HTML files')
      .action(() => {
        api.logger.done('Done right')
      })
  })
}
