module.exports = command => {
  command.option('--jsx [bool]', 'Make app support JSX syntax.', {
    default: false
  })
}
