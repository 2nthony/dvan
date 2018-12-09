import minify from 'rollup-plugin-babel-minify'

export default {
  input: 'index.js',
  plugins: [minify({ comments: false })],
  output: [
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/plugin.js',
      format: 'esm'
    }
  ]
}
