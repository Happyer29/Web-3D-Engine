const webpack =  require('webpack')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config.js')
const WebpackShellPluginNext = require("webpack-shell-plugin-next");
const {PATHS} = require("./files.config.js");

console.log('\x1b[31m%s\x1b[0m', 'Starting dev project build:');
const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    stats: 'errors-warnings',
    devServer: {
        contentBase: baseWebpackConfig.externals.paths.dist,
        port: 8081,
        overlay: {
            warnings: true,
            errors: true
        }
    },
    plugins: [
        new WebpackShellPluginNext({
            onDoneWatch: "npm run test",
            blocking: true,
            parallel: false
        })
    ]
})

module.exports = new Promise((resolve) => {
    resolve(devWebpackConfig)
})