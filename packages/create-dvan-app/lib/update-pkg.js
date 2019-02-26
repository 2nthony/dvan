module.exports = (api, when) => {
  const { frameworks } = api.answers

  return {
    name: api.outFolder,
    private: true,
    scripts: {
      dvan: 'dvan',
      dev: 'dvan --dev',
      build: 'dvan --prod'
    },
    dependencies: {
      vue: when(frameworks.includes('vue'), '^2.5.22')
    },
    devDependencies: {
      dvan: '^2.3.2',
      'vue-template-compiler': when(frameworks.includes('vue'), '^2.5.22')
    }
  }
}
