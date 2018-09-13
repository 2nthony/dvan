const fs = require('fs-extra')

exports.isEmptyPath = src => {
  return fs.existsSync(src) && fs.readFileSync(src, 'utf8') !== ''
}
