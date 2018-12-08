module.exports = cmd => (flag, desc, opts) =>
  cmd.option(
    flag,
    desc,
    typeof opts === 'object'
      ? opts
      : {
          default: opts
        }
  )
