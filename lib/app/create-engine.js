const fs = require('fs-extra')
const path = require('upath')
const globby = require('globby')
const formatCode = code =>
  require('prettier')
    .format(code, {
      semi: false,
      parser: 'babylon',
      singleQuote: true
    })
const { isExistsPath } = require('../utils')

class Engine {
  constructor (lib) {
    this.lib = lib

    this.RE = new RegExp(`.(${lib.config.exts.join('|')})$`)
    this.pagesDir = lib.config.pagesDir
    this.routes = new Map()
  }

  resolveEngineDir (...args) {
    return path.join(this.lib.resolveDvanDir('.engine'), ...args)
  }

  async createEngineFiles () {
    await this.createEntries()
    await this.createEnhanceApp()
    await this.createRouter(this.lib.resolveBaseDir(this.pagesDir))
    await this.createApp()
  }

  async createEntries () {
    await fs.outputFile(
      this.resolveEngineDir('client-entry.js'),
      formatCode(`
        import { createApp } from './app'
        import { register } from 'register-service-worker-chain'

        const { app, router } = createApp()

        router.onReady(() => {
          app.$mount('#__dvan')

          if (
            __PWA_ENABLED__ &&
            process.env.NODE_ENV === 'production' &&
            window.location.protocol === 'https:'
          ) {
            register(\`\${__PUBLIC_PATH__}sw.js\`)
              .ready(registration => {
                console.log('[dvan:pwa] Service worker is active.')
              })
              .cached(registration => {
                console.log('[dvan:pwa] Content has been cached for offline use.')
              })
              .updated(registration => {
                console.log(\`[dvan:pwa] \${__PWA_OPTIONS__.updateText}\`)
                app.$emit('sw-updated', registration)
              })
              .offline(() => {
                console.log('[dvan:pwa] No internet connection found. App is running in offline mode.')
              })
              .error(error => {
                console.error('[dvan:pwa] Error during service worker registration:', error)
              })
          }
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
      isExistsPath(this.lib.resolveDvanDir('enhanceApp.js'))
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
        .replace(this.RE, '')
        .replace(/index/, '')
  }

  routeName (route) {
    return route.replace(/\//g, '-').replace(this.RE, '')
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
          mounted () {
            app.$on('sw-updated', registration => {
              app.SWRegistration = registration
            })
          },
          data () {
            return {
              SWRegistration: null
            }
          },
          components: {
            SWUpdatePopup: () =>
              import(/* webpackChunkName: "SW-Update-Popup" */
                '${path.resolve(__dirname, '../pwa/sw-update-popup.vue')}'
              )
          },
          render: h => h(
            'div',
            {
              attrs: { id: '__dvan' }
            },
            [
              h('router-view'),
              h(
                'SW-update-popup',
                {
                  props: {
                    SWRegistration: app.SWRegistration
                  }
                }
              )
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
                      '${this.lib.resolveBaseDir(this.pagesDir, route)}'
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
                isExistsPath(this.lib.resolveBaseDir(this.pagesDir, '404.vue'))
                  ? this.lib.resolveBaseDir(this.pagesDir, '404.vue')
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

module.exports = function (lib) {
  return new Engine(lib)
}
