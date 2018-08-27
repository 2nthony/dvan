---
sidebar: auto
---

# Config

## Basic Config

### head
- Type: `object`
- Default: `{}`

Details for the site with [vue-meta](https://github.com/declandewet/vue-meta), generally is `title`, `description` and `manifest` for webapp

### dest
- Type: `string`
- Default: `.dvan/dist`

The output directory for `dvan build`

### assetsDir
- Type: `string`
- Default: `assets`

A directory (relative to `dest`) to nest generated static assets (js, css, images, fonts) under

### host
- Type: `string`
- Default: `0.0.0.0`

The host for the dev server, you can set it in command-line `--host 0.0.0.0`

### port
- Type: `number`
- Default: `8080`

Same with [host](#host)

### pagesDir
- Type: `string`
- Default: `pages`

The directory to your page files

### root
- Type: `string`
- Default: `/`

The root path of your site

If you want to deploy your site under a sub path, for example `https://site.com/webapp/`, you should set it to `/webapp/`


## Build Pipeline

### postcss
- Type: `object`
- Default: `{ plugins: [require('autoprefixer')] }`

Options for [post-loader](https://github.com/postcss/postcss-loader)

::: warning
This value will overwrite default value and you need to include it yourself

Same with all following CSS Pre-Processor
:::

### stylus
- Type: `object`
- Default: `{ preferPathResolve: 'webpack' }`

Options for [stylus-loader](https://github.com/shama/stylus-loader)

### sass
- Type: `object`
- Default: `{ indentedSyntax: true }`

Options for [sass-loader](https://github.com/webpack-contrib/sass-loader) to load `.sass` files

### scss
- Type: `object`
- Default: `{}`

Options for [sass-loader](https://github.com/webpack-contrib/sass-loader) to load `.scss` files

### less
- Type: `object`
- Default: `{}`

Options for [less-loader](https://github.com/webpack-contrib/less-loader)

### chainWebpack
- Type: `function`
- Default: `undefined`

Internal webpack config with [webpack-chain](https://github.com/neutrinojs/webpack-chain)

```js
module.exports = {
  chainWebpack: config => {
    // add config
  }
}
```