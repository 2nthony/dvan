const path = require('path')

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
        name: 'name',
        message: 'What is the name of the new project'
      },
      {
        name: 'description',
        message: 'How would you describe the new project',
        default: `My awesome project`
      },
      {
        name: 'author',
        message: 'What is your name',
        default: this.gitUser.username || this.gitUser.name,
        store: true
      },
      {
        name: 'email',
        message: 'What is your email',
        default: this.gitUser.email,
        store: true,
        validate: v => /.+@.+/.test(v)
      },
      {
        name: 'frameworks',
        message: 'Choose a framework for your app',
        type: 'list',
        choices: [
          {
            name: 'Vanilla JavaScript',
            value: 'vanilla'
          },
          {
            name: 'Vue',
            value: 'vue'
          },
          {
            name: 'React (TODO)',
            value: 'react',
            disabled: true
          }
        ]
      },
      {
        name: 'vue-router',
        message: 'Do you need `vue-router` for your Vue app',
        type: 'confirm',
        default: true,
        when: ({ frameworks }) => frameworks === 'vue'
      },
      {
        name: 'vue-auto-routes',
        message: 'Do you want to use `vue-auto-routes` to manage your routes',
        type: 'confirm',
        default: true,
        when: 'vue-router'
      }
    ]
  },

  actions() {
    return [
      {
        type: 'add',
        templateDir: 'templates/main',
        files: '**'
      },
      {
        type: 'add',
        templateDir: 'templates/vue/main',
        files: '**',
        when: ({ frameworks }) => frameworks === 'vue'
      },
      {
        name: 'add',
        templateDir: 'templates/vue/router',
        files: '**',
        when: 'vue-router'
      },
      {
        name: 'add',
        templateDir: 'templates/vue/vue-auto-routes',
        files: '**',
        when: 'vue-auto-routes'
      },
      {
        type: 'modify',
        files: 'package.json',
        handler: () => require('../lib/update-pkg')(this)
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
    await this.gitInit()
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
