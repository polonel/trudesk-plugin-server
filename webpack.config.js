const webpack = require('webpack');
const path = require('path');
const whatwg = require('whatwg-fetch');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const HtmlwebpackPlugin = require('html-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname);

module.exports = {
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    'webpack/hot/only-dev-server',
    'whatwg-fetch',
    path.resolve(ROOT_PATH, 'src/app'),
  ],
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    },
    {
      test: /\.md$/,
      loader: "html!markdown"
    },
    {
      test: /\.svg$/,
      loader: 'babel-loader!svg-react'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.module\.s[a,c]ss$/,
      loader: 'style-loader!css-loader' +
        '?modules&importLoaders=1&localIdentName=[path]' +
        '___[name]__[local]___[hash:base64:5]' +
        '!postcss-loader!sass-loader'
    },
    {
      test: /\.scss$/,
      exclude: [/\.module\.s[a,c]ss$/],
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'sass-loader', options: { includePaths: ['./node_modules', './node_modules/grommet/node_modules'], indentedSyntax: false } }
      ]
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },
    {
      test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
      loader: 'url-loader?mimetype=application/font-woff'
    },
    {
      test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
      loader: 'file-loader?name=[name].[ext]'
    },
    {
      test: /\.(jpg|png)$/,
      loader: 'file-loader?name=[name].[hash].[ext]'
    }
  ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      components: path.resolve(ROOT_PATH, 'src/app/components'),
      containers: path.resolve(ROOT_PATH, 'src/app/containers'),
      pages: path.resolve(ROOT_PATH, 'src/app/pages'),
      utils: path.resolve(ROOT_PATH, 'src/app/utils')
    },
  },
  
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new HtmlwebpackPlugin({
      title: 'Trudesk Plugins Server',
      template: path.resolve(ROOT_PATH, 'src/app/public/index.html')
    }),
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: function () {
              return {
                defaults: [precss, autoprefixer],
                cleaner:  [autoprefixer({ browsers: [] })]
              };
            },
            sassLoader: {
                includePaths: [
                    './node_modules',
                    './node_modules/grommet/node_modules'
                ],
                sourceMap: true
            },
        }
    })
  ],
};