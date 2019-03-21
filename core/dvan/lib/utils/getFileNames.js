module.exports = ({ useHash, format }) => {
  let res

  if (format === 'iife') {
    res = {
      js: useHash ? 'assets/js/[name].[chunkhash:8].js' : 'assets/js/[name].js',
      css: useHash
        ? 'assets/css/style.[chunkhash:8].css'
        : 'assets/css/[name].css',
      font: useHash
        ? 'assets/font/[name].[hash:8].[ext]'
        : 'assets/font/[name].[ext]',
      image: useHash
        ? 'assets/image/[name].[hash:8].[ext]'
        : 'assets/image/[name].[ext]',
      video: useHash
        ? 'assets/video/[name].[hash:8].[ext]'
        : 'assets/video/[name].[ext]'
    }
  } else {
    res = {
      js: '[name].js',
      css: '[name].css',
      font: '[name].[ext]',
      image: '[name].[ext]',
      video: '[name].[ext]'
    }
  }

  return res
}
