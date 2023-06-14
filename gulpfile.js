//@ts-check

'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    // When creating a production build...
    if (process.argv.indexOf('--ship') > -1 || process.argv.indexOf('-s') > -1) {
      // Create a stats folder and put generated webpack stats within it.
      const path = require('path');
      const bundleAnalyzer = require('webpack-bundle-analyzer');

      const lastDirName = path.basename(__dirname);
      const dropPath = path.join(__dirname, 'temp', 'stats');

      generatedConfiguration.plugins.push(
        new bundleAnalyzer.BundleAnalyzerPlugin({
          openAnalyzer: false,
          analyzerMode: 'static',
          reportFilename: path.join(dropPath, `${lastDirName}.stats.html`),
          generateStatsFile: true,
          statsFilename: path.join(dropPath, `${lastDirName}.stats.json`),
          logLevel: 'error'
        })
      );
    }

    // Force use of projects specified react version.
    // @see https://inprod.dev/blog/2020-02-12-spfx-sharepoint-server-2019/
    // Necessary for `react-testing-library` to use `waitFor utilities, which require `react-dom@16.9.0`.
    generatedConfiguration.externals = generatedConfiguration.externals.filter((name) => !['react', 'react-dom'].includes(name));

    return generatedConfiguration;
  }
});

build.initialize(require('gulp'));
