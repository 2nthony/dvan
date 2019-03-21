module.exports = command => {
  const cmd = require('../../utils/easyCmdOption')(command)
  cmd('--host <host>', 'Serve host', '0.0.0.0')
  cmd('-p, --port <port>', 'Serve port', '4000')
  cmd('-o, --open', 'Open in browser')
  cmd('--no-hot', 'Disable hot reloading')
  cmd('--local', 'Alias for --host localhost')
}
