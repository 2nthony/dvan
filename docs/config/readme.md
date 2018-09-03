---
sidebar: auto
---

# Config

## Basic Config

### title
- Type: `string`
- Default: `''`

Title for the site

### description
- Type: `string`
- Default: `''`

Description for the site

### head
- Type: `array`
- Default: `[]`

Extra tags to be injected to the page HTML `<head>`. Each tag can be specified in the form of `[tagName, { attrName: attrValue }, innerHTML?]`. For example, to add a custom favicon:

```js
module.exports = {
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ]
}
```

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

If you want to deploy your site under a sub path, for example `https://site.com/website/`, you should set it to `/website/`


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