const kleur = require('kleur')

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
    this.log(kleur.magenta('debug'), ...args)
  }

  error(...args) {
    this.log(kleur.bold().red(`${['error', ' ', ...args].join('')}`))
    process.exitCode = process.exitCode || 1
  }

  warn(...args) {
    this.log(kleur.yellow('warning'), ...args)
    process.exitCode = process.exitCode || 1
  }

  success(...args) {
    this.log(kleur.green('success'), ...args)
  }

  done(...args) {
    this.log(
      kleur
        .bold()
        .green(
          `${[process.platform === 'win32' ? '√' : '✔', ' ', ...args].join('')}`
        )
    )
  }

  tips(...args) {
    this.log(kleur.cyan('tips'), ...args)
  }

  color(c, ...args) {
    return kleur[c](args.join(''))
  }
}

module.exports = new Logger()
