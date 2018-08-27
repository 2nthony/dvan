# Quick Started

## Installation

Install dvan as a local dependency inside a project.
```bash
cd your-project
yarn add dvan -D # npm i -D dvan
```

Then add two scripts to `package.json`
```json
{
  "scripts": {
    "dev": "dvan dev",
    "build": "dvan build"
  },
  "devDenpendency": {
    "dvan": "latest"
  }
}
```

You can now start with:
```bash
yarn dev
```

To generate static assets:
```bash
yarn build
```
By default the built files will be in `.dvan/dist`, it can be configured the `outputDir` field in `dvan.config.js`.