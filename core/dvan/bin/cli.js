#!/usr/bin/env node
// eslint-disable-next-line import/no-unassigned-import
require('v8-compile-cache')
const app = new (require('..'))()

app.run().catch(error => {
  console.error(error)
  process.exit(1)
})
