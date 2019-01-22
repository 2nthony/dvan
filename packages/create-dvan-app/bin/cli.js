#!/usr/bin/env node

const path = require('path')
const cli = require('cac')()

cli
  .command('<target-folder>', 'Generate a new project to target folder')
  .option(
    '--npm-client',
    'Choose an npm client for installing packages (`yarn` | `npm` | `pnpm`)'
  )
  .action(async (targetFolder, { npmClient }) => {
    const sao = require('sao')

    const app = sao({
      generator: path.join(__dirname, '../generator'),
      outDir: targetFolder,
      npmClient
    })

    await app.run().catch(sao.handleError)
  })

cli.version(require('../package.json').version)

cli.help()
cli.parse()
