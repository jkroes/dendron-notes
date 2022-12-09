---
tags:
- obsidian
---

# Getting started

```
npm install -g typescript
cd path/to/vault/.obsidian/plugins
git clone https://github.com/your-username/obsidian-instant-coffee.git
cd path/to/vault/.obsidian/plugins/obsidian-instant-coffee
npm install
npm run dev
```

This seems to run a codewatcher that monitors for changes in the source code

# Anatomy of a plugin

## esbuild files

esbuild.config.js

https://esbuild.github.io/getting-started/#your-first-bundle

https://janessagarrow.com/blog/typescript-and-esbuild/
## Yarn files

yarn is an alternative to npm.

https://www.knowledgehut.com/blog/web-development/yarn-vs-npm

### yarn.lock

## Node.js files

### package.json

Obsidian plugins are also Node packages and thus have a package.json. 

If using esbuild, you can specify a build script:

```json
{
  "scripts": {
    "build": "esbuild app.jsx --bundle --outfile=out.js"
  }
}
```

It can be invoked by 

```shell
npm run build
```

## TS files

### main.ts

Source code, but what else?

### tsconfig.json

Present in the root of a ts project. Specifies the root, or project, files and compiler options required to compile the project. 

https://www.typescriptlang.org/tsconfig

## Obsidian files

### manifest.json

https://marcus.se.net/obsidian-plugin-docs/reference/manifest
https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/Guides/How+to+release+a+new+version+of+your+plugin

### versions.json

https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/Guides/How+to+release+a+new+version+of+your+plugin
# Creating a plugin

[Themes and Plugins](https://help.obsidian.md/Contributing+to+Obsidian/Themes+and+plugins)
 - [Obsidian Plugin Developer Docs](https://marcus.se.net/obsidian-plugin-docs/)
     - https://publish.obsidian.md/hub/04+-+Guides%2C+Workflows%2C+%26+Courses/for+Plugin+Developers
Discord.app > Obsidian > #plugin-dev

# Examples
## [sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
## [zotero integration](https://github.com/mgmeyers/obsidian-zotero-integration)

