const fs = require('fs-extra')
const path = require('upath')
const globby = require('globby')
const formatCode = code => require('prettier').format(code, { semi: false, parser: 'babylon', singleQuote: true })

class Engine {
  constructor (lib) {
    this.lib = lib

    this.engine = path.resolve(__dirname, 'engine')
  }

  isEmptyFile (src) {
    return fs.existsSync(src) && fs.readFileSync(src, 'utf8') !== ''
  }

  resolveEngineDir (...args) {
    return path.join(this.engine, ...args)
  }

  sort (arr) {
    return arr.sort((a, b) => {
      if (a < b) return -1
      if (a > b) return 1
      return 0
    })
  }

  async createEnhanceApp () {
    await fs.outputFile(
      this.resolveEngineDir('enhanceApp.js'),
      this.isEmptyFile(this.lib.resolveDvanDir('enhanceApp.js'))
        ? `export { default } from '${this.lib.resolveDvanDir('enhanceApp.js')}'`
        : 'export default () => {}'
    )
  }

  async createRoutes (pagesDir) {
    const pagesFile = this.sort(await globby([
      '**/*.vue'
    ], {
      cwd: pagesDir
    }))
    await fs.outputFile(
      this.resolveEngineDir('routes.js'),
      this.routesTemplate(pagesFile)
    )
  }

  fpToComponentName (fp) {
    return `${fp.replace(/\//g, '-')}`
  }

  routesTemplate (fps) {
    return formatCode(`
export const routes = [
  ${
  fps && fps.length > 0
    ? fps.map(fp => {
      fp = fp.replace(/^\.\//, '').replace(/\.(vue|js)$/, '')
      return `{
          path: '/${fp.replace(/index/, '')}',
          name: '${this.fpToComponentName(fp)}',
          component: () => {
            return import(/* webpackChunkName: "${this.fpToComponentName(fp)}" */
              '${this.lib.resolveBaseDir('pages', fp)}'
            )
          }
        }`
    })
    : `{
        path: '/',
        component: {
          template: \`
            <div class='initial'>
              <h1>Thanks for using dvan♂.</h1>
              <p>Add a 'pages' folder in your project.</p>
              <p>And write '.vue' file.</p>
              <p>That's how simple dvan have. :)</p>
            </div>
          \`
        }
      }`
}
]
`)
  }
}

module.exports = function (ctx) {
  return new Engine(ctx)
}
