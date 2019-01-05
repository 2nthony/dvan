module.exports = ({ isProd }, command) => {
  const cmd = require('../../utils/easyCmdOption')(command)
  if (isProd) {
    cmd('--no-extract-css', 'Do not extract CSS files')
  } else {
    cmd('--extract-css', 'Extract CSS to standalone files')
  }
}
