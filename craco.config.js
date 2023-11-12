module.exports = {
  style: {
    sass: {
      loaderOptions: {
        additionalData: `
          @import "src/assets/scss/includes.scss";
          @import "src/assets/scss/variables.scss";
          @import "src/assets/scss/mixins.scss";
        `,
      },
    },
  },
};
