const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './docs/index.js',
  output: {
    publicPath: '/',
  },
  resolve: {
    alias: {
      'timepicker-ui': path.resolve('./src/index.js'),
    },
    extensions: ['.tsx', '.ts', '.js', '.d.ts'],
  },
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 8080,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.module\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                compileType: 'icss',
              },
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'docs/index.html',
    }),
  ],
};
