# serve-webpack

A simple and fast webpack development server with HMR support

```sh
npm install -D serve-webpack
```

```sh
yarn add -D serve-webpack
```

## Usage

The `serve-webpack` module is intended to be used as a local development server, that automatically compiles a Webpack configuration in watch-mode, and serves the output directory as static files over HTTP, using [serve-handler](https://github.com/zeit/serve-handler). Additionally, a Websocket server is opened for HMR support, and a client-side script injected along with Webpack's [HotModuleReplacementPlugin](https://webpack.js.org/plugins/hot-module-replacement-plugin/).

`serve-webpack` offers cli and node API support:

**cli usage**:  
```sh
npx serve-webpack --require ts-node/register --config webpack.config.ts
```

**node usage**:  
```js
const serveWebpack = require('serve-webpack')
serveWebpack({ require: 'ts-node/register', config: 'webpack.config.ts' })
```

## Configuration

### Cli options

#### `--require`, `-r`

type: `string` (supports multiple)

Require a module before requiring the Webpack configuration. Useful for registering [ts-node](https://webpack.js.org/plugins/hot-module-replacement-plugin/) or [babel](https://babeljs.io/docs/en/babel-register), for example.

#### `--config`, `-c`

type: `string`

Path to the Webpack configuration, relative to `process.cwd()`. Supports a single configuration exported via `module.exports` either in object or function form. In case of an array, only the first is used.

#### `--hot`, `-h`

type: `boolean`  
default: `true`  

Enable or disable the Websocket server and other HMR additions. Enabled by default.

#### `--env`, `-e`

type: `object` (supports multiple)

Additional [environment variables](https://webpack.js.org/guides/environment-variables/) passed to the Webpack configurations that export a function. The function's argument will be an env object. For example, the following configuration

```sh
serve-webpack --env.NODE_ENV=local --env.production --env.test=false
```

will result in

```js
// webpack.config.js
module.exports = (env) => {
  console.log(env.NODE_ENV) // "local"
  console.log(env.production) // true
  console.log(env.test) // false
}
```

### Webpack configuration key

`serve-webpack` supports its custom key `serve?: Object` in the supplied Webpack configuration. Because this makes the configuration invalid, the key is deleted after parsing and before passing the rest to the Webpack compiler. Typescript type augmentations are available.

#### Options

| key | description | type | default |
| :-- | :---------- | :--- | :------ |
| `protocol` | The protocol of the dev server | `http: | https:` | `http:` |
| `host` | The hostname of the dev server | `string` | `localhost` |
| `port` | The port of the dev server | `number` | `3000` |
| `socketPath` | The path of the websocket | `string` | `/__socket` |
| `path` | The fs path from where serve-handler serves files | `string` | Webpack's `output.path`, eg. `/public` |
| `path` | The url path where serve-handler binds | `string` | Webpack's `output.publicPath`, eg. `/` |

The `serve` key also supports all [serve-handler](https://github.com/zeit/serve-handler#options) options, that are passed directly to it. All requests except for the `socketPath` are passed to the handler.
