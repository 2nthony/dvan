const when = (condition, value, fallback) => (condition ? value : fallback)

module.exports = ({
  name,
  description,
  author,
  email,
  frameworks,
  vueRouter,
  vueAutoRoutes
}) => {
  return {
    name,
    description,
    private: true,
    author: `${author} <${email}>`,
    scripts: {
      dvan: 'dvan',
      dev: 'dvan --dev',
      build: 'dvan --prod'
    },
    dependencies: {
      vue: when(frameworks.includes('vue'), '^2.6.7'),
      'vue-router': when(vueRouter, '^3.0.2'),
      'vue-auto-routes': when(vueAutoRoutes, '^1.3.0')
    },
    devDependencies: {
      dvan: '^2.3.7',
      'vue-template-compiler': when(frameworks.includes('vue'), '^2.6.7')
    }
  }
}
