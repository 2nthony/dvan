module.exports = (api, config) => (type, test, loader) => {
  const inlineMaxLimit = 5000

  if (type) {
    config.module
      .rule(type)
      .test(test)
      .use(loader)
      .loader(loader)
      .options(
        Object.assign(
          {
            name: api.config.output.fileNames[type === 'svg' ? 'image' : type]
          },
          loader === 'url-loader' ? { limit: inlineMaxLimit } : {}
        )
      )
  }
}
