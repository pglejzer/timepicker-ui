import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: {
    main: './docs/index.ts',
    styles: './src/styles/index.scss',
    'theme-custom': './docs/theme-custom.css',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      'timepicker-ui': path.resolve(__dirname, './src/index.ts'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    static: false,
    port: 8005,
    open: true,
    compress: true,
    hot: true,
    watchFiles: ['./docs/**/*.{html,js,ts,css}', './src/**/*.{ts,js,tsx,css,scss}'],

    devMiddleware: {
      writeToDisk: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.module\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /\.module\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.svg$/,
        type: 'asset/source',
      },
      {
        test: /\.(png|jpg|gif|woff2?|eot|ttf|otf)$/,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './docs/index.html',
      inject: 'body',
      minify: false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  performance: {
    hints: false,
  },
  stats: 'minimal',
};
