export default ({ Vue }) => {
  Vue.prototype.$log = console.log.bind(console)
  Vue.prototype.$log('Vue enhanced.')
}
