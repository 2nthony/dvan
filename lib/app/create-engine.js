const fs = require('fs-extra')
const path = require('upath')
const globby = require('globby')
const formatCode = code => require('prettier').format(code, { semi: false, parser: 'babylon', singleQuote: true })
const Config = require('./config')

class Engine {
  constructor (lib) {
    this.lib = lib

    this.engine = lib.resolveDvanDir('.engine')
    this.config = new Config(lib)
    this.routes = new Map()
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
    await this.createApp()
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
    await fs.outputFile(
      this.resolveEngineDir('server-entry.js'),
      formatCode(`
        import { createApp } from './app'

        export default function (context) {
          return new Promise((resolve, reject) => {
            const { app, router } = createApp()
            const { url } = context
            const { fullPath } = router.resolve(url).route

            if (fullPath !== url) {
              return reject({ url: fullPath })
            }

            router.push(url)
            router.onReady(() => resolve(app))
          })
        }
      `)
    )
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
    this.routes = await globby([
      ...this.lib.config.extensions,
      '!404.vue'
    ], {
      cwd: pagesDir
    })
    await fs.outputFile(
      this.resolveEngineDir('router.js'),
      this.routerTemplate(this.routes)
    )
  }

  routePath (route) {
    return '/' +
      route
        .replace(/^\.\//, '')
        .replace(/\.(vue|js)$/, '')
        .replace(/index/, '')
  }

  routeName (route) {
    return route.replace(/\//g, '-').replace(/\.(vue|js)$/, '')
  }

  appTemplate () {
    return formatCode(`
      import Vue from 'vue'
      import enhanceApp from './enhanceApp'
      import { createRouter } from './router'
      import '${path.resolve(__dirname, 'styles/default.styl')}'

      Vue.config.productionTip = false

      export function createApp () {
        const router = createRouter()

        enhanceApp({ Vue, router })

        const app = new Vue({
          router,
          render: h => h(
            'div',
            {
              attrs: { id: '__dvan' }
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

  routesTemplate (routes) {
    return formatCode(`
      const routes = [
        ${
          routes && routes.length > 0
            ? routes.map(route => {
                return `{
                  path: '${this.routePath(route)}',
                  name: '${this.routeName(route)}',
                  component: () => {
                    return import(/* webpackChunkName: "${this.routeName(route)}" */
                      '${this.lib.resolveBaseDir('pages', route)}'
                    )
                  }
                }`
              })
            : ''
        },
        {
          path: '*',
          name: '404',
          component: () => {
            return import(/* webpackChunkName: "404" */
              '${
                this.isEmptyFile(this.lib.resolveBaseDir('pages', '404.vue'))
                  ? this.lib.resolveBaseDir('pages', '404.vue')
                  : path.resolve(__dirname, '404.vue')
              }'
            )
          }
        }
      ]
    `)
  }

  routerTemplate (routes) {
    return formatCode(`
      import Vue from 'vue'
      import Router from 'vue-router'

      Vue.use(Router)

      ${this.routesTemplate(routes)}

      export function createRouter () {
        const router = new Router({
          mode: 'history',
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
