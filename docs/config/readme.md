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
  - `[tagName, { attrName: attrValue }, innerHTML?]`

Extra tags in `<head>`. For example, to add a custom favicon:

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

Same with [host](#host), port auto matches from `8080`

### pagesDir
- Type: `string`
- Default: `pages`

The directory to your page files

### exts
- Type: `array`
- Default: `['vue']`

The page file extension type under [pagesDir](#pagesdir), for example `['vue', 'js']` will auto load vue and js extension file as page

### pwa
- Type: `boolean|object`
- Default: `false`

PWA(Progressive Web Application) support  
If set it `true` or any `object` will enable PWA for your site

```js
// Default values when `true`
{
  // Update notifier config
  updateText: 'New content is available.',
  updateButtonText: 'Refresh'
}
```

::: warning PWA NOTES
Only enabled in production  
Also, service worker can only be registered under HTTPs URLs
:::

This `pwa` options only do:
- Caches content
- Offline use
- Notify update content

To make your site fully PWA-compliant, you will need to provide the [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) and icons in `pwa/`, `manifest.json` will auto inject each html file
```
.
├── pages
├── pwa
│   │── images
│   └── manifest.json
├── dvan.config.js
└── package.json
```

Override `sw-update-popup` with your own style:
```css
.sw-update-popup {}
/* <transition name="sw-update-popup"> */
```

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
    // configure something
  }
}
```

::: tip A part of chainWebpack reference
- `entry`
  - `app`
- `resolve`
  - `alias`
    - `@app` root dir (**not [root](#root)**)
    - `@pages` pages dir (depends on [pagesDir](#pagesdir))
  - `extensions`
    - `.vue`
    - `.js`
    - `.json`
:::