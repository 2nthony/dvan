module.exports = ({ host, port }) =>
  class OpenBrowserPlugin {
    apply(compiler) {
      compiler.hooks.done.tap('open-browser', () => {
        require('./openBrowser')(`http://${host}:${port}`)
      })
    }
  }
