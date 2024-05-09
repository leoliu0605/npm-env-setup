## [1.2.1](https://github.com/leoli0605/npm-env-setup/compare/v1.2.0...v1.2.1) (2024-05-09)


### Bug Fixes

* fix function is not defined error ([955a701](https://github.com/leoli0605/npm-env-setup/commit/955a701c08d43d61555ad75a514cbb151d9e4c85))



# [1.2.0](https://github.com/leoli0605/npm-env-setup/compare/v1.1.0...v1.2.0) (2024-05-09)


### Features

* migrate the installation method to asdf, close [#16](https://github.com/leoli0605/npm-env-setup/issues/16) ([e8ad820](https://github.com/leoli0605/npm-env-setup/commit/e8ad820ac85ad95ccd0fce1f6f318bff927ea7c0))
* use asdf to install latest gohugo, close [#14](https://github.com/leoli0605/npm-env-setup/issues/14) ([88371a0](https://github.com/leoli0605/npm-env-setup/commit/88371a041c0aa57236816e7c9b1af2835320726d))
* use script to install dotnet-sdk, close [#15](https://github.com/leoli0605/npm-env-setup/issues/15) ([964cfd8](https://github.com/leoli0605/npm-env-setup/commit/964cfd85fb50f5323ccc89cd84c95ea976825c07))



# [1.1.0](https://github.com/leoli0605/npm-env-setup/compare/v1.0.2...v1.1.0) (2024-04-16)


### Features

* add ttc-source-han-serif font installation instructions, close [#13](https://github.com/leoli0605/npm-env-setup/issues/13) ([8d26c1e](https://github.com/leoli0605/npm-env-setup/commit/8d26c1eff61f9d6b03f8c42dbe3a39691555cb38))
* add USB over IP Windows installation command, close [#11](https://github.com/leoli0605/npm-env-setup/issues/11) ([95e00c6](https://github.com/leoli0605/npm-env-setup/commit/95e00c687b30163ce29dd8410ed34b99cef20105))
* install orbstack instead of docker on macOS, close [#12](https://github.com/leoli0605/npm-env-setup/issues/12) ([1a4d80a](https://github.com/leoli0605/npm-env-setup/commit/1a4d80aebcab614ab08f745ced7e4b13eb21440f))
* update packageData.json with software enable/disable changes ([d83ad3e](https://github.com/leoli0605/npm-env-setup/commit/d83ad3ee1b8cefc92032c1bb0ef47b5d43fb3e3e))



## [1.0.2](https://github.com/leoli0605/npm-env-setup/compare/v1.0.1...v1.0.2) (2024-03-18)


### Bug Fixes

* install Node.js 18.18.0 directly on Windows without using NVM to avoid errors, close [#9](https://github.com/leoli0605/npm-env-setup/issues/9) ([16bb945](https://github.com/leoli0605/npm-env-setup/commit/16bb945c634c5f97fd8268d0679f4f6cc050171e))



## [1.0.1](https://github.com/leoli0605/npm-env-setup/compare/v1.0.0...v1.0.1) (2024-03-16)


### Bug Fixes

* update stdin from pipe to inherit to fix [#8](https://github.com/leoli0605/npm-env-setup/issues/8) issue ([4641366](https://github.com/leoli0605/npm-env-setup/commit/464136696b0ea1c894d538ae9cc3ae7014c621af))



# [1.0.0](https://github.com/leoli0605/npm-env-setup/compare/45a0bf78f82824d25f1b0373b21b509d147ffe83...v1.0.0) (2024-03-15)


### Bug Fixes

* repair PowerShell commands and command execution errors ([8d464f2](https://github.com/leoli0605/npm-env-setup/commit/8d464f21ad95ca76f477ed895cfb8735f01d3616))
* repair the command error that occurs when running on Windows ([a6812f9](https://github.com/leoli0605/npm-env-setup/commit/a6812f9827b1927eb78b036fa7b072768bb853f6))


### Continuous Integration

* add build and release workflows ([7cb6450](https://github.com/leoli0605/npm-env-setup/commit/7cb6450ce816d2d5242ff1c0341d185688c932ee))


### Features

* add console log for MacOS detection and update Ubuntu version check ([b901d7b](https://github.com/leoli0605/npm-env-setup/commit/b901d7b461e8806d5481af4ad0de99c1a7f9735b))
* add environment variable for app version ([e941e93](https://github.com/leoli0605/npm-env-setup/commit/e941e93ac65987ef7232514308e49ab199794240))
* add for macOS and linux (Ubuntu) ([de8eaa1](https://github.com/leoli0605/npm-env-setup/commit/de8eaa15a3e7b5920d18c7313715c0744e26bd8c))
* add packages file and related functions ([45a0bf7](https://github.com/leoli0605/npm-env-setup/commit/45a0bf78f82824d25f1b0373b21b509d147ffe83))
* add WSL & Sandbox enable powershell script ([d627d3e](https://github.com/leoli0605/npm-env-setup/commit/d627d3ee1d63775abedad56b0ac5cef601c4a73b))
* completed the setup of the Windows environment ([e74366e](https://github.com/leoli0605/npm-env-setup/commit/e74366e7fd665b507a9213f3a97e6c00e978c496))
* enable script execution and add error handling ([52471e8](https://github.com/leoli0605/npm-env-setup/commit/52471e880c114abaf14b609604ec889ec69eb70c))
* update installation scripts and add deduplication functionality ([d73258b](https://github.com/leoli0605/npm-env-setup/commit/d73258bc84cbb982edabbf23f86f51f3bbedf573))
* update Node.js installation command for Windows ([cc36638](https://github.com/leoli0605/npm-env-setup/commit/cc366381d0169f682ebf070cea610e8abb4e4bd3))


### BREAKING CHANGES

* 1st version



