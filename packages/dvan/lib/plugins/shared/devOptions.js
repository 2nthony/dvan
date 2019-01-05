module.exports = command => {
  const cmd = require('../../utils/easyCmdOption')(command)
  cmd('--host <host>', 'Development server host', '0.0.0.0')
  cmd('--port <port>', 'Development server port', 4000)
  cmd('--hot', 'Hot reload', true)
  cmd('-o, --open', 'Open in browser')
}
