module.exports = _args => {
  const args = _args.reduce((res, arg) => {
    return res.concat(
      arg.startsWith('-') && arg.includes('=') ? arg.split('=') : arg
    )
  }, [])

  return {
    get(name) {
      if (!this.has(name)) return

      const i = args.indexOf(name.length === 1 ? `-${name}` : `--${name}`)
      return args[i + 1]
    },

    has(name) {
      if (name.length > 1) {
        return args.includes(`--${name}`)
      }

      const RE = new RegExp('^-([a-zA-Z]+)')
      return args.find(arg => {
        return RE.test(arg) && RE.exec(arg)[1].includes(name)
      })
    }
  }
}
