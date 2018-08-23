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

  async createEngineFiles () {
    await this.createApp()
    await this.createEnhanceApp()
    await this.createRoutes(this.lib.resolveBaseDir('pages'))
  }

  async createEnhanceApp () {
    await fs.outputFile(
      this.resolveEngineDir('enhanceApp.js'),
      this.isEmptyFile(this.lib.resolveDvanDir('enhanceApp.js'))
        ? `export { default } from '${this.lib.resolveDvanDir('enhanceApp.js')}'`
        : 'export default () => {}'
    )
  }

  async createApp () {
    await fs.outputFile(
      this.resolveEngineDir('app.js'),
      this.appTemplate()
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

  appTemplate () {
    return formatCode(`
      import Vue from 'vue'
      import { createRouter } from './router'

      import enhanceApp from './enhanceApp'
      import { routes } from './routes'

      Vue.config.productionTip = false

      export function createApp () {
        const router = createRouter({ routes })

        enhanceApp({ Vue, router })

        const app = new Vue({
          router,
          render: h => h(
            'div',
            {
              attrs: { id: '__dvan' },
              style: {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
              }
            },
            [
              h('router-view')
            ]
          )
        })
      
        return { app, router }
      }
    `)
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

  routerTemplate () {}
}

module.exports = function (ctx) {
  return new Engine(ctx)
}
