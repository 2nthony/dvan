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
        handler() {
          return `module.exports = {
  entry: 'src/index.js'
}`
        }
      },
      {
        type: 'modify',
        files: 'package.json',
        handler() {
          return {
            name: this.outFolder,
            private: true,
            scripts: {
              dvan: 'dvan',
              dev: 'dvan --dev',
              build: 'dvan --prod'
            },
            dependencies: {
              dvan: '^2.2.2'
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

    this.logger.tip(`To start dev server, run following commands:`)
    console.log(
      `${this.chalk.bold(this.npmClient)} ${this.chalk.cyan('run dev')}`
    )

    this.logger.tip(`To build for production, run following commands:`)
    console.log(
      `${this.chalk.bold(this.npmClient)} ${this.chalk.cyan('run build')}`
    )
  }
}
