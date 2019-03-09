const path = require('path')
const superb = require('superb')

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
				message: 'What is the name of the new project',
				default: this.outFolder
			},
			{
				name: 'description',
				message: 'How would you describe the new project',
				default: `My ${superb.random()} project`
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
				message: 'Choose a framework for the app',
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
				name: 'Vuex',
				message: 'Do you need `Vuex` for the app',
				type: 'confirm',
				default: false,
				when: ({ frameworks }) => frameworks === 'vue'
			},
			{
				name: 'VueRouter',
				message: 'Do you need `vue-router` for the app',
				type: 'confirm',
				default: true,
				when: ({ frameworks }) => frameworks === 'vue'
			},
			{
				name: 'VueAutoRoutes',
				message: 'Do you want to use `vue-auto-routes` for the routes',
				type: 'confirm',
				default: true,
				when: ({ VueRouter }) => VueRouter
			}
		]
	},

	actions() {
		const { frameworks } = this.answers

		return [
			{
				type: 'add',
				templateDir: 'templates/main',
				files: '**'
			},
			frameworks === 'vue' && {
				type: 'add',
				templateDir: 'templates/vue',
				files: '**',
				filters: {
					'src/App.vue': '!VueRouter',
					'src/App.router.vue': 'VueRouter',
					'src/views/**': 'VueRouter',
					'src/core/router.js': 'VueRouter',
					'src/core/store.js': 'Vuex',
					'autoRoutes.config.js': 'VueAutoRoutes'
				}
			},
			{
				type: 'modify',
				files: 'package.json',
				handler: () => require('../lib/update-pkg')(this.answers)
			},
			{
				type: 'move',
				patterns: {
					_gitignore: '.gitignore',
					'src/App.router.vue': 'src/App.vue',
					'autoRoutes.config.js': 'dvan.config.js'
				}
			}
		].filter(Boolean)
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
