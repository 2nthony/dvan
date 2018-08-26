# Directory Structure

A basic project structure looks like:
```
.
├── pages
│   └── index.vue
├── .gitignore
├── dvan.config.js
└── package.json
```

| File / Directory | Description |
| --- | --- |
| pages/ | Write your pages |
| dvan.config.js | Configure the webapp |
| package.json | Define npm scripts and dependencies |

You can configure the `pages` directory you want, configured the `pagesDir` field in `dvan.config.js`.

Here an example:
```js
module.exports = {
  pagesDir: 'src/pages'
}
```
Will be resolve under `src/pages` directory Vue components as pages:
```
.
├── src
│   └── pages
│       │── about.vue
│       └── index.vue
├── .gitignore
├── dvan.config.js
└── package.json
```