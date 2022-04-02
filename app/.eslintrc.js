module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  plugins: ['prettier', '@typescript-eslint', 'tree-shaking'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    '.eslintrc.js',
    './docs',
    './dist',
    '/node_modules',
    'rollup.config.js',
    'webpack.config.js',
    './src/**/*.d.ts',
    'docs/index.ts',
  ],
  rules: {
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'func-names': 'off',
    'class-methods-use-this': 'off',
    'operator-linebreak': 'off',
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    'implicit-arrow-linebreak': 'off',
    'comma-dangle': 'off',
    'function-paren-newline': 'off',
    'wrap-iife': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'linebreak-style': ['error', 'windows'],
    'object-curly-newline': 'off',
    indent: 'off',
    '@typescript-eslint/indent': ['off'],
    'max-len': 'off',
    'no-confusing-arrow': 'off',
    'tree-shaking/no-side-effects-in-initialization': 2,
  },
};
