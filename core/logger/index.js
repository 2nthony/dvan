const chalk = require('chalk')

class Logger {
	constructor(opts) {
		this.setOptions(opts)
	}

	setOptions(opts) {
		this.opts = Object.assign({}, this.opts, opts)
	}

	log(...args) {
		console.log(
			...args.map(arg => {
				return typeof arg === 'function' ? arg() : arg
			})
		)
	}

	debug(...args) {
		if (!this.opts.debug) {
			return
		}
		this.log(chalk.magenta('debug'), ...args)
	}

	error(...args) {
		this.log(chalk.bold.hex('#fd6f6b')('error', ...args))
		process.exitCode = process.exitCode || 1
	}

	warn(...args) {
		this.log(chalk.yellow('warning'), ...args)
		process.exitCode = process.exitCode || 1
	}

	success(...args) {
		this.log(chalk.green('success'), ...args)
	}

	done(...args) {
		this.log(
			chalk.bold.green(process.platform === 'win32' ? '√' : '✔', ...args)
		)
	}

	tips(...args) {
		this.log(chalk.cyan('tips'), ...args)
	}

	color(type, ...args) {
		if (type.startsWith('#')) {
			return chalk.hex(type)(...args)
		}
		return chalk[type](...args)
	}
}

module.exports = new Logger()
