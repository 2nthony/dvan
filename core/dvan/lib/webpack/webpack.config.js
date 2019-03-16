const isLocalPath = require('../utils/isLocalPath')

const normalizeEntry = v => {
	if (v.startsWith('module:')) {
		return v.replace(/^module:/, '')
	}

	if (isLocalPath(v)) {
		return v
	}

	return `./${v}`
}

module.exports = (config, api) => {
	/**
	 * Set entry
	 */
	const webpackEntry = {}
	const { entry, srcDir } = api.config

	if (typeof entry === 'string') {
		webpackEntry.index = [entry]
	} else if (Array.isArray(entry)) {
		webpackEntry.index = entry
	} else if (typeof entry === 'object') {
		Object.assign(webpackEntry, entry)
	}

	for (const name of Object.keys(webpackEntry)) {
		webpackEntry[name] = Array.isArray(webpackEntry[name])
			? webpackEntry[name].map(v => normalizeEntry(v))
			: normalizeEntry(webpackEntry[name])
	}

	config.merge({ entry: webpackEntry })

	/**
	 * Set mode
	 */
	config.mode(api.mode)

	/**
	 * Set extensions
	 */
	config.resolve.extensions.merge(['.mjs', '.js', '.jsx', '.json'])

	/**
	 * Output
	 */
	config.output
		.filename(api.config.output.fileNames.js)
		.publicPath(api.config.output.publicUrl)
		.path(api.resolveOutDir())
		.chunkFilename(api.config.output.fileNames.js.replace(/\.js$/, '.chunk.js'))

	/**
	 * output.sourceMap defaults to false in production mode
	 */
	config.devtool(
		api.config.output.sourceMap === false
			? false
			: api.isProd
			? 'source-map'
			: 'cheap-module-source-map'
	)

	/**
	 * Format
	 */
	const { format, moduleName } = api.config.output
	if (format === 'cjs') {
		config.output.libraryTarget('commonjs2')
	} else if (format === 'umd') {
		config.output.libraryTarget('umd')
		config.output.library(moduleName)
	}

	/**
	 * Alias @ to source directory
	 * Alias @@ to root directory
	 */
	config.resolve.alias.set('@', api.resolveCwd(srcDir)).set('@@', api.cwd)

	config.resolve.alias.set(
		'#webpack-hot-client$',
		require.resolve('@dvan/dev-utils/webpackHotDevClient')
	)

	config.merge({
		/**
		 * Disable webpack's default minimizer
		 */
		optimization: {
			minimize: false
		},
		/**
		 * disalbe webpack's default performance hints
		 */
		performance: {
			hints: false
		}
	})

	/**
	 * Minimize js files
	 */

	if (api.config.output.minimize) {
		config.plugin('minimize').use(require('terser-webpack-plugin'), [
			{
				cache: true,
				parallel: true,
				sourceMap: api.config.output.sourceMap,
				terserOptions: {
					parse: {
						// We want terser to parse ecma 8 code. However, we don't want it
						// to apply any minfication steps that turns valid ecma 5 code
						// into invalid ecma 5 code. This is why the 'compress' and 'output'
						// sections only apply transformations that are ecma 5 safe
						// https://github.com/facebook/create-react-app/pull/4234
						ecma: 8
					},
					compress: {
						ecma: 5,
						warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// https://github.com/facebook/create-react-app/issues/2376
						// Pending further investigation:
						// https://github.com/mishoo/UglifyJS2/issues/2011
						comparisons: false,
						// Disabled because of an issue with Terser breaking valid code:
						// https://github.com/facebook/create-react-app/issues/5250
						// Pending futher investigation:
						// https://github.com/terser-js/terser/issues/120
						inline: 2
					},
					mangle: {
						safari10: true
					},
					output: {
						ecma: 5,
						comments: false,
						// Turned on because emoji and regex is not minified properly using default
						// https://github.com/facebook/create-react-app/issues/2488
						ascii_only: true
					}
				}
			}
		])
	}

	/**
	 * Constants plugin
	 * Progress-bar plugin
	 * Clean-out-dir plugin
	 */
	require('./plugins/constants')(config, api)
	require('./plugins/progressBar')(config, api)
	require('./plugins/cleanOutDir')(config, api)

	config
		.plugin('print-status')
		.use(require('@dvan/dev-utils/printStatusPlugin'), [api.cli.options])
}
