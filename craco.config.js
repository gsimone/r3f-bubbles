const { loaderByName, addBeforeLoader } = require("@craco/craco");

const glslLoader = {
    overrideWebpackConfig:
      ({webpackConfig, cracoConfig, pluginOptions, context: {env, paths}}) => {
        const glslifyLoader = {test: pluginOptions.test, use: ['raw-loader', 'glslify-loader']}

        addBeforeLoader(webpackConfig, loaderByName('file-loader'), glslifyLoader)

        return webpackConfig

      }
}

module.exports = {
    plugins: [
      {
        plugin: glslLoader,
        options: { test:  /\.(glsl|vs|fs|vert|frag)$/ },
      },
     
    ],
};
