#!/usr/bin/env node
const cac = require('cac')

const { input, flags } = cac.parse(process.argv.slice(2))

if (flags.version || flags.v) {
  console.log(require('../package').version)
  process.exit()
}

const options = {
  command: input[0],
  baseDir: input[1]
}

const app = require('../lib')(options, flags)
app.start().catch(err => {
  console.error(err)
  process.exit()
})
