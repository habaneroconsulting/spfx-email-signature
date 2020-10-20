'use strict';

const build = require('@microsoft/sp-build-web');

// Force use of projects specified react version.
// @see https://inprod.dev/blog/2020-02-12-spfx-sharepoint-server-2019/
// Necessary for `react-testing-library` to use `waitFor utilities, which require `react-dom@16.9.0`.
build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    generatedConfiguration.externals = generatedConfiguration.externals.filter((name) => !['react', 'react-dom'].includes(name));
    return generatedConfiguration;
  }
});

build.initialize(require('gulp'));
