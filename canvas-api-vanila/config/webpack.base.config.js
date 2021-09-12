const {PATHS, ENTRY} = require('./files.config.js');
const miniCss = require("mini-css-extract-plugin");
const copyWebpackPlugin = require('copy-webpack-plugin')


//TODO mocha tests
//TODO cross-env - WTF
//TODO lint
//TODO dev server
//TODO including script to specific html page (not for all)
module.exports = {
  mode: "development",
  devtool: "source-map", //TODO console parameter with/without maps
  entry: ENTRY,

  watch: true,
  output: {
    path: PATHS.dist,
    filename: "./scripts/[name].bundle.js",
  },

  resolve: { //TODO learn modules
    extensions: ['.tsx', '.ts', ".js", ".jsx", ".json", "*",],
    alias: {
      '~': PATHS.src
    }
  },

  // TODO WTF??? vendors.bundle.js????
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
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
      },

      {//For css
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: miniCss.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: {sourceMap: true}
          }, {
            loader: 'postcss-loader',
            options: { sourceMap: true, postcssOptions: {config: './config/css/postcss.config.js'}}
          }
        ]
      },


      //Assets
      {//For png
        test: /\.(png|jpg|gif|svg|ico)$/ ,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        },
      },
      {//For fonts
        test    : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader  : 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
    ],
  },
  plugins: [
    new miniCss({
      filename: "./assets/styles/style.css",
    }),
    new copyWebpackPlugin({
      patterns: [
        {from: `${PATHS.img}`, to: `${PATHS.dist}/assets/img`},
        {from: `${PATHS.fonts}`, to: `${PATHS.dist}/assets/fonts`},
        {from: `${PATHS.static}`, to: `${PATHS.dist}`},
      ]
    }),

  ],
  externals: {
    paths: PATHS
  },

};
