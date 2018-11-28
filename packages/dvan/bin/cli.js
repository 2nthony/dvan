#!/usr/bin/env node
const cli = require('cac')()

const { args: input, options: flags } = cli.parse()

if (flags.version || flags.v) {
  console.info(require('chalk').hex('#58a')(require('../package.json').version))
  process.exit()
}

const options = {
  command: input[0],
  baseDir: input[1]
}

const app = require('../lib')(options, flags)

app.start().catch(error => {
  console.error(error)
  process.exit()
})
