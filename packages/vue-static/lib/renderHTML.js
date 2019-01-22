/* eslint-disable no-unused-vars */

const path = require('path')
const fs = require('fs-extra')
const { createBundleRenderer } = require('vue-server-renderer')

export default (api, { __CLIENT_MANIFEST__, __SERVER_BUNDLE__ }) => {
  const clientManifest = require(api.resolveCwd('dist', __CLIENT_MANIFEST__))
  const serverBundle = require(api.resolveCwd('dist', __SERVER_BUNDLE__))
  const template = path.join(__dirname, '../app/template.html')

  const renderer = createBundleRenderer(serverBundle, {
    clientManifest,
    runInNewContext: false,
    inject: false,
    basedir: api.resolveCwd()
  })

  async function renderHTML(url) {
    const ctx = { url }

    const app = await renderer.renderToString(ctx)
  }
}
