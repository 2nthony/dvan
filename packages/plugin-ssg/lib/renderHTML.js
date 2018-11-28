const path = require('upath')
const fs = require('fs-extra')
const { createBundleRenderer } = require('vue-server-renderer')

module.exports = async (
  api,
  { routesMap, __clientManifest__, __serverBundle__ }
) => {
  const clientManifest = require(api.resolve(
    api.config.outDir,
    __clientManifest__
  ))
  const serverBundle = require(api.resolve(api.config.outDir, __serverBundle__))
  const template = fs.readFileSync(
    path.join(__dirname, '../app/template.static.html'),
    'utf8'
  )

  const renderer = createBundleRenderer(serverBundle, {
    clientManifest,
    runInNewContext: false,
    inject: false,
    basedir: api.resolve()
  })

  routesMap.forEach(async route => {
    await renderHTML(route)
  })

  // Also render 404
  await renderHTML('/404')

  async function renderHTML(url) {
    const context = { url }

    const app = await renderer.renderToString(context)
    const {
      title,
      htmlAttrs,
      bodyAttrs,
      link,
      style,
      script,
      noscript,
      meta
    } = context.meta.inject()

    const html = template
      .replace('{htmlAttrs}', htmlAttrs.text())
      .replace(
        '{head}',
        `${title.text()}${meta.text()}${link.text()}${style.text()}`
      )
      .replace('{bodyAttrs}', bodyAttrs.text())
      .replace('{script}', script.text())
      .replace('{noscript}', noscript.text())
      // From renderer
      .replace('{app}', app)
      .replace('{styles}', () => context.renderStyles())
      .replace('{state}', () => context.renderState())
      .replace('{scripts}', () => context.renderScripts())
      .replace('{resourceHints}', () => context.renderResourceHints())

    await fs.outputFile(api.resolve(api.config.outDir, handlePath(url)), html)

    api.logger.success(
      `Generated static file ${api.logger.color(
        'cyan',
        path.relative(
          process.cwd(),
          api.resolve(api.config.outDir, handlePath(url))
        )
      )}`
    )
  }

  // Done!
  /* api.logger.log(
    api.logger.color('green', `Done! Check out`),
    api.logger.color('cyan',
      path.relative(
        process.cwd(),
        api.resolve(api.config.outDir)
      )
    )
  ) */

  function handlePath(url) {
    if (url === '/') {
      url = '/index'
    }
    return url === '/index' || url === '/404'
      ? `${url}.html`
      : `${url}/index.html`
  }
}
