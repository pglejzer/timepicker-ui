const path = require('path');
const loader = require('sass-loader');
const ni = require('os').networkInterfaces();
const ip = Object.keys(ni)
  .map((interf) => ni[interf].map((o) => !o.internal && o.family === 'IPv4' && o.address))
  .reduce((a, b) => a.concat(b))
  .filter((o) => o)[0];

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    path: __dirname + '/docs-test',
    filename: 'index.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'docs-test'),
    port: 9000,
    host: ip,
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
    ],
  },
};
