module.exports = async api => {
	const { devServer } = api.config
	delete devServer.hotEntries

	const config = api.createWebpackChain()

	const { host, port: _port, open } = devServer

	const isUnSpecifiedHost = host === '0.0.0.0' || host === '::'
	const _host = isUnSpecifiedHost ? 'localhost' : host

	const port = await require('get-port')({ port: _port })

	config
		.plugin('print-dev-status')
		.use(require('@dvan/dev-utils/printDevStatusPlugin')(_host, port))

	if (open) {
		config
			.plugin('open-browser')
			.use(require('@dvan/dev-utils/openBrowserPlugin')(_host, port))
	}

	return {
		config,

		run() {
			const webpackConfig = config.toConfig()
			const compiler = api.createWebpackCompiler(webpackConfig)

			const devServerOptions = Object.assign(
				{
					quiet: true,
					historyApiFallback: true,
					overlay: true,
					disableHostCheck: true,
					publicPath: webpackConfig.output.publicPath,
					contentBase:
						api.config.publicFolder && api.resolveCwd(api.config.publicFolder),
					watchContentBase: true,
					stats: {
						colors: true
					}
				},
				devServer
			)

			const server = new (require('webpack-dev-server'))(
				compiler,
				devServerOptions
			)

			server.listen(port, api.parseArgs.has('local') ? 'localhost' : host)
		}
	}
}
