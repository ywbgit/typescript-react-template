const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const WebpackParallerUglifyPlugin = require('webpack-parallel-uglify-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

let config = {
  entry: {
    bundle: [
      resolveApp('src/scripts/index.tsx')
    ],
  },
  output: {
    path: resolveApp('dist'),
    publicPath: '',
    filename: 'static/js/[name].[hash:7].js',
    chunkFilename: 'static/js/[name].[chunkhash:7].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: resolveApp('src/scripts/'),
        enforce: 'pre',
        use: [ 'tslint-loader' ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: resolveApp('src/scripts/'),
        use: [ 'babel-loader', 'awesome-typescript-loader' ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: resolveApp('src/scripts'),
        use: [ 'babel-loader', 'source-map-loader' ],
      },
      {
        test: /\.css$/,
        exclude: resolveApp('src/fonts/'),
        use: [
          'style-loader',
          'css-loader?modules&localIdentName=[name]-[local]-[hash:7]',
          'postcss-loader'
        ]
      },
      {
        test: /\.css$/,
        include: resolveApp('src/fonts/'),
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader?modules&localIdentName=[name]-[local]-[hash:7]',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([ 'dist' ]),
    new WebpackParallerUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }
    }),
    new MiniCSSExtractPlugin({
      filename: 'static/css/[name].[contenthash:7].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunks: [ 'vendors', 'bundle' ],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new CopyWebpackPlugin([
      {
        from: resolveApp('src/config/prod.js'),
        to: 'config/config.js',
        ignore: ['.*']
      },
      {
        from: resolveApp('src/libs/'),
        to: 'libs/',
        ignore: ['.*']
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendors'
    },
  },
  resolve: {
    modules: [
      resolveApp('src'),
      resolveApp('node_modules')
    ],
    extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
    alias: {
      '@': resolveApp('src')
    }
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  mode: 'production'
};

module.exports = config;
