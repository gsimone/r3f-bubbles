const {
  babelInclude,
  addWebpackAlias,
  removeModuleScopePlugin,
  addWebpackModuleRule,
  override,
} = require('customize-cra')
const { addReactRefresh } = require('customize-cra-react-refresh')
const path = require('path')

module.exports = (config, env) => {
  config.resolve.extensions = [...config.resolve.extensions, '.ts', '.tsx']
  return override(
    addReactRefresh(),
    /*removeModuleScopePlugin(),
    babelInclude([path.resolve('src'), path.resolve('../react-postprocessing/src')]),
    addWebpackAlias({
      postprocessing: path.resolve('node_modules/postprocessing'),
      react: path.resolve('node_modules/react'),
      'react-dom': path.resolve('node_modules/react-dom'),
      'react-three-fiber': path.resolve('node_modules/react-three-fiber'),
      'react-postprocessing': path.resolve('../react-postprocessing/src/index.tsx'),
    }),*/
    addWebpackModuleRule({ test: /\.(glsl|vs|fs|vert|frag)$/, use: ['raw-loader', 'glslify-loader'] })
  )(config, env)
}
