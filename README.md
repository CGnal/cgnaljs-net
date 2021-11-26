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
