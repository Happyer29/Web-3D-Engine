var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var WebpackShellPluginNext = require('webpack-shell-plugin-next');
const {ENTRY_TESTS} = require("./files.config");
const {PATHS} = require("./files.config.js");

console.log('\x1b[31m%s\x1b[0m', 'Starting UNIT tests: ');
module.exports = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    //stats убирает вывод бесполезного говна
    stats: 'errors-warnings',
    entry: ENTRY_TESTS,
    output: {
        path: PATHS.dist,
        filename: 'testBundle.js'
    },
    target: 'node',
    externals: [nodeExternals()],
    plugins: [
        new WebpackShellPluginNext({
            onBuildEnd: "npm run mocha"
        })
    ],
    module: {
        rules: [
            {
                test: /\.spec\.(ts|tsx)?$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            { //for using babel
                test: /\.js$|jsx/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            }
        ]
    }
};