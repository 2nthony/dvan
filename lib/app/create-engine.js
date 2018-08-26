const fs = require('fs-extra')
const path = require('upath')
const globby = require('globby')
const formatCode = code => require('prettier').format(code, { semi: false, parser: 'babylon', singleQuote: true })
const Config = require('./config')

class Engine {
  constructor (lib) {
    this.lib = lib

    this.engine = path.resolve(__dirname, 'engine')
    this.config = new Config(lib)
  }

  isEmptyFile (src) {
    return fs.existsSync(src) && fs.readFileSync(src, 'utf8') !== ''
  }

  resolveEngineDir (...args) {
    return path.join(this.engine, ...args)
  }

  async createEngineFiles () {
    const { pagesDir } = this.config.normalizeConfig()

    await this.createEntries()
    await this.createEnhanceApp()
    await this.createRouter(this.lib.resolveBaseDir(pagesDir))
    await this.createDataMixin()
    await this.createApp()
  }

  async createDataMixin () {
    await fs.outputFile(
      this.resolveEngineDir('data-mixin.js'),
      formatCode(`
        export default {
          computed: {
            $head () {
              return ${this.config.$head()}
            }
          }
        }
      `)
    )
  }

  async createEntries () {
    await fs.outputFile(
      this.resolveEngineDir('client-entry.js'),
      formatCode(`
        import { createApp } from './app'

        const { app, router } = createApp()

        router.onReady(() => {
          app.$mount('#__dvan')
        })
      `)
    )
    /* await fs.outputFile(
      this.resolveEngineDir('server-entry.js')
    ) */
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

  async createRouter (pagesDir) {
    const pagesFile = await globby([
      '**/*.vue',
      '**/*.js'
    ], {
      cwd: pagesDir
    })
    await fs.outputFile(
      this.resolveEngineDir('router.js'),
      this.routerTemplate(pagesFile)
    )
  }

  fpToComponentName (fp) {
    return `${fp.replace(/\//g, '-')}`
  }

  appTemplate () {
    return formatCode(`
      import Vue from 'vue'
      import Meta from 'vue-meta'
      import enhanceApp from './enhanceApp'
      import dataMixin from './data-mixin'
      import { createRouter } from './router'

      Vue.config.productionTip = false
      Vue.use(Meta, {
        keyName: 'head',
        attribute: 'data-dvan',
        tagIDKeyName: 'dvid'
      })
      Vue.mixin(dataMixin)

      export function createApp () {
        const router = createRouter()

        enhanceApp({ Vue, router })

        const app = new Vue({
          router,
          head () {
            return this.$head
          },
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
      const routes = [
        ${
          fps && fps.length > 0
            ? fps.map(fp => {
                fp = fp.replace(/^\.\//, '').replace(/\.(vue|js)$/, '')
                return `{
                  path: '/${fp.replace(/index/, '')}',
                  name: '${this.fpToComponentName(fp)}',
                  component: () => {
                    return import(/* webpackChunkName: "${this.fpToComponentName(fp)}" */
                      '${path.join('@pages', fp)}'
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
                    <p>And write Vue components as pages.</p>
                    <p>That's how simple dvan have. :)</p>
                  </div>
                \`
              }
            }`
        }
      ]
    `)
  }

  routerTemplate (fps) {
    return formatCode(`
      import Vue from 'vue'
      import Router from 'vue-router'

      Vue.use(Router)

      ${this.routesTemplate(fps)}

      export function createRouter () {
        const router = new Router({
          mode: 'hostory',
          base: __PUBLIC_PATH__,
          scrillBahavior: () => ({ y: 0 }),
          routes
        })

        return router
      }
    `)
  }
}

module.exports = function (ctx) {
  return new Engine(ctx)
}
