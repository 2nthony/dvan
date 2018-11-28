module.exports = command => {
  command.option('--jsx', 'Make app support JSX syntax.', {
    default: false
  })
}
