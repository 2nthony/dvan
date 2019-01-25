const path = require('path')

module.exports = {
  prepare() {
    if (this.outDir === process.cwd()) {
      throw this.createError(
        `You can not create a project in current directory`
      )
    }
  },
  /**
   * TODO
   * Other options
   * See generator/template
   */
  actions() {
    return [
      {
        type: 'add',
        templateDir: 'template/main',
        files: '**'
      },
      {
        type: 'modify',
        files: 'dvan.config.js',
        handler: () => {
          return `module.exports = {
  entry: 'src/index.js'
}`
        }
      },
      {
        type: 'modify',
        files: 'package.json',
        handler: () => {
          return {
            name: this.outFolder,
            private: true,
            scripts: {
              dvan: 'dvan',
              dev: 'dvan --dev',
              build: 'dvan --prod'
            },
            dependencies: {
              dvan: '^2.3.2'
            }
          }
        }
      },
      {
        type: 'move',
        patterns: {
          _gitignore: '.gitignore'
        }
      }
    ]
  },
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showProjectTips()

    const logCd = () => {
      if (this.outDir !== process.cwd()) {
        console.log(
          `${this.chalk.bold('cd')} ${this.chalk.cyan(
            path.relative(process.cwd(), this.outDir)
          )}`
        )
      }
    }

    console.log('')

    this.logger.tip(`To start dev server, run following commands:`)
    logCd()
    console.log(
      `${this.chalk.bold(this.npmClient)} ${this.chalk.cyan('run dev')}`
    )

    this.logger.tip(`To build for production, run following commands:`)
    logCd()
    console.log(
      `${this.chalk.bold(this.npmClient)} ${this.chalk.cyan('run build')}`
    )
  }
}
