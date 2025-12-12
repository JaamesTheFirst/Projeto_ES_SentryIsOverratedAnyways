const webpack = require('webpack');

module.exports = function (options, webpack) {
  return {
    ...options,
    externals: {
      'bcrypt': 'commonjs bcrypt',
      '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp',
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          // Ignore optional dependencies that aren't needed
          const lazyImports = [
            'mock-aws-s3',
            'aws-sdk',
            'nock',
          ];
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource);
          } catch (err) {
            return true;
          }
          return false;
        },
      }),
    ],
  };
};

