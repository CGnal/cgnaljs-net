# CGnal Network utils

[![NPM version](https://img.shields.io/npm/v/@cgnal/net.svg)](https://www.npmjs.com/package/@cgnal/net) [![Checks Status](https://github.com/CGnal/cgnaljs-net/actions/workflows/checks.yml/badge.svg)](https://github.com/CGnal/cgnaljs-net/actions/workflows/checks.yml) [![Coveralls Status](https://img.shields.io/coveralls/CGnal/cgnaljs-net/master.svg)](https://coveralls.io/github/CGnal/cgnaljs-net)

Network utilities for [CGnal](https://cgnal.com)'s JavaScript projects.

## Documentation.

The API documentation is published [here](https://cgnal.github.io/cgnaljs-net/).

## Installation and usage

```bash
npm install @cgnal/net --save
```

The library doesn't come with a predefined build, but rather relies on the application that uses it to "set the rules".

[`@babel/runtime-corejs3`](https://github.com/babel/babel/tree/main/packages/babel-runtime-corejs3) and [`core-js`](https://github.com/zloirock/core-js) are set as dependencies, so you can make your application build it for your intended targets and eventually add automatically the necessary polyfills.

Example of possible babel configuration:

```javascript
// ...

"presets": [
    ["@babel/preset-env", {
        "corejs": "3.19",
        "modules": "auto",
        "useBuiltIns": "usage"
    }]
],
"plugins": [
    ["@babel/plugin-transform-runtime", { "corejs": 3, "proposals": true }],
]

// ...
```

## Usage with Jest

[Jest](https://jestjs.io/) currently (v27.4.2 at the time of writing) doesn't play nice with ES modules and [`package.json` exports](https://nodejs.org/api/packages.html#subpath-exports).
See [this issue](https://github.com/facebook/jest/issues/9771) about the exports support status.
Both problems are easily solved for the time being with a config tweak and the support of [`jest-node-exports-resolver`](https://github.com/k-g-a/jest-node-exports-resolver).

Example of Jest configuration:

```javascript
// ...

resolver: "jest-node-exports-resolver",
transformIgnorePatterns: ["node_modules/(?!@cgnal)"],

// ...
```

## Usage with `eslint-plugin-import`

[`eslint-plugin-import`](https://github.com/import-js/eslint-plugin-import) still have to support the aforementioned exports field.
You can refer to [this issue](https://github.com/import-js/eslint-plugin-import/issues/1868) to track the situation.
In the meanwhile you can add a custom resolver such as [`@tophat/eslint-import-resolver-require`](https://github.com/tophat/eslint-import-resolver-require) and tweak your configuration to use it:

```javascript
// ...

"settings": {
    "import/resolver": "@tophat/eslint-import-resolver-require",
}

// ...
```

## NPM scripts and Gulp tasks

Only a few Gulp tasks are exposed as npm scripts, as such scripts are only a facilitation to run tasks without having to install [`gulp-cli`](https://www.npmjs.com/package/gulp-cli) as a global module.
Running tasks in a CI server, for example.

If you want to use `gulp` from the command line, you should `npm install gulp-cli -g` first, or, to avoid installing it, prefix your commands with `npx`, e.g. `npx gulp test`.

### NPM scripts

* `npm run coverage` runs the `gulp test:coverage` task.
* `npm run docs` runs the `gulp docs` task.
* `npm run lint` runs the `gulp lint` task.
* `npm test` runs the `gulp test` task.

### Gulp tasks

* `gulp`: the default task runs the `gulp lint` and `gulp test:coverage` in sequence.
* `gulp bump` updates version number using an interactive shell.
* `gulp clean`: deletes the docs and coverage folders (`./docs`, `./coverage`).
* `gulp clean:coverage`: deletes the coverage folder (`./coverage`).
* `gulp clean:docs`: deletes the docs folder (`./docs`).
* `gulp docs`: generates the documentation in the `./docs` folder.
* `gulp lint`: runs linting for code and test, in sequence.
* `gulp lint:code`: runs linting for code only.
* `gulp lint:tests`: runs linting for tests only.
* `gulp test`: runs the test suite.
* `gulp test:coverage`: runs tests and generates the code coverage report in `./coverage`.
* `gulp test:verbose`: runs the test suite in verbose mode.
* `gulp test:watch`: runs the test suite in watch mode.
