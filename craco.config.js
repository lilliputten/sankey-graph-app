const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  style: {
    sass: {
      loaderOptions: {
        additionalData: `
          @use 'sass:math';
          @use 'sass:color';
          @import "src/core/assets/scss/variables.scss";
          @import "src/core/assets/scss/mixins.scss";
        `,
      },
    },
  },
  webpack: {
    plugins: {
      add: [
        // Enable core nodejs polyfills (like 'buffer' etc) for webpack 5 
        new NodePolyfillPlugin(),
      ],
    },
  },
};
