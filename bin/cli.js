#!/usr/bin/env node
const cac = require('cac')

const app = require('../lib')
const cli = cac()

cli
  .command('dev', 'Develop mode', (input, flags) => {
    return app(Object.assign({}, flags)).dev()
  })
  .option('port', {
    desc: 'Port for dev server',
    type: 'number'
  })

cli.command('build', 'Build website to static HTML files', (input, flags) => {
  return app(Object.assign({}, flags)).build()
})

cli.parse()
