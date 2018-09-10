const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

let config = {
  entry: {
    bundle: [
      resolveApp('src/scripts/index.tsx')
    ]
  },
  output: {
    path: resolveApp('build/'),
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
        use: [
          'style-loader',
          'css-loader?modules&localIdentName=[name]-[local]-[hash:7]',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true,
      chunks: [ 'vendors', 'bundle' ],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new CheckerPlugin(),
    new CopyWebpackPlugin([
      {
        from: resolveApp('src/config/dev.js'),
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
    extensions: ['.js', '.jsx', '.ts', '.tsx', ],
    alias: {
      '@': resolveApp('src')
    }
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  devServer: {
    contentBase: resolveApp('build/'),
    hot: true,
    host: '192.168.1.150',
    port: '4000',
    open: true,
    overlay: true,
    stats: 'errors-only'
  },
  devtool: 'cheap-module-eval-source-map',
  mode: 'development'
};

module.exports = config;
