const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: './src/timepicker/index.js',
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'index.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
    port: 9000,
    liveReload: true,
    open: true,
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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: false,
    }),
  ],
};
