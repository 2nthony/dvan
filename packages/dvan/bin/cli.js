#!/usr/bin/env node

const app = new (require('..'))()

app.run().catch(error => {
  console.error(error)
  process.exit(1)
})
