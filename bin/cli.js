#!/usr/bin/env node
const cac = require('cac')

const app = require('../lib')
const cli = cac()

cli
  .command('dev', 'Develop mode',
    (input, flags) => {
      return app(Object.assign({ baseDir: input[0] }, flags)).dev()
    })
  .option('host', {
    desc: 'Host for dev server',
    type: 'string'
  })
  .option('port', {
    desc: 'Port for dev server',
    type: 'number'
  })

cli.command('build', 'Build website to static HTML files',
  (input, flags) => {
    return app(Object.assign({ baseDir: input[0] }, flags)).build()
  })

cli.parse()
