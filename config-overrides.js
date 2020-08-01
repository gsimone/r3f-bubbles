const { addWebpackModuleRule, override } = require('customize-cra')
const { addReactRefresh } = require('customize-cra-react-refresh')

module.exports = (config, env) => {
  return override(
    addReactRefresh(),
    addWebpackModuleRule({ test: /\.(glsl|vs|fs|vert|frag)$/, use: ['raw-loader', 'glslify-loader'] })
  )(config, env)
}
