const path = require('path')

const when = (condition, value, fallback) => (condition ? value : fallback)

module.exports = {
  prepare() {
    if (this.outDir === process.cwd()) {
      throw this.createError(
        `You can not create a project in current directory`
      )
    }
  },

  prompts() {
    return [
      {
        name: 'frameworks',
        message: 'Choose a framework for you app',
        type: 'list',
        choices: [
          {
            name: 'Vue',
            value: 'vue'
          },
          {
            name: 'React (TODO)',
            value: 'react',
            disabled: true
          },
          {
            name: 'Vanilla JavaScript',
            value: 'vanilla'
          }
        ]
      }
    ]
  },

  actions() {
    const { frameworks } = this.answers

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
              vue: when(frameworks.includes('vue'), '^2.5.22'),
              'vue-template-compiler': when(
                frameworks.includes('vue'),
                '^2.5.22'
              )
            },
            devDependencies: {
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
