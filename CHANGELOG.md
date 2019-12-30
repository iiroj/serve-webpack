# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.4](https://github.com/iiroj/serve-webpack/compare/v0.0.3...v0.0.4) (2019-12-30)

### [0.0.3](https://github.com/iiroj/serve-webpack/compare/v0.0.2...v0.0.3) (2019-10-17)


### Bug Fixes

* log socket url with correct scheme ([065c9c5](https://github.com/iiroj/serve-webpack/commit/065c9c523d811418729f8e9570ce32881ce3f344))
* strip prefix from req.url before passing to serve-handler ([e6d979d](https://github.com/iiroj/serve-webpack/commit/e6d979d46832a62f4b6be3c51f86b997e7536306))

### [0.0.2](https://github.com/iiroj/serve-webpack/compare/v0.0.1...v0.0.2) (2019-10-16)


### Bug Fixes

* allow newer versions of Webpack ([c0f589c](https://github.com/iiroj/serve-webpack/commit/c0f589c9221970082f626f5f5cd6c239443d453a))
* apply correct entrypoints in array ([71e9db5](https://github.com/iiroj/serve-webpack/commit/71e9db503a75243747e7739ba94c1e2bdd5a4dbb))
* include necessary files in publish ([d386117](https://github.com/iiroj/serve-webpack/commit/d386117986f0773e5b9b45270c9f52a2d5caeef8))

### 0.0.1 (2019-10-16)


### Features

* add client for HMR ([cf9c059](https://github.com/iiroj/serve-webpack/commit/cf9c0598614cb2a855607e1f7aae3b100ac9348d))
* initial commit ([331ce36](https://github.com/iiroj/serve-webpack/commit/331ce36db3082ea2241ecba24c2526ea691c5d88))
* pass env variables from cli options to webpack configuration ([2af89f7](https://github.com/iiroj/serve-webpack/commit/2af89f70e3c5cf6a7676950c90d6895c54f6cc17))


### Bug Fixes

* create HTTPS server when protocol is https: ([3e7a6d9](https://github.com/iiroj/serve-webpack/commit/3e7a6d90f117442a2920451ebafbb1c722681a89))
* do not listen to PORT env variable, can be set in webpack config ([41cc938](https://github.com/iiroj/serve-webpack/commit/41cc93804d924cd9062a916de830b0b4c8b14706))
* working build script ([f580e0a](https://github.com/iiroj/serve-webpack/commit/f580e0add14cf0ff1f546405d4ce34fc0e14a8c6))
