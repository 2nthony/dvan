/* eslint-disable no-unused-vars */

const path = require('path')
const fs = require('fs-extra')
const { createBundleRenderer } = require('vue-server-renderer')

export default (api, { CLIENT_MANIFEST, SERVER_BUNDLE } = {}) => {
	const clientManifest = require(api.resolveOutDir(CLIENT_MANIFEST))
	const serverBundle = require(api.resolveOutDir(SERVER_BUNDLE))
	const template = path.join(__dirname, '../app/template.html')

	const renderer = createBundleRenderer(serverBundle, {
		clientManifest,
		runInNewContext: false,
		inject: false,
		basedir: api.resolveCwd()
	})

	async function renderHtml(url) {
		const ctx = { url }

		const app = await renderer.renderToString(ctx)
	}
}
