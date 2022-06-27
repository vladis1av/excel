const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = (ext) => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src/public/index.html'),
    minify: {
      removeComments: isProd,
      collapseWhitespace: isProd,
    },
  }),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'src/public/favicon.ico'),
        to: path.resolve(__dirname, 'dist'),
      },
    ],
  }),
  new MiniCssExtractPlugin({
    filename: filename('css'),
  }),
];

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: process.env.MODE || 'development',
  entry: ['@babel/polyfill', './index.ts'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: process.env.PORT || 3000,
    hot: isDev,
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
};
